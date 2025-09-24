import { QueueName, UrlStatus, CollectionName } from "./constants";

export type QdrantDistanceTypes = "Cosine" | "Dot" | "Euclid" | "Manhattan";

export interface QueueManager {
  push: (queue: QueueName, value: object) => Promise<number>;
  pop: (queue: QueueName) => Promise<string | null>;
  subscribe: (queue: QueueName, callback: (value: object) => void) => void;
}


export interface QueueTypes {
  URL_QUEUE_ITEM: {
    link: string;
    depth: number;
  };
}


// Re-export types for convenience
export type { QueueName, UrlStatus, CollectionName };
