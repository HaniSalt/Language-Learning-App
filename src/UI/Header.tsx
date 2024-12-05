import { FunctionalComponent} from 'preact';
import { useState } from 'preact/hooks';
import './headerStyles.less';
import logo from '../assets/logo.png';

interface HeaderProps {
  page: string;
  setPage: (page: string) => void;
}

export const Header: FunctionalComponent<HeaderProps> = ({ page, setPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  // Navigates to a new page and closes the menu
  const handleNavigation = (newPage: string) => {
    setPage(newPage);
    setMenuOpen(false);
  };

  // Load in the logo and handle the navigation between the different pages.
  return (
    <header class="header">
      <div class="logo">
        <img src={logo} alt="App Logo" />
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
