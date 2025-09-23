from core.embedding import embedding
from typing import List
from pipeline.storagePipeline import storagePipeline

class EmbeddingService:
    def __init__(self):
        self.embedding = embedding

    async def getEmbeddingsAndTriggerPipeline(self, url_id: str, texts: List[str]) -> None:
        embeddings = self.embedding.upsert_embeddings_urls(url_id, texts)
        storagePipeline.extractTopicsFromContentWithTags(url_id, texts)

