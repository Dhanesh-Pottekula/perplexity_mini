import { QdrantClient } from "@qdrant/js-client-rest";
import { qdrantDistanceTypes } from "../interfaces/config";
import { envDefaults } from "../envDefaults";

let client: QdrantClient;

// Constants
const VECTOR_SIZE = 1536;
const VECTOR_DISTANCE: qdrantDistanceTypes = "Cosine";

// Singleton Qdrant client
export function getQdrantClient(): QdrantClient {
  if (!client) {
    client = new QdrantClient({ url: envDefaults.QDRANT_URL });
  }
  return client;
}

/**
 * Ensure a Qdrant collection exists.
 * @param collectionName Name of the collection (e.g., "urls", "web_content")
 * @param vectorSize Size of the vector embedding
 * @param distance Distance metric: qdrantDistanceTypes
 */
export async function ensureQdrantCollection(
  collectionName: string,
  vectorSize: number = VECTOR_SIZE,
  distance: qdrantDistanceTypes = VECTOR_DISTANCE
): Promise<QdrantClient> {
  const qdrant = getQdrantClient();
  try {
    await qdrant.createCollection(collectionName, {
      vectors: { size: vectorSize, distance },
    });
    console.log(`✅ Qdrant collection '${collectionName}' ready`);
  } catch (err) {
      console.log(`⚡ Collection '${collectionName}' already exists`);

  }
  return qdrant;
}



export async function createCollectionsQdrant() {
  const q = await ensureQdrantCollection("urls");
  const q2 = await ensureQdrantCollection("web_content");
}