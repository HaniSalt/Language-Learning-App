import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { addDeck } from '../utils/storage';

interface DeckCreatorProps {
  onDeckCreated: (deckId: number) => void;
}

export const DeckCreator: FunctionalComponent<DeckCreatorProps> = ({ onDeckCreated }) => {
  const [deckName, setDeckName] = useState('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (deckName.trim() === '') {
      alert('Deck name cannot be empty.');
      return;
    }
    const newDeck = addDeck(deckName);
    console.log('Creating deck:', newDeck);
    setDeckName('');
    onDeckCreated(newDeck.id);
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
