import { FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
import { addDeck } from '../utils/storage';

interface DeckCreatorProps {
  onDeckCreated: (deckId: number) => void; // Callback function to notify when a new deck is created
}

export const DeckCreator: FunctionalComponent<DeckCreatorProps> = ({ onDeckCreated }) => {
  // State to hold the current value of the deck name input
  const [deckName, setDeckName] = useState('');

  // Handles form submission to create a new deck
  const handleSubmit = (e: Event) => {
    e.preventDefault(); // Prevents the default form submission behavior
    if (deckName.trim() === '') { // Validates that the deck name is not empty
      alert('Deck name cannot be empty.');
      return;
    }
    const newDeck = addDeck(deckName); // Adds a new deck using the provided deck name
    console.log('Creating deck:', newDeck); // Logs the newly created deck for debugging
    setDeckName(''); // Resets the deck name input field
    onDeckCreated(newDeck.id); // Calls the callback with the new deck's ID
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Label and input for the deck name */}
      <label>
        Deck Name:
        <input
          type="text"
          value={deckName} // Binds the input value to the deckName state
          onInput={(e: any) => setDeckName(e.target.value)} // Updates the deckName state on input
        />
      </label>
      {/* Submit button to create the deck */}
      <button type="submit">Create Deck</button>
    </form>
  );
};
