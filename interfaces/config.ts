import { QueueName, UrlStatus, CollectionName } from "../constants";

export type QdrantDistanceTypes = "Cosine" | "Dot" | "Euclid" | "Manhattan";

export interface QueueManager {
  push: (queue: QueueName, value: string) => Promise<number>;
  pop: (queue: QueueName) => Promise<string | null>;
  subscribe: (queue: QueueName, callback: (value: string) => void) => void;
}

// Re-export types for convenience
export type { QueueName, UrlStatus, CollectionName };
