import { FunctionalComponent } from 'preact';
// import { Deck } from '../../utils/storage'; // Old import
import type { Deck } from '../../types'; // Corrected import for Deck type
import { Card as MuiCard, CardActionArea, CardContent, Typography } from '@mui/material'; // Renamed to avoid conflict

interface DeckItemProps {
  deck: Deck;
  onSelect: (id: number) => void;
}

export const DeckItem: FunctionalComponent<DeckItemProps> = ({ deck, onSelect }) => {
  return (
    <MuiCard> {/* Changed from Card to MuiCard to avoid conflict with your Deck's Card type */}
      <CardActionArea onClick={() => onSelect(deck.id)}>
        <CardContent>
          <Typography variant="h5" component="div">
            {deck.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </MuiCard>
  );
};