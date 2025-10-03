import { envDefaults } from "../envDefaults";
import { OPENROUTER_CHAT_MODEL_TYPES } from "../interfaces/openrouter";

type ChatContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string | ChatContentPart[];
};

// Lazy import to avoid ESM issues until used
async function getOpenAIClient() {
  const mod = await import("openai");
  const OpenAI = mod.default;
  const apiKey = envDefaults.OPENROUTER_API_KEY || "";
  const baseURL = envDefaults.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
  return new OpenAI({ apiKey, baseURL });
}

export class OpenRouterService {
  private readonly defaultModel: string;

  constructor(defaultModel: string = OPENROUTER_CHAT_MODEL_TYPES.DEEPSEEK_CHAT_V3_1) {
    this.defaultModel = defaultModel;
  }

  async generateText(
    messages: ChatMessage[],
    model?: string,
    options?: { extraHeaders?: Record<string, string>; extraBody?: any }
  ): Promise<string> {
    const client = await getOpenAIClient();
    const requestBody: any = {
      model: model || this.defaultModel,
      messages,
      stream: false,
    };
    if (options?.extraHeaders) requestBody.extra_headers = options.extraHeaders;
    if (options?.extraBody) requestBody.extra_body = options.extraBody;

    const response = await client.chat.completions.create(requestBody as any);
    return response.choices?.[0]?.message?.content || "";
  }

  async generateStructuredJSON<T>(
    messages: ChatMessage[],
    jsonSchema: any,
    model?: string,
    options?: { extraHeaders?: Record<string, string>; extraBody?: any }
  ): Promise<T> {
    const client = await getOpenAIClient();
    const schemaInstruction = [
      "Return ONLY a valid JSON object with no code fences or commentary.",
      "Ensure it strictly conforms to this JSON Schema:",
      JSON.stringify(jsonSchema),
    ].join("\n");

    const augmentedMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: schemaInstruction },
    ];

    const requestBody: any = {
      model: model || this.defaultModel,
      messages: augmentedMessages,
      stream: false,
    };
    if (options?.extraHeaders) requestBody.extra_headers = options.extraHeaders;
    if (options?.extraBody) requestBody.extra_body = options.extraBody;

    const response = await client.chat.completions.create(requestBody as any);
    const content = response.choices?.[0]?.message?.content || "{}";
    return JSON.parse(content) as T;
  }
}

export const openRouterService = new OpenRouterService();


