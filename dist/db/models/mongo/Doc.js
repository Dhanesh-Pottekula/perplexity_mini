import mongoose, { Schema } from "mongoose";
const DocSchema = new Schema({
    url: String,
    topic: String,
    content: String,
    createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("Doc", DocSchema);
//# sourceMappingURL=Doc.js.map