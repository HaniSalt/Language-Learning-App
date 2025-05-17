import { FunctionalComponent } from 'preact';
import { useState, useEffect, useMemo } from 'preact/hooks';
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
import './styles/globalStyles.less';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { trpc } from './services/trpc/index';
import superjson from 'superjson';

const App: FunctionalComponent = () => {
  const [page, setPage] = useState('home');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  }), []);

  const trpcClient = useMemo(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: process.env.REACT_APP_TRPC_URL || 'http://localhost:3001/trpc',
        }),
      ],
      transformer: superjson, // <--- ADD THE TRANSFORMER HERE
    }),
    []
  );

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
  }, [page, queryClient]);

  const renderPage = () => {
    if (isLoadingAuth) {
      return <div>Loading application...</div>;
    }

    const ensureLoggedIn = (targetPage: string, component: JSX.Element): JSX.Element => {
      if (!isLoggedIn) {
        if (page !== 'register') {
            setPage('register');
            return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
        }
        return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
      }
      return component;
    };

    switch (page) {
      case 'home':
        return <Home />;
      case 'decks':
        return ensureLoggedIn('decks',
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
        return ensureLoggedIn('analytics', <AnalyticsDashboard />);
      case 'settings':
        return ensureLoggedIn('settings', <Settings />);
      case 'register':
        if (isLoggedIn) {
          setTimeout(() => setPage('home'), 0);
          return <Home />;
        }
        return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
      case 'profile':
        return ensureLoggedIn('profile', <Profile />);
      default:
        setTimeout(() => setPage(isLoggedIn ? 'home' : 'register'), 0);
        return isLoadingAuth ? <div>Loading application...</div> : null;
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
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div id="app">
          <Header page={page} setPage={handleSetPage} isLoggedIn={isLoggedIn} />
          <main>
            {renderPage()}
          </main>
          <Footer />
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;