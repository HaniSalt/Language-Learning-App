import { FunctionalComponent, h } from 'preact';
import { Deck } from '../utils/storage';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';

interface DeckItemProps {
  deck: Deck;
  onSelect: (id: number) => void;
}

export const DeckItem: FunctionalComponent<DeckItemProps> = ({ deck, onSelect }) => {
  return (
    <Card>
      <CardActionArea onClick={() => onSelect(deck.id)}>
        <CardContent>
          <Typography variant="h5" component="div">
            {deck.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
