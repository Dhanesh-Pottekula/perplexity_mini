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
const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;


export async function cleanExpiredUrlsCronJob() {
  try {
    const runStartedAt = new Date();
    console.log("🔄 Starting cron job to clean expired URLs at:", runStartedAt);

    const cutoffDate = new Date(runStartedAt.getTime() - TWO_DAYS_IN_MS);

    const expiredUrls = await urlMongoService.find({
      discoveredAt: { $lt: cutoffDate },
    });

    if (expiredUrls.length === 0) {
      console.log("✅ No expired URLs found for cleanup");
      return;
    }

    const expiredUrlIds = expiredUrls
      .map((doc: any) => doc?._id?.toString())
      .filter((id): id is string => typeof id === "string");

    if (expiredUrlIds.length === 0) {
      console.warn("⚠️ Found expired URL documents without valid IDs. Skipping cleanup.");
      return;
    }

    console.log(
      `📉 Found ${expiredUrlIds.length} expired URLs discovered before ${cutoffDate.toISOString()}`
    );

    // Remove from MongoDB
    const deletedFromMongo = await urlMongoService.deleteMany({
      _id: { $in: expiredUrlIds },
    });

    console.log(`🗑️ Removed ${deletedFromMongo} expired URLs from MongoDB`);

    console.log("✅ Completed expired URL cleanup job");
  } catch (error) {
    console.error("❌ Error in cron job:", error);
  }
}
