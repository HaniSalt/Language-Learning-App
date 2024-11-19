// CardViewer.tsx
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { CardItem } from './CardItem';

interface CardViewerProps {
  cards: Array<{
    id: number;
    front: string;
    back: string;
  }>;
}

export const CardViewer: FunctionalComponent<CardViewerProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % cards.length);
  };

  return (
    <div>
      <CardItem card={cards[currentIndex]} />
      <button onClick={handleNext}>Next Card</button>
    </div>
  );
};
