

import { envDefaults } from "../envDefaults";
import { TaskQueue } from "../configs/pQueue";
import { OLLAMA_CHAT_MODEL_TYPES, OllamaRequest, OllamaResponse } from "../interfaces/ollama";

import { callApi } from "../helpers/apiHelpers";
import { retryWithExponentialBackoff } from "../helpers/retryHelpers";

const DEFAULT_MODEL = OLLAMA_CHAT_MODEL_TYPES.LLAMA3_1_8B;
const DEFAULT_STRUCTURED_MODEL = OLLAMA_CHAT_MODEL_TYPES.LLAMA3_1_8B;
const MAX_CONCURRENT = envDefaults.MAX_CONCURRENT_LLM_CALLS;
export class OllamaService {
  private readonly defaultModel: string;
  private readonly structuredModel: string;
  private readonly nginxUrlChat: string;
  private readonly queue: TaskQueue;

  constructor() {
    this.defaultModel = DEFAULT_MODEL;
    this.structuredModel = DEFAULT_STRUCTURED_MODEL;
    this.nginxUrlChat = envDefaults.NGINX_URL;
    this.queue = new TaskQueue(MAX_CONCURRENT);
  }

  private async sendRequest(payload: OllamaRequest) {
    return callApi<OllamaResponse, OllamaRequest>(
      this.nginxUrlChat,
      "POST",
      payload
    );
  }

  async generateTextAsStream(
    prompt: string,
    systemInstruction: string,
    model?: string
  ): Promise<AsyncGenerator<string, void, unknown>> {
    const targetModel = model || this.defaultModel;

    return retryWithExponentialBackoff(async () => {
      const payload: OllamaRequest = {
        model: targetModel,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt },
        ],
        stream: false,
      };

      const data = await this.sendRequest(payload);
      const content = data.message.content;

      return this.createChunkGenerator(content);
    });
  }

  private async* createChunkGenerator(content: string): AsyncGenerator<string, void, unknown> {
    const chunkSize = 100;
    for (let i = 0; i < content.length; i += chunkSize) {
      yield content.slice(i, i + chunkSize);
    }
  }

  async generateStructuredOutput<T>(
    prompt: string,
    systemInstruction: string,
    responseModel: new (data: any) => T,
    model?: string
  ): Promise<T> {
    const targetModel = model || this.structuredModel;

    return this.queue.add(async () => {
      return retryWithExponentialBackoff(async () => {
        const payload: OllamaRequest = {
          model: targetModel,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt },
          ],
          stream: false,
        };

        const data = await this.sendRequest(payload);
        const content = data.message.content || "{}";

        try {
          const parsed = JSON.parse(content);
          return new responseModel(parsed);
        } catch (error) {
          console.error(
            `Failed to parse JSON response: ${error}. Content: ${content.slice(0, 200)}...`
          );
          throw error;
        }
      });
    });
  }

}

export const ollamaService = new OllamaService();

