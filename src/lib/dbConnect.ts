import mongoose from "mongoose";
const connectionURL = process.env.MONGODB_URL || "";
type connectionObj = {
  isConnected?: number;
};

const connection: connectionObj = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected");
    return;
  }

  try {
    const db = await mongoose.connect(connectionURL, {
      connectTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected");
  } catch (error) {
    console.log("database connection failed", error);
    // process.exit(1);
  }
}

export default dbConnect;
