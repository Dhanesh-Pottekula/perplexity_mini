import mongoose from "mongoose";
import { envDefaults } from "../envDefaults";

const MONGO_URI = envDefaults.MONGO_URI;

export async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI);
    const connection = mongoose.connection;
    connection.on("error", (err) => console.error("❌ MongoDB error:", err));
    return connection;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  }
}


