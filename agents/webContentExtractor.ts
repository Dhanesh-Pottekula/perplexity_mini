import { redisQueue } from "../db/services/redisService";
import { QueueName } from "../interfaces/config";
import { scrapeWebsite } from "../workers/scrapingWorker";
import { sleep } from "../helpers/timers";
import { getEmbeddings } from "../db/services/apiService";
import { chunkText } from "../helpers/formettors";

async function processUrl(url: string) {
  try {


    const result = await scrapeWebsite(url);
    const { content, links, title } = result;
    const chunkContent = chunkText(content, 500, 50);

    const embeddings = await getEmbeddings(chunkContent);

    console.log(embeddings);
    // const getCleanContent = getCleanContent(content);
  } catch (err) {
    console.error("❌ Error processing URL:", url, err);
  }
}


// Subscribe to the queue
redisQueue.subscribe("urls_queue" as QueueName, processUrl).catch(err => {
  console.error("❌ Failed to start queue subscription:", err);
});
