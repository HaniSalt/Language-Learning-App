import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/database';
import cardRoutes from './routes/cardRoutes';

dotenv.config({ path: './db/config.env' });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', cardRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'card-service' });
});

const PORT = process.env.PORT || 8083;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Card  Service running on port ${PORT}`);
  });
});

export default app;