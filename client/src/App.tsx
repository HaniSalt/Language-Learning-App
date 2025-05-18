import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Header } from './components/UI/Header';
import { Footer } from './components/UI/Footer';
import { Home } from './pages/Home';
import { DeckList } from './components/Deck/DeckList';
import { DeckDetail } from './components/Deck/DeckDetail';
import { AnalyticsDashboard } from './components/Settings/AnalyticsDashboard';
import { Settings } from './components/Settings/Settings';
import Register from './pages/register';
import Profile from './pages/profile';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase/firebase';
import './styles/globalStyles.less';

const App: FunctionalComponent = () => {
  const [page, setPage] = useState('home');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoggedIn(!!user);
      setIsLoadingAuth(false);

      if (user) {
        if (page === 'register' || page === '') {
          setPage('home');
        }
      } else {
        const protectedPages = ['decks', 'analytics', 'settings', 'profile'];
        if (protectedPages.includes(page)) {
          setPage('register');
        }
      }
    });
    return () => unsubscribe();
  }, [page]);

  const renderPage = () => {
    if (isLoadingAuth) {
      return <div>Loading application...</div>;
    }

    const ensureLoggedIn = (component: JSX.Element): JSX.Element => {
      if (!isLoggedIn) {
        if (page !== 'register') {
          setPage('register');
        }
        return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
      }
      return component;
    };

    switch (page) {
      case 'home':
        return <Home />;
      case 'decks':
        return ensureLoggedIn(
          selectedDeckId !== null ? (
            <DeckDetail
              deckId={selectedDeckId}
              onBack={() => setSelectedDeckId(null)}
            />
          ) : (
            <DeckList setSelectedDeckId={setSelectedDeckId} />
          )
        );
      case 'analytics':
        return ensureLoggedIn(<AnalyticsDashboard />);
      case 'settings':
        return ensureLoggedIn(<Settings />);
      case 'register':
        if (isLoggedIn) {
          setTimeout(() => setPage('home'), 0);
          return <Home />;
        }
        return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
      case 'profile':
        return ensureLoggedIn(<Profile />);
      default:
        setTimeout(() => setPage(isLoggedIn ? 'home' : 'register'), 0);
        return <div>Redirecting...</div>;
    }
  };

  const handleSetPage = (newPage: string) => {
    if (newPage === 'register' && isLoggedIn) {
      setPage('profile');
    } else {
      setPage(newPage);
    }
    setSelectedDeckId(null);
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