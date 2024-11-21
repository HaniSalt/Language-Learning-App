import { FunctionalComponent, h } from 'preact';
import { DeckItem } from './DeckItem';
import { getDecks, Deck } from '../utils/storage';
import { useState, useEffect } from 'preact/hooks';
import './deckListStyles.less';

interface DeckListProps {
  setSelectedDeckId: (id: number) => void;
}

export const DeckList: FunctionalComponent<DeckListProps> = ({ setSelectedDeckId }) => {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    setDecks(getDecks());
  }, []);

  return (
    <div class="deck-list">
      <h2>Your Decks</h2>
      <div class="deck-items">
        {decks.map(deck => (
          <DeckItem key={deck.id} deck={deck} onSelect={setSelectedDeckId} />
        ))}
      </div>
    </div>
  );
};
