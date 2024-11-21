// src/Settings/Settings.tsx

import { FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import './settingsStyles.less';

export const Settings: FunctionalComponent = () => {
  const [fontSize, setFontSize] = useState(16);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const storedFontSize = localStorage.getItem('appFontSize');
    const storedTheme = localStorage.getItem('appTheme');

    if (storedFontSize) {
      setFontSize(parseInt(storedFontSize, 10));
      document.body.style.setProperty('--app-font-size', `${storedFontSize}px`);
    } else {
      localStorage.setItem('appFontSize', '16');
    }

    if (storedTheme === 'dark') {
      setIsDarkTheme(true);
      document.body.classList.add('dark-theme');
    } else {
      localStorage.setItem('appTheme', 'light');
    }
  }, []);

  const handleFontSizeChange = (e: any) => {
    const newSize = parseInt(e.target.value, 10);
    setFontSize(newSize);
    localStorage.setItem('appFontSize', newSize.toString());
    document.body.style.setProperty('--app-font-size', `${newSize}px`);
  };

  const handleThemeToggle = () => {
    const newTheme = isDarkTheme ? 'light' : 'dark';
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem('appTheme', newTheme);
    document.body.classList.toggle('dark-theme');
  };

  return (
    <div class="settings">
      <h2>Settings</h2>
      <label>
        Font Size:
        <input
          type="number"
          min="12"
          max="32"
          value={fontSize}
          onInput={handleFontSizeChange}
        />
      </label>
      <label class="theme-toggle">
        Dark Theme:
        <input
          type="checkbox"
          checked={isDarkTheme}
          onChange={handleThemeToggle}
        />
      </label>
    </div>
  );
};
