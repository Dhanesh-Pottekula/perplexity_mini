from fastapi import FastAPI
from routes.embedding_routes import embedding_router
from startup import startup
import logging
from config.envConfig import config

# Configure logging
logging.basicConfig(level=getattr(logging, config.LOG_LEVEL.upper(), logging.INFO))
logger = logging.getLogger(__name__)

app = FastAPI(title=config.APP_NAME, debug=config.DEBUG)

@app.on_event("startup")
async def startup_event():
    """Run startup initialization when the app starts"""
    await startup()

app.include_router(embedding_router)
