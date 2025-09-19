import { IDoc } from "../db/models/mongo/Doc.js";
interface CreateDocumentParams {
    url?: string | undefined;
    topic?: string | undefined;
    content?: string | undefined;
    embedding: number[];
}
interface SearchDocumentsParams {
    queryVector: number[];
    limit?: number | undefined;
}
export declare function createDocument({ url, topic, content, embedding }: CreateDocumentParams): Promise<IDoc>;
export declare function searchDocuments({ queryVector, limit }: SearchDocumentsParams): Promise<any>;
export {};
//# sourceMappingURL=docService.d.ts.map