import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { CardItem } from './CardItem';

export const CardViewer: FunctionalComponent = () => {
  const cards = [
    { id: 1, front: 'Hola', back: 'Hello' },
    { id: 2, front: 'Adiós', back: 'Goodbye' },
  ];

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
