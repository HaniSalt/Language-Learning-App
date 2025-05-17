const express = require('express');
const cors = require('cors');
const { connectToServer, saveUserId } = require('./connect.cjs');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/save-user', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    await saveUserId(userId);
    res.status(200).json({ message: 'User ID saved successfully' });
  } catch (error) {
    console.error('Failed to save user ID:', error);
    res.status(500).json({ message: 'Failed to save user ID to database' });
  }
});

connectToServer((err) => {
  if (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
});