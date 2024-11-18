import { FunctionalComponent, h } from 'preact';

interface DeckItemProps {
  deck: {
    id: number;
    name: string;
  };
}

export const DeckItem: FunctionalComponent<DeckItemProps> = ({ deck }) => {
  return (
    <li>
      <a href={`/decks/${deck.id}`}>{deck.name}</a>
    </li>
  );
};