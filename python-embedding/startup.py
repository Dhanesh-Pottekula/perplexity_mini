"""
Startup initialization for the embedding service.
This module handles all initialization tasks that need to run when the app starts.
"""
import logging
from configs.qdrant_config import qdrant_config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def startup():
    """Main startup function that runs all initialization tasks"""
    logger.info("Starting application initialization...")
    
    try:
        # Initialize collections
        await qdrant_config.ensure_collection(
            collection_name="urls",
            vector_size=384  # Size for paraphrase-MiniLM-L12-v2 model
        )
        
        logger.info("Application startup completed successfully")
        
    except Exception as e:
        logger.error(f"Application startup failed: {e}")
        raise
