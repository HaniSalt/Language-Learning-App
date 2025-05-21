const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Mongoose is a singleton
require('dotenv').config({ path: "./config.env" });
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// User Schema
const userSchema = new mongoose.Schema({
  userName: String,
  userId: String,
  dateOfCreation: String
});
mongoose.model('User', userSchema); // Define model on the mongoose instance

// Card and Deck Schemas
const cardSchema = new mongoose.Schema({
  id: Number,
  front: String,
  back: String,
  imageUrl: { type: String, default: '' },
  audioUrl: { type: String, default: '' }
});

const deckSchema = new mongoose.Schema({
  id: Number, // Your custom ID
  name: String,
  cards: [cardSchema],
  userId: { type: String, required: true }
});
mongoose.model('Deck', deckSchema); // Define model on the mongoose instance

// ========== ROUTES ==========
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/src/pages/register.tsx'));
});

// User registration endpoint
app.post('/post', async (req, res) => {
  const Users = mongoose.model('User'); // Access model
  const Decks = mongoose.model('Deck');
  try {
    const { userName, userId, dateOfCreation } = req.body;

    if (!userName || !userId || !dateOfCreation) {
      return res.status(400).json({ message: 'Missing required fields: userName, userId, dateOfCreation' });
    }
    const newUser = new Users({ userName, userId, dateOfCreation });
    await newUser.save();

    const defaultDecks = [
      { id: Date.now(), name: 'Spanish Basics', cards: [{ id: Date.now() + 1, front: 'Hola', back: 'Hello' }], userId: userId },
      { id: Date.now() + 100, name: 'French Vocabulary', cards: [{ id: Date.now() + 101, front: 'Bonjour', back: 'Hello' }], userId: userId }
    ];
    await Decks.insertMany(defaultDecks);

    console.log('User data saved to MongoDB:', newUser);
    res.status(201).json({ message: 'User registered and data saved successfully!', data: newUser });
  } catch (error) {
    console.error('Error saving user to MongoDB:', error);
    res.status(500).json({ message: 'Server error while saving user data', error: error.message });
  }
});

// Get all decks for a specific user
app.get('/api/decks/:userId', async (req, res) => {
  const Decks = mongoose.model('Deck');
  try {
    const { userId } = req.params;
    const decks = await Decks.find({ userId });
    res.status(200).json(decks);
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).json({ message: 'Server error while fetching decks', error: error.message });
  }
});

// Create a new deck
app.post('/api/decks', async (req, res) => {
  const Decks = mongoose.model('Deck');
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ message: 'Missing required fields: name, userId' });
    }
    const newDeck = new Decks({
      id: Date.now(), // Setting your custom ID
      name,
      cards: [],
      userId
    });
    await newDeck.save();
    res.status(201).json(newDeck); // newDeck will have both _id and your custom id
  } catch (error) {
    console.error('Error creating deck:', error);
    res.status(500).json({ message: 'Server error while creating deck', error: error.message });
  }
});

// Update an existing deck
app.put('/api/decks/:deckId', async (req, res) => {
  const Decks = mongoose.model('Deck');
  try {
    const { deckId } = req.params;
    const updatedDeck = req.body;
    const result = await Decks.findOneAndUpdate({ id: parseInt(deckId) }, updatedDeck, { new: true });
    if (!result) return res.status(404).json({ message: 'Deck not found' });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating deck:', error);
    res.status(500).json({ message: 'Server error while updating deck', error: error.message });
  }
});

// Delete a deck
app.delete('/api/decks/:deckId', async (req, res) => {
  const Decks = mongoose.model('Deck');
  try {
    const { deckId } = req.params;
    const result = await Decks.findOneAndDelete({ id: parseInt(deckId) });
    if (!result) return res.status(404).json({ message: 'Deck not found' });
    res.status(200).json({ message: 'Deck deleted successfully' });
  } catch (error) {
    console.error('Error deleting deck:', error);
    res.status(500).json({ message: 'Server error while deleting deck', error: error.message });
  }
});

// Import decks
app.post('/api/decks/import', async (req, res) => {
  const Decks = mongoose.model('Deck');
  try {
    const { decks, userId } = req.body;
    if (!decks || !Array.isArray(decks) || !userId) {
      return res.status(400).json({ message: 'Invalid request: decks must be an array and userId is required' });
    }
    const decksWithUserId = decks.map(deck => ({ ...deck, userId }));
    await Decks.insertMany(decksWithUserId);
    res.status(201).json({ message: 'Decks imported successfully' });
  } catch (error) {
    console.error('Error importing decks:', error);
    res.status(500).json({ message: 'Server error while importing decks', error: error.message });
  }
});

// Export the app for testing purposes (and for other modules if needed)
module.exports = app;

// Start server and connect to DB only if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  if (!process.env.ATLAS_URI) {
    console.error("FATAL ERROR: ATLAS_URI is not defined in the environment variables.");
    process.exit(1);
  }
  mongoose.connect(process.env.ATLAS_URI)
    .then(() => {
      console.log('MongoDB connection established (initiated by index.js direct run)');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} (initiated by index.js direct run)`);
      });
    })
    .catch(err => {
      console.error('MongoDB connection error (initiated by index.js direct run):', err);
      process.exit(1);
    });
}