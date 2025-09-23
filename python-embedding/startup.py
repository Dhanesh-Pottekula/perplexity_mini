"""
Startup initialization for the embedding service.
This module handles all initialization tasks that need to run when the app starts.
"""
import logging
from configs.qdrant_config import qdrant_config
from configs.envConfig import config

# Configure logging
logging.basicConfig(level=getattr(logging, config.LOG_LEVEL.upper(), logging.INFO))
logger = logging.getLogger(__name__)


async def startup():
    """Main startup function that runs all initialization tasks"""
    logger.info("Starting application initialization...")
    
    try:
        # Initialize collections
        await qdrant_config.ensure_collection(
            collection_name="urls",
            vector_size=config.VECTOR_SIZE
        )
        
        logger.info("Application startup completed successfully")
        
    except Exception as e:
        logger.error(f"Application startup failed: {e}")
        raise
