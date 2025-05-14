import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers/_app';
import { createContext } from './context';
import dotenv from 'dotenv';
import path from 'path';

import cjsDbConnect from './connect.cjs';

const { connectToServer, getDb } = cjsDbConnect;

dotenv.config({ path: path.resolve(__dirname, './config.env') });

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:8080' }));
app.use(express.json());

app.use(
    '/trpc',
    createExpressMiddleware({
        router: appRouter,
        createContext: (opts) => createContext(opts, getDb),
    })
);

async function startServer() {
    try {
        console.log('Starting server...');
        await (connectToServer as () => Promise<void>)();

        app.listen(port, () => {
            console.log(`Server listening at http://localhost:${port}`);
            console.log(`tRPC API available at http://localhost:${port}/trpc`);
        });
    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1);
    }
}

startServer();