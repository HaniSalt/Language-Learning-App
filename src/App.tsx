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
import { auth } from './firebase/firebase'; // Your firebase auth instance
import './styles/globalStyles.less';

// tRPC and React Query imports
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Assuming your services/trpc/index.ts is correctly set up for Preact
// For Preact, ensure createTRPCReact is used correctly, or if you need a specific Preact adapter for react-query.
// The provided `createTRPCReact` should generally work.
import { trpc, createTrpcClient } from './services/trpc/index'; // Adjust path as per your project structure

const App: FunctionalComponent = () => {
  const [page, setPage] = useState('home');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null); // Deck IDs from your backend are strings
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be derived from currentUser

  // Memoize QueryClient instance
  const queryClient = useMemo(() => new QueryClient(), []);

  // Memoize tRPC client instance. It will be recreated if the currentUser changes.
  const trpcClient = useMemo(() => {
    // This function will be called by tRPC's httpBatchLink to get the auth token
    const getAuthToken = async (): Promise<string | null> => {
      if (auth.currentUser) { // Use your actual Firebase auth instance
        try {
          return await auth.currentUser.getIdToken(true); // Force refresh the token if near expiry
        } catch (error) {
          console.error("Error getting ID token:", error);
          // Potentially handle token refresh errors, e.g., by signing the user out
          return null;
        }
      }
      return null;
    };
    return createTrpcClient(getAuthToken);
  }, [currentUser]); // Dependency on currentUser ensures client is updated on auth state change

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => { // Use your actual Firebase auth instance
      setCurrentUser(user);
      setIsLoggedIn(!!user); // Update isLoggedIn based on user presence
      setIsLoadingAuth(false);

      if (user) {
        // User is logged in
        if (page === 'register') {
          setPage('home'); // Redirect from register to home if logged in
        }
      } else {
        // User is logged out
        const protectedPages = ['decks', 'analytics', 'settings', 'profile'];
        if (protectedPages.includes(page)) {
          setPage('register'); // Redirect to register if on a protected page
        }
        // The condition `else if (page === 'profile')` was redundant as 'profile' is in protectedPages
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [page]); // Add `page` to dependencies to re-evaluate redirects if page changes externally

  const renderPage = () => {
    if (isLoadingAuth) {
      return <div>Loading application...</div>;
    }

    switch (page) {
      case 'home':
        return <Home />;
      case 'decks':
        if (!isLoggedIn) {
          // It's better to setPage and let the effect handle the redirect,
          // or return the component directly if that's the desired UX.
          // For simplicity here, if not logged in, we can directly render Register or let useEffect handle it.
          // To avoid rendering anything briefly before redirect:
          // setPage('register'); // This would trigger a re-render
          return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />; // Or let useEffect handle it by returning null
        }
        if (selectedDeckId !== null) {
          return (
            <DeckDetail
              deckId={selectedDeckId}
              onBack={() => setSelectedDeckId(null)}
            />
          );
        } else {
          // DeckList can now use tRPC hooks like trpc.cards.getMyDecksAndCards.useQuery()
          return <DeckList setSelectedDeckId={setSelectedDeckId} />;
        }
      case 'analytics':
        if (!isLoggedIn) {
          // setPage('register');
          return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
        }
        return <AnalyticsDashboard />;
      case 'settings':
        if (!isLoggedIn) {
          // setPage('register');
          return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
        }
        return <Settings />;
      case 'register':
        if (isLoggedIn) {
          // setPage('home');
          return <Home />; // If already logged in, show home instead of register
        }
        return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
      case 'profile':
        if (!isLoggedIn) {
          // setPage('register');
          return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
        }
        // Profile component can use tRPC hooks for user-specific data
        return <Profile />;
      default:
        // Fallback: if page state is unknown, redirect based on login status
        setPage(isLoggedIn ? 'home' : 'register');
        // Return null or a loading indicator while the state updates and re-renders
        return isLoggedIn ? <Home /> : <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
    }
  };

  const handleSetPage = (newPage: string) => {
    if (newPage === 'register' && isLoggedIn) {
      setPage('profile'); // If logged in and trying to go to register, go to profile instead
    } else {
      setPage(newPage);
    }
    setSelectedDeckId(null); // Reset selected deck when changing main pages
  };

  return (
    // Provide the tRPC client and QueryClient to the component tree
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div class="app-container">
          <Header
            page={page}
            setPage={handleSetPage}
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