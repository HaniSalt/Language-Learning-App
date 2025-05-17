import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDkjgnMudgHHZc4HjltF9BzelehZ5aBkus",
  authDomain: "onallolabor-5c76f.firebaseapp.com",
  projectId: "onallolabor-5c76f",
  storageBucket: "onallolabor-5c76f.firebasestorage.app",
  messagingSenderId: "334404445801",
  appId: "1:334404445801:web:c540bd06f74c04124024f8",
  measurementId: "G-NJNZ4WLX22"
};

// Firebase inicializálása
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

// Figyeli a felhasználó autentikációs állapotának változását
onAuthStateChanged(auth, async (user: User | null) => {
  if (user) {
    // Felhasználó bejelentkezve
    console.log("User is signed in:", user);
    const userId: string = user.uid;
    await updateUserDataMongo(userId); // Küldd el az ID-t a backendnek
  } else {
    // Felhasználó kijelentkezve
    console.log("User is signed out");
    // Itt kezelheted a kijelentkezési logikát, ha szükséges
    // pl. törölhetsz session adatokat a backendről, ha releváns
  }
});

async function updateUserDataMongo(userId: string): Promise<void> {
  try {
    // A szerver API végpontjának URL-je
    // Győződj meg róla, hogy ez a helyes cím és port
    const response = await fetch('http://localhost:5000/api/save-user', { // Vagy a deployed szervered címe
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId }),
    });

    if (!response.ok) {
      // Kezeld a hibás válaszokat a szervertől
      const errorData = await response.json();
      throw new Error(errorData.message || `Server responded with ${response.status}`);
    }

    const result = await response.json();
    console.log('Successfully sent user ID to MongoDB:', result.message);
  } catch (error) {
    console.error('Error sending user ID to MongoDB:', error);
    // Itt érdemes lehet a felhasználónak is visszajelzést adni a hibáról
  }
}

export { auth };
