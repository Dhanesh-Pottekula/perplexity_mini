import mongoose, { Document, Schema } from "mongoose";

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

const UrlSchema = new Schema<IUrl>({
  url: { type: String, unique: true },
  parentUrl: String,
  status: { type: String, enum: ["pending", "visiting", "visited", "failed"], default: "pending" },
  depth: { type: Number, default: 0 },
  discoveredAt: { type: Date, default: Date.now },
  content: String, // full HTML/text
  title: String,
  meta: mongoose.Schema.Types.Mixed // any other metadata
});

const Url = mongoose.model<IUrl>("Url", UrlSchema);
export default Url;
