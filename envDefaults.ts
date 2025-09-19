
import dotenv from "dotenv";
dotenv.config();

export const envDefaults = {
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/perplexity",
  QDRANT_URL: process.env.QDRANT_URL || "http://localhost:6333",
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  PORT: process.env.PORT || 3000,
};