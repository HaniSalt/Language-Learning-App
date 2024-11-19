import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import './headerStyles.less';

interface HeaderProps {
  page: string;
  setPage: (page: string) => void;
}

export const Header: FunctionalComponent<HeaderProps> = ({ page, setPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (newPage: string) => {
    setPage(newPage);
    setMenuOpen(false);
  };

  return (
    <header class="header">
      <div class="logo">
        <img src="/assets/logo.png" alt="App Logo" />
      </div>
      <nav class={`nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <button
              class={page === 'home' ? 'active' : ''}
              onClick={() => handleNavigation('home')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              class={page === 'decks' ? 'active' : ''}
              onClick={() => handleNavigation('decks')}
            >
              Decks
            </button>
          </li>
          <li>
            <button
              class={page === 'analytics' ? 'active' : ''}
              onClick={() => handleNavigation('analytics')}
            >
              Analytics
            </button>
          </li>
          <li>
            <button
              class={page === 'settings' ? 'active' : ''}
              onClick={() => handleNavigation('settings')}
            >
              Settings
            </button>
          </li>
        </ul>
      </nav>
      <button class="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        &#9776;
      </button>
    </header>
  );
};
