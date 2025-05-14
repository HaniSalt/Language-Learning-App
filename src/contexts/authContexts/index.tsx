import React, { useEffect, useState, useContext, createContext } from "preact/compat";
import { auth } from "../../firebase/firebase";
import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export interface AuthContextType {
  currentUser: FirebaseUser | null;
  userLoggedIn: boolean;
  loading: boolean;
  getAuthToken: () => Promise<string | null>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user: FirebaseUser | null) {
    if (user) {
      setUserLoggedIn(true);
      setCurrentUser(user);
    } else {
      setUserLoggedIn(false);
      setCurrentUser(null);
    }
    setLoading(false);
  }

  const getAuthToken = async (): Promise<string | null> => {
    if (auth.currentUser) {
      try {
        return await auth.currentUser.getIdToken();
      } catch (error) {
        console.error("Error getting auth token:", error);
        return null;
      }
    }
    return null;
  };
  
  const value: AuthContextType = {
    currentUser,
    userLoggedIn,
    loading,
    getAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}