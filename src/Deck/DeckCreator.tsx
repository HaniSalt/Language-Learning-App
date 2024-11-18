import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

export const DeckCreator: FunctionalComponent = () => {
  const [deckName, setDeckName] = useState('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // Logic to create a new deck
    console.log('Creating deck:', deckName);
    setDeckName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Deck Name:
        <input
          type="text"
          value={deckName}
          onInput={(e: any) => setDeckName(e.target.value)}
        />
      </label>
      <button type="submit">Create Deck</button>
    </form>
  );
};
