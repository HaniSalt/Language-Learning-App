import { FunctionalComponent, h } from 'preact';
import { CardViewer } from '../Card/CardViewer';
import { CardEditor } from '../Card/CardEditor';

interface DeckDetailProps {
  deckId: number;
  onBack: () => void;
}

export const DeckDetail: FunctionalComponent<DeckDetailProps> = ({ deckId, onBack }) => {
  // Mock deck data based on deckId
  const deck = {
    id: deckId,
    name: deckId === 1 ? 'Spanish Basics' : 'French Vocabulary',
    cards: [
      { id: 1, front: 'Hola', back: 'Hello' },
      { id: 2, front: 'Adiós', back: 'Goodbye' },
      // Add more cards as needed
    ],
  };

  return (
    <div>
      <button onClick={onBack}>Back to Decks</button>
      <h2>{deck.name}</h2>
      {/* Options to edit or delete the deck */}
      <button>Edit Deck</button>
      <button>Delete Deck</button>
      {/* Display the cards in the deck */}
      <CardViewer cards={deck.cards} />
      {/* Optionally, include a card editor */}
      <CardEditor deckId={deckId} />
    </div>
  );
};
