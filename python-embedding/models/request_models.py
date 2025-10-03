from pydantic import BaseModel
from typing import List



class EmbeddingQueryRequest(BaseModel):
    query: str


class EmbeddingBatchRequest(BaseModel):
    texts: List[str]


class EmbeddingResponse(BaseModel):
    message: str
    success: bool
    embeddings: List[List[float]] = None


class SearchRequest(BaseModel):
    query: str
    limit: int = 10
    collection_name: str = "urls"


class SearchResponse(BaseModel):
    results: List[dict]
    success: bool
    message: str
