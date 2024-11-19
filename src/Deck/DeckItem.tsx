import { FunctionalComponent, h } from 'preact';

interface DeckItemProps {
  deck: {
    id: number;
    name: string;
  };
  onSelect: (id: number) => void;
}

export const DeckItem: FunctionalComponent<DeckItemProps> = ({ deck, onSelect }) => {
  return (
    <li>
      <button onClick={() => onSelect(deck.id)}>{deck.name}</button>
    </li>
  );
};
