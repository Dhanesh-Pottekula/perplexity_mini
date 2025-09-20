from pydantic import BaseModel
from typing import List



class EmbeddingRequest(BaseModel):
    url_id: str
    texts: List[str]


class EmbeddingResponse(BaseModel):
    message: str
    success: bool


class SearchRequest(BaseModel):
    query: str
    limit: int = 10
    collection_name: str = "urls"


class SearchResponse(BaseModel):
    results: List[dict]
    success: bool
    message: str
