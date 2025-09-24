import { envDefaults } from "../../envDefaults";
import { apiService } from "../../helpers/fetchHelpers";
import { API_ENDPOINTS, PAYLOAD_KEYS } from "../../interfaces/constants";

// Types for embeddings service
export interface EmbeddingRequest {
  [PAYLOAD_KEYS.URL_ID]: string;
  texts: string[];
}

export interface EmbeddingResponse {
  embeddings: number[][];
}

// stores the text in qdrant, generates the topics with tags and stores them in qdrant
export async function getEmbeddings(data: {url_id: string, chunkContent: string[]}): Promise<EmbeddingResponse> {
    const embeddingServiceUrl = envDefaults.EMBEDDING_SERVICE_URL;
    const requestData: EmbeddingRequest = { 
      [PAYLOAD_KEYS.URL_ID]: data.url_id, 
      texts: data.chunkContent 
    };
    
    return apiService.post<EmbeddingResponse>(
      `${embeddingServiceUrl}${API_ENDPOINTS.EMBED}`,
      requestData
    );
}

