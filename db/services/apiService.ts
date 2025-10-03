import { envDefaults } from "../../envDefaults";
import { apiService } from "../../helpers/fetchHelpers";
import { API_ENDPOINTS } from "../../interfaces/constants";

// Types for embeddings service
export interface EmbeddingResponse {
  embeddings: number[][];
}

export async function getEmbeddings(data: {query: string}): Promise<EmbeddingResponse> {
  const embeddingServiceUrl = envDefaults.EMBEDDING_SERVICE_URL;
  
  return apiService.post<EmbeddingResponse>(
    `${embeddingServiceUrl}${API_ENDPOINTS.EMBED}`,
    data
  );
}

export async function getEmbeddingsBatch(texts: string[]): Promise<EmbeddingResponse> {
  const embeddingServiceUrl = envDefaults.EMBEDDING_SERVICE_URL;
  return apiService.post<EmbeddingResponse>(
    `${embeddingServiceUrl}${API_ENDPOINTS.EMBED_BATCH}`,
    { texts }
  );
}