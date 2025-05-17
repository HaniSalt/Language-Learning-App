const { MongoClient } = require('mongodb');
require('dotenv').config({ path: "./config.env" });

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri);

let dbConnection;

async function connectToServer(callback) {
  try {
    await client.connect();
    dbConnection = client.db("ÖnLab");
    console.log("Successfully connected to MongoDB.");
    return callback();
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
    return callback(e);
  }
}

function getDb() {
  if (!dbConnection) {
    throw new Error("Call connectToServer first!");
  }
  return dbConnection;
}

async function saveUserId(userId) {
  if (!dbConnection) {
    throw new Error("Database not initialized. Call connectToServer first.");
  }
  try {
    const usersCollection = dbConnection.collection("users");
    const result = await usersCollection.updateOne(
      { firebaseUid: userId },
      { $set: { firebaseUid: userId, lastLogin: new Date() } },
      { upsert: true }
    );
    console.log(`User ID ${userId} saved/updated. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, UpsertedId: ${result.upsertedId}`);
    return result;
  } catch (error) {
    console.error("Error saving user ID to MongoDB:", error);
    throw error; 
  }
}
async function main() {
  try {
    await client.connect();
    const collections = await client.db("ÖnLab").collections();
    // @ts-ignore
    collections.forEach((collection) => console.log(collection.s.namespace.collection));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

module.exports = { connectToServer, getDb, saveUserId };