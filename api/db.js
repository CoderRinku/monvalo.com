const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "monvalo";

let cachedClient = null;
let cachedDb = null;

// Fallback in-memory database simulation for local testing
const mockDb = {
  collection: (name) => {
    if (!global.mockCollections) global.mockCollections = {};
    if (!global.mockCollections[name]) global.mockCollections[name] = [];
    const list = global.mockCollections[name];

    return {
      insertOne: async (doc) => {
        list.push(doc);
        return { insertedId: list.length };
      },
      findOne: async (query) => {
        return list.find(item => {
          return Object.keys(query).every(key => item[key] === query[key]);
        });
      },
      updateOne: async (query, update) => {
        const item = list.find(item => {
          return Object.keys(query).every(key => item[key] === query[key]);
        });
        if (item && update.$set) {
          Object.assign(item, update.$set);
        }
        return { modifiedCount: item ? 1 : 0 };
      }
    };
  }
};

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGODB_URI) {
    console.warn("MONGODB_URI environment variable not defined. Using local in-memory fallback database.");
    return { client: null, db: mockDb };
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI, { connectTimeoutMS: 2000, serverSelectionTimeoutMS: 2000 });
    const db = client.db(MONGODB_DB);

    cachedClient = client;
    cachedDb = db;

    console.log("Successfully connected to MongoDB server.");
    return { client, db };
  } catch (error) {
    console.warn("Failed to connect to MongoDB server. Falling back to local in-memory database. Error:", error.message);
    return { client: null, db: mockDb };
  }
}

module.exports = { connectToDatabase };
