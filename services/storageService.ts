import { qdrantService } from "../db/services/qdrantService";
import { COLLECTION_NAMES, PAYLOAD_KEYS } from "../interfaces/constants";
import { openRouterService } from "./openRouterService";
import { storagePrompts } from "../helpers/storagePrompts";
import { TopicExtractionItem, TopicExtractionList, TopicExtractionListSchema } from "../interfaces/topics";
import { getEmbeddingsBatch } from "../db/services/apiService";

function uniqueArray<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export class StorageService {
  async extractTopicsFromContentWithTags(content: string[]): Promise<TopicExtractionItem[]> {
    const { system_instruction, user_prompt } = storagePrompts.extractTopicsFromContentWithTagsPrompt(content.slice(0, 10));

    const schema = TopicExtractionListSchema;

    const result = await openRouterService.generateStructuredJSON<TopicExtractionList>(
      [
        { role: "system", content: system_instruction },
        { role: "user", content: user_prompt },
      ],
      schema
    );

    return result.topics || [];
  }

  async upsertTopicsAndReturnIds(topics: TopicExtractionItem[]): Promise<string[]> {
    if (!topics || topics.length === 0) return [];
    const topicNames = uniqueArray(topics.map(t => t.topic_name));

    // Fetch existing topics by names
    const filter = {
      must: [
        {
          key: PAYLOAD_KEYS.TOPIC_NAME,
          match: { any: topicNames },
        },
      ],
    };
    const existing = await qdrantService.filterPoints(COLLECTION_NAMES.TOPICS, filter, topicNames.length);
    const nameToPayload = new Map<string, any>();
    for (const item of existing) {
      const payload = item.payload || {};
      const name = payload[PAYLOAD_KEYS.TOPIC_NAME];
      if (name) nameToPayload.set(name, payload);
    }

    // Prepare merged topics and tags_texts for embeddings
    const merged: { topic_id: string; topic_name: string; tags: string[]; created_at: any }[] = [];
    const tagsTexts: string[] = [];

    const now = new Date().toISOString();
    for (const t of topics) {
      const existingPayload = nameToPayload.get(t.topic_name);
      const topic_id = existingPayload?.[PAYLOAD_KEYS.TOPIC_ID] || (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`);
      const created_at = existingPayload?.[PAYLOAD_KEYS.CREATED_AT] || now;
      const existingTags: string[] = Array.isArray(existingPayload?.[PAYLOAD_KEYS.TAGS]) ? existingPayload[PAYLOAD_KEYS.TAGS] : [];
      const tags = uniqueArray([...(t.tags || []), ...existingTags]);
      merged.push({ topic_id, topic_name: t.topic_name, tags, created_at });
      const text = tags.join(" ") || "general";
      tagsTexts.push(text);
    }

    // Get embeddings for topics' tags
    const topicEmbeddings = (await getEmbeddingsBatch(tagsTexts)).embeddings;

    // Build Qdrant points
    const points = merged.map((m, idx) => ({
      id: m.topic_id,
      vector: topicEmbeddings[idx],
      payload: {
        [PAYLOAD_KEYS.TOPIC_ID]: m.topic_id,
        [PAYLOAD_KEYS.TOPIC_NAME]: m.topic_name,
        [PAYLOAD_KEYS.TAGS]: m.tags,
        [PAYLOAD_KEYS.CREATED_AT]: m.created_at,
        [PAYLOAD_KEYS.UPDATED_AT]: new Date().toISOString(),
      },
    }));

    await qdrantService.upsertPoints(COLLECTION_NAMES.TOPICS, points as any);
    return merged.map(m => m.topic_id);
  }

  async process(data: { url_id: string; content: string[] }): Promise<string[]> {
    const topics = await this.extractTopicsFromContentWithTags(data.content);
    console.log(topics)
    const topic_ids = await this.upsertTopicsAndReturnIds(topics);
    console.log(topic_ids)

    // Get embeddings for URL chunks (raw text, no enrichment)
    const texts = data.content;
    const { embeddings } = await getEmbeddingsBatch(texts);

    // Upsert to URLs collection
    const urlPoints = texts.map((text, idx) => ({
      id: (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${idx}-${Math.random()}`),
      vector: embeddings[idx],
      payload: {
        [PAYLOAD_KEYS.URL_ID]: data.url_id,
        [PAYLOAD_KEYS.TEXT]: text,
        [PAYLOAD_KEYS.INDEX]: idx,
        [PAYLOAD_KEYS.TOPIC_IDS]: topic_ids,
        [PAYLOAD_KEYS.UPDATED_AT]: new Date().toISOString(),
      },
    }));

    await qdrantService.upsertPoints(COLLECTION_NAMES.URLS, urlPoints as any);
    return topic_ids;
  }
}

export const storageService = new StorageService();


