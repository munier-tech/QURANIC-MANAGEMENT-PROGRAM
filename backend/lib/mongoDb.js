import mongoose from "mongoose";
import {
  getMongoCandidates,
  getMongoHelpMessage,
  isPlaceholderMongoUri,
} from "./mongoConfig.js";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoCandidates = getMongoCandidates();

    if (mongoCandidates.length === 0) {
      throw new Error("Please define MONGO_URI or MONGO_URI_DIRECT in your environment variables");
    }

    const opts = {
      bufferCommands: false,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,
      connectTimeoutMS: 15000,
      retryWrites: true,
      w: "majority",
    };

    cached.promise = (async () => {
      let lastError;

      for (const uri of mongoCandidates) {
        if (isPlaceholderMongoUri(uri)) {
          lastError = new Error(
            "MONGO_URI contains placeholder credentials. Replace them with your real MongoDB Atlas username and password.",
          );
          continue;
        }

        try {
          return await mongoose.connect(uri, opts);
        } catch (error) {
          lastError = error;
          console.error("MongoDB connection error:", error.message);
          console.error(`Help: ${getMongoHelpMessage(error, uri)}`);
        }
      }

      throw lastError;
    })().catch((error) => {
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
