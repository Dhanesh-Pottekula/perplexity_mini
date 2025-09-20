from fastapi import FastAPI
from routes.embedding_routes import embedding_router

app = FastAPI(title="Embedding Service")

app.include_router(embedding_router)
