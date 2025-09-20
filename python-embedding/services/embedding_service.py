from sentence_transformers import SentenceTransformer
from typing import List


class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer('paraphrase-MiniLM-L12-v2')
    
    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts"""
        embeddings = self.model.encode(texts, convert_to_numpy=True).tolist()
        return embeddings


# Global instance
embedding_service = EmbeddingService()
