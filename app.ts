import express from "express";
import bodyParser from "body-parser";
import { connectMongo } from "./configs/mongo";
import { createCollectionsQdrant } from "./configs/qdrant";
import { redisQueue } from "./db/services/redisService";
import urlRoutes from "./routes/urlRoutes";
import chatRoutes from "./routes/chatRoutes";
import { runPerplexitySearch } from "./services/perplexitySearchService";
import "./agents/webContentExtractor"; // Import the agent to start the subscription
import "./workers/CronJobWorker"; // Import the cron job worker to start scheduled tasks

export async function createApp() {
  await connectMongo();
  await createCollectionsQdrant();

  // Initialize Redis connection
  await redisQueue.initialize();

  const app = express();
  app.use(bodyParser.json());

  // API Routes
  app.use("/api/urls", urlRoutes);
  app.use("/api/chat", chatRoutes);

  app.post("/api/search/perplexity", async (req, res) => {
    const { queries, maxResults } = req.body;

    if (!Array.isArray(queries)) {
      res.status(400).json({ error: "queries must be an array" });
      return;
    }

    try {
      const results = await runPerplexitySearch(queries, maxResults);
      res.json({ results });
    } catch (error) {
      console.error("Perplexity search endpoint failed", error);
      res.status(500).json({ error: "Perplexity search failed" });
    }
  });

  app.get("/health", (req, res) => {
    res.json({ status: "ok", pid: process.pid });
  });

  return app;
}


