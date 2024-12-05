import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { Header } from './UI/Header';
import { Footer } from './UI/Footer';
import { Home } from './UI/Home';
import { DeckList } from './Deck/DeckList';
import { DeckDetail } from './Deck/DeckDetail';
import { AnalyticsDashboard } from './Settings/AnalyticsDashboard';
import { Settings } from './Settings/Settings';
import './styles/globalStyles.less';


//The root component of the application
const App: FunctionalComponent = () => {
  const [page, setPage] = useState('home');
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);

  // Using a simple switch case structure it 
  // manages global state and renders the appropriate page based on the current state.
  // There are 4 different pages that we could access, home, decks, analytics and settings
  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home />;
      case 'decks':
        if (selectedDeckId !== null) {
          return (
            <DeckDetail
              deckId={selectedDeckId}
              onBack={() => setSelectedDeckId(null)}
            />
          );
        } else {
          return <DeckList setSelectedDeckId={setSelectedDeckId} />;
        }
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <div class="app-container">
      <Header
        page={page}
        setPage={(newPage) => {
          setPage(newPage);
          setSelectedDeckId(null); // Reset selected deck when changing pages
        }}
      />
      <div class="content-container">{renderPage()}</div>
      <Footer />
    </div>
  );
};

export default App;
