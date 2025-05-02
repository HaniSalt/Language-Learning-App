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
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase'; // Adjust this import to match your Firebase setup
import './styles/globalStyles.less';

//The root component of the application
const App: FunctionalComponent = () => {
  const [page, setPage] = useState('home');
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsLoading(false);
      console.log('Auth state changed:', !!user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Navigation function to pass to components
  const navigateTo = (newPage: string) => {
    console.log('Navigating to page:', newPage);
    setPage(newPage);
    if (newPage !== 'decks') {
      setSelectedDeckId(null); // Reset selected deck when changing to non-deck pages
    }
  };

  // Using a simple switch case structure it 
  // manages global state and renders the appropriate page based on the current state.
  // Now includes authenticated routing for the profile page
  const renderPage = () => {
    // Display loading state while checking authentication
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
        // If already logged in, redirect to home
        if (isLoggedIn) {
          navigateTo('home');
          return <Home />;
        }
        return <Register setPage={navigateTo} setIsLoggedIn={setIsLoggedIn} />;
      case 'profile':
        // If not logged in, redirect to register
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
    <div class="app-container">
      <Header
        page={page}
        setPage={navigateTo} // Use the same navigation function for Header
        isLoggedIn={isLoggedIn} // Pass isLoggedIn state to Header
      />
      <div class="content-container">{renderPage()}</div>
      <Footer />
    </div>
  );
};

export default App;