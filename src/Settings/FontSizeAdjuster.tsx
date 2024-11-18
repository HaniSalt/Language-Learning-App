import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

export const FontSizeAdjuster: FunctionalComponent = () => {
  const [fontSize, setFontSize] = useState(16);

  const increaseFont = () => {
    const newSize = fontSize + 1;
    setFontSize(newSize);
    document.body.style.fontSize = `${newSize}px`;
  };

  const decreaseFont = () => {
    const newSize = fontSize - 1;
    setFontSize(newSize);
    document.body.style.fontSize = `${newSize}px`;
  };

  return (
    <div>
      <label>
        Font Size:
        <button onClick={decreaseFont}>-</button>
        <span>{fontSize}px</span>
        <button onClick={increaseFont}>+</button>
      </label>
    </div>
  );
};