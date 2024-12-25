import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { getDecks, Deck } from '../utils/storage';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import './analyticsDashboardStyles.less';

export const AnalyticsDashboard: FunctionalComponent = () => {
  // State to hold the list of all decks
  const [decks, setDecks] = useState<Deck[]>([]);

  // Fetches all decks from storage when the component mounts
  useEffect(() => {
    setDecks(getDecks());
  }, []);

  // Calculates the total number of cards across all decks
  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);

  return (
    <Container className="analytics-dashboard">
      {/* Dashboard title */}
      <Typography variant="h4" component="h2" gutterBottom>
        Analytics Dashboard
      </Typography>
      {/* Displays the total number of decks */}
      <Typography variant="body1">Total Decks: {decks.length}</Typography>
      {/* Displays the total number of cards */}
      <Typography variant="body1">Total Cards: {totalCards}</Typography>
      {/* Lists each deck with its corresponding number of cards */}
      <List>
        {decks.map(deck => (
          <ListItem key={deck.id}>
            <ListItemText
              primary={deck.name} // Deck name
              secondary={`Cards: ${deck.cards.length}`} // Number of cards in the deck
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};
