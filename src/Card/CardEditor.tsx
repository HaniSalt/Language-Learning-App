import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

interface CardEditorProps {
  deckId: number;
}

export const CardEditor: FunctionalComponent<CardEditorProps> = ({ deckId }) => {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log('Card saved:', { deckId, frontText, backText });
    setFrontText('');
    setBackText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a new card to Deck {deckId}</h3>
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
