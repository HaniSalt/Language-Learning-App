import axios from 'axios';
import { getDecksForUser, addDeckApi, Deck } from '../deckApi';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Group of tests for our deckApi functions
describe('deckApi Service', () => {
  const API_BASE_URL = 'http://localhost:3001/api'; 

  // This runs after each test, to clean up the mocks
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Tests for the getDecksForUser function
  describe('getDecksForUser', () => {
    // Test if we can get decks for a user
    test('Test if we can get decks for a user and it returns the right data', async () => {
      const testUserId = 'userTestId123'; // Example user ID
      const dummyDecksResponse: Deck[] = [ // What we expect the server to send back
        { id: 1, _id: 'mongoId1', name: 'Spanish Basics', cards: [], userId: testUserId },
        { id: 2, _id: 'mongoId2', name: 'French Vocabulary', cards: [], userId: testUserId },
      ];

      // Tell our fake axios what to do when 'get' is called
      mockedAxios.get.mockResolvedValueOnce({ data: dummyDecksResponse });

      // Call the actual function we're testing
      const result = await getDecksForUser(testUserId);

      // Check if axios.get was called
      expect(mockedAxios.get).toHaveBeenCalledTimes(1); // Should be called once
      // Check if it was called with the correct URL
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_BASE_URL}/decks/${testUserId}`);
      
      // Check if the result from our function is what we expected
      expect(result).toEqual(dummyDecksResponse);
    });

    // Test what happens if the API call has an error
    test('when API fails for getting decks, it should give an error', async () => {
      const someUserId = 'userTestId456';
      const errorMsg = 'Network Error or something bad happened';
      
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMsg));

      // We expect our function to throw an error
      try {
        await getDecksForUser(someUserId); // This should fail
      } catch (e: any) {
        expect(e.message).toBe(errorMsg); // Check the error message
      }

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_BASE_URL}/decks/${someUserId}`);
    });
  });

  describe('addDeckApi', () => {
    test('should make a POST request to create a new deck and return the new deck', async () => {
        const newDeckName = "My Cool New Deck";
        const forUserId = "userCreator789";
        
        const newDeckInfo = { name: newDeckName, userId: forUserId };
        
        const mockAddedDeck: Deck = {
            id: 12345,
            _id: "newMongoIdGeneratedByDb",
            name: newDeckName,
            userId: forUserId,
            cards: []
        };

        mockedAxios.post.mockResolvedValueOnce({ data: mockAddedDeck });

        const resultOfTheApiCall = await addDeckApi(newDeckName, forUserId);
        expect(mockedAxios.post).toHaveBeenCalledWith(`${API_BASE_URL}/decks`, newDeckInfo);
        
        expect(resultOfTheApiCall).toEqual(mockAddedDeck);
    });

  });
});