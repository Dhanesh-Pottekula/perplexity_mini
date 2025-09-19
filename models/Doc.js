import mongoose from "mongoose";

const DocSchema = new mongoose.Schema({
  url: String,
  topic: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Doc", DocSchema);


