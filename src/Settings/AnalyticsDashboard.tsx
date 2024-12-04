import { FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { getDecks, Deck } from '../utils/storage';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import './analyticsDashboardStyles.less';

export const AnalyticsDashboard: FunctionalComponent = () => {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    setDecks(getDecks());
  }, []);

  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);

  return (
    <Container className="analytics-dashboard">
      <Typography variant="h4" component="h2" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Typography variant="body1">Total Decks: {decks.length}</Typography>
      <Typography variant="body1">Total Cards: {totalCards}</Typography>
      <List>
        {decks.map(deck => (
          <ListItem key={deck.id}>
            <ListItemText
              primary={deck.name}
              secondary={`Cards: ${deck.cards.length}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};
