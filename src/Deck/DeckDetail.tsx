// DeckDetail.tsx

import { FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { CardViewer } from '../Card/CardViewer';
import { CardEditor } from '../Card/CardEditor';
import { getDeckById, deleteDeck, updateDeck, Deck } from '../utils/storage';
import './deckDetailStyles.less';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface DeckDetailProps {
  deckId: number;
  onBack: () => void;
}

export const DeckDetail: FunctionalComponent<DeckDetailProps> = ({ deckId, onBack }) => {
  const [deck, setDeck] = useState<Deck | undefined>(undefined);
  const [showOptions, setShowOptions] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingDeckName, setIsEditingDeckName] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');

  useEffect(() => {
    const fetchedDeck = getDeckById(deckId);
    setDeck(fetchedDeck);
    if (fetchedDeck) {
      setNewDeckName(fetchedDeck.name);
    }
  }, [deckId]);

  if (!deck) {
    return (
      <div class="deck-detail">
        <p>Deck not found.</p>
        <button onClick={onBack}>Exit</button>
      </div>
    );
  }

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleDeleteDeck = () => {
    const confirmDelete = confirm('Are you sure you want to delete this deck?');
    if (confirmDelete) {
      deleteDeck(deck.id);
      onBack();
    }
  };

  const handleAddNewCard = () => {
    setIsAddingCard(true);
    setShowOptions(false);
  };

  const handleCardAdded = (updatedDeck: Deck) => {
    setDeck(updatedDeck);
    setIsAddingCard(false);
  };

  const handleEditDeckName = () => {
    setIsEditingDeckName(true);
    setShowOptions(false);
  };

  const handleSaveDeckName = () => {
    if (deck) {
      const updatedDeck = { ...deck, name: newDeckName };
      updateDeck(updatedDeck);
      setDeck(updatedDeck);
      setIsEditingDeckName(false);
    }
  };

  return (
    <div class="deck-detail">
      <div class="deck-top-bar">
        <div class="deck-title">{deck.name}</div>
        <div class="deck-exit">
          <button onClick={onBack}>Exit</button>
        </div>
      </div>
      <div class="card-viewer-container">
        {isAddingCard ? (
          <CardEditor deckId={deck.id} onCardAdded={handleCardAdded} />
        ) : isEditingDeckName ? (
          <div class="edit-deck-name">
            <input
              type="text"
              value={newDeckName}
              onInput={(e: any) => setNewDeckName(e.target.value)}
            />
            <div class="edit-deck-name-actions">
              <button onClick={handleSaveDeckName}>Save</button>
              <button onClick={() => setIsEditingDeckName(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <CardViewer deck={deck} onDeckUpdated={setDeck} />
        )}

        {isEditingDeckName && (
          <form class="edit-deck-name-form" onSubmit={handleSaveDeckName}>
            <TextField
              label="Deck Name"
              value={newDeckName}
              onChange={(e: any) => setNewDeckName(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <div class="edit-deck-name-actions">
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsEditingDeckName(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
      <div class="deck-bottom-bar">
        <div class="deck-actions">
          <button onClick={toggleOptions} class="options-button">
            Deck Options ▼
          </button>
          {showOptions && (
            <div class="options-dropdown">
              <button onClick={handleAddNewCard}>Add New Card</button>
              <button onClick={handleEditDeckName}>Edit Deck Name</button>
              <button onClick={handleDeleteDeck}>Delete Deck</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
