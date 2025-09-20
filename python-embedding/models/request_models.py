from pydantic import BaseModel
from typing import List


class EmbeddingRequest(BaseModel):
    url: str
    texts: List[str]


class EmbeddingResponse(BaseModel):
    message: str
    success: bool
