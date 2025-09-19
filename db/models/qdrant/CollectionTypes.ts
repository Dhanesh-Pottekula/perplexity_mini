// Collection type definitions and interfaces for Qdrant

export interface BaseCollectionConfig {
  name: string;
  vectorSize: number;
  distance: "Cosine" | "Euclidean" | "Dot";
  description?: string;
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


export type CollectionConfig = 
  | UrlCollectionConfig;

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

  upsertPoints(collectionName: string, points: VectorPoint[]): Promise<boolean>;
  searchPoints(
    collectionName: string, 
    vector: number[], 
    limit?: number, 
    filter?: Record<string, any>
  ): Promise<SearchResult[]>;
  deletePoints(collectionName: string, ids: (string | number)[]): Promise<boolean>;
}
