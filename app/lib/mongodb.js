import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "uddog_events";

let client;
let clientPromise;

if (!uri) {
  console.warn("Warning: MONGODB_URI environment variable is not set.");
} else if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDatabase() {
  if (!clientPromise) {
    throw new Error("MongoDB connection URI is not configured.");
  }
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export async function getCollections() {
  const db = await getDatabase();
  return {
    db,
    usersCollection: db.collection("users"),
    eventsCollection: db.collection("events"),
    joinedEventsCollection: db.collection("joined_events"),
  };
}

export default clientPromise;
