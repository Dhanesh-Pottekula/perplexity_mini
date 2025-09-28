from fastapi import APIRouter
from models.request_models import (
    EmbeddingRequest,
    EmbeddingQueryRequest,
    EmbeddingResponse,
)

from services.embeddingService import embeddingService
from constants import ApiEndpoints, SuccessMessages, ErrorMessages

embedding_router = APIRouter()

@embedding_router.post(ApiEndpoints.EMBED_URLS, response_model=EmbeddingResponse)
async def upsert_embeddings_urls_qdrant(req: EmbeddingRequest):
    try:
        await embeddingService.getEmbeddingsAndTriggerPipeline(req.url_id, req.texts)
        return EmbeddingResponse(
            message=f"{SuccessMessages.UPSERT_SUCCESS}: {len(req.texts)} embeddings for URL: {req.url_id}",
            success=True
        )
    except Exception as e:
        return EmbeddingResponse(
            message=f"{ErrorMessages.UPSERT_ERROR}: {str(e)}",
            success=False
        )


@embedding_router.post(ApiEndpoints.EMBED, response_model=EmbeddingResponse)
async def get_embeddings_text(req: EmbeddingQueryRequest):
    try:
        embeddings = await embeddingService.generateEmbeddings([req.query])
        return EmbeddingResponse(
            message=f"{SuccessMessages.EMBEDDING_SUCCESS}: 1 embedding generated",
            success=True,
            embeddings=embeddings
        )
    except Exception as e:
        return EmbeddingResponse(
            message=f"{ErrorMessages.SEARCH_ERROR}: {str(e)}",
            success=False
        )