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
        await asyncio.gather(
            self.embedding.upsert_embeddings_urls(url_id, texts),
            storagePipeline.extractTopicsFromContentWithTags(url_id, texts),
        )


embeddingService = EmbeddingService()
