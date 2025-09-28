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
    const DEFAULT_SCROLL_LIMIT = 100;

    try {
      const results: FilterResult[] = [];
      let remaining = typeof limit === "number" ? limit : undefined;
      let nextOffset: string | number | undefined = offset;

      while (true) {
        if (remaining !== undefined && remaining <= 0) {
          break;
        }

        const pageLimit = remaining !== undefined
          ? Math.min(remaining, DEFAULT_SCROLL_LIMIT)
          : DEFAULT_SCROLL_LIMIT;

        const scrollParams: any = {
          with_payload: true,
          with_vectors: false,
          limit: pageLimit,
        };

        if (filter) {
          scrollParams.filter = filter;
        }

        if (nextOffset !== undefined) {
          scrollParams.offset = nextOffset;
        }

        const { points, next_page_offset } = await this.client.scroll(collectionName, scrollParams);

        if (!points || points.length === 0) {
          break;
        }

        for (const point of points) {
          results.push({
            id: point.id,
            payload: point.payload || {},
          });
        }

        if (remaining !== undefined) {
          remaining -= points.length;
        }

        if (!next_page_offset) {
          break;
        }

        nextOffset = next_page_offset as string | number;
      }

      return results;
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

  async deletePointsByFilter(
    collectionName: string,
    filter: Record<string, any>
  ): Promise<boolean> {
    try {
      await this.client.delete(collectionName, {
        filter,
      });
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete points by filter from '${collectionName}':`, error);
      return false;
    }
  }

  async updatePayload(
    collectionName: string,
    payload: Record<string, any>,
    filter?: Record<string, any>,
    points?: (string | number)[]
  ): Promise<boolean> {
    try {
      if (!filter && (!points || points.length === 0)) {
        throw new Error("Either filter or points must be provided to update payload");
      }

      const payloadOptions: Parameters<QdrantClient["setPayload"]>[1] = {
        payload,
      };

      if (filter) {
        payloadOptions.filter = filter;
      }

      if (points && points.length > 0) {
        payloadOptions.points = points;
      }

      await this.client.setPayload(collectionName, payloadOptions);
      return true;
    } catch (error) {
      console.error(`❌ Failed to update payload for '${collectionName}':`, error);
      return false;
    }
  }

  async batchUpdatePayloads(
    collectionName: string,
    updates: { pointId: string | number; payload: Record<string, any> }[]
  ): Promise<boolean> {
    if (updates.length === 0) {
      return true;
    }

    try {
      const operations = updates.map((update) => ({
        set_payload: {
          payload: update.payload,
          points: [update.pointId],
        },
      }));

      await this.client.batchUpdate(collectionName, {
        operations,
        wait: true,
      });

      return true;
    } catch (error) {
      console.error(`❌ Failed to batch update payloads for '${collectionName}':`, error);
      return false;
    }
  }



}

// Export service instance
export const qdrantService = new QdrantService();
