import { QdrantClient } from "@qdrant/js-client-rest";
import { getQdrantClient } from "../../configs/qdrant";
import { 
  VectorPoint, 
  SearchResult, 

} from "../models/qdrant/CollectionTypes";

export class QdrantService {
  private client: QdrantClient;

  constructor() {
    this.client = getQdrantClient();
  }



  // Vector Operations
  async upsertPoints(collectionName: string, points: VectorPoint[]): Promise<boolean> {
    try {
      await this.client.upsert(collectionName, {
        points: points.map(point => ({
          id: point.id,
          vector: point.vector,
          payload: point.payload || {}
        }))
      });
      return true;
    } catch (error) {
      console.error(`❌ Failed to upsert points to '${collectionName}':`, error);
      return false;
    }
  }

  async searchPoints(
    collectionName: string, 
    vector: number[], 
    limit: number = 10, 
    filter?: Record<string, any>
  ): Promise<SearchResult[]> {
    try {
      const searchParams: any = {
        vector,
        limit,
        with_payload: true
      };

      if (filter) {
        searchParams.filter = filter;
      }

      const results = await this.client.search(collectionName, searchParams);
      
      return results.map(result => ({
        id: result.id,
        score: result.score,
        payload: result.payload || {}
      }));
    } catch (error) {
      console.error(`❌ Failed to search points in '${collectionName}':`, error);
      return [];
    }
  }

  async deletePoints(collectionName: string, ids: (string | number)[]): Promise<boolean> {
    try {
      await this.client.delete(collectionName, {
        points: ids
      });
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete points from '${collectionName}':`, error);
      return false;
    }
  }



}

// Export service instance
export const qdrantService = new QdrantService();
