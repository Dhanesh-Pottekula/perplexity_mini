import { urlMongoService } from "../db/models/mongo/UrlObj";
import { redisQueue } from "../db/services/redisService";
import { qdrantService } from "../db/services/qdrantService";
import {
  COLLECTION_NAMES,
  PAYLOAD_KEYS,
  QUEUE_NAMES,
  QueueName,
} from "../interfaces/constants";

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

    const expiredUrlSet = new Set(expiredUrlIds);

    console.log(
      `📉 Found ${expiredUrlIds.length} expired URLs discovered before ${cutoffDate.toISOString()}`
    );

    // 1. Remove from MongoDB
    const deletedFromMongo = await urlMongoService.deleteMany({
      _id: { $in: expiredUrlIds },
    });

    console.log(`🗑️ Removed ${deletedFromMongo} expired URLs from MongoDB`);

    // 2. Remove from Qdrant URL embeddings collection
    const urlDeleteFilter = {
      must: [
        {
          key: PAYLOAD_KEYS.URL_ID,
          match: {
            any: expiredUrlIds,
          },
        },
      ],
    };

    const urlCollectionCleanup = await qdrantService.deletePointsByFilter(
      COLLECTION_NAMES.URLS,
      urlDeleteFilter
    );

    if (urlCollectionCleanup) {
      console.log("🧹 Removed expired URL embeddings from Qdrant 'urls' collection");
    } else {
      console.warn("⚠️ Failed to remove some URL embeddings from Qdrant 'urls' collection");
    }

    // 3. Remove references from the topics collection
    const topicFilter = {
      must: [
        {
          key: PAYLOAD_KEYS.URL_IDS,
          match: {
            any: expiredUrlIds,
          },
        },
      ],
    };

    const topicsWithExpiredUrls = await qdrantService.filterPoints(
      COLLECTION_NAMES.TOPICS,
      topicFilter
    );

    if (topicsWithExpiredUrls.length > 0) {
      const topicsToDelete: (string | number)[] = [];
      const payloadUpdates: {
        pointId: string | number;
        payload: Record<string, any>;
      }[] = [];
      let topicsUpdated = 0;
      const updateTimestamp = new Date().toISOString();

      for (const topic of topicsWithExpiredUrls) {
        const payload = topic.payload || {};
        const currentUrlIds = Array.isArray(payload[PAYLOAD_KEYS.URL_IDS])
          ? (payload[PAYLOAD_KEYS.URL_IDS] as unknown[])
          : [];

        const updatedUrlIds = currentUrlIds
          .map((id) => (typeof id === "string" ? id : String(id)))
          .filter((id) => !expiredUrlSet.has(id));

        if (updatedUrlIds.length === 0) {
          topicsToDelete.push(topic.id);
          continue;
        }

        if (updatedUrlIds.length !== currentUrlIds.length) {
          topicsUpdated += 1;
          payloadUpdates.push({
            pointId: topic.id,
            payload: {
              [PAYLOAD_KEYS.URL_IDS]: updatedUrlIds,
              [PAYLOAD_KEYS.UPDATED_AT]: updateTimestamp,
            },
          });
        }
      }

      if (topicsToDelete.length > 0) {
        const topicDeleteResult = await qdrantService.deletePoints(
          COLLECTION_NAMES.TOPICS,
          topicsToDelete
        );

        if (topicDeleteResult) {
          console.log(
            `🗑️ Removed ${topicsToDelete.length} topics that no longer reference any URLs`
          );
        } else {
          console.warn(
            "⚠️ Failed to remove some topics that no longer reference any URLs"
          );
        }
      }

      if (payloadUpdates.length > 0) {
        const batchResult = await qdrantService.batchUpdatePayloads(
          COLLECTION_NAMES.TOPICS,
          payloadUpdates
        );

        if (!batchResult) {
          console.warn(
            "⚠️ Failed to update some topic payloads in Qdrant 'topics' collection"
          );
        } else {
          console.log(`✏️ Updated payload for ${topicsUpdated} topics in Qdrant`);
        }
      }
    }

    console.log("✅ Completed expired URL cleanup job");
  } catch (error) {
    console.error("❌ Error in cron job:", error);
  }
}
