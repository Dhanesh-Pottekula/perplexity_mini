from sentence_transformers import SentenceTransformer
from typing import List
import uuid
from qdrant_client.models import PointStruct
from configs.qdrant_config import qdrant_config


class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer('paraphrase-MiniLM-L12-v2')
        self.vector_size = 384  # Size for paraphrase-MiniLM-L12-v2 model
        self.client = qdrant_config.get_client()
    async def upsert_embeddings(self, url: str, texts: List[str]) -> None:
        """Generate embeddings for texts and upsert them to Qdrant collection"""
        # Generate embeddings
        embeddings = self.model.encode(texts, convert_to_numpy=True).tolist()
        
        # Prepare points for upsert
        points = []
        for i, (text, embedding) in enumerate(zip(texts, embeddings)):
            point_id = str(uuid.uuid4())
            point = PointStruct(
                id=point_id,
                vector=embedding,
                payload={
                    "url": url,
                    "text": text,
                    "index": i
                }
            )
            points.append(point)
        
        # Upsert to Qdrant
        await self.client.upsert(
            collection_name="urls",
            points=points
        )

        return None


# Global instance
embedding_service = EmbeddingService()