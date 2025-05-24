import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { CardViewer } from '../Card/CardViewer';
import { CardEditor } from '../Card/CardEditor';
import { updateDeckApi, deleteDeckApi } from '../../utils/deckApi';
import type { Deck} from '../../types';
import './deckDetailStyles.less';
import MuiButton from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface DeckDetailProps {
  initialDeck: Deck;
  userId: string;
  onBack: () => void;
  onDecksChanged: () => void;
}

export const DeckDetail: FunctionalComponent<DeckDetailProps> = ({
  initialDeck,
  userId,
  onBack,
  onDecksChanged,
}) => {
  const [deck, setDeck] = useState<Deck>(initialDeck);
  const [showOptions, setShowOptions] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingDeckName, setIsEditingDeckName] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');

  useEffect(() => {
    setDeck(initialDeck);
    setNewDeckName(initialDeck.name);
  }, [initialDeck]);

  const toggleOptions = () => setShowOptions(!showOptions);

  const handleDeleteDeck = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this deck?');
    if (confirmDelete) {
      try {
        await deleteDeckApi(deck.id, userId);
        onDecksChanged();
        onBack();
      } catch (error: any) {
        console.error('Failed to delete deck:', error);
        alert(`Error deleting deck: ${error.message || 'Please try again.'}`);
      }
    }
  };

  const handleAddNewCard = () => {
    setIsAddingCard(true);
    setShowOptions(false);
  };

  const handleCardAddedOrUpdated = (updatedDeckFromChild: Deck) => {
    setDeck(updatedDeckFromChild);
    setIsAddingCard(false);
    onDecksChanged();
  };

  const handleEditDeckName = () => {
    setNewDeckName(deck.name);
    setIsEditingDeckName(true);
    setShowOptions(false);
  };

  const handleSaveDeckName = async (e: Event) => {
    e.preventDefault();
    if (newDeckName.trim() && newDeckName.trim() !== deck.name) {
      try {
        const updatedDeckPayload: Partial<Omit<Deck, 'id' | 'userId' | 'cards'>> = { name: newDeckName.trim() };
        const updatedDeckFromApi = await updateDeckApi(deck.id, userId, updatedDeckPayload);
        setDeck(updatedDeckFromApi);
        onDecksChanged();
        setIsEditingDeckName(false);
      } catch (error: any) {
        console.error('Failed to update deck name:', error);
        alert(`Error updating deck name: ${error.message || 'Please try again.'}`);
      }
    } else {
      setIsEditingDeckName(false);
    }
  };

  const handleDeckUpdatedByCardViewer = (updatedDeckFromChild: Deck) => {
    setDeck(updatedDeckFromChild);
    onDecksChanged();
  };

  return (
    <div class="deck-detail">
      <div class="deck-top-bar">
        <div class="deck-title">{isEditingDeckName ? 'Editing Deck Name' : deck.name}</div>
        <div class="deck-exit">
          <MuiButton onClick={onBack} size="small">Exit</MuiButton>
        </div>
      </div>

      <div class="card-viewer-container">
        {isAddingCard ? (
          <CardEditor
            deckId={deck.id}
            userId={userId}
            onCardAdded={handleCardAddedOrUpdated}
            onCancel={() => setIsAddingCard(false)}
          />
        ) : isEditingDeckName ? (
          <div class="edit-deck-name">
            <form class="edit-deck-name-form" onSubmit={handleSaveDeckName}>
              <TextField
                label="Deck Name"
                value={newDeckName}
                onChange={(e: any) => setNewDeckName(e.target.value)}
                variant="outlined"
                fullWidth
                autoFocus
              />
              <div class="edit-deck-name-actions">
                <MuiButton type="submit" variant="contained" color="primary">
                  Save
                </MuiButton>
                <MuiButton
                  variant="outlined"
                  onClick={() => setIsEditingDeckName(false)}
                >
                  Cancel
                </MuiButton>
              </div>
            </form>
          </div>
        ) : (
          <CardViewer
            deck={deck}
            userId={userId}
            onDeckUpdated={handleDeckUpdatedByCardViewer}
          />
        )}
      </div>

      {!isAddingCard && !isEditingDeckName && (
        <div class="deck-bottom-bar">
          <div class="deck-actions">
            <MuiButton onClick={toggleOptions} className="options-button" size="small">
              Deck Options {showOptions ? '▲' : '▼'}
            </MuiButton>
            {showOptions && (
              <div class="options-dropdown">
                <MuiButton onClick={handleAddNewCard} fullWidth>Add New Card</MuiButton>
                <MuiButton onClick={handleEditDeckName} fullWidth>Edit Deck Name</MuiButton>
                <MuiButton onClick={handleDeleteDeck} fullWidth color="secondary">Delete Deck</MuiButton>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};