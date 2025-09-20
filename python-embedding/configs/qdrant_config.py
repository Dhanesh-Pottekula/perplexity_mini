import os
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
from typing import Optional

class QdrantConfig:
    def __init__(self):
        self.qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
        self.client: Optional[QdrantClient] = None
    
    def get_client(self) -> QdrantClient:
        """Get or create Qdrant client instance"""
        if not self.client:
            self.client = QdrantClient(url=self.qdrant_url)
        return self.client
    
    async def ensure_collection(self, collection_name: str, vector_size: int = 384) -> QdrantClient:
        """Ensure a Qdrant collection exists"""
        client = self.get_client()
        try:
            # Try to create the collection
            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE)
            )
        except Exception:
            # Collection already exists, ignore the error
            pass
        return client

# Global instance
qdrant_config = QdrantConfig()
