import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

export const ThemeToggle: FunctionalComponent = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Apply theme to the application
    document.body.setAttribute('data-theme', newTheme);
  };

  return (
    <div>
      <label>
        Theme:
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </label>
    </div>
  );
};
