export type qdrantDistanceTypes = "Cosine" | "Dot" | "Euclid" | "Manhattan";

export type QueueName =
  | "urls_queue"
  | "web_content_queue"
  | "image_queue";

export interface QueueManager {
  push: (queue: QueueName, value: string) => Promise<number>;
  pop: (queue: QueueName) => Promise<string | null>;
  subscribe: (queue: QueueName, callback: (value: string) => void) => void;
}
