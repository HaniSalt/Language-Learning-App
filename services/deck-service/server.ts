import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/database';
import deckRoutes from './routes/deckRoutes';

dotenv.config({ path: './db/config.env' });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', deckRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'deck-service' });
});

const PORT = process.env.PORT || 8082;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Deck Service running on port ${PORT}`);
  });
});

export default app;