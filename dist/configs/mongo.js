import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/perplexity";
export async function connectMongo() {
    try {
        await mongoose.connect(MONGO_URI);
        const connection = mongoose.connection;
        connection.on("error", (err) => console.error("❌ MongoDB error:", err));
        connection.once("open", () => console.log(`✅ MongoDB connected (Worker ${process.pid})`));
        return connection;
    }
    catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        throw error;
    }
}
//# sourceMappingURL=mongo.js.map