import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './services/trpc/trpc';
import { Header } from './components/UI/Header';
import { Footer } from './components/UI/Footer';
import { Home } from './pages/Home';
import { DeckList } from './components/Deck/DeckList';
import { DeckDetail } from './components/Deck/DeckDetail';
import { AnalyticsDashboard } from './components/Settings/AnalyticsDashboard';
import { Settings } from './components/Settings/Settings';
import Register from './pages/register';
import Profile from './pages/profile';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import './styles/globalStyles.less';

const queryClient = new QueryClient();

const App: FunctionalComponent = () => {
  const [page, setPage] = useState('home');
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const navigateTo = (newPage: string) => {
    setPage(newPage);
    if (newPage !== 'decks') {
      setSelectedDeckId(null);
    }
  };

  const renderPage = () => {
    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }
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
      case 'register':
        if (isLoggedIn) {
          navigateTo('home');
          return <Home />;
        }
        return <Register setPage={navigateTo} setIsLoggedIn={setIsLoggedIn} />;
      case 'profile':
        if (!isLoggedIn) {
          navigateTo('register');
          return <Register setPage={navigateTo} setIsLoggedIn={setIsLoggedIn} />;
        }
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <trpc.Provider client={trpc} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div class="app-container">
          <Header
            page={page}
            setPage={navigateTo}
            isLoggedIn={isLoggedIn}
          />
          <div class="content-container">{renderPage()}</div>
          <Footer />
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;