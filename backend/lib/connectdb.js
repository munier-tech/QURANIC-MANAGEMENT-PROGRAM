import mongoose from "mongoose";
import {
  getMongoCandidates,
  getMongoConnectionLabel,
  getMongoHelpMessage,
  isPlaceholderMongoUri,
} from "./mongoConfig.js";

let listenersAttached = false;

function attachMongoListeners() {
  if (listenersAttached) {
    return;
  }

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  listenersAttached = true;
}

export const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB already connected");
    return mongoose.connection;
  }

  const mongoCandidates = getMongoCandidates();

  if (mongoCandidates.length === 0) {
    throw new Error("Please define MONGO_URI or MONGO_URI_DIRECT in your environment variables");
  }

  let lastError;

  for (const uri of mongoCandidates) {
    if (isPlaceholderMongoUri(uri)) {
      lastError = new Error(
        "MONGO_URI contains placeholder credentials. Replace them with your real MongoDB Atlas username and password.",
      );
      console.error("MongoDB connection skipped:", lastError.message);
      continue;
    }

    try {
      console.log(`Attempting MongoDB connection using ${getMongoConnectionLabel(uri)}...`);

      const conn = await mongoose.connect(uri, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });

      attachMongoListeners();
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn.connection;
    } catch (error) {
      lastError = error;
      console.error(`MongoDB connection failed: ${error.message}`);
      console.error(`Help: ${getMongoHelpMessage(error, uri)}`);
    }
  }

  throw lastError;
};
