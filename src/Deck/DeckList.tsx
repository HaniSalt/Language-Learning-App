import { FunctionalComponent, h } from 'preact';
import { DeckItem } from './DeckItem';

export const DeckList: FunctionalComponent = () => {
  const decks = [
    { id: 1, name: 'Spanish Basics' },
    { id: 2, name: 'French Vocabulary' },
  ];

  return (
    <div>
      <h2>Your Decks</h2>
      <ul>
        {decks.map(deck => (
          <DeckItem key={deck.id} deck={deck} />
        ))}
      </ul>
    </div>
  );
};