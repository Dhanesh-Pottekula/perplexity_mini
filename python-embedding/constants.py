"""
Constants to prevent spelling mistakes and ensure consistency across the application.
"""
from configs.envConfig import config

# Collection Names
class CollectionNames:
    URLS = "urls"
    DOCUMENTS = "documents"
    WEB_CONTENT = "web_content"
    TOPICS = "topics"

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
    MODEL_NAME = config.EMBEDDING_MODEL
    VECTOR_SIZE = config.VECTOR_SIZE
    DISTANCE_METRIC = "Cosine"

# API Endpoints
class ApiEndpoints:
    EMBED_URLS = "/embed_urls"
    EMBED = "/embed"
    SEARCH = "/search"
    HEALTH = "/health"
    CHAT = "/chat"


# Error Messages
class ErrorMessages:
    EMBEDDING_ERROR = "Error generating embeddings"
    QDRANT_ERROR = "Error with Qdrant operation"
    COLLECTION_ERROR = "Error ensuring collection exists"
    UPSERT_ERROR = "Error upserting embeddings"
    CHAT_ERROR = "Error generating chat"

# Success Messages
class SuccessMessages:
    EMBEDDING_SUCCESS = "Embeddings generated successfully"
    COLLECTION_CREATED = "Collection created successfully"
    COLLECTION_EXISTS = "Collection already exists"
    UPSERT_SUCCESS = "Embeddings upserted successfully"
    CHAT_SUCCESS = "Chat generated successfully"
# Payload Keys
class PayloadKeys:
    URL_ID = "url_id"
    URL_IDS = "url_ids"  # Array of URL IDs for topics
    TEXT = "text"
    INDEX = "index"
    TITLE = "title"
    CONTENT = "content"
    LINKS = "links"
    STATUS = "status"
    DEPTH = "depth"
    DISCOVERED_AT = "discovered_at"
    META = "meta"
    TOPIC_ID = "topic_id"
    TOPIC_NAME = "topic_name"
    TAGS = "tags"
    USER_ID = "user_id"
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"
