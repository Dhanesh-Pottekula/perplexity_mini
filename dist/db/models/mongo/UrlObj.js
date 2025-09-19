import mongoose, { Schema } from "mongoose";
const UrlSchema = new Schema({
    url: { type: String, unique: true },
    parentUrl: String,
    status: { type: String, enum: ["pending", "visiting", "visited", "failed"], default: "pending" },
    depth: { type: Number, default: 0 },
    discoveredAt: { type: Date, default: Date.now },
    content: String, // full HTML/text
    title: String,
    meta: mongoose.Schema.Types.Mixed // any other metadata
});
const Url = mongoose.model("Url", UrlSchema);
export default Url;
//# sourceMappingURL=UrlObj.js.map