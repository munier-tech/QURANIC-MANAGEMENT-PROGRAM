export const mongoConnectionOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

export function getMongoCandidates() {
  return [process.env.MONGO_URI_DIRECT, process.env.MONGO_URI].filter(Boolean);
}

export function isPlaceholderMongoUri(uri = "") {
  return uri.includes("DBUSER") || uri.includes("dbuserpassword123");
}

export function getMongoConnectionLabel(uri = "") {
  return uri.startsWith("mongodb://") ? "direct MongoDB URI" : "Atlas SRV URI";
}

export function getMongoHelpMessage(error, uri = "") {
  const errorMessage = error?.message || "";

  if (isPlaceholderMongoUri(uri)) {
    return "MONGO_URI still contains placeholder credentials. Replace DBUSER and dbuserpassword123 with your real MongoDB Atlas database username and password.";
  }

  if (error?.code === "ECONNREFUSED" && error?.syscall === "querySrv") {
    return "SRV DNS lookup failed for your MongoDB Atlas cluster. Fix local DNS/network access or add MONGO_URI_DIRECT in backend/.env with a non-SRV mongodb:// connection string.";
  }

  if (error?.code === "ENOTFOUND") {
    return "MongoDB hostname could not be resolved. Check the cluster hostname, local DNS, and Atlas network access settings.";
  }

  if (error?.name === "MongooseServerSelectionError") {
    if (
      errorMessage.includes("IP that isn't whitelisted") ||
      errorMessage.includes("IP whitelist") ||
      errorMessage.includes("IP address is on your Atlas cluster's IP whitelist")
    ) {
      return "MongoDB Atlas rejected this connection because your current IP is not allowed. Add your current public IP in Atlas Network Access, or temporarily allow 0.0.0.0/0 for testing.";
    }

    return "MongoDB server selection failed. Check Atlas cluster status, IP access list, connection string, and whether your network can reach the cluster.";
  }

  if (
    errorMessage.includes("IP that isn't whitelisted") ||
    errorMessage.includes("IP whitelist") ||
    errorMessage.includes("IP address is on your Atlas cluster's IP whitelist")
  ) {
    return "MongoDB Atlas rejected this connection because your current IP is not allowed. Add your current public IP in Atlas Network Access, or temporarily allow 0.0.0.0/0 for testing.";
  }

  return "Check your MongoDB connection string, Atlas network access, and local DNS/network settings.";
}
