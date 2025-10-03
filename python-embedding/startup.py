"""
Startup for embedding service. Embeddings-only; no vector DB initialization.
"""
import logging
from configs.envConfig import config

logging.basicConfig(level=getattr(logging, config.LOG_LEVEL.upper(), logging.INFO))
logger = logging.getLogger(__name__)


async def startup():
    logger.info("Embedding service startup complete (embeddings-only mode)")
