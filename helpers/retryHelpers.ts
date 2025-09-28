import { envDefaults } from "../envDefaults";
import { RetryConfig } from "../interfaces/ollama";

const MAX_RETRIES = envDefaults.MAX_RETRIES;

export async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {
    maxRetries: MAX_RETRIES,
    baseDelay: 1000,
    maxDelay: 30000,
  }
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === config.maxRetries) {
        throw lastError;
      }

      const delay = Math.min(
        config.baseDelay * Math.pow(2, attempt),
        config.maxDelay
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

