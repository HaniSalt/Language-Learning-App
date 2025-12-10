import { FunctionalComponent } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { Header } from './components/UI/Header';
import { Footer } from './components/UI/Footer';
import { Home } from './pages/Home';
import { DeckList } from './components/Deck/DeckList';
import { DeckDetail } from './components/Deck/DeckDetail';
import { AnalyticsDashboard, AnalyticsDashboardProps } from './components/Settings/AnalyticsDashboard'; 
import { Settings } from './components/Settings/Settings';
import Register from './pages/register';
import Profile, { ProfileProps } from './pages/profile';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase/firebase';
import './styles/globalStyles.less';
import { getDecksForUser, Deck } from './utils/deckApi';
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
        console.log('Fetching decks for user:', user.uid);
        const decks = await getDecksForUser(user.uid);
        console.log('Fetched decks:', decks);
        setUserDecks(decks);
      } catch (error) {
        console.error("Failed to fetch user decks:", error);
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
      await fetchUserDecks(user);
      setIsLoadingAuth(false);

      if (user) {
        if (page === 'register' || page === '') setPage('home');
      } else {
        const protectedPages = ['decks', 'analytics', 'settings', 'profile', 'importexportpage'];
        if (protectedPages.includes(page)) setPage('register');
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

  // Refresh the selected deck after card operations
  const handleDeckUpdate = useCallback(async () => {
    console.log('handleDeckUpdate called');
    await fetchUserDecks(currentUser);
  }, [currentUser, fetchUserDecks]);
  
  const renderPage = () => {
    if (isLoadingAuth) return <div>Loading application...</div>;

    const ensureLoggedIn = (component: JSX.Element, _targetPage?: string): JSX.Element => {
      if (!isLoggedIn) {
        if (page !== 'register') setTimeout(() => setPage('register'), 0);
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
              onDecksChanged={handleDeckUpdate}
            />
          ) : (
            <DeckList
              decks={userDecks}
              setSelectedDeckId={setSelectedDeckId}
              currentUserId={currentUser?.uid || ''}
              onDecksChanged={handleDeckUpdate}
            />
          ), 'decks'
        );
      case 'importexportpage':
        return ensureLoggedIn(
          <ImportExport onDecksChanged={handleDeckUpdate} />,
          'importexportpage'
        );
      case 'analytics':
        return ensureLoggedIn(
          <AnalyticsDashboard decks={userDecks} />,
          'analytics'
        );
      case 'settings':
        return ensureLoggedIn(<Settings />, 'settings');
      case 'register':
        if (isLoggedIn) {
          setTimeout(() => setPage('home'), 0);
          return <Home />;
        }
        return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} setUserDecks={setUserDecks} />;
      case 'profile':
        return ensureLoggedIn(<Profile currentUser={currentUser} />, 'profile');
      default:
        setTimeout(() => setPage(isLoggedIn ? 'home' : 'register'), 0);
        return <div>Redirecting...</div>;
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