import express from "express";
import bodyParser from "body-parser";
import { connectMongo } from "./configs/mongo.js";
import { ensureQdrantCollection } from "./configs/qdrant.js";
import docRoutes from "./routes/docRoutes.js";

export async function createApp() {
  await connectMongo();
  await ensureQdrantCollection();

  const app = express();
  app.use(bodyParser.json());

  app.use(docRoutes);

  app.get("/health", (req, res) => {
    res.json({ status: "ok", pid: process.pid });
  });

  return app;
}


