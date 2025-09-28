import { redisQueue } from "../db/services/redisService";
import { QueueName } from "../interfaces/config";
import { scrapeWebsite, ScrapeWebsiteEnqueue } from "../workers/scrapingWorker";
import { sleep } from "../helpers/timers";
import { storeurlContent } from "../db/services/apiService";
import { chunkText } from "../helpers/formettors";
import { urlMongoService } from "../db/models/mongo/UrlObj";
import {
  QUEUE_NAMES,
  URL_STATUS,
  ERROR_MESSAGES,
} from "../interfaces/constants";
import mongoose from "mongoose";

async function processUrl(urlData: any) {
  try {
    // Extract URL and depth directly from the object
    const { link: url, depth: currentDepth } = urlData;

    if (!url || typeof currentDepth !== 'number') {
      throw new Error('Invalid URL data: missing link or depth');
    }

    console.log("🔍 current depth:", currentDepth);
    
    // Check depth limit early to avoid unnecessary processing
    if (currentDepth > 1) {
      console.log("🔍 Skipping URL due to depth limit:", url);
      return;
    }

    const result = await ScrapeWebsiteEnqueue(url);
    const { content, links, title } = result;
    
    const document = await urlMongoService.upsert(
      { url: url },
      {
        url,
        title,
        links,
        status: URL_STATUS.VISITING,
        depth: currentDepth,
        updatedAt: new Date(),
      }
    );
    const url_id = document._id as mongoose.Types.ObjectId;
    const chunkContent = chunkText(content, 500, 50);

    const data = {
      chunkContent,
      url_id: url_id.toString(),
    };
    await storeurlContent(data);

    // Only push links if the incremented depth won't exceed the limit
    if (currentDepth < 1) {
      for (const link of links) {
        const linkData = {
          link: link,
          depth: currentDepth + 1
        };
        // await sleep(5000);
        await redisQueue.push(QUEUE_NAMES.URLS_QUEUE as QueueName, linkData);
        console.log("🔍 Pushing links completed:", url);
      }
    } else {
      console.log("🔍 Not pushing links - depth limit reached:", url);
    }
  } catch (err) {
    console.error("❌", ERROR_MESSAGES.URL_PROCESSING_ERROR, urlData, err);
  }
}

// Subscribe to the queue
redisQueue
  .subscribe(QUEUE_NAMES.URLS_QUEUE as QueueName, processUrl)
  .catch((err) => {
    console.error("❌", ERROR_MESSAGES.QUEUE_SUBSCRIPTION_ERROR, err);
  });
