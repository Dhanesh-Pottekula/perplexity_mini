from core.embedding import embedding
from typing import List
from pipeline.storagePipeline import storagePipeline
import asyncio


class EmbeddingService:
    def __init__(self):
        self.embedding = embedding

    async def getEmbeddingsAndTriggerPipeline(
        self, url_id: str, texts: List[str]
    ) -> None:
        try:
            await asyncio.gather(
                self.embedding.upsert_embeddings_urls(url_id, texts),
                storagePipeline.process({"url_id": url_id, "content": texts}),
            )
        except Exception as e:
            print(f"{e}")

    async def generateEmbeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for texts without storing them"""
        try:
            embeddings = self.embedding.model.encode(texts, convert_to_numpy=True).tolist()
            return embeddings
        except Exception as e:
            print(f"Error generating embeddings: {e}")
            raise e


embeddingService = EmbeddingService()
