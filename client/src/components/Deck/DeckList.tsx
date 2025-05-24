import { FunctionalComponent } from 'preact';
import { DeckItem } from './DeckItem';
import type { Deck } from '../../types';
import { createNewDeck } from '../../utils/deckApi';
import { Container, Typography, Grid, Button as MuiButton } from '@mui/material';
import { ImportExport } from './ImportExport';
import './deckListStyles.less';

interface DeckListProps {
  decks: Deck[];
  setSelectedDeckId: (id: number) => void;
  currentUserId: string;
  onDecksChanged: () => void;
}

export const DeckList: FunctionalComponent<DeckListProps> = ({
  decks,
  setSelectedDeckId,
  currentUserId,
  onDecksChanged,
}) => {
  const handleAddDeck = async () => {
    const deckName = prompt('Enter deck name:');
    if (deckName && currentUserId) {
      try {
        await createNewDeck(deckName, currentUserId);
        onDecksChanged();
      } catch (error) {
        console.error('Failed to add deck:', error);
        const errorMessage = error instanceof Error ? error.message : 'Please try again.';
        alert(`Error adding deck: ${errorMessage}`);
      }
    } else if (!currentUserId) {
      alert('You must be logged in to add a deck.');
    }
  };

  return (
    <Container className="deck-list" sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Your Decks
      </Typography>
      <Grid container justifyContent="center" sx={{ mb: 3 }}>
        <MuiButton
          variant="contained"
          color="primary"
          onClick={handleAddDeck}
          disabled={!currentUserId}
        >
          Add New Deck
        </MuiButton>
      </Grid>

      {!currentUserId && (
        <Typography variant="subtitle1" align="center" sx={{ my: 2 }}>
          Please log in to see or create decks.
        </Typography>
      )}

      {currentUserId && decks.length === 0 && (
        <Typography variant="subtitle1" align="center" sx={{ my: 2 }}>
          No decks found. Click "Add New Deck" to create one!
        </Typography>
      )}

      {currentUserId && decks.length > 0 && (
        <Grid container spacing={3}>
          {decks.map(deck => (
            // @ts-ignore
            <Grid item xs={12} sm={6} md={4} key={deck.id}>
              <DeckItem
                deck={deck}
                onSelect={() => setSelectedDeckId(deck.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {currentUserId && (
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <ImportExport
            userId={currentUserId}
            onDecksChanged={onDecksChanged}
          />
        </Grid>
      )}
    </Container>
  );
};