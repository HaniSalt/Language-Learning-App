const mongoose = require('mongoose');

beforeAll(async () => {
  if (!process.env.ATLAS_URI) {
    throw new Error("ATLAS_URI is not defined.");
  }
  await mongoose.connect(process.env.ATLAS_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});