import { FunctionalComponent } from 'preact';
import { DeckItem } from './DeckItem';
import { useState, useEffect } from 'preact/hooks';
import { Container, Typography, Grid, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ImportExport } from './ImportExport';
import './deckListStyles.less';
import { trpc } from '../../services/trpc/index'; 
import type { Deck } from '../../utils/storage';

interface DeckListProps {
  setSelectedDeckId: (id: string) => void;
}

export const DeckList: FunctionalComponent<DeckListProps> = ({ setSelectedDeckId }) => {
  const [showAddDeckDialog, setShowAddDeckDialog] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');

  // tRPC query to get all decks for the user
  const { data: decks, isLoading, error, refetch: refetchDecks } =
    trpc.cards.getMyDecksAndCards.useQuery();

  // tRPC mutation to create a new deck
  const createDeckMutation = trpc.cards.createDeck.useMutation({
    onSuccess: () => {
      refetchDecks(); // Refetch the list of decks after creation
      setShowAddDeckDialog(false); // Close dialog
      setNewDeckName(''); // Reset new deck name
    },
    onError: (err) => {
      alert(`Failed to create deck: ${err.message}`); // Basic error handling
    }
  });

  const handleOpenAddDeckDialog = () => {
    setShowAddDeckDialog(true);
  };

  const handleCloseAddDeckDialog = () => {
    setShowAddDeckDialog(false);
    setNewDeckName(''); // Reset
  };

  const handleConfirmAddDeck = () => {
    if (newDeckName.trim()) {
      createDeckMutation.mutate({ name: newDeckName.trim() });
    } else {
      alert("Deck name cannot be empty.");
    }
  };

  if (isLoading) {
    return <Container className="deck-list"><Typography>Loading your decks...</Typography></Container>;
  }

  if (error) {
    return <Container className="deck-list"><Typography>Error loading decks: {error.message}</Typography></Container>;
  }

  return (
    <Container className="deck-list">
      <Typography variant="h4" component="h2" gutterBottom>
        Your Decks
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenAddDeckDialog} style={{ marginBottom: '20px' }}>
        Add New Deck
      </Button>
      <Grid container spacing={2}>
        {decks && decks.length > 0 ? (
          decks.map((deck) => ( // deck is inferred from AppRouter
            <Grid item xs={12} sm={6} md={4} key={deck.id}>
              {/* DeckItem needs to accept a deck object with string ID and an onSelect expecting string */}
              <DeckItem deck={deck as Deck} onSelect={() => setSelectedDeckId(deck.id)} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}><Typography>No decks found. Click "Add New Deck" to get started!</Typography></Grid>
        )}
      </Grid>

      <Dialog open={showAddDeckDialog} onClose={handleCloseAddDeckDialog}>
        <DialogTitle>Add New Deck</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name for your new deck.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Deck Name"
            type="text"
            fullWidth
            variant="standard"
            value={newDeckName}
            onChange={(e) => setNewDeckName((e.target as HTMLInputElement).value)}
            disabled={createDeckMutation.isLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDeckDialog} disabled={createDeckMutation.isLoading}>Cancel</Button>
          <Button onClick={handleConfirmAddDeck} disabled={createDeckMutation.isLoading}>
            {createDeckMutation.isLoading ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};