
import dotenv from "dotenv";
dotenv.config();

export const envDefaults = {
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/perplexity",
  QDRANT_URL: process.env.QDRANT_URL || "http://localhost:6333",
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  PORT: Number(process.env.PORT) || 3000,
  BROWSER_HEADLESS: process.env.BROWSER_HEADLESS === "true" ? true : false,
  EMBEDDING_SERVICE_URL: process.env.EMBEDDING_SERVICE_URL || "http://localhost:8001",
  NGINX_URL: process.env.NGINX_URL || "http://localhost:11434",
  MAX_CONCURRENT_LLM_CALLS: Number(process.env.MAX_CONCURRENT_LLM_CALLS) || 5,
  MAX_RETRIES: Number(process.env.MAX_RETRIES) || 3,
  PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY || "",
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
  OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
};