from fastapi import FastAPI
from routes.embedding_routes import embedding_router
from startup import startup
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Embedding Service")

@app.on_event("startup")
async def startup_event():
    """Run startup initialization when the app starts"""
    await startup()

app.include_router(embedding_router)
