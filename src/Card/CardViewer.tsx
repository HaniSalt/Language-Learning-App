import { FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Deck, Card, updateDeck } from '../utils/storage';
import './cardViewerStyles.less';

interface CardViewerProps {
  deck: Deck;
  onDeckUpdated: (updatedDeck: Deck) => void;
}

export const CardViewer: FunctionalComponent<CardViewerProps> = ({ deck, onDeckUpdated }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');

  const cards = deck.cards;

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [deck]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % cards.length);
    setIsFlipped(false);
  };

  const handleEditCard = () => {
    const currentCard = cards[currentIndex];
    setFrontText(currentCard.front);
    setBackText(currentCard.back);
    setIsEditingCard(true);
  };

  const handleSaveCard = () => {
    const updatedCard: Card = {
      ...cards[currentIndex],
      front: frontText,
      back: backText,
    };
    const updatedCards = [...cards];
    updatedCards[currentIndex] = updatedCard;
    const updatedDeck = { ...deck, cards: updatedCards };
    updateDeck(updatedDeck);
    onDeckUpdated(updatedDeck);
    setIsEditingCard(false);
    setIsFlipped(false);
  };

  const handleDeleteCard = () => {
    const confirmDelete = confirm('Are you sure you want to delete this card?');
    if (confirmDelete) {
      const updatedCards = cards.filter((_, index) => index !== currentIndex);
      const updatedDeck = { ...deck, cards: updatedCards };
      updateDeck(updatedDeck);
      onDeckUpdated(updatedDeck);
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsEditingCard(false);
    }
  };

  if (cards.length === 0) {
    return <p>No cards in this deck.</p>;
  }

  const card = cards[currentIndex];

  return (
    <div class="card-viewer">
      {isEditingCard ? (
        <div class="card-editor">
          <input
            type="text"
            value={frontText}
            onInput={(e: any) => setFrontText(e.target.value)}
            placeholder="Front"
          />
          <input
            type="text"
            value={backText}
            onInput={(e: any) => setBackText(e.target.value)}
            placeholder="Back"
          />
          <div class="card-editor-actions">
            <button onClick={handleSaveCard}>Save</button>
            <button onClick={() => setIsEditingCard(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div class={`card ${isFlipped ? 'is-flipped' : ''}`}>
            <div class="card-inner">
              <div class="card-face card-front">
                <p>{card.front}</p>
              </div>
              <div class="card-face card-back">
                <p>{card.back}</p>
              </div>
            </div>
          </div>
          <div class="card-actions">
            <button onClick={handleFlip} class="flip-button">
              {isFlipped ? 'Show Question' : 'Show Answer'}
            </button>
          </div>
        </>
      )}
      {!isEditingCard && (
        <div class="card-viewer-bottom">
          <button onClick={handleEditCard} class="edit-button">Edit</button>
          <button onClick={handleDeleteCard} class="delete-button">Delete</button>
          <button onClick={handleNext} class="next-button">Next Card</button>
        </div>
      )}
    </div>
  );
};
