from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
from typing import Optional
from constants import EmbeddingConfig, ErrorMessages, SuccessMessages
from config.envConfig import config

class QdrantConfig:
    def __init__(self):
        self.qdrant_url = config.QDRANT_URL
        self.client: Optional[QdrantClient] = None
    
    def get_client(self) -> QdrantClient:
        """Get or create Qdrant client instance"""
        if not self.client:
            self.client = QdrantClient(url=self.qdrant_url)
        return self.client
    
    async def ensure_collection(self, collection_name: str, vector_size: int = EmbeddingConfig.VECTOR_SIZE) -> QdrantClient:
        """Ensure a Qdrant collection exists"""
        client = self.get_client()
        try:
            # Check if collection exists
            collections = client.get_collections()
            collection_exists = any(col.name == collection_name for col in collections.collections)
            
            if not collection_exists:
                # Create new collection
                client.create_collection(
                    collection_name=collection_name,
                    vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE)
                )
                print(f"{SuccessMessages.COLLECTION_CREATED}: {collection_name}")
            else:
                print(f"{SuccessMessages.COLLECTION_EXISTS}: {collection_name}")
                
        except Exception as e:
            print(f"{ErrorMessages.COLLECTION_ERROR} {collection_name}: {e}")
        return client

# Global instance
qdrant_config = QdrantConfig()
