from sentence_transformers import SentenceTransformer
from typing import List
from constants import EmbeddingConfig


class Embedding:
    def __init__(self):
        self.model = SentenceTransformer(EmbeddingConfig.MODEL_NAME)
        self.vector_size = EmbeddingConfig.VECTOR_SIZE

    async def generate_embeddings(self, texts: List[str]) -> list[list[float]]:
        """Generate embeddings for a list of texts and return vectors."""
        return self.model.encode(texts, convert_to_numpy=True).tolist()

# Global instance
embedding = Embedding()
