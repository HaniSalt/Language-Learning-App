import { FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

export const ThemeToggle: FunctionalComponent = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem('appTheme') || 'light'
  );

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
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
