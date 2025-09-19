import { Request, Response } from "express";
interface AddDocRequest {
    url?: string;
    topic?: string;
    content?: string;
    embedding: number[];
}
interface SearchRequest {
    queryVector: number[];
    limit?: number;
}
export declare function addDoc(req: Request<{}, {}, AddDocRequest>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function search(req: Request<{}, {}, SearchRequest>, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=docController.d.ts.map