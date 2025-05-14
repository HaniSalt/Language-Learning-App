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
import { onAuthStateChanged, User } from 'firebase/auth'; // Updated import for User type
import { auth } from './firebase/firebase';
import './styles/globalStyles.less';

// The root component of the application
const App: FunctionalComponent = () => {
  const [page, setPage] = useState('home'); // Initial page
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Store current user (optional)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Loading state for auth check

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsLoggedIn(true);
        setCurrentUser(user);
        // If user is logged in and on the register page, redirect to home or profile
        if (page === 'register') {
          setPage('home'); // Or 'profile'
        }
      } else {
        // User is signed out
        setIsLoggedIn(false);
        setCurrentUser(null);
        // If user is signed out, and was on a page that requires login, redirect to register
        const protectedPages = ['decks', 'analytics', 'settings', 'profile'];
        if (protectedPages.includes(page)) {
          setPage('register');
        } else if (page === 'profile') { // Specifically handle if on profile page when logged out
            setPage('register');
        }
      }
      setIsLoadingAuth(false); // Finished checking auth state
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [page]); // Add page to dependencies to re-evaluate redirects if page changes externally

  // Manages global state and renders the appropriate page
  const renderPage = () => {
    if (isLoadingAuth) {
      return <div>Loading application...</div>; // Or a more sophisticated loading component
    }

    switch (page) {
      case 'home':
        return <Home />;
      case 'decks':
        if (!isLoggedIn) {
          setPage('register'); // Redirect to register
          // Return Register here for immediate render or null/loading while redirect happens
          return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
        }
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
        if (!isLoggedIn) {
          setPage('register');
          return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
        }
        return <AnalyticsDashboard />;
      case 'settings':
        if (!isLoggedIn) {
          setPage('register');
          return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
        }
        return <Settings />;
      case 'register':
        // If user is already logged in, don't show register page, redirect to home/profile
        if (isLoggedIn) {
          setPage('home'); // Or 'profile'
          return <Home />; // Or <Profile />
        }
        return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
      case 'profile':
        if (!isLoggedIn) {
          setPage('register');
          return <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
        }
        // Pass currentUser if Profile component needs it, though it can also get it from auth.currentUser
        return <Profile /* currentUser={currentUser} */ />;
      default:
        // Fallback to home or register depending on login state
        setPage(isLoggedIn ? 'home' : 'register');
        return isLoggedIn ? <Home /> : <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
    }
  };

  // Handles page navigation, including auth-related redirects
  const handleSetPage = (newPage: string) => {
    // If trying to go to 'register' while logged in, redirect to 'profile' or 'home'
    if (newPage === 'register' && isLoggedIn) {
      setPage('profile'); // Or 'home'
    } else {
      setPage(newPage);
    }
    setSelectedDeckId(null); // Reset selected deck when changing pages
  };

  return (
    <div class="app-container">
      <Header
        page={page}
        setPage={handleSetPage} // Use the new handler for navigation
        isLoggedIn={isLoggedIn} // Pass the login status to the Header
      />
      <div class="content-container">{renderPage()}</div>
      <Footer />
    </div>
  );
};

export default App;