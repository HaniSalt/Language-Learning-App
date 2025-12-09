import mongoose from 'mongoose';

export const connectDB = async () => {
  if (!process.env.ATLAS_URI) {
    console.error("ATLAS_URI not defined");
    process.exit(1);
  }
  
  try {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log('MongoDB connected: Card Service');
  } catch (err) {
    console.error('MongoDB connection error:', err)
    process.exit(1);
  }
};