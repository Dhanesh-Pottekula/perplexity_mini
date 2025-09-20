/**
 * Constants to prevent spelling mistakes and ensure consistency across the application.
 */

// Collection Names
export const COLLECTION_NAMES = {
  URLS: "urls",
  DOCUMENTS: "documents",
  WEB_CONTENT: "web_content"
} as const;

// URL Status Values
export const URL_STATUS = {
  PENDING: "pending",
  VISITING: "visiting",
  VISITED: "visited",
  FAILED: "failed"
} as const;

// Queue Names
export const QUEUE_NAMES = {
  URLS_QUEUE: "urls_queue",
  WEB_CONTENT_QUEUE: "web_content_queue",
  IMAGE_QUEUE: "image_queue"
} as const;

// Embedding Model Configuration
export const EMBEDDING_CONFIG = {
  MODEL_NAME: "paraphrase-MiniLM-L12-v2",
  VECTOR_SIZE: 384,
  DISTANCE_METRIC: "Cosine"
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  EMBED: "/embed",
  SEARCH: "/search",
  HEALTH: "/health"
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  EMBEDDING_ERROR: "Error generating embeddings",
  QDRANT_ERROR: "Error with Qdrant operation",
  COLLECTION_ERROR: "Error ensuring collection exists",
  UPSERT_ERROR: "Error upserting embeddings",
  URL_PROCESSING_ERROR: "Error processing URL",
  QUEUE_SUBSCRIPTION_ERROR: "Failed to start queue subscription"
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  EMBEDDING_SUCCESS: "Embeddings generated successfully",
  COLLECTION_CREATED: "Collection created successfully",
  COLLECTION_EXISTS: "Collection already exists",
  UPSERT_SUCCESS: "Embeddings upserted successfully",
  URL_PROCESSED: "URL processed successfully"
} as const;

// Payload Keys
export const PAYLOAD_KEYS = {
  URL_ID: "url_id",
  TEXT: "text",
  INDEX: "index",
  TITLE: "title",
  CONTENT: "content",
  LINKS: "links",
  STATUS: "status",
  DEPTH: "depth",
  DISCOVERED_AT: "discovered_at",
  META: "meta"
} as const;

// Type definitions for better type safety
export type CollectionName = typeof COLLECTION_NAMES[keyof typeof COLLECTION_NAMES];
export type UrlStatus = typeof URL_STATUS[keyof typeof URL_STATUS];
export type QueueName = typeof QUEUE_NAMES[keyof typeof QUEUE_NAMES];
export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];
export type PayloadKey = typeof PAYLOAD_KEYS[keyof typeof PAYLOAD_KEYS];
