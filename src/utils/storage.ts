export interface Card {
  id: number;
  front: string;
  back: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface Deck {
  id: number;
  name: string;
  cards: Card[];
}

const DECKS_KEY = 'flashcards_decks';

// Generate a unique ID for decks and cards
function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// Fetch all decks from localStorage
export function getDecks(): Deck[] {
  const decksJson = localStorage.getItem(DECKS_KEY);
  if (decksJson) {
    return JSON.parse(decksJson);
  } else {
    // Initialize with sample data
    const sampleDecks: Deck[] = [
      {
        id: 1,
        name: 'Spanish Basics',
        cards: [
          { id: 1, front: 'Hola', back: 'Hello' },
          { id: 2, front: 'Adiós', back: 'Goodbye' },
        ],
      },
      {
        id: 2,
        name: 'French Vocabulary',
        cards: [
          { id: 3, front: 'Bonjour', back: 'Hello' },
          { id: 4, front: 'Au revoir', back: 'Goodbye' },
        ],
      },
    ];
    saveDecks(sampleDecks);
    return sampleDecks;
  }
}

// Save all decks to localStorage
export function saveDecks(decks: Deck[]): void {
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
}

// Get a deck by ID
export function getDeckById(deckId: number): Deck | undefined {
  const decks = getDecks();
  return decks.find(deck => deck.id === deckId);
}

// Add a new deck
export function addDeck(name: string): Deck {
  const newDeck: Deck = {
    id: generateId(),
    name,
    cards: [],
  };
  const decks = getDecks();
  decks.push(newDeck);
  saveDecks(decks);
  return newDeck;
}


// Update an existing deck
export function updateDeck(updatedDeck: Deck): void {
  const decks = getDecks();
  const index = decks.findIndex(deck => deck.id === updatedDeck.id);
  if (index !== -1) {
    decks[index] = updatedDeck;
    saveDecks(decks);
  }
}

// Delete a deck
export function deleteDeck(deckId: number): void {
  const decks = getDecks();
  const updatedDecks = decks.filter(deck => deck.id !== deckId);
  saveDecks(updatedDecks);
}

// Add a card to a deck
// src/utils/storage.ts

export function addCardToDeck(
  deckId: number,
  front: string,
  back: string,
  imageUrl?: string,
  audioUrl?: string
): Card {
  const decks = getDecks();
  const deck = decks.find(d => d.id === deckId);
  if (deck) {
    const newCard: Card = {
      id: generateId(),
      front,
      back,
      imageUrl,
      audioUrl,
    };
    deck.cards.push(newCard);
    updateDeck(deck);
    return newCard;
  } else {
    throw new Error('Deck not found');
  }
}


// Delete a card from a deck
export function deleteCardFromDeck(deckId: number, cardId: number): void {
  const decks = getDecks();
  const deck = decks.find(d => d.id === deckId);
  if (deck) {
    deck.cards = deck.cards.filter(card => card.id !== cardId);
    updateDeck(deck);
  }
}

export function importDecks(deckData: Deck[]): void {
  const existingDecks = getDecks();
  const combinedDecks = [...existingDecks, ...deckData];
  saveDecks(combinedDecks);
}

// Export decks to JSON
export function exportDecks(): string {
  const decks = getDecks();
  return JSON.stringify(decks, null, 2);
}

export function createDeck(name: string): Deck {
  const newDeck: Deck = {
    id: generateId(),
    name,
    cards: [],
  };
  const decks = getDecks();
  decks.push(newDeck);
  saveDecks(decks);
  return newDeck;
}