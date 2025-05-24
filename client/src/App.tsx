import { FunctionalComponent, JSX } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { Header } from './components/UI/Header';
import { Footer } from './components/UI/Footer';
import { Home } from './pages/Home';
import { DeckList } from './components/Deck/DeckList';
import { DeckDetail } from './components/Deck/DeckDetail';
import { AnalyticsDashboard } from './components/Settings/AnalyticsDashboard';
import { Settings } from './components/Settings/Settings';
import Register from './pages/register';
import Profile from './pages/profile';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase/firebase';
import './styles/globalStyles.less';
import { getDecksForUser } from './utils/deckApi';
import type { Deck } from './types';
import { ImportExport } from './components/Deck/ImportExport';

const App: FunctionalComponent = () => {
  const [page, setPage] = useState('home');
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDecks, setUserDecks] = useState<Deck[]>([]);

  const fetchUserDecks = useCallback(async (user: FirebaseUser | null) => {
    if (user) {
      try {
        const decks = await getDecksForUser(user.uid);
        setUserDecks(decks);
      } catch (error) {
        console.error("Failed to fetch user decks (App.tsx):", error);
        setUserDecks([]);
      }
    } else {
      setUserDecks([]);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsLoggedIn(!!user);
      fetchUserDecks(user);
      setIsLoadingAuth(false);

      if (user) {
        if (page === 'register' || page === '') {
          setPage('home');
        }
      } else {
        const protectedPages = ['decks', 'analytics', 'settings', 'profile', 'importexportpage'];
        if (protectedPages.includes(page)) {
          setPage('register');
        }
      }
    });
    return () => unsubscribe();
  }, [page, fetchUserDecks]);

  const handleSetPage = (newPage: string) => {
    if (newPage === 'register' && isLoggedIn) {
      setPage('profile');
    } else {
      setPage(newPage);
    }
    setSelectedDeckId(null);
  };

  const renderPage = () => {
    if (isLoadingAuth) {
      return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>Loading application...</div>;
    }

    const ensureLoggedIn = (component: JSX.Element, _targetPage?: string): JSX.Element => {
      if (!isLoggedIn) {
        if (page !== 'register') {
        }
        return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} setUserDecks={setUserDecks} />;
      }
      return component;
    };

    switch (page) {
      case 'home':
        return <Home />;
      case 'decks':
        const selectedDeck = userDecks.find(d => d.id === selectedDeckId);
        return ensureLoggedIn(
          selectedDeckId !== null && selectedDeck ? (
            <DeckDetail
              initialDeck={selectedDeck}
              userId={currentUser?.uid || ''}
              onBack={() => setSelectedDeckId(null)}
              onDecksChanged={() => fetchUserDecks(currentUser)}
            />
          ) : (
            <DeckList
              decks={userDecks}
              setSelectedDeckId={setSelectedDeckId}
              currentUserId={currentUser?.uid || ''}
              onDecksChanged={() => fetchUserDecks(currentUser)}
            />
          ), 'decks'
        );
      case 'importexportpage':
        return ensureLoggedIn(
          <ImportExport
            userId={currentUser?.uid || ''}
            onDecksChanged={() => fetchUserDecks(currentUser)}
          />,
          'importexportpage'
        );
      case 'analytics':
        return ensureLoggedIn(
          <AnalyticsDashboard decks={userDecks} />,
          'analytics'
        );
      case 'settings':
        return ensureLoggedIn(
          <Settings />,
          'settings'
        );
      case 'register':
        if (isLoggedIn) {
          return <Home />;
        }
        return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} setUserDecks={setUserDecks} />;
      case 'profile':
        return ensureLoggedIn(
          <Profile currentUser={currentUser} />,
          'profile'
        );
      default:
        return <div style={{ textAlign: 'center', padding: '50px' }}>Redirecting...</div>;
    }
  };

  return (
    <div id="app">
      <Header page={page} setPage={handleSetPage} isLoggedIn={isLoggedIn} />
      <main>{renderPage()}</main>
      <Footer />
    </div>
  );
};

export default App;
