from sentence_transformers import SentenceTransformer
from typing import List
import uuid
from qdrant_client.models import PointStruct
from configs.qdrant_config import qdrant_config
from constants import EmbeddingConfig, CollectionNames, PayloadKeys, ErrorMessages


class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer(EmbeddingConfig.MODEL_NAME)
        self.vector_size = EmbeddingConfig.VECTOR_SIZE
        self.client = qdrant_config.get_client()

    async def upsert_embeddings(self, url_id: str, texts: List[str]) -> None:
        """Generate embeddings for texts and upsert them to Qdrant collection"""
        # Generate embeddings
        try:
            embeddings = self.model.encode(texts, convert_to_numpy=True).tolist()
            # Prepare points for upsert
            points = []
            for i, (text, embedding) in enumerate(zip(texts, embeddings)):
                point_id = str(uuid.uuid4())
                point = PointStruct(
                    id=point_id,
                    vector=embedding,
                    payload={
                        PayloadKeys.URL_ID: url_id,
                        PayloadKeys.TEXT: text,
                        PayloadKeys.INDEX: i,
                    },
                )
                points.append(point)

            # Upsert to Qdrant
            self.client.upsert(collection_name=CollectionNames.URLS, points=points)

        except Exception as e:
            print(f"{ErrorMessages.UPSERT_ERROR}: {e}")


# Global instance
embedding_service = EmbeddingService()
