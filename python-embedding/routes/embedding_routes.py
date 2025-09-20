from fastapi import APIRouter
from models.request_models import EmbeddingRequest, EmbeddingResponse
from services.embedding_service import embedding_service

embedding_router = APIRouter()

@embedding_router.post("/embed", response_model=EmbeddingResponse)
async def get_embeddings(req: EmbeddingRequest):
    embeddings = embedding_service.get_embeddings(req.texts)
    return EmbeddingResponse(embeddings=embeddings)
