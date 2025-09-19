import express from "express";
import bodyParser from "body-parser";
import { connectMongo } from "./configs/mongo";
import { createCollectionsQdrant } from "./configs/qdrant";

export async function createApp() {
  await connectMongo();
  await createCollectionsQdrant();

  const app = express();
  app.use(bodyParser.json());

  // app.use(docRoutes);

  app.get("/health", (req, res) => {
    res.json({ status: "ok", pid: process.pid });
  });

  return app;
}


