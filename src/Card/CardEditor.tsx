import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { addCardToDeck, getDeckById, Deck } from '../utils/storage';

interface CardEditorProps {
  deckId: number;
  onCardAdded: (updatedDeck: Deck) => void;
}

export const CardEditor: FunctionalComponent<CardEditorProps> = ({ deckId, onCardAdded }) => {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (frontText.trim() === '' || backText.trim() === '') {
      alert('Both front and back text are required.');
      return;
    }
    addCardToDeck(deckId, frontText, backText);
    console.log('Card saved:', { deckId, frontText, backText });
    setFrontText('');
    setBackText('');
    // Fetch the updated deck and pass it up
    const updatedDeck = getDeckById(deckId);
    if (updatedDeck) {
      onCardAdded(updatedDeck);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a new card</h3>
      <label>
        Front:
        <input
          type="text"
          value={frontText}
          onInput={(e: any) => setFrontText(e.target.value)}
        />
      </label>
      <label>
        Back:
        <input
          type="text"
          value={backText}
          onInput={(e: any) => setBackText(e.target.value)}
        />
      </label>
      <button type="submit">Save Card</button>
    </form>
  );
};
