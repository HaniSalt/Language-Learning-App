// server/db/connect.cjs
const { MongoClient } = require('mongodb');
const path = require('path'); // Import path module

// Load environment variables from config.env.
// This assumes config.env is in the 'server' directory, and connect.cjs is in 'server/db/'.
// __dirname in CommonJS is the directory of the current file.
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });

const uri = process.env.ATLAS_URI;

if (!uri) {
    console.error('ATLAS_URI is not defined. Please ensure it is set in your config.env file and the path in connect.cjs is correct.');
    process.exit(1); // Exit if URI is not found, as it's critical
}

let clientInstance; // Stores the MongoClient instance
let dbInstance;     // Stores the Db instance

async function connectToServer() {
    if (dbInstance) {
        console.log('MongoDB connection already established (from CJS).');
        return;
    }
    try {
        console.log('Attempting to connect to MongoDB (from CJS)...');
        clientInstance = new MongoClient(uri);
        await clientInstance.connect();
        const databaseName = process.env.DB_NAME || 'ÖnLab'; // Use DB_NAME from .env or default
        dbInstance = clientInstance.db(databaseName);
        console.log(`Successfully connected to MongoDB database: ${dbInstance.databaseName} (from CJS)`);
    } catch (e) {
        console.error('Failed to connect to MongoDB (from CJS):', e);
        throw e; // Re-throw the error to be handled by the caller (e.g., in server/index.ts)
    }
}

function getDb() {
    if (!dbInstance) {
        throw new Error('Database not initialized. Call connectToServer first (from CJS).');
    }
    return dbInstance;
}

// Optional: if you need a way to close the connection explicitly during shutdown
async function closeConnection() {
    if (clientInstance) {
        await clientInstance.close();
        console.log('MongoDB connection closed (from CJS).');
        clientInstance = null;
        dbInstance = null;
    }
}

module.exports = {
    connectToServer,
    getDb,
    closeConnection, // Export if needed elsewhere
};