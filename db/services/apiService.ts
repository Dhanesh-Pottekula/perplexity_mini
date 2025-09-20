// Types for embeddings service
export interface EmbeddingRequest {
  texts: string[];
}

export interface EmbeddingResponse {
  embeddings: number[][];
}

import { envDefaults } from "../../envDefaults";
import { apiService } from "../../helpers/fetchHelpers";


  // Specific function for embeddings service
export async function getEmbeddings(texts: string[]): Promise<EmbeddingResponse> {
    const embeddingServiceUrl = envDefaults.EMBEDDING_SERVICE_URL;
    const requestData: EmbeddingRequest = { texts };
    
    return apiService.post<EmbeddingResponse>(
      `${embeddingServiceUrl}/embed`,
      requestData
    );
}

