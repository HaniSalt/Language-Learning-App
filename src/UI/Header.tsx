import { FunctionalComponent, h } from 'preact';

interface HeaderProps {
  setPage: (page: string) => void;
}

export const Header: FunctionalComponent<HeaderProps> = ({ setPage }) => {
  return (
    <header>
      <nav>
        <ul>
          <li><button onClick={() => setPage('home')}>Home</button></li>
          <li><button onClick={() => setPage('decks')}>Decks</button></li>
          <li><button onClick={() => setPage('analytics')}>Analytics</button></li>
          <li><button onClick={() => setPage('settings')}>Settings</button></li>
        </ul>
      </nav>
    </header>
  );
};
