import { redisQueue } from "../db/services/redisService";
import { QueueName } from "../interfaces/config";
import { scrapeWebsite } from "../workers/scrapingWorker";
import { sleep } from "../helpers/timers";
import { getEmbeddings } from "../db/services/apiService";
import { chunkText } from "../helpers/formettors";
import { urlMongoService } from "../db/models/mongo/UrlObj";
import { QUEUE_NAMES, URL_STATUS, ERROR_MESSAGES } from "../constants";
import mongoose from "mongoose";



async function processUrl(url: string) {

  try {
    const result = await scrapeWebsite(url);
    const { content, links, title } = result;
    const document = await urlMongoService.upsert({url: url}, {
      url, 
      title, 
      links,
      status: URL_STATUS.VISITING,
      depth: 0
    });
    const url_id = document._id as mongoose.Types.ObjectId;
    const chunkContent = chunkText(content, 500, 50);

const data = {
  chunkContent,
  url_id: url_id.toString()
}
  await getEmbeddings(data);

  
  } catch (err) {
    console.error("❌", ERROR_MESSAGES.URL_PROCESSING_ERROR, url, err);
  }
}


// Subscribe to the queue
redisQueue.subscribe(QUEUE_NAMES.URLS_QUEUE as QueueName, processUrl).catch(err => {
  console.error("❌", ERROR_MESSAGES.QUEUE_SUBSCRIPTION_ERROR, err);
});
