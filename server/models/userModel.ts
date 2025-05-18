import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: String,
  userId: { type: String, unique: true, required: true }, // Make userId unique and required
  dateOfCreation: String
});

export const Users = mongoose.model('User', userSchema);