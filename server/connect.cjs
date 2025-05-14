const { MongoClient } = require('mongodb');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });

const uri = process.env.ATLAS_URI;

if (!uri) {
    console.error('ATLAS_URI is not defined. Please ensure it is set in your config.env file and the path in connect.cjs is correct.');
    process.exit(1);
}

let clientInstance; 
let dbInstance;     

async function connectToServer() {
    if (dbInstance) {
        console.log('MongoDB connection already established (from CJS).');
        return;
    }
    try {
        console.log('Attempting to connect to MongoDB (from CJS)...');
        clientInstance = new MongoClient(uri);
        await clientInstance.connect();
        const databaseName = process.env.DB_NAME || 'ÖnLab';
        dbInstance = clientInstance.db(databaseName);
        console.log(`Successfully connected to MongoDB database: ${dbInstance.databaseName} (from CJS)`);
    } catch (e) {
        console.error('Failed to connect to MongoDB (from CJS):', e);
        throw e;
    }
}

function getDb() {
    if (!dbInstance) {
        throw new Error('Database not initialized. Call connectToServer first (from CJS).');
    }
    return dbInstance;
}

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
    closeConnection,
};