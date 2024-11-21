import { FunctionalComponent, h } from 'preact';
import { Deck } from '../utils/storage';
import './deckItemStyles.less';

interface DeckItemProps {
  deck: Deck;
  onSelect: (id: number) => void;
}

export const DeckItem: FunctionalComponent<DeckItemProps> = ({ deck, onSelect }) => {
  return (
    <div class="deck-item" onClick={() => onSelect(deck.id)}>
      <div class="deck-name">{deck.name}</div>
    </div>
  );
};
