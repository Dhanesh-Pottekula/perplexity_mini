import { getEmbeddings } from "../db/services/apiService";
import { qdrantService } from "../db/services/qdrantService";
import { generateStreamChatPrompt } from "../helpers/promptsHelpers";
import { COLLECTION_NAMES } from "../interfaces/constants";
import { OllamaService } from "../services/ollamaService";

export class RetrivalAgent {
  private readonly llm: OllamaService;
  constructor() {
    this.llm = new OllamaService();
  }

  async retrieve_relevant_content(query: string) {

    const embeddings = await getEmbeddings({ query });
    const [embedding] = embeddings.embeddings;

    if (!embedding) {
      throw new Error("No embeddings returned for query");
    }

    const topics = await qdrantService.searchPoints(
      COLLECTION_NAMES.TOPICS,
      embedding,
      100,
      0.5
    );

    const urlIds = topics.flatMap((topic) => {
      const ids = topic.payload?.url_ids;
      return Array.isArray(ids) ? ids : [];
    });

    const urlSet = new Set(urlIds);

    const urlFilter = urlSet.size
      ? {
          must: [
            {
              key: "url_id",
              match: {
                any: Array.from(urlSet)
              }
            }
          ]
        }
      : undefined;

    const contentArray = await qdrantService.searchPoints(
      COLLECTION_NAMES.URLS,
      embedding,
      100,
      0.1,
      urlFilter
    );
    const content = contentArray.map((item) => item.payload?.text).join("\n");
    const response = await this.generateResponse(query, content);
    return response;

  }

  async generateResponse(query: string, content: string) {
    const {prompt,systemInstruction} = await generateStreamChatPrompt(query, content);
    const response = await this.llm.generateTextAsStream(prompt, systemInstruction);
    return response;
  }
}   

