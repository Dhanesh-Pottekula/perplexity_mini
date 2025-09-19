import mongoose, { Document } from "mongoose";
export interface IDoc extends Document {
    url?: string;
    topic?: string;
    content?: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IDoc, {}, {}, {}, mongoose.Document<unknown, {}, IDoc, {}, {}> & IDoc & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Doc.d.ts.map