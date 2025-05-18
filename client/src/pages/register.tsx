import { FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
import { docreateUserWithEmailAndPassword, doSignInWithEmailAndPassword } from '../firebase/auth';
import './register.less';
import { getAuth } from 'firebase/auth';
import axios from 'axios'; 

interface RegisterProps {
  setPage: (page: string) => void;
  // Add setIsLoggedIn prop
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Register: FunctionalComponent<RegisterProps> = ({ setPage, setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // --- Validation ---
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

    await docreateUserWithEmailAndPassword(email, password);
const user = getAuth().currentUser;

if (user) {
  const userData = {
    userName: user.displayName || email, // use email if displayName is null
    userId: user.uid,
    dateOfCreation: new Date().toISOString()
  };

  try {
    await axios.post('http://localhost:3001/post', userData);
    console.log('User data posted to MongoDB');
  } catch (err) {
    console.error('Error posting user data:', err);
  }
    setIsLoggedIn(true);
    setPage('home');
  }

    // --- Firebase Interaction ---
    try {
      if (isLogin) {
        await doSignInWithEmailAndPassword(email, password);
        console.log('Login successful for:', email);
        // Update login state and navigate
        setIsLoggedIn(true);
        setPage('home');
      } else {
        await docreateUserWithEmailAndPassword(email, password);
        console.log('Registration successful for:', email);
        // Update login state and navigate
        setIsLoggedIn(true);
        setPage('home');
      }
    } catch (err: any) {
      console.error("Authentication Error:", err);
      switch (err.code) {
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
          setError(`Authentication failed: ${err.message || 'An unknown error occurred.'}`);
      }
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