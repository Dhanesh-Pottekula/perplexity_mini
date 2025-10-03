export interface TopicExtractionItem {
  topic_name: string;
  tags: string[];
}

export interface TopicExtractionList {
  topics: TopicExtractionItem[];
}

export const TopicExtractionListSchema = {
  name: "TopicExtractionList",
  schema: {
    type: "object",
    properties: {
      topics: {
        type: "array",
        items: {
          type: "object",
          properties: {
            topic_name: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
          },
          required: ["topic_name", "tags"],
        },
      },
    },
    required: ["topics"],
    additionalProperties: false,
  },
} as const;


