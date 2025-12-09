const axios = require("axios");

jest.mock("axios");

beforeEach(() => {
  jest.clearAllMocks();

  process.env.USER_SERVICE_URL = "http://localhost:8081";
  process.env.DECK_SERVICE_URL = "http://localhost:8082";
  process.env.CARD_SERVICE_URL = "http://localhost:8083";
});