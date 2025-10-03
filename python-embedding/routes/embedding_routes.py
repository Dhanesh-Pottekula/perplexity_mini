from fastapi import APIRouter
from models.request_models import (
    EmbeddingQueryRequest,
    EmbeddingBatchRequest,
    EmbeddingResponse,
)

from services.embeddingService import embeddingService
from constants import ApiEndpoints, SuccessMessages, ErrorMessages

embedding_router = APIRouter()

# Removed EMBED_URLS route; Node handles storage/upserts now


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


@embedding_router.post(ApiEndpoints.EMBED_BATCH, response_model=EmbeddingResponse)
async def get_embeddings_batch(req: EmbeddingBatchRequest):
    try:
        embeddings = await embeddingService.generateEmbeddings(req.texts)
        return EmbeddingResponse(
            message=f"{SuccessMessages.EMBEDDING_SUCCESS}: {len(req.texts)} embeddings generated",
            success=True,
            embeddings=embeddings
        )
    except Exception as e:
        return EmbeddingResponse(
            message=f"{ErrorMessages.EMBEDDING_ERROR}: {str(e)}",
            success=False
        )