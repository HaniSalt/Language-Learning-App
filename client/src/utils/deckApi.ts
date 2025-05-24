import { trpc } from '../trpc';
import type { Deck, Card } from '../types';

export const getDecksForUser = async (userId: string): Promise<Deck[]> => {
  try {
    const decks = await trpc.deck.getDecksByUserId.query({ userId });
    return decks as Deck[]; 
  } catch (error) {
    console.error("tRPC - Failed to fetch user decks:", error);
    throw error;
  }
};

export const createNewDeck = async (name: string, userId: string, cards?: Card[]): Promise<Deck> => {
  try {
    const newDeck = await trpc.deck.createDeck.mutate({ name, userId, cards });
    return newDeck as Deck;
  } catch (error) {
    console.error("tRPC - Failed to create deck:", error);
    throw error;
  }
};

export const updateDeckApi = async (
  deckId: number,
  userId: string,
  updates: Partial<Omit<Deck, 'id' | 'userId' | 'cards'>> & { cards?: Card[] }
): Promise<Deck> => {
  try {
    const updatedDeck = await trpc.deck.updateDeck.mutate({ deckId, userId, ...updates });
    return updatedDeck as Deck;
  } catch (error) {
    console.error("tRPC - Failed to update deck:", error);
    throw error;
  }
};

export const deleteDeckApi = async (deckId: number, userId: string): Promise<{ message: string }> => {
  try {
    return await trpc.deck.deleteDeck.mutate({ deckId, userId });
  } catch (error) {
    console.error("tRPC - Failed to delete deck:", error);
    throw error;
  }
};

export const importDecksApi = async (
  decksToImport: Array<Omit<Deck, 'userId'>>,
  userId: string
): Promise<{ message: string }> => {
  try {
    const formattedDecks = decksToImport.map(d => ({
      id: d.id,
      name: d.name,
      cards: d.cards.map(c => ({
        id: c.id,
        front: c.front,
        back: c.back,
        imageUrl: c.imageUrl,
        audioUrl: c.audioUrl,
      })),
    }));
    return await trpc.deck.importDecks.mutate({ decks: formattedDecks, userId });
  } catch (error) {
    console.error("tRPC - Failed to import decks:", error);
    throw error;
  }
};

export const exportDecksApi = async (userId: string): Promise<Deck[]> => {
  try {
    const decks = await trpc.deck.getDecksByUserId.query({ userId });
    return decks as Deck[];
  } catch (error) {
    console.error("tRPC - Failed to fetch decks for export:", error);
    throw error;
  }
};

export const registerUserWithBackend = async (userData: {
  userName: string;
  userId: string;
  dateOfCreation: string;
}) => {
  try {
    const result = await trpc.user.registerUser.mutate(userData);
    console.log('User registered on backend:', result.message);
    return result.user;
  } catch (error) {
    console.error("tRPC - Failed to register user on backend:", error);
    throw error;
  }
};