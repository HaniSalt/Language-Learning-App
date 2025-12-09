import request from "supertest";
import express from "express";
import { setupRoutes } from "../routes";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Deck API through Gateway", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    setupRoutes(app);
  });

  test("GET /api/decks returns combined decks with cards", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { uid: "user123", isNewUser: false },
    } as any);

    mockedAxios.get.mockImplementationOnce((url) => {
      if (url.includes("localhost:8082/api/decks")) {
        return Promise.resolve({ data: [{ id: "deck1", name: "My Deck" }] } as any);
      }
      return Promise.reject(new Error("Unexpected call: " + url));
    });

    mockedAxios.get.mockImplementationOnce((url) => {
      if (url.includes("localhost:8082/api/decks")) {
        return Promise.resolve({
          data: [{ id: "deck1", name: "My Deck" }],
        } as any);
      }
      return Promise.reject(new Error("Unexpected call: " + url));
    });

    mockedAxios.get.mockImplementationOnce((url) => {
      if (url.includes("localhost:8083/api/cards?deckId=deck1")) {
        return Promise.resolve({
          data: [{ id: "card1", front: "A", back: "B" }],
        } as any);
      }
      return Promise.reject(new Error("Unexpected call: " + url));
    });

    const res = await request(app)
      .get("/api/decks")
      .set("Authorization", "Bearer TOKEN123")
      .expect(200);

    expect(res.body).toEqual([
      {
        id: "deck1",
        name: "My Deck",
        cards: [{ id: "card1", front: "A", back: "B" }],
      },
    ]);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:8081/validate-token",
      { token: "TOKEN123" }
    );
  });

  test("POST /api/decks creates a deck", async () => {
    mockedAxios.post
      .mockResolvedValueOnce({ data: { uid: "user123" } } as any)
      .mockResolvedValueOnce({
        data: { id: "deck42", name: "New Deck" },
      } as any);

    const res = await request(app)
      .post("/api/decks")
      .send({ name: "New Deck" })
      .set("Authorization", "Bearer TOKENXYZ")
      .expect(201);

    expect(res.body.id).toBe("deck42");

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:8082/api/decks",
      { name: "New Deck" },
      { headers: { "x-user-id": "user123" } }
    );
  });
});