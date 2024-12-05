import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

export const FontSizeAdjuster: FunctionalComponent = () => {
  // State to manage the current font size, initialized to 16px
  const [fontSize, setFontSize] = useState(16);

  // Increases the font size by 1px and updates the document's body style
  const increaseFont = () => {
    const newSize = fontSize + 1;
    setFontSize(newSize);
    document.body.style.fontSize = `${newSize}px`;
  };

  // Decreases the font size by 1px and updates the document's body style
  const decreaseFont = () => {
    const newSize = fontSize - 1;
    setFontSize(newSize);
    document.body.style.fontSize = `${newSize}px`;
  };

  return (
    <div>
      {/* Label for font size adjustment */}
      <label>
        Font Size:
        {/* Button to decrease the font size */}
        <button onClick={decreaseFont}>-</button>
        {/* Displays the current font size */}
        <span>{fontSize}px</span>
        {/* Button to increase the font size */}
        <button onClick={increaseFont}>+</button>
      </label>
    </div>
  );
};
