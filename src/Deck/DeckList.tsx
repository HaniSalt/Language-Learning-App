import { FunctionalComponent } from 'preact';
import { DeckItem } from './DeckItem';
import { getDecks, Deck, createDeck } from '../utils/storage';
import { useState, useEffect } from 'preact/hooks';
import { Container, Typography, Grid, Button } from '@mui/material';
import { ImportExport } from './ImportExport';
import './deckListStyles.less';

interface DeckListProps {
  setSelectedDeckId: (id: number) => void;
}

export const DeckList: FunctionalComponent<DeckListProps> = ({ setSelectedDeckId }) => {
  // Holds the list of decks
  const [decks, setDecks] = useState<Deck[]>([]);

  // Loads decks from storage on mount
  useEffect(() => {
    setDecks(getDecks());
  }, []);

  // Adds a new deck
  const handleAddDeck = () => {
    const deckName = prompt('Enter deck name:');
    if (deckName) {
      const newDeck = createDeck(deckName);
      setDecks([...decks, newDeck]);
    }
  };

  // Consists of multiple parts:
  // Page title and add deck button 
  // Import/Export functionality
  // Finally grid of deck items
  return (
    <Container className="deck-list">
      <Typography variant="h4" component="h2" gutterBottom>
        Your Decks
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddDeck} style={{ marginBottom: '20px' }}>
        Add New Deck
      </Button>
      <Grid container spacing={2}>
        {decks.map(deck => (
          <Grid item xs={12} sm={6} md={4} key={deck.id}>
            <DeckItem deck={deck} onSelect={setSelectedDeckId} />
          </Grid>
        ))}
      </Grid>
      <ImportExport />
    </Container>
  );
};
