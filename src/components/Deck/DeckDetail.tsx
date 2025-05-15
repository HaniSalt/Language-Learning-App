import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { CardViewer } from '../Card/CardViewer';
import { CardEditor } from '../Card/CardEditor';
import './deckDetailStyles.less';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { trpc } from '../../services/trpc/index';
import type { Deck } from '../../utils/storage';

interface DeckDetailProps {
  deckId: string;
  onBack: () => void;
}

export const DeckDetail: FunctionalComponent<DeckDetailProps> = ({ deckId, onBack }) => {
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingDeckName, setIsEditingDeckName] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');

  // tRPC query to fetch the deck by its ID
  const { data: fetchedDeck, isLoading: isLoadingDeck, error: deckError, refetch: refetchDeck } =
    trpc.cards.getDeckById.useQuery(
      { deckId },
      {
        enabled: !!deckId, // Only run query if deckId is available
        onSuccess: (data) => {
          if (data) {
            setCurrentDeck(data as Deck); // Ensure 'data' conforms to your 'Deck' type
            setNewDeckName(data.name);
          } else {
            setCurrentDeck(null); // Deck not found
          }
        },
        onError: () => {
            setCurrentDeck(null); // Handle error by setting deck to null
        }
      }
    );

  // tRPC mutation for deleting a deck
  const deleteDeckMutation = trpc.cards.deleteDeck.useMutation({ // ASSUMING you add 'deleteDeck' to cardRouter
    onSuccess: () => {
      onBack(); // Navigate back after successful deletion
    },
    onError: (err) => {
        alert(`Failed to delete deck: ${err.message}`);
    }
  });

  // tRPC mutation for updating deck name (you'll need to create this in cardRouter)
  const updateDeckNameMutation = trpc.cards.updateDeckName.useMutation({ // ASSUMING 'updateDeckName' in cardRouter
    onSuccess: (updatedDeck) => {
      setCurrentDeck(updatedDeck as Deck);
      setIsEditingDeckName(false);
      refetchDeck(); // Or manually update currentDeck state
    },
    onError: (err) => {
        alert(`Failed to update deck name: ${err.message}`);
    }
  });


  useEffect(() => {
    // If using tRPC, direct fetching in useEffect is handled by useQuery
    // However, if deckId changes, useQuery will refetch if enabled
    if (fetchedDeck) {
        setCurrentDeck(fetchedDeck as Deck);
        setNewDeckName(fetchedDeck.name);
    }
  }, [fetchedDeck]);


  if (isLoadingDeck) {
    return (
      <div class="deck-detail">
        <p>Loading deck...</p>
        <button onClick={onBack}>Exit</button>
      </div>
    );
  }

  if (deckError) {
    return (
      <div class="deck-detail">
        <p>Error loading deck: {deckError.message}</p>
        <button onClick={onBack}>Exit</button>
      </div>
    );
  }

  if (!currentDeck) {
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
    if (confirmDelete && currentDeck) {
      deleteDeckMutation.mutate({ deckId: String(currentDeck.id) });
    }
  };

  const handleAddNewCard = () => {
    setIsAddingCard(true);
    setShowOptions(false);
  };

  // This function is called by CardEditor after a card is successfully added
  const handleCardAdded = () => {
    setIsAddingCard(false);
    refetchDeck(); // Refetch the deck to show the new card
  };

  const handleEditDeckName = () => {
    setIsEditingDeckName(true);
    setNewDeckName(currentDeck.name); // Initialize with current name
    setShowOptions(false);
  };

  const handleSaveDeckName = (e: Event) => {
    e.preventDefault();
    if (currentDeck && newDeckName.trim() !== '') {
      updateDeckNameMutation.mutate({ deckId: String(currentDeck.id), name: newDeckName.trim() });
    }
  };

  return (
    <div class="deck-detail">
      <div class="deck-top-bar">
        <div class="deck-title">{currentDeck.name}</div>
        <div class="deck-exit">
          <button onClick={onBack}>Exit</button>
        </div>
      </div>

      <div class="card-viewer-container">
        {isAddingCard ? (
          <CardEditor
            deckId={currentDeck.id} // Pass string ID
            onCardAdded={handleCardAdded} // Modified to refetch
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
                disabled={updateDeckNameMutation.isLoading}
              />
              <div class="edit-deck-name-actions">
                <Button type="submit" variant="contained" color="primary" disabled={updateDeckNameMutation.isLoading}>
                  {updateDeckNameMutation.isLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditingDeckName(false)}
                  disabled={updateDeckNameMutation.isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          currentDeck && <CardViewer deck={currentDeck} onDeckUpdated={() => refetchDeck()} />
        )}
      </div>

      {!isAddingCard && !isEditingDeckName && (
        <div class="deck-bottom-bar">
          <div class="deck-actions">
            <button onClick={toggleOptions} class="options-button">
              Deck Options ▼
            </button>
            {showOptions && (
              <div class="options-dropdown">
                <button onClick={handleAddNewCard}>Add New Card</button>
                <button onClick={handleEditDeckName}>Edit Deck Name</button>
                <button onClick={handleDeleteDeck} disabled={deleteDeckMutation.isLoading}>
                    {deleteDeckMutation.isLoading ? 'Deleting...' : 'Delete Deck'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};