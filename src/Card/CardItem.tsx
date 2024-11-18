import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

interface CardItemProps {
  card: {
    id: number;
    front: string;
    back: string;
  };
}

export const CardItem: FunctionalComponent<CardItemProps> = ({ card }) => {
  const [showBack, setShowBack] = useState(false);

  const handleFlip = () => {
    setShowBack(!showBack);
  };

  return (
    <div onClick={handleFlip}>
      {showBack ? <p>{card.back}</p> : <p>{card.front}</p>}
    </div>
  );
};
