import { getEmbeddings } from "../db/services/apiService";
import { qdrantService } from "../db/services/qdrantService";
import { COLLECTION_NAMES } from "../interfaces/constants";
import { OllamaService } from "../services/ollamaService";

export class RetrivalAgent {
  private readonly llm: OllamaService;
  constructor() {
    this.llm = new OllamaService();
  }

  async retrieve_relevant_content(query: string) {

    const embeddings = await getEmbeddings({text: query});
    // get the hot topics from the query
    // const topics = qdrantService.searchPoints(COLLECTION_NAMES.TOPICS, embeddings.embeddings, 10);
    // const response = await this.llm.generateTextAsStream(query, "You are a helpful assistant that can answer questions and help with tasks.");
    // return response;
  }
}   