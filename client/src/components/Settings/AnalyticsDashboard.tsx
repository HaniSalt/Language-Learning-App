import { FunctionalComponent } from 'preact';
import { Deck } from '../../utils/deckApi';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import './analyticsDashboardStyles.less';

export interface AnalyticsDashboardProps {
  decks: Deck[];
}

export const AnalyticsDashboard: FunctionalComponent<AnalyticsDashboardProps> = ({ decks }) => {
  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);

  return (
    <Container className="analytics-dashboard">
      <Typography variant="h4" component="h2" gutterBottom>
        Analytics Dashboard
      </Typography>
      {decks.length > 0 ? (
        <>
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
        </>
      ) : (
        <Typography variant="body1">
          No decks available to display analytics. Create some decks first!
        </Typography>
      )}
    </Container>
  );
};