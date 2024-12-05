import { FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

export const ThemeToggle: FunctionalComponent = () => {
  // State to manage the current theme, initialized from localStorage or default to 'light'
  const [theme, setTheme] = useState(
    localStorage.getItem('appTheme') || 'light'
  );

  // Applies the current theme by setting a data attribute and saving to localStorage
  useEffect(() => {
    document.body.setAttribute('data-theme', theme); // Sets the theme attribute on the body
    localStorage.setItem('appTheme', theme); // Saves the current theme to storage
  }, [theme]);

  // Toggles the theme between 'light' and 'dark'
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'; // Determines the new theme
    setTheme(newTheme); // Updates the theme state
  };

  return (
    <div>
      {/* Button to switch themes */}
      <label>
        Theme:
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </label>
    </div>
  );
};
