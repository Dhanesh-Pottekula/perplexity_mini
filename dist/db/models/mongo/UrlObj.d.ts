import mongoose, { Document } from "mongoose";
interface IUrl extends Document {
    url: string;
    parentUrl?: string;
    status: "pending" | "visiting" | "visited" | "failed";
    depth: number;
    discoveredAt: Date;
    content?: string;
    title?: string;
    meta?: any;
}
declare const Url: mongoose.Model<IUrl, {}, {}, {}, mongoose.Document<unknown, {}, IUrl, {}, {}> & IUrl & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Url;
//# sourceMappingURL=UrlObj.d.ts.map