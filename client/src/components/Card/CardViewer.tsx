import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Deck, Card, updateDeckApi } from "../../utils/deckApi";
import './cardViewerStyles.less';
import { IconButton, Button as MuiButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export interface CardViewerProps {
  deck: Deck;
  userId: string;
  onDeckUpdated: (updatedDeck: Deck) => void;
}

export const CardViewer: FunctionalComponent<CardViewerProps> = ({ deck, userId, onDeckUpdated }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [editFrontText, setEditFrontText] = useState('');
  const [editBackText, setEditBackText] = useState('');

  // Effect to reset view when deck or cards change externally
  useEffect(() => {
    if (deck.cards && deck.cards.length > 0) {
      setCurrentIndex(prevIndex => (prevIndex >= deck.cards.length ? 0 : prevIndex));
      setIsFlipped(false);
      setIsEditingCard(false);
      if (deck.cards[currentIndex]) { // Check if current card exists
         setEditFrontText(deck.cards[currentIndex].front);
         setEditBackText(deck.cards[currentIndex].back);
      }
    } else {
        setCurrentIndex(0); // No cards, reset index
    }
  }, [deck, deck.cards, currentIndex]); // Added currentIndex to reset edit texts

  if (!deck.cards || deck.cards.length === 0) {
    return <p>No cards in this deck. Add one via Deck Options!</p>;
  }

  const currentCard = deck.cards[currentIndex];

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % deck.cards.length);
    setIsFlipped(false);
    setIsEditingCard(false);
  };

  const handleEditCard = () => {
    if (currentCard) {
      setEditFrontText(currentCard.front);
      setEditBackText(currentCard.back);
      setIsEditingCard(true);
    }
  };

  const handleSaveCard = async () => {
    if (!currentCard) return;

    const updatedCardData: Card = {
      ...currentCard,
      front: editFrontText,
      back: editBackText,
    };

    const updatedCardsArray = deck.cards.map(card =>
      card.id === currentCard.id ? updatedCardData : card
    );

    try {
      const updatedDeckFromApi = await updateDeckApi(deck.id, { cards: updatedCardsArray, userId });
      onDeckUpdated(updatedDeckFromApi);
      setIsEditingCard(false);
      setIsFlipped(false); // Show front after saving
    } catch (error) {
      console.error('Failed to save card:', error);
      alert(`Error saving card: ${error.message || 'Please try again.'}`);
    }
  };

  const handleDeleteCard = async () => {
    if (!currentCard) return;
    const confirmDelete = confirm('Are you sure you want to delete this card?');
    if (confirmDelete) {
      const updatedCardsArray = deck.cards.filter(card => card.id !== currentCard.id);
      try {
        const updatedDeckFromApi = await updateDeckApi(deck.id, { cards: updatedCardsArray, userId });
        onDeckUpdated(updatedDeckFromApi);
        if (updatedCardsArray.length === 0) {
            setCurrentIndex(0); // Reset index if no cards left
        } else if (currentIndex >= updatedCardsArray.length) {
            setCurrentIndex(updatedCardsArray.length - 1);
        }
        setIsFlipped(false);
        setIsEditingCard(false);
      } catch (error) {
        console.error('Failed to delete card:', error);
        alert(`Error deleting card: ${error.message || 'Please try again.'}`);
      }
    }
  };


  return (
    <div class="card-viewer">
      {isEditingCard && currentCard ? (
        <div class="card-editor-inline">
          <TextField
            label="Front"
            value={editFrontText}
            onChange={(e: any) => setEditFrontText(e.target.value)}
            variant="outlined" fullWidth margin="normal"
          />
          <TextField
            label="Back"
            value={editBackText}
            onChange={(e: any) => setEditBackText(e.target.value)}
            variant="outlined" fullWidth margin="normal"
          />
          <div class="card-editor-actions">
            <MuiButton onClick={handleSaveCard} variant="contained" color="primary">Save</MuiButton>
            <MuiButton onClick={() => setIsEditingCard(false)} variant="outlined">Cancel</MuiButton>
          </div>
        </div>
      ) : currentCard ? (
        <div class={`card ${isFlipped ? 'is-flipped' : ''}`}>
          <div class="card-inner">
            <div class="card-face card-front"><p>{currentCard.front}</p></div>
            <div class="card-face card-back">
              <p>{currentCard.back}</p>
              {currentCard.imageUrl && <div class="card-image"><img src={currentCard.imageUrl} alt="Card Illustration" /></div>}
              {currentCard.audioUrl && <div class="card-audio"><audio controls src={currentCard.audioUrl}></audio></div>}
            </div>
          </div>
        </div>
      ) : (
         <p>Card not available.</p>
      )}

      {!isEditingCard && currentCard && (
        <>
          <div class="card-actions">
            <MuiButton onClick={handleFlip} variant="contained" fullWidth>
              {isFlipped ? 'Show Question' : 'Show Answer'}
            </MuiButton>
          </div>
          <div class="card-viewer-bottom">
            <IconButton onClick={handleEditCard} title="Edit Card"><EditIcon /></IconButton>
            <IconButton onClick={handleDeleteCard} title="Delete Card"><DeleteIcon /></IconButton>
            {deck.cards.length > 1 && (
                <IconButton onClick={handleNext} title="Next Card"><SkipNextIcon /></IconButton>
            )}
          </div>
        </>
      )}
    </div>
  );
};