const request = require('supertest');
const app = require('../server').default;
const mongoose = require('mongoose');

const DeckModel = mongoose.model('Deck');

describe('Deck Service: POST /api/decks - Create new deck endpoint', () => {
  let saveMockFn;
  
  beforeEach(() => {
    saveMockFn = jest.spyOn(DeckModel.prototype, 'save').mockImplementation(function() {
      this._id = new mongoose.Types.ObjectId();
      this.id = Math.floor(Math.random() * 100000); 
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    saveMockFn.mockRestore();
  });

  test('should successfully create a new deck with 201 status and return deck data', async () => {
    const newDeck = {
      name: 'Test Deck for Deck Service',
      userId: 'deckServiceUser123',
    };

    const response = await request(app)
      .post('/api/decks')
      .send(newDeck);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(newDeck.name);
    expect(response.body.userId).toBe(newDeck.userId);
    expect(saveMockFn).toHaveBeenCalledTimes(1);
  });
  
  test('should return 400 error if name or userId is missing', async () => {
    const responseWithoutName = await request(app)
      .post('/api/decks')
      .send({ userId: 'testUserABC' });

    expect(responseWithoutName.statusCode).toBe(400);
    expect(responseWithoutName.body.message).toContain('Missing required fields');

    expect(saveMockFn).not.toHaveBeenCalled();
  });
});