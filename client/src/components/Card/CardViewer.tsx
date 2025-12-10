import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Deck, Card } from "../../utils/deckApi";
import { updateCard, deleteCard } from "../../utils/cardApi";
import './cardViewerStyles.less';
import { IconButton, Button as MuiButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export interface CardViewerProps {
  deck: Deck;
  userId: string;
  onDeckUpdated: () => void;
}

export const CardViewer: FunctionalComponent<CardViewerProps> = ({ deck, userId, onDeckUpdated }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [editFrontText, setEditFrontText] = useState('');
  const [editBackText, setEditBackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to reset view when deck or cards change externally
  useEffect(() => {
    if (deck.cards && deck.cards.length > 0) {
      setCurrentIndex(prevIndex => (prevIndex >= deck.cards.length ? 0 : prevIndex));
      setIsFlipped(false);
      setIsEditingCard(false);
      if (deck.cards[currentIndex]) {
         setEditFrontText(deck.cards[currentIndex].front);
         setEditBackText(deck.cards[currentIndex].back);
      }
    } else {
        setCurrentIndex(0);
    }
  }, [deck, deck.cards, currentIndex]);

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

    setIsSubmitting(true);
    try {
      console.log('Updating card:', currentCard.id);
      
      // Use the new cardApi to update the card
      await updateCard(currentCard.id, {
        front: editFrontText.trim(),
        back: editBackText.trim(),
      });

      // Trigger parent to refresh deck data - just call without arguments
      onDeckUpdated();
      setIsEditingCard(false);
      setIsFlipped(false);
      
    } catch (error) {
      console.error('Failed to save card:', error);
      alert(`Error saving card: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!currentCard) return;
    const confirmDelete = confirm('Are you sure you want to delete this card?');
    if (!confirmDelete) return;

    setIsSubmitting(true);
    try {
      console.log('Deleting card:', currentCard.id);
      
      // Use the new cardApi to delete the card
      await deleteCard(currentCard.id);

      // Adjust current index if needed
      if (deck.cards.length <= 1) {
        setCurrentIndex(0);
      } else if (currentIndex >= deck.cards.length - 1) {
        setCurrentIndex(deck.cards.length - 2);
      }

      // Trigger parent to refresh deck data - just call without arguments
      onDeckUpdated();
      setIsFlipped(false);
      setIsEditingCard(false);
      
    } catch (error) {
      console.error('Failed to delete card:', error);
      alert(`Error deleting card: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
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
            variant="outlined" 
            fullWidth 
            margin="normal"
            disabled={isSubmitting}
          />
          <TextField
            label="Back"
            value={editBackText}
            onChange={(e: any) => setEditBackText(e.target.value)}
            variant="outlined" 
            fullWidth 
            margin="normal"
            disabled={isSubmitting}
          />
          <div class="card-editor-actions">
            <MuiButton 
              onClick={handleSaveCard} 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </MuiButton>
            <MuiButton 
              onClick={() => setIsEditingCard(false)} 
              variant="outlined"
              disabled={isSubmitting}
            >
              Cancel
            </MuiButton>
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
            <MuiButton onClick={handleFlip} variant="contained" fullWidth disabled={isSubmitting}>
              {isFlipped ? 'Show Question' : 'Show Answer'}
            </MuiButton>
          </div>
          <div class="card-viewer-bottom">
            <IconButton onClick={handleEditCard} title="Edit Card" disabled={isSubmitting}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDeleteCard} title="Delete Card" disabled={isSubmitting}>
              <DeleteIcon />
            </IconButton>
            {deck.cards.length > 1 && (
                <IconButton onClick={handleNext} title="Next Card" disabled={isSubmitting}>
                  <SkipNextIcon />
                </IconButton>
            )}
          </div>
        </>
      )}
    </div>
  );
};