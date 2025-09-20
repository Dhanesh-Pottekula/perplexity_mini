"""
Constants to prevent spelling mistakes and ensure consistency across the application.
"""

# Collection Names
class CollectionNames:
    URLS = "urls"
    DOCUMENTS = "documents"
    WEB_CONTENT = "web_content"

# URL Status Values
class UrlStatus:
    PENDING = "pending"
    VISITING = "visiting"
    VISITED = "visited"
    FAILED = "failed"

# Queue Names
class QueueNames:
    URLS_QUEUE = "urls_queue"
    WEB_CONTENT_QUEUE = "web_content_queue"
    IMAGE_QUEUE = "image_queue"

# Embedding Model Configuration
class EmbeddingConfig:
    MODEL_NAME = "paraphrase-MiniLM-L12-v2"
    VECTOR_SIZE = 384
    DISTANCE_METRIC = "Cosine"

# API Endpoints
class ApiEndpoints:
    EMBED = "/embed"
    SEARCH = "/search"
    HEALTH = "/health"

# Error Messages
class ErrorMessages:
    EMBEDDING_ERROR = "Error generating embeddings"
    QDRANT_ERROR = "Error with Qdrant operation"
    COLLECTION_ERROR = "Error ensuring collection exists"
    UPSERT_ERROR = "Error upserting embeddings"

# Success Messages
class SuccessMessages:
    EMBEDDING_SUCCESS = "Embeddings generated successfully"
    COLLECTION_CREATED = "Collection created successfully"
    COLLECTION_EXISTS = "Collection already exists"
    UPSERT_SUCCESS = "Embeddings upserted successfully"

# Payload Keys
class PayloadKeys:
    URL_ID = "url_id"
    TEXT = "text"
    INDEX = "index"
    TITLE = "title"
    CONTENT = "content"
    LINKS = "links"
    STATUS = "status"
    DEPTH = "depth"
    DISCOVERED_AT = "discovered_at"
    META = "meta"
