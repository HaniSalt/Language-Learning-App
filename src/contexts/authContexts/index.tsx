import React, { useEffect } from "preact/compat";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext({});

export function useAuth (){
    return React.useContext(AuthContext);
} 
export function AuthProvider({children}){
    const [currentUser, setCurrentUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [userLoggedIn, setUserLoggedIn] = React.useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser)
        return unsubscribe
    }, []);

    async function initializeUser(user) {
        if (user) {
            setUserLoggedIn(true);
            setCurrentUser({...user});
        } else {
            setUserLoggedIn(false);
            setCurrentUser(null);
        }
        setLoading(false);
    }
    const value={
        currentUser,
        userLoggedIn,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}