export const OPENROUTER_CHAT_MODEL_TYPES = {
  // Google Models
  GEMINI_2_5_FLASH: "google/gemini-2.5-flash",
  GEMINI_2_5_PRO: "google/gemini-2.5-pro",
  GEMINI_1_5_FLASH: "google/gemini-1.5-flash",
  GEMINI_1_5_PRO: "google/gemini-1.5-pro",

  // Anthropic Models
  CLAUDE_3_5_SONNET: "anthropic/claude-3.5-sonnet",
  CLAUDE_3_5_HAIKU: "anthropic/claude-3.5-haiku",
  CLAUDE_3_OPUS: "anthropic/claude-3-opus",
  CLAUDE_3_SONNET: "anthropic/claude-3-sonnet",
  CLAUDE_3_HAIKU: "anthropic/claude-3-haiku",

  // OpenAI Models
  GPT_5: "openai/gpt-5",
  GPT_5_MINI: "openai/gpt-5-mini",
  GPT_5_NANO: "openai/gpt-5-nano",
  GPT_5_2025_08_07: "openai/gpt-5-2025-08-07",
  GPT_5_MINI_2025_08_07: "openai/gpt-5-mini-2025-08-07",
  GPT_5_NANO_2025_08_07: "openai/gpt-5-nano-2025-08-07",
  GPT_5_CHAT_LATEST: "openai/gpt-5-chat-latest",

  GPT_4_1: "openai/gpt-4.1",
  GPT_4_1_MINI: "openai/gpt-4.1-mini",
  GPT_4_1_NANO: "openai/gpt-4.1-nano",
  GPT_4_1_2025_04_14: "openai/gpt-4.1-2025-04-14",
  GPT_4_1_MINI_2025_04_14: "openai/gpt-4.1-mini-2025-04-14",
  GPT_4_1_NANO_2025_04_14: "openai/gpt-4.1-nano-2025-04-14",

  O4_MINI: "openai/o4-mini",
  O4_MINI_2025_04_16: "openai/o4-mini-2025-04-16",

  O3: "openai/o3",
  O3_2025_04_16: "openai/o3-2025-04-16",
  O3_MINI: "openai/o3-mini",
  O3_MINI_2025_01_31: "openai/o3-mini-2025-01-31",

  O1: "openai/o1",
  O1_2024_12_17: "openai/o1-2024-12-17",
  O1_PREVIEW: "openai/o1-preview",
  O1_PREVIEW_2024_09_12: "openai/o1-preview-2024-09-12",
  O1_MINI: "openai/o1-mini",
  O1_MINI_2024_09_12: "openai/o1-mini-2024-09-12",

  GPT_4O: "openai/gpt-4o",
  GPT_4O_2024_11_20: "openai/gpt-4o-2024-11-20",
  GPT_4O_2024_08_06: "openai/gpt-4o-2024-08-06",
  GPT_4O_2024_05_13: "openai/gpt-4o-2024-05-13",
  GPT_4O_AUDIO_PREVIEW: "openai/gpt-4o-audio-preview",
  GPT_4O_AUDIO_PREVIEW_2024_10_01: "openai/gpt-4o-audio-preview-2024-10-01",
  GPT_4O_AUDIO_PREVIEW_2024_12_17: "openai/gpt-4o-audio-preview-2024-12-17",
  GPT_4O_AUDIO_PREVIEW_2025_06_03: "openai/gpt-4o-audio-preview-2025-06-03",
  GPT_4O_MINI_AUDIO_PREVIEW: "openai/gpt-4o-mini-audio-preview",
  GPT_4O_MINI_AUDIO_PREVIEW_2024_12_17: "openai/gpt-4o-mini-audio-preview-2024-12-17",
  GPT_4O_SEARCH_PREVIEW: "openai/gpt-4o-search-preview",
  GPT_4O_MINI_SEARCH_PREVIEW: "openai/gpt-4o-mini-search-preview",
  GPT_4O_SEARCH_PREVIEW_2025_03_11: "openai/gpt-4o-search-preview-2025-03-11",
  GPT_4O_MINI_SEARCH_PREVIEW_2025_03_11: "openai/gpt-4o-mini-search-preview-2025-03-11",
  CHATGPT_4O_LATEST: "openai/chatgpt-4o-latest",
  CODEX_MINI_LATEST: "openai/codex-mini-latest",
  GPT_4O_MINI: "openai/gpt-4o-mini",
  GPT_4O_MINI_2024_07_18: "openai/gpt-4o-mini-2024-07-18",

  // GPT-4 Turbo Models
  GPT_4_TURBO: "openai/gpt-4-turbo",
  GPT_4_TURBO_2024_04_09: "openai/gpt-4-turbo-2024-04-09",
  GPT_4_0125_PREVIEW: "openai/gpt-4-0125-preview",
  GPT_4_TURBO_PREVIEW: "openai/gpt-4-turbo-preview",
  GPT_4_1106_PREVIEW: "openai/gpt-4-1106-preview",
  GPT_4_VISION_PREVIEW: "openai/gpt-4-vision-preview",

  // GPT-4 Models
  GPT_4: "openai/gpt-4",
  GPT_4_0314: "openai/gpt-4-0314",
  GPT_4_0613: "openai/gpt-4-0613",
  GPT_4_32K: "openai/gpt-4-32k",
  GPT_4_32K_0314: "openai/gpt-4-32k-0314",
  GPT_4_32K_0613: "openai/gpt-4-32k-0613",

  // GPT-3.5 Models
  GPT_3_5_TURBO: "openai/gpt-3.5-turbo",
  GPT_3_5_TURBO_16K: "openai/gpt-3.5-turbo-16k",
  GPT_3_5_TURBO_0301: "openai/gpt-3.5-turbo-0301",
  GPT_3_5_TURBO_0613: "openai/gpt-3.5-turbo-0613",
  GPT_3_5_TURBO_1106: "openai/gpt-3.5-turbo-1106",
  GPT_3_5_TURBO_0125: "openai/gpt-3.5-turbo-0125",
  GPT_3_5_TURBO_16K_0613: "openai/gpt-3.5-turbo-16k-0613",

  // Meta Models
  LLAMA_3_1_405B: "meta-llama/llama-3.1-405b-instruct",
  LLAMA_3_1_70B: "meta-llama/llama-3.1-70b-instruct",
  LLAMA_3_1_8B: "meta-llama/llama-3.1-8b-instruct",

  // Mistral Models
  MISTRAL_LARGE: "mistralai/mistral-large",
  MISTRAL_7B: "mistralai/mistral-7b-instruct",

  // Cohere Models
  COMMAND_R_PLUS: "cohere/command-r-plus",
  COMMAND_R: "cohere/command-r",

  // Free models
  DEEPSEEK_CHAT_V3_1: "deepseek/deepseek-chat-v3.1:free",
  DEEPSEEK_CHAT_R1: "deepseek/deepseek-r1:free",

  DEFAULT: "google/gemini-2.5-flash",
} as const;

export type OpenRouterChatModel = typeof OPENROUTER_CHAT_MODEL_TYPES[keyof typeof OPENROUTER_CHAT_MODEL_TYPES];


