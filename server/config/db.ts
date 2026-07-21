import mongoose from "mongoose";
import { env } from "./env";

async function connectDB() {
mongoose.connect(env.MONGODB_URL)
    .then(() => {
        console.log("✅ Connected to MongoDB");
    })
    .catch((error) => {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1);
    });
}

export default connectDB;