import axios from 'axios';
import { User as FirebaseUser } from 'firebase/auth';

export interface Card {
  id: number;
  front: string;
  back: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface Deck {
  id: number;
  _id?: string;
  name: string;
  cards: Card[];
  userId: string;
}

const API_BASE_URL = 'http://localhost:3001/api';

// Fetch all decks for a user
export async function getDecksForUser(userId: string): Promise<Deck[]> {
  const response = await axios.get(`${API_BASE_URL}/decks/${userId}`);
  return response.data;
}

// Add a new deck
export async function addDeckApi(deckName: string, userId: string): Promise<Deck> {
  const response = await axios.post(`${API_BASE_URL}/decks`, { name: deckName, userId });
  return response.data;
}

// Update an existing deck
export async function updateDeckApi(deckId: number, updatedDeckData: Partial<Deck>): Promise<Deck> {
  const response = await axios.put(`${API_BASE_URL}/decks/${deckId}`, updatedDeckData);
  return response.data;
}

// Delete a deck
export async function deleteDeckApi(deckId: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/decks/${deckId}`);
}

export async function addCardToDeckViaApi(deckId: number, cardData: Omit<Card, 'id'>, userId: string): Promise<Deck> {
  const response = await axios.get(`${API_BASE_URL}/decks/${userId}`);
  const decks: Deck[] = response.data;
  const deck = decks.find(d => d.id === deckId);
  if (!deck) throw new Error('Deck not found');
  const newCard: Card = { ...cardData, id: Date.now() }; // Ensure unique ID generation
  deck.cards.push(newCard);
  return updateDeckApi(deckId, deck); // Ensure updateDeckApi sends the whole deck or backend handles merging
}

export async function deleteCardFromDeckViaApi(deckId: number, cardId: number, userId: string): Promise<Deck> {
  const response = await axios.get(`${API_BASE_URL}/decks/${userId}`);
  const decks: Deck[] = response.data;
  const deck = decks.find(d => d.id === deckId);
  if (!deck) throw new Error('Deck not found');
  deck.cards = deck.cards.filter(card => card.id !== cardId);
  return updateDeckApi(deckId, deck);
}

// Import decks for a user
export async function importDecksApi(decksToImport: Deck[], userId: string): Promise<{ message: string }> {
  const response = await axios.post(`${API_BASE_URL}/decks/import`, { decks: decksToImport, userId });
  return response.data;
}

// Export decks (simply fetches and lets the component handle file creation)
export async function exportDecksApi(userId: string): Promise<Deck[]> {
  return getDecksForUser(userId);
}