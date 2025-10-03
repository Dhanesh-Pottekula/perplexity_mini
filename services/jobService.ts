import { urlMongoService } from "../db/models/mongo/UrlObj";
import { redisQueue } from "../db/services/redisService";
import { getPerplexityClient } from "../configs/perplexity";
import { QUEUE_NAMES, QueueName, URL_STATUS } from "../interfaces/constants";
import Doc from "../db/models/mongo/Doc";

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
const DEFAULT_URLS_PER_TOPIC = 10;

export async function seedTopicsWithUrlsCronJob() {
  const runStartedAt = new Date();
  console.log("🔄 Starting simple topic seeding job at:", runStartedAt);

  try {
    const perplexityClient = getPerplexityClient();
    if (!perplexityClient.hasValidKey) {
      console.warn("⚠️ Skipping seeding job: Perplexity API key missing");
      return;
    }

    const documents = await Doc.find({}, { topic: 1 }).lean();
    const topicNames = documents
      .map((doc) => (typeof doc.topic === "string" ? doc.topic.trim() : ""))
      .filter((name) => !!name);

    if (topicNames.length === 0) {
      console.log("✅ No topics available for seeding");
      return;
    }

    let totalInserted = 0;

    for (const topicName of topicNames) {
      try {
        const body = {
          ...perplexityClient.defaultBody,
          messages: [
            {
              role: "system" as const,
              content:
                "Return a newline separated list of URLs for the requested topic. Respond with plain text only.",
            },
            {
              role: "user" as const,
              content: `List ${DEFAULT_URLS_PER_TOPIC} current, high-quality URLs for the topic: ${topicName}.`,
            },
          ],
        };

        const response = await perplexityClient.post(body);
        const content = response?.choices?.[0]?.message?.content;

        if (!content) {
          console.warn(`⚠️ No URLs returned for topic '${topicName}'`);
          continue;
        }

        const urls = content.split("\n").map((line) => line.trim()).filter(Boolean);

        for (const url of urls) {
          await urlMongoService.create({
            url,
            status: URL_STATUS.PENDING,
            depth: 0,
            discoveredAt: new Date(),
            updatedAt: new Date(),
            sourceTopic: topicName,
          } as any);
          totalInserted += 1;
        }

        console.log(`🌱 Seeded URLs for topic '${topicName}'. Added ${urls.length} entries.`);
      } catch (topicError) {
        console.error(`❌ Failed to seed URLs for topic '${topicName}':`, topicError);
      }
    }

    console.log(`✅ Completed topic seeding job. Total new URLs inserted: ${totalInserted}`);
  } catch (error) {
    console.error("❌ Error during topic seeding job:", error);
  }
}


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
