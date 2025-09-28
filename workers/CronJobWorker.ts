import cron from "node-cron";
import { redisQueue } from "../db/services/redisService";
import { urlMongoService } from "../db/models/mongo/UrlObj";
import { QUEUE_NAMES, URL_STATUS } from "../interfaces/constants";
import { QueueName } from "../interfaces/config";

/**
 * Function to retrieve URLs with depth <= 1 and push them to Redis queue
 */
async function processUrlsWithDepthLimit() {
  try {
    console.log("🔄 Starting cron job to process URLs with depth <= 1 at:", new Date());
    
    // Query URLs with depth <= 1 and status PENDING
    const urlsToProcess = await urlMongoService.find({
      depth: { $lte: 1 }
    });

    console.log(`📊 Found ${urlsToProcess.length} URLs with depth <= 1 to process`);

    if (urlsToProcess.length === 0) {
      console.log("✅ No URLs found to process");
      return;
    }

    // Push each URL to the Redis queue in the expected format
    let pushedCount = 0;
    for (const urlDoc of urlsToProcess) {
      const linkData = {
        link: urlDoc.url,
        depth: urlDoc.depth
      };

      try {
        await redisQueue.push(QUEUE_NAMES.URLS_QUEUE as QueueName, linkData);
        pushedCount++;
        console.log(`✅ Pushed URL to queue: ${urlDoc.url} (depth: ${urlDoc.depth})`);
      } catch (error) {
        console.error(`❌ Failed to push URL to queue: ${urlDoc.url}`, error);
      }
    }

    console.log(`🎉 Cron job completed. Successfully pushed ${pushedCount}/${urlsToProcess.length} URLs to queue`);
    
  } catch (error) {
    console.error("❌ Error in cron job:", error);
  }
}

// Schedule the cron job to run every 5 minutes
// You can adjust the schedule as needed:
// "* * * * *" - every minute
// "*/5 * * * *" - every 5 minutes  
// "0 */1 * * *" - every hour
// "0 0 * * *" - every day at midnight
cron.schedule("0 0 * * *", () => {
  processUrlsWithDepthLimit();
});

console.log("⏰ Cron job scheduled to run every 5 minutes");
