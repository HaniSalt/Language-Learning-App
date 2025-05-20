import { FunctionalComponent } from 'preact';
import { DeckItem } from './DeckItem';
import { Deck, addDeckApi } from '../../utils/deckApi';
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
        await addDeckApi(deckName, currentUserId);
        onDecksChanged(); // Signal App.tsx to refresh its decks list
      } catch (error) {
        console.error('Failed to add deck:', error);
        alert(`Error adding deck: ${error.message || 'Please try again.'}`);
      }
    } else if (!currentUserId) {
      alert('You must be logged in to add a deck.');
    }
  };

  return (
    <Container className="deck-list">
      <Typography variant="h4" component="h2" gutterBottom>
        Your Decks
      </Typography>
      <MuiButton
        variant="contained"
        color="primary"
        onClick={handleAddDeck}
        style={{ marginBottom: '20px' }}
        disabled={!currentUserId}
      >
        Add New Deck
      </MuiButton>
      <Grid container spacing={2}>
        {decks.length === 0 && !currentUserId && (
          <Grid item xs={12}>
            <Typography>Please log in to see or create decks.</Typography>
          </Grid>
        )}
        {decks.length === 0 && currentUserId && (
          <Grid item xs={12}>
            <Typography>No decks found. Click "Add New Deck" to create one!</Typography>
          </Grid>
        )}
        {decks.map(deck => (
          <Grid item xs={12} sm={6} md={4} key={deck.id}>
            <DeckItem deck={deck} onSelect={setSelectedDeckId} />
          </Grid>
        ))}
      </Grid>
      {currentUserId && <ImportExport onDecksChanged={onDecksChanged} />}
    </Container>
  );
};