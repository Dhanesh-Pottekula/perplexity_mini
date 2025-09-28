export interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OllamaRequest {
  model: string;
  messages: OllamaMessage[];
  stream: boolean;
}

export interface OllamaResponse {
  message: {
    content: string;
  };
}

export interface OllamaChatModelTypes {
  LLAMA3_8B: string;
  LLAMA3_1_8B: string;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

export const OLLAMA_CHAT_MODEL_TYPES: OllamaChatModelTypes = {
    LLAMA3_8B: "llama3:8b",
    LLAMA3_1_8B: "llama3.1:8b",
  };
