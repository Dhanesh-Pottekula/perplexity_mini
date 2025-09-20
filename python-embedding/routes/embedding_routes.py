from fastapi import APIRouter
from models.request_models import EmbeddingRequest, EmbeddingResponse
from services.embedding_service import embedding_service
from constants import ApiEndpoints, SuccessMessages, ErrorMessages

embedding_router = APIRouter()

@embedding_router.post(ApiEndpoints.EMBED, response_model=EmbeddingResponse)
async def upsert_embeddings(req: EmbeddingRequest):
    try:
        await embedding_service.upsert_embeddings(req.url_id, req.texts)
        return EmbeddingResponse(
            message=f"{SuccessMessages.UPSERT_SUCCESS}: {len(req.texts)} embeddings for URL: {req.url_id}",
            success=True
        )
    except Exception as e:
        return EmbeddingResponse(
            message=f"{ErrorMessages.UPSERT_ERROR}: {str(e)}",
            success=False
        )
