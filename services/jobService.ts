import { urlMongoService } from "../db/models/mongo/UrlObj";
import { redisQueue } from "../db/services/redisService";
import { QUEUE_NAMES, QueueName } from "../interfaces/constants";

/**
 * Function to retrieve URLs with depth <= 1 and push them to Redis queue
 */
export async function processUrlsWithDepthLimitCronJob() {
    try {
      console.log(
        "🔄 Starting cron job to process URLs with depth <= 1 at:",
        new Date()
      );
  
      // Query URLs with depth <= 1 and status PENDING
      const urlsToProcess = await urlMongoService.find({
        depth: { $lte: 1 },
      });
  
      console.log(
        `📊 Found ${urlsToProcess.length} URLs with depth <= 1 to process`
      );
  
      if (urlsToProcess.length === 0) {
        console.log("✅ No URLs found to process");
        return;
      }
  
      // Push each URL to the Redis queue in the expected format
      let pushedCount = 0;
      for (const urlDoc of urlsToProcess) {
        const linkData = {
          link: urlDoc.url,
          depth: urlDoc.depth,
        };
  
        try {
          await redisQueue.push(QUEUE_NAMES.URLS_QUEUE as QueueName, linkData);
          pushedCount++;
        } catch (error) {
          console.error(`❌ Failed to push URL to queue: ${urlDoc.url}`, error);
        }
      }
  
      console.log(
        `🎉 Cron job completed. Successfully pushed ${pushedCount}/${urlsToProcess.length} URLs to queue`
      );
    } catch (error) {
      console.error("❌ Error in cron job:", error);
    }
  }
  
  
  
  export async function cleanExpiredUrlsCronJob() {
    try {
      console.log("🔄 Starting cron job to clean expired URLs at:", new Date());
    } catch (error) {
      console.error("❌ Error in cron job:", error);
    }
  }
  
  