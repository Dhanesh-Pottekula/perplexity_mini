import Doc from "../db/models/mongo/Doc.js";
import { getQdrantClient } from "../configs/qdrant.js";
import { DOCS_COLLECTION } from "../configs/qdrant.js";
export async function createDocument({ url, topic, content, embedding }) {
    const doc = await Doc.create({ url, topic, content });
    const qdrant = getQdrantClient();
    await qdrant.upsert(DOCS_COLLECTION, {
        points: [
            {
                id: doc._id.toString(),
                vector: embedding,
                payload: { url, topic, content },
            },
        ],
    });
    return doc;
}
export async function searchDocuments({ queryVector, limit = 5 }) {
    const qdrant = getQdrantClient();
    const results = await qdrant.search(DOCS_COLLECTION, {
        vector: queryVector,
        limit,
    });
    return results;
}
//# sourceMappingURL=docService.js.map