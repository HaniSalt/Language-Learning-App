import { FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import './settingsStyles.less';

export const Settings: FunctionalComponent = () => {
  // State to manage the current font size, initialized to 16px
  const [fontSize, setFontSize] = useState(16);
  // State to manage whether dark theme is enabled
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Loads settings from localStorage when the component mounts
  useEffect(() => {
    const storedFontSize = localStorage.getItem('appFontSize');
    const storedTheme = localStorage.getItem('appTheme');

    if (storedFontSize) {
      setFontSize(parseInt(storedFontSize, 10)); // Sets the font size from storage
      document.body.style.setProperty('--app-font-size', `${storedFontSize}px`); // Applies the font size
    } else {
      localStorage.setItem('appFontSize', '16'); // Sets default font size in storage
    }

    if (storedTheme === 'dark') {
      setIsDarkTheme(true); // Enables dark theme
      document.body.classList.add('dark-theme'); // Applies dark theme class to body
    } else {
      localStorage.setItem('appTheme', 'light'); // Sets default theme in storage
    }
  }, []);

  // Handles changes to the font size input
  const handleFontSizeChange = (e: any) => {
    const newSize = parseInt(e.target.value, 10); // Parses the new font size
    setFontSize(newSize); // Updates the font size state
    localStorage.setItem('appFontSize', newSize.toString()); // Saves the new font size to storage
    document.body.style.setProperty('--app-font-size', `${newSize}px`); // Applies the new font size
  };

  // Toggles between light and dark themes
  const handleThemeToggle = () => {
    const newTheme = isDarkTheme ? 'light' : 'dark'; // Determines the new theme
    setIsDarkTheme(!isDarkTheme); // Updates the theme state
    localStorage.setItem('appTheme', newTheme); // Saves the new theme to storage
    document.body.classList.toggle('dark-theme'); // Toggles the dark theme class on body
  };

  return (
    <div class="settings">
      {/* Settings section title */}
      <h2>Settings</h2>
      {/* Font size adjustment input */}
      <label>
        Font Size:
        <input
          type="number"
          min="12"
          max="32"
          value={fontSize} // Binds the input value to the fontSize state
          onInput={handleFontSizeChange} // Updates the fontSize state on input
        />
      </label>
      {/* Theme toggle switch */}
      <label class="theme-toggle">
        Dark Theme:
        <input
          type="checkbox"
          checked={isDarkTheme} // Binds the checkbox to the isDarkTheme state
          onChange={handleThemeToggle} // Toggles the theme on change
        />
      </label>
    </div>
  );
};
