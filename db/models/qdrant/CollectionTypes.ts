// Collection type definitions and interfaces for Qdrant

export interface BaseCollectionConfig {
  name: string;
  vectorSize: number;
  distance: "Cosine" | "Euclidean" | "Dot";
  description?: string;
}

export interface DocumentCollectionConfig extends BaseCollectionConfig {
  type: "documents";
  payloadSchema: {
    url?: string;
    title?: string;
    content?: string;
    topic?: string;
    createdAt?: Date;
    metadata?: Record<string, any>;
  };
}

export interface UrlCollectionConfig extends BaseCollectionConfig {
  type: "urls";
  payloadSchema: {
    url: string;
    parentUrl?: string;
    status: "pending" | "visiting" | "visited" | "failed";
    depth: number;
    discoveredAt: Date;
    title?: string;
    meta?: Record<string, any>;
  };
}

export interface UserCollectionConfig extends BaseCollectionConfig {
  type: "users";
  payloadSchema: {
    userId: string;
    preferences?: Record<string, any>;
    searchHistory?: string[];
    createdAt: Date;
    lastActive?: Date;
  };
}

export interface QueryCollectionConfig extends BaseCollectionConfig {
  type: "queries";
  payloadSchema: {
    query: string;
    userId?: string;
    results?: string[];
    timestamp: Date;
    context?: Record<string, any>;
  };
}

export type CollectionConfig = 
  | DocumentCollectionConfig 
  | UrlCollectionConfig 
  | UserCollectionConfig 
  | QueryCollectionConfig;

export interface CollectionMetadata {
  name: string;
  type: string;
  vectorSize: number;
  distance: string;
  pointCount: number;
  createdAt: Date;
  lastUpdated: Date;
}

export interface VectorPoint {
  id: string | number;
  vector: number[];
  payload?: Record<string, any>;
}

export interface SearchResult {
  id: string | number;
  score: number;
  payload?: Record<string, any>;
}

export interface CollectionManager {
  createCollection(config: CollectionConfig): Promise<boolean>;
  deleteCollection(name: string): Promise<boolean>;
  collectionExists(name: string): Promise<boolean>;
  getCollectionInfo(name: string): Promise<CollectionMetadata | null>;
  listCollections(): Promise<CollectionMetadata[]>;
  upsertPoints(collectionName: string, points: VectorPoint[]): Promise<boolean>;
  searchPoints(
    collectionName: string, 
    vector: number[], 
    limit?: number, 
    filter?: Record<string, any>
  ): Promise<SearchResult[]>;
  deletePoints(collectionName: string, ids: (string | number)[]): Promise<boolean>;
}
