// DeckList.tsx
import { FunctionalComponent, h } from 'preact';
import { DeckItem } from './DeckItem';

interface DeckListProps {
  setSelectedDeckId: (id: number) => void;
}

export const DeckList: FunctionalComponent<DeckListProps> = ({ setSelectedDeckId }) => {
  const decks = [
    { id: 1, name: 'Spanish Basics' },
    { id: 2, name: 'French Vocabulary' },
  ];

  return (
    <div>
      <h2>Your Decks</h2>
      <ul>
        {decks.map(deck => (
          <DeckItem key={deck.id} deck={deck} onSelect={setSelectedDeckId} />
        ))}
      </ul>
    </div>
  );
};
