const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

const DeckModel = mongoose.model('Deck');

describe('POST /api/decks - Create new deck endpoint', () => {
  beforeAll(async () => {
    if (!process.env.ATLAS_URI) {
      console.error("Warning: ATLAS_URI is not set in the .env file!");
      throw new Error("ATLAS_URI is not defined.");
    }
    await mongoose.connect(process.env.ATLAS_URI);
    console.log("Connected to MongoDB before tests.");
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log("Closed MongoDB connection after tests.");
  });

  let saveMockFn;

  beforeEach(() => {
    saveMockFn = jest.spyOn(DeckModel.prototype, 'save').mockImplementation(function() {
      this._id = new mongoose.Types.ObjectId();
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    saveMockFn.mockRestore();
  });

  test('should successfully create a new deck with 201 status and return deck data', async () => {
    const newDeck = {
      name: 'Test Deck from Unit Test',
      userId: 'testUser12345',
    };

    const response = await request(app)
      .post('/api/decks')
      .send(newDeck);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(newDeck.name);
    expect(response.body.userId).toBe(newDeck.userId);
    expect(response.body.cards).toEqual([]);
    expect(response.body).toHaveProperty('id');
    expect(typeof response.body.id).toBe('number');
    expect(saveMockFn).toHaveBeenCalledTimes(1);
  });

  test('should return 400 error if name or userId is missing', async () => {
    const responseWithoutName = await request(app)
      .post('/api/decks')
      .send({ userId: 'testUserABC' });

    expect(responseWithoutName.statusCode).toBe(400);
    expect(responseWithoutName.body.message).toContain('Missing required fields');

    const responseWithoutUserId = await request(app)
      .post('/api/decks')
      .send({ name: 'Another Test Deck' });

    expect(responseWithoutUserId.statusCode).toBe(400);
    expect(responseWithoutUserId.body.message).toContain('Missing required fields');

    expect(saveMockFn).not.toHaveBeenCalled();
  });
});
