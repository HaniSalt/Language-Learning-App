import { FunctionalComponent } from 'preact';
import { useState, useEffect, useMemo } from 'preact/hooks'; // Added useMemo
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client'; // Added loggerLink (optional)
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
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from './firebase/firebase';
import './styles/globalStyles.less';

const App: FunctionalComponent = () => {
  const [page, setPage] = useState('home');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null); // MongoDB IDs are typically strings
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Renamed for clarity
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null); // Store user object

  // Memoize QueryClient to prevent re-creation on every render
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        // Configure other defaults as needed
      },
    },
  }), []);

  // Memoize and manage tRPC client, recreate if auth token changes
  const trpcClient = useMemo(() => {
    return trpc.createClient({
      links: [
        // Optional: Logger link for development, shows tRPC requests in console
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: process.env.PREACT_APP_TRPC_URL || 'http://localhost:3001/trpc', // Use env variable
          async headers() {
            const headers: Record<string, string> = {};
            if (firebaseUser) {
              try {
                const token = await getIdToken(firebaseUser);
                headers['Authorization'] = `Bearer ${token}`;
              } catch (error) {
                console.error('Failed to get Firebase ID token:', error);
                // Handle error, maybe sign out user or clear token
              }
            }
            return headers;
          },
        }),
      ],
    });
  }, [firebaseUser]); // Recreate client if firebaseUser changes (e.g., token might be new)


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user); // Store the whole user object
      setIsLoggedIn(!!user);
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const navigateTo = (newPage: string) => {
    setPage(newPage);
    if (newPage !== 'decks' && newPage !== 'deck-detail') { // Ensure DeckDetail also doesn't reset
      setSelectedDeckId(null);
    }
  };

  const handleSelectDeck = (deckId: string) => {
    setSelectedDeckId(deckId);
    setPage('deck-detail'); // Navigate to deck detail page
  };

  const renderPage = () => {
    if (isLoadingAuth) {
      return <div className="loading">Authenticating...</div>;
    }
    switch (page) {
      case 'home':
        return <Home />;
      case 'decks':
        return <DeckList onSelectDeck={handleSelectDeck} />; // Pass handler
      case 'deck-detail':
        if (selectedDeckId) {
          return (
            <DeckDetail
              deckId={selectedDeckId}
              onBack={() => {
                setSelectedDeckId(null);
                setPage('decks'); // Go back to deck list
              }}
            />
          );
        }
        navigateTo('decks'); // If no selectedDeckId, go back to list
        return null;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <Settings />;
      case 'register':
        if (isLoggedIn) {
          navigateTo('home');
          return null; // Avoid rendering Register if navigating away
        }
        return <Register setPage={navigateTo} setIsLoggedIn={setIsLoggedIn} />;
      case 'profile':
        if (!isLoggedIn) {
          navigateTo('register');
          return null; // Avoid rendering Profile if navigating away
        }
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
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