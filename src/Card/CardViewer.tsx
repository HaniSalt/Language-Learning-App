import { FunctionalComponent} from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Deck, Card, updateDeck } from '../utils/storage';
import './cardViewerStyles.less';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SkipNextIcon from '@mui/icons-material/SkipNext';

interface CardViewerProps {
  deck: Deck; // The deck containing the cards to view
  onDeckUpdated: (updatedDeck: Deck) => void; // Callback when the deck is updated
}

// CardViewer component definition
export const CardViewer: FunctionalComponent<CardViewerProps> = ({ deck, onDeckUpdated }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Current index of the card being viewed
  const [isFlipped, setIsFlipped] = useState(false); // Whether the card is flipped to show the back
  const [isEditingCard, setIsEditingCard] = useState(false); // Whether the current card is in edit mode
  const [frontText, setFrontText] = useState(''); // Front text for editing
  const [backText, setBackText] = useState(''); // Back text for editing

  const cards = deck.cards; // Array of cards in the deck

  // Reset the card viewer when the deck changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [deck]);

  // Handles flipping the card
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Moves to the next card
  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % cards.length);
    setIsFlipped(false);
  };

  // Initiates editing of the current card
  const handleEditCard = () => {
    const currentCard = cards[currentIndex];
    setFrontText(currentCard.front);
    setBackText(currentCard.back);
    setIsEditingCard(true);
  };

  // Saves the edited card
  const handleSaveCard = () => {
    const updatedCard: Card = {
      ...cards[currentIndex],
      front: frontText,
      back: backText,
    };
    const updatedCards = [...cards];
    updatedCards[currentIndex] = updatedCard;
    const updatedDeck = { ...deck, cards: updatedCards };
    updateDeck(updatedDeck); // Update the deck in storage
    onDeckUpdated(updatedDeck); // Notify parent component of the update
    setIsEditingCard(false);
    setIsFlipped(false);
  };

  // Deletes the current card
  const handleDeleteCard = () => {
    const confirmDelete = confirm('Are you sure you want to delete this card?');
    if (confirmDelete) {
      const updatedCards = cards.filter((_, index) => index !== currentIndex);
      const updatedDeck = { ...deck, cards: updatedCards };
      updateDeck(updatedDeck); // Update the deck in storage
      onDeckUpdated(updatedDeck); // Notify parent component of the update
      setCurrentIndex(0); // Reset to the first card
      setIsFlipped(false);
      setIsEditingCard(false);
    }
  };

  // If there are no cards in the deck
  if (cards.length === 0) {
    return <p>No cards in this deck.</p>;
  }

  const card = cards[currentIndex]; // Current card being viewed

  return (
    <div class="card-viewer">
      {isEditingCard ? (
        // Card editing form
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
        // Card display with flip animation
        <div class={`card ${isFlipped ? 'is-flipped' : ''}`}>
          <div class="card-inner">
            {/* Front face of the card */}
            <div class="card-face card-front">
              <p>{card.front}</p>
            </div>
            {/* Back face of the card */}
            <div class="card-face card-back">
              <p>{card.back}</p>
              {/* Display image if available */}
              {card.imageUrl && (
                <div class="card-image">
                  <img src={card.imageUrl} alt="Card Image" />
                </div>
              )}
              {/* Display audio player if available */}
              {card.audioUrl && (
                <div class="card-audio">
                  <audio controls>
                    <source src={card.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {!isEditingCard && (
        <>
          {/* Card action buttons */}
          <div class="card-actions">
            <button onClick={handleFlip} class="flip-button">
              {isFlipped ? 'Show Question' : 'Show Answer'}
            </button>
          </div>
          <div class="card-viewer-bottom">
            {/* Edit card button */}
            <IconButton onClick={handleEditCard} class="edit-button">
              <EditIcon />
            </IconButton>
            {/* Delete card button */}
            <IconButton onClick={handleDeleteCard} class="delete-button">
              <DeleteIcon />
            </IconButton>
            {/* Next card button */}
            <IconButton onClick={handleNext} class="next-button">
              <SkipNextIcon />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
};
