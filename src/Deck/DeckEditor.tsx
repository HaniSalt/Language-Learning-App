import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

interface DeckEditorProps {
  deckId: number;
}

export const DeckEditor: FunctionalComponent<DeckEditorProps> = ({ deckId }) => {
  const [deckName, setDeckName] = useState('Current Deck Name');

  const handleSave = () => {
    // Logic to save the updated deck
    console.log('Saving deck:', deckId, deckName);
  };

  // Displays the edit name deck part and save the new name.
  return (
    <div>
      <h2>Edit Deck</h2>
      <label>
        Deck Name:
        <input
          type="text"
          value={deckName}
          onInput={(e: any) => setDeckName(e.target.value)}
        />
      </label>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};
