import mongoose, { Document, Schema } from "mongoose";
import { MongoService } from "../../services/mongoService";
import { URL_STATUS, UrlStatus } from "../../../interfaces/constants";

interface IUrl extends Document {
  url: string;
  parentUrl?: string|null;
  status: UrlStatus;
  depth: number;
  discoveredAt: Date;
  content?: string;
  title?: string;
  links?: string[];
  meta?: any;
}

const UrlSchema = new Schema<IUrl>({
  url: { type: String, unique: true },
  status: { 
    type: String, 
    enum: Object.values(URL_STATUS), 
    default: URL_STATUS.PENDING 
  },
  depth: { type: Number, default: 0 },
  discoveredAt: { type: Date, default: Date.now },
  title: String,
  links: [String],
  meta: mongoose.Schema.Types.Mixed // any other metadata
});

const Url = mongoose.model<IUrl>("Url", UrlSchema);
export default Url;

export const urlMongoService = new MongoService(Url);