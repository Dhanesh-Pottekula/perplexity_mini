import { QdrantClient } from "@qdrant/js-client-rest";
import { getQdrantClient } from "../../configs/qdrant";
import { 
  VectorPoint, 
  SearchResult, 
  FilterResult,

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
    limit?: number, 
    score_threshold?: number,
    filter?: Record<string, any>,
  ): Promise<SearchResult[]> {
    try {
      const searchParams: any = {
        limit,
        with_payload: true,
      };
      if (score_threshold) {
        searchParams.score_threshold = score_threshold;
      }
      if (vector) {
        searchParams.vector = vector;
      }

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

  async filterPoints(
    collectionName: string,
    filter: Record<string, any>,
    limit?: number,
    offset?: string | number,
  ): Promise<FilterResult[]> {
    try {
      const scrollParams: any = {
        with_payload: true,
        with_vectors: false,
      };

      if (filter) {
        scrollParams.filter = filter;
      }

      if (limit !== undefined) {
        scrollParams.limit = limit;
      }

      if (offset !== undefined) {
        scrollParams.offset = offset;
      }

      const { points } = await this.client.scroll(collectionName, scrollParams);

      return (points || []).map(point => ({
        id: point.id,
        payload: point.payload || {}
      }));
    } catch (error) {
      console.error(`❌ Failed to filter points in '${collectionName}':`, error);
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
