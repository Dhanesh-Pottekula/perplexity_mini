import mongoose, { Document, Schema } from "mongoose";

export interface IDoc extends Document {
  url?: string;
  topic?: string;
  content?: string;
  createdAt: Date;
}

const DocSchema = new Schema<IDoc>({
  url: String,
  topic: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDoc>("Doc", DocSchema);


