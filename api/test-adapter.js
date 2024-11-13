import { Server } from "socket.io";
import { createAdapter } from "@socket.io/mongo-adapter";
import { MongoClient } from "mongodb";

// MongoDB configuration
const DB = "mydb";
const COLLECTION = "socket.io-adapter-events";

// Create a Socket.IO server instance
const io = new Server();

// MongoDB client connection
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017,127.0.0.1:27017,127.0.0.1:27017/?replicaSet=myReplicaSet");

try {
  // Connect to MongoDB
  await mongoClient.connect();
  console.log("Connected to MongoDB");

  // Create collection if it doesn't exist
  await mongoClient.db(DB).createCollection(COLLECTION, {
    capped: true,
    size: 1e6
  });
} catch (e) {
  // Handle if collection already exists
  console.log("Collection may already exist or MongoDB error: ", e);
}

// Get the collection from MongoDB
const mongoCollection = mongoClient.db(DB).collection(COLLECTION);

// Set the adapter for Socket.IO to use MongoDB
io.adapter(createAdapter(mongoCollection));

// Start the server on port 3001
io.listen(3001, () => {
  console.log("Socket.IO server running on http://localhost:3001");
});
