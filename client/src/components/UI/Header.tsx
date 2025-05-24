import { FunctionalComponent} from 'preact';
import { useState } from 'preact/hooks';
import './headerStyles.less';

interface HeaderProps {
  page: string;
  setPage: (page: string) => void;
  isLoggedIn?: boolean;
}

export const Header: FunctionalComponent<HeaderProps> = ({ page, setPage, isLoggedIn = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (newPage: string) => {
    setPage(newPage);
    setMenuOpen(false);
  };

  return (
    <header class="header">
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
      <div class="auth-buttons">
        {isLoggedIn ? (
          <button
            class={`profile-btn ${page === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavigation('profile')}
          >
            Profile
          </button>
        ) : (
          <button
            class={`register-btn ${page === 'register' ? 'active' : ''}`}
            onClick={() => handleNavigation('register')}
          >
            Login / Register
          </button>
        )}
      </div>
      <button class="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        &#9776;
      </button>
    </header>
  );
};