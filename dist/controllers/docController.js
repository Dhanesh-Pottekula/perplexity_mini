import { createDocument, searchDocuments } from "../services/docService.js";
export async function addDoc(req, res) {
    try {
        const { url, topic, content, embedding } = req.body || {};
        if (!Array.isArray(embedding) || embedding.length === 0) {
            return res.status(400).json({ error: "embedding array is required" });
        }
        const doc = await createDocument({ url, topic, content, embedding });
        return res.json({ message: "✅ Document stored", id: doc._id });
    }
    catch (error) {
        console.error("addDoc error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function search(req, res) {
    try {
        const { queryVector, limit } = req.body || {};
        if (!Array.isArray(queryVector) || queryVector.length === 0) {
            return res.status(400).json({ error: "queryVector array is required" });
        }
        const results = await searchDocuments({ queryVector, limit });
        return res.json(results);
    }
    catch (error) {
        console.error("search error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
//# sourceMappingURL=docController.js.map