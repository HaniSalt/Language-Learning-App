import { auth } from '../firebase/firebase';

const API_BASE_URL = 'http://localhost:8080/api';

export interface Card {
  id: number;
  deckId: number;
  front: string;
  back: string;
  imageUrl?: string;
  audioUrl?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Get auth token for API calls
async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user');
  }
  return await user.getIdToken();
}

// Create a new card
export async function createCard(deckId: number, front: string, back: string, imageUrl?: string, audioUrl?: string): Promise<Card> {
  const token = await getAuthToken();
  
  console.log('Creating card:', { deckId, front, back });
  
  const response = await fetch(`${API_BASE_URL}/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      deckId,
      front,
      back,
      imageUrl: imageUrl || '',
      audioUrl: audioUrl || '',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create card');
  }

  return await response.json();
}

// Update an existing card
export async function updateCard(cardId: number, updates: Partial<Card>): Promise<Card> {
  const token = await getAuthToken();
  
  console.log('Updating card:', cardId, updates);
  
  const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update card');
  }

  return await response.json();
}

// Delete a card
export async function deleteCard(cardId: number): Promise<void> {
  const token = await getAuthToken();
  
  console.log('Deleting card:', cardId);
  
  const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete card');
  }
}

// Get cards for a specific deck
export async function getCardsForDeck(deckId: number): Promise<Card[]> {
  const token = await getAuthToken();
  
  console.log('Fetching cards for deck:', deckId);
  
  const response = await fetch(`${API_BASE_URL}/cards?deckId=${deckId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch cards');
  }

  return await response.json();
}