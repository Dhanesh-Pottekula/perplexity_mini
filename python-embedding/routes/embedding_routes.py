from fastapi import APIRouter
from models.request_models import EmbeddingRequest, EmbeddingResponse
from services.embedding_service import embedding_service

embedding_router = APIRouter()

@embedding_router.post("/embed", response_model=EmbeddingResponse)
async def upsert_embeddings(req: EmbeddingRequest):
    try:
        await embedding_service.upsert_embeddings(req.url, req.texts)
        return EmbeddingResponse(
            message=f"Successfully upserted {len(req.texts)} embeddings for URL: {req.url}",
            success=True
        )
    except Exception as e:
        return EmbeddingResponse(
            message=f"Error upserting embeddings: {str(e)}",
            success=False
        )
