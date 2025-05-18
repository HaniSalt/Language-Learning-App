const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ path: "./config.env" });
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.ATLAS_URI)
  .then(() => console.log('MongoDB connection established'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  userName: String, 
  userId: String,  
  dateOfCreation: String
});

const Users = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/src/pages/register.tsx'));
});

app.post('/post', async (req, res) => {
  try {
    const { userName, userId, dateOfCreation } = req.body;

    if (!userName || !userId || !dateOfCreation) {
      return res.status(400).json({ message: 'Missing required fields: userName, userId, dateOfCreation' });
    }

    const newUser = new Users({
      userName,
      userId,
      dateOfCreation
    });

    await newUser.save();
    console.log('User data saved to MongoDB:', newUser);
    res.status(201).json({ message: 'User registered and data saved successfully!', data: newUser });

  } catch (error) {
    console.error('Error saving user to MongoDB:', error);
    res.status(500).json({ message: 'Server error while saving user data', error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});