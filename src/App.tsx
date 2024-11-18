import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { Header } from './UI/Header';
import { Footer } from './UI/Footer';
import { Home } from './UI/Home';
import { DeckList } from './Deck/DeckList';
import { AnalyticsDashboard } from './Settings/AnalyticsDashboard';
import { Settings } from './Settings/Settings';

const App: FunctionalComponent = () => {
  const [page, setPage] = useState('home');

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home />;
      case 'decks':
        return <DeckList />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <div>
      <Header setPage={setPage} />
      {renderPage()}
      <Footer />
    </div>
  );
};

export default App;