import { envDefaults } from "../envDefaults";

type PerplexityClientOptions = {
  apiKey?: string;
  timeoutSeconds?: number;
  model?: string;
};

export type PerplexityRequestBody = {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
};

export type PerplexityResponseChoice = {
  message?: {
    role?: string;
    content?: string;
  };
};

export type PerplexityChatResponse = {
  choices?: PerplexityResponseChoice[];
};

export class PerplexityClient {
  private readonly apiUrl = "https://api.perplexity.ai/chat/completions";
  private readonly apiKey: string;
  private readonly timeoutSeconds: number;
  private readonly model: string;

  constructor(options: PerplexityClientOptions = {}) {
    this.apiKey = options.apiKey ?? envDefaults.PERPLEXITY_API_KEY ?? "";
    this.timeoutSeconds = options.timeoutSeconds ?? 30;
    this.model = options.model ?? "sonar";
  }

  get defaultHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  get hasValidKey(): boolean {
    return Boolean(this.apiKey);
  }

  get defaultBody(): Pick<PerplexityRequestBody, "model" | "messages" | "temperature"> {
    return {
      model: this.model,
      messages: [],
      temperature: 0.3,
    };
  }

  async post(body: PerplexityRequestBody): Promise<PerplexityChatResponse> {
    if (!this.hasValidKey) {
      return { choices: [] };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutSeconds * 1000);

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: this.defaultHeaders,
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Perplexity API request failed with status ${response.status}`);
      }

      return (await response.json()) as PerplexityChatResponse;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export function getPerplexityClient(options?: PerplexityClientOptions): PerplexityClient {
  return new PerplexityClient(options);
}
