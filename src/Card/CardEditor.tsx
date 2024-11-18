import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

export const CardEditor: FunctionalComponent = () => {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // Logic to create or edit a card
    console.log('Card saved:', { frontText, backText });
    setFrontText('');
    setBackText('');
  };

  return (
    <form onSubmit={handleSubmit}>
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
