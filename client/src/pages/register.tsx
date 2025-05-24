import { FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
import { docreateUserWithEmailAndPassword, doSignInWithEmailAndPassword } from '../firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';
import './register.less';
// Remove axios if no longer needed elsewhere: import axios from 'axios';
import { getDecksForUser, registerUserWithBackend } from '../utils/deckApi'; // Import registerUserWithBackend
import type { Deck } from '../types'; // Import Deck type

interface RegisterProps {
  setPage: (page: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserDecks: (decks: Deck[]) => void;
}

const Register: FunctionalComponent<RegisterProps> = ({ setPage, setIsLoggedIn, setUserDecks }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccessfulAuth = async (firebaseUser: FirebaseUser) => {
    try {
      const decks = await getDecksForUser(firebaseUser.uid);
      setUserDecks(decks);
      setIsLoggedIn(true);
      setPage('home');
    } catch (err) {
      console.error('Error fetching decks after auth:', err);
      setError('Could not load your decks. Please try again.');
      // Potentially sign out if critical data load fails
      // await auth.signOut();
      // setIsLoggedIn(false);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      setIsSubmitting(false);
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isLogin) {
        const userCredential = await doSignInWithEmailAndPassword(email, password);
        if (userCredential.user) {
          await handleSuccessfulAuth(userCredential.user);
        } else {
          setError('Login failed: Could not retrieve user details.');
        }
      } else { // Registration
        const userCredential = await docreateUserWithEmailAndPassword(email, password);
        const firebaseUser = userCredential.user;

        if (firebaseUser) {
          const userDataForBackend = {
            userName: firebaseUser.displayName || email.split('@')[0], // Get a sensible default username
            userId: firebaseUser.uid,
            dateOfCreation: firebaseUser.metadata.creationTime || new Date().toISOString(),
          };
          try {
            // **Use tRPC mutation here**
            await registerUserWithBackend(userDataForBackend);
            console.log('User data posted to backend via tRPC, default decks created.');
            await handleSuccessfulAuth(firebaseUser); // Fetch decks (including default ones)
          } catch (backendError: any) {
            console.error('Error during backend user registration or fetching initial decks:', backendError);
            // Decide on UX:
            // 1. Inform user backend setup failed, ask to retry login (which might trigger it again if designed so)
            // 2. Or, sign out from Firebase if backend part is critical
            setError(`Registration complete, but failed to setup account data: ${backendError.message || 'Please try logging in.'}`);
            // Optionally, sign out from Firebase if backend registration is critical
            // await auth.signOut(); // You'd need to import 'auth' from firebase config
            // setIsLoggedIn(false); // Reflect this state change
          }
        } else {
          setError('Registration failed: Could not retrieve user details from Firebase.');
        }
      }
    } catch (authError: any) {
      console.error("Authentication Error:", authError);
      // ... (your existing error handling for authError.code)
      switch (authError.code) {
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
          setError('Login failed: Invalid email or password.');
          break;
        case 'auth/wrong-password':
          setError('Login failed: Incorrect password.');
          break;
        case 'auth/email-already-in-use':
          setError('Registration failed: This email is already registered.');
          break;
        case 'auth/weak-password':
          setError('Registration failed: Password should be at least 6 characters.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        default:
          setError(`Authentication failed: ${authError.message || 'An unknown error occurred.'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = (newIsLogin: boolean) => {
    setIsLogin(newIsLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setIsSubmitting(false);
  };

  return (
    // Your JSX remains the same
    <div class="auth-container">
      <div class="auth-form-container">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <div class="toggle-form">
          <button
            class={isLogin ? 'active' : ''}
            onClick={() => toggleMode(true)}
            disabled={isSubmitting}
          >
            Login
          </button>
          <button
            class={!isLogin ? 'active' : ''}
            onClick={() => toggleMode(false)}
            disabled={isSubmitting}
          >
            Register
          </button>
        </div>
        {error && <div class="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
              required
              disabled={isSubmitting}
              placeholder="your.email@example.com"
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
              required
              disabled={isSubmitting}
              placeholder="******"
            />
          </div>
          {!isLogin && (
            <div class="form-group">
              <label for="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onInput={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
                required
                disabled={isSubmitting}
                placeholder="******"
              />
            </div>
          )}
          <button type="submit" class="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;