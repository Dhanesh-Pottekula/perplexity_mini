import { QdrantClient } from "@qdrant/js-client-rest";

export const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";
export const VECTOR_SIZE = Number.parseInt(process.env.VECTOR_SIZE || "1536", 10);
export const VECTOR_DISTANCE = process.env.VECTOR_DISTANCE || "Cosine";

let client: QdrantClient;
const URL_COLLECTION = "urls";
export function getQdrantClient() {
  if (!client) {
    client = new QdrantClient({ url: QDRANT_URL });
  }
  return client;
}

export async function ensureQdrantCollection() {
  const qdrant = getQdrantClient();
  try {
    await qdrant.createCollection(, {
      vectors: { size: VECTOR_SIZE, distance: VECTOR_DISTANCE },
    });
    console.log("✅ Qdrant collection ready");
  } catch (err) {
    if (!String((err as Error)?.message || "").includes("already exists")) {
      console.error("⚠️ Qdrant error:", err);
    }
  }
  return qdrant;
}


