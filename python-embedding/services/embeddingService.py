from core.embedding import embedding
from typing import List


class EmbeddingService:
    def __init__(self):
        self.embedding = embedding

    # Removed storage pipeline logic. Node service now handles topics and URL upserts.

    async def generateEmbeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for texts without storing them"""
        try:
            return await self.embedding.generate_embeddings(texts)
        except Exception as e:
            print(f"Error generating embeddings: {e}")
            raise e


embeddingService = EmbeddingService()
