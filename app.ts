import express from "express";
import bodyParser from "body-parser";
import { connectMongo } from "./configs/mongo";
import { createCollectionsQdrant } from "./configs/qdrant";
import { redisQueue } from "./db/services/redisService";
import urlRoutes from "./routes/urlRoutes";
import "./agents/webContentExtractor"; // Import the agent to start the subscription

export async function createApp() {
  await connectMongo();
  await createCollectionsQdrant();
  
  // Initialize Redis connection
  await redisQueue.initialize();

  const app = express();
  app.use(bodyParser.json());

  // API Routes
  app.use("/api/urls", urlRoutes);

  app.get("/health", (req, res) => {
    res.json({ status: "ok", pid: process.pid });
  });

  return app;
}


