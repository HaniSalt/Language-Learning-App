import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './router';
import { createContext } from './trpc';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../config.env') }); 

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] })); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  '/trpc', //tRPC endpoint
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'));
  });
}

const startServer = async () => {
  try {
    if (!process.env.ATLAS_URI) {
      throw new Error("FATAL ERROR: ATLAS_URI is not defined in the environment variables.");
    }
    await mongoose.connect(process.env.ATLAS_URI);
    console.log('MongoDB connection established');

    app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
      console.log(`tRPC endpoint ready at http://localhost:${PORT}/trpc`);
    });
  } catch (err) {
    console.error('MongoDB connection error or server start error:', err);
    process.exit(1);
  }
};

startServer();