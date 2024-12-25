import { FunctionalComponent} from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { CardViewer } from '../Card/CardViewer';
import { CardEditor } from '../Card/CardEditor';
import { getDeckById, deleteDeck, updateDeck, Deck } from '../utils/storage';
import './deckDetailStyles.less';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface DeckDetailProps {
  deckId: number; // ID of the deck to display
  onBack: () => void; // Callback to navigate back to the previous page
}

export const DeckDetail: FunctionalComponent<DeckDetailProps> = ({ deckId, onBack }) => {
  // Holds the current deck object
  const [deck, setDeck] = useState<Deck | undefined>(undefined);
  // Controls the visibility of the deck options dropdown
  const [showOptions, setShowOptions] = useState(false);
  // Determines if the CardEditor component should be displayed for adding a new card
  const [isAddingCard, setIsAddingCard] = useState(false);
  // Determines if the deck name is being edited
  const [isEditingDeckName, setIsEditingDeckName] = useState(false);
  // Stores the new name of the deck during editing
  const [newDeckName, setNewDeckName] = useState('');

  // Fetches the deck data when the component mounts or when deckId changes
  useEffect(() => {
    const fetchedDeck = getDeckById(deckId);
    setDeck(fetchedDeck);
    if (fetchedDeck) {
      setNewDeckName(fetchedDeck.name); // Initialize the deck name for editing
    }
  }, [deckId]);

  // Renders a message if the deck is not found
  if (!deck) {
    return (
      <div class="deck-detail">
        <p>Deck not found.</p>
        <button onClick={onBack}>Exit</button>
      </div>
    );
  }

  // Toggles the visibility of the deck options dropdown
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  // Handles the deletion of the current deck after user confirmation
  const handleDeleteDeck = () => {
    const confirmDelete = confirm('Are you sure you want to delete this deck?');
    if (confirmDelete) {
      deleteDeck(deck.id);
      onBack(); // Navigate back after deletion
    }
  };

  // Initiates the process of adding a new card
  const handleAddNewCard = () => {
    setIsAddingCard(true);
    setShowOptions(false); // Hide options dropdown when adding a card
  };

  // Updates the deck state after a new card is added
  const handleCardAdded = (updatedDeck: Deck) => {
    setDeck(updatedDeck);
    setIsAddingCard(false); // Hide the CardEditor after adding
  };

  // Initiates the process of editing the deck name
  const handleEditDeckName = () => {
    setIsEditingDeckName(true);
    setShowOptions(false); // Hide options dropdown when editing
  };

  // Saves the new deck name and updates the deck state
  const handleSaveDeckName = (e: Event) => {
    e.preventDefault(); // Prevents form submission from reloading the page
    if (deck) {
      const updatedDeck = { ...deck, name: newDeckName };
      updateDeck(updatedDeck);
      setDeck(updatedDeck);
      setIsEditingDeckName(false); // Exit editing mode
    }
  };

  return (
    <div class="deck-detail">
      {/* Top bar displaying the deck name and exit button */}
      <div class="deck-top-bar">
        <div class="deck-title">{deck.name}</div>
        <div class="deck-exit">
          <button onClick={onBack}>Exit</button>
        </div>
      </div>

      {/* Container for either the CardViewer or CardEditor component */}
      <div class="card-viewer-container">
        {isAddingCard ? (
          // Displays the CardEditor component to add a new card
          <CardEditor
            deckId={deck.id}
            onCardAdded={handleCardAdded}
            onCancel={() => setIsAddingCard(false)}
          />
        ) : isEditingDeckName ? (
          // Displays the form to edit the deck name
          <div class="edit-deck-name">
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
          </div>
        ) : (
          // Displays the CardViewer component to view cards in the deck
          <CardViewer deck={deck} onDeckUpdated={setDeck} />
        )}

        {/* Conditional rendering of the deck name editing form */}
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

      {/* Bottom bar with deck options, hidden when adding or editing */}
      {!isAddingCard && !isEditingDeckName && (
        <div class="deck-bottom-bar">
          <div class="deck-actions">
            <button onClick={toggleOptions} class="options-button">
              Deck Options ▼
            </button>
            {/* Dropdown menu for deck options */}
            {showOptions && (
              <div class="options-dropdown">
                <button onClick={handleAddNewCard}>Add New Card</button>
                <button onClick={handleEditDeckName}>Edit Deck Name</button>
                <button onClick={handleDeleteDeck}>Delete Deck</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
