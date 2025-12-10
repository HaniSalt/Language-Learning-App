import axios from 'axios';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase/firebase';

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

const API_BASE_URL = 'http://localhost:8080/api'; //gateway fogja hasznalni

async function getAuthHeader() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  const token = await user.getIdToken();
  return { 
    'Authorization': `Bearer ${token}`,
    'x-user-id': user.uid
  };
}

// Fetch all decks for a user
// export async function getDecksForUser(userId: string): Promise<Deck[]> {
//   const response = await axios.get(`${API_BASE_URL}/decks/${userId}`);
//   return response.data;
// }

export async function getDecksForUser(userId: string): Promise<Deck[]> {
  try {
    const headers = await getAuthHeader();
    // console.log('Fetching decks with headers:', headers);
    const response = await axios.get(`${API_BASE_URL}/decks`, {headers});
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch decks');
    throw error;
  }
}

// Add a new deck
// export async function addDeckApi(deckName: string, userId: string): Promise<Deck> {
//   const response = await axios.post(`${API_BASE_URL}/decks`, { name: deckName, userId });
//   return response.data;
// }

export async function addDeckApi(deckName: string, userId: string): Promise<Deck> {
  const headers = await getAuthHeader();
  const response = await axios.post(
    `${API_BASE_URL}/decks`, 
    { name: deckName },{headers}
  );
  return response.data;
}

// Update an existing deck
// export async function updateDeckApi(deckId: number, updatedDeckData: Partial<Deck>): Promise<Deck> {
//   const response = await axios.put(`${API_BASE_URL}/decks/${deckId}`, updatedDeckData);
//   return response.data;
// }
export async function updateDeckApi(deckId: number, updatedDeckData: Partial<Deck>): Promise<Deck> {
  const headers = await getAuthHeader();
  const response = await axios.put(
    `${API_BASE_URL}/decks/${deckId}`, 
    updatedDeckData,{headers}
  );
  return response.data;
}

// Delete a deck
// export async function deleteDeckApi(deckId: number): Promise<void> {
//   await axios.delete(`${API_BASE_URL}/decks/${deckId}`);
// }

export async function deleteDeckApi(deckId: number): Promise<void> {
  const headers = await getAuthHeader();
  await axios.delete(`${API_BASE_URL}/decks/${deckId}`, {headers});
}

export async function getDeckById(deckId: number): Promise<Deck> {
  const headers = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/decks/${deckId}`, {headers});
  return response.data;
}
export async function getTemplateDcks(): Promise<Deck[]> {
  const response = await axios.get(`${API_BASE_URL}/templates`);
  return response.data;
}
// export async function deleteCardFromDeckViaApi(deckId: number, cardId: number, userId: string): Promise<Deck> {
//   const response = await axios.get(`${API_BASE_URL}/decks/${userId}`);
//   const decks: Deck[] = response.data;
//   const deck = decks.find(d => d.id === deckId);
//   if (!deck) throw new Error('Deck not found');
//   deck.cards = deck.cards.filter(card => card.id !== cardId);
//   return updateDeckApi(deckId, deck);
// }

// Import decks for a user
// export async function importDecksApi(decksToImport: Deck[], userId: string): Promise<{ message: string }> {
//   const response = await axios.post(`${API_BASE_URL}/decks/import`, { decks: decksToImport, userId });
//   return response.data;
// }
export async function importDecksApi(decksToImport: Deck[], userId: string): Promise<{ message: string }> {
  const headers = await getAuthHeader();
  const response = await axios.post(
    `${API_BASE_URL}/decks/import`, 
    { decks: decksToImport },{headers}
  );
  return response.data;
}

// Export decks (simply fetches and lets the component handle file creation)
export async function exportDecksApi(userId: string): Promise<Deck[]> {
  return getDecksForUser(userId);
}