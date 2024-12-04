import { FunctionalComponent, h } from 'preact';
import { DeckItem } from './DeckItem';
import { addDeck, getDecks, Deck } from '../utils/storage';
import { useState, useEffect } from 'preact/hooks';
import { Container, Typography, Grid } from '@mui/material';
import { Button } from '@mui/material';

interface DeckListProps {
  setSelectedDeckId: (id: number) => void;
}

export const DeckList: FunctionalComponent<DeckListProps> = ({ setSelectedDeckId }) => {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    setDecks(getDecks());
  }, []);

  const handleAddDeck = () => {
    const deckName = prompt('Enter deck name:');
    if (deckName) {
      const newDeck = addDeck(deckName);
      setDecks([...decks, newDeck]);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Your Decks
      </Typography>
      <Grid container spacing={2}>
        {decks.map(deck => (
          <Grid item xs={12} sm={6} md={4} key={deck.id}>
            <DeckItem deck={deck} onSelect={setSelectedDeckId} />
          </Grid>
        ))}
        <div class="deck-list">
          <h2>Your Decks</h2>
          <Button variant="contained" color="primary" onClick={handleAddDeck}>
            Add New Deck
          </Button>
          <div class="deck-items">
            {/* ... existing deck items ... */}
          </div>
        </div>
      </Grid>
    </Container>
  );
};
