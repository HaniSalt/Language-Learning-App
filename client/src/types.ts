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
  userId: string; // Firebase UID
}