import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDkjgnMudgHHZc4HjltF9BzelehZ5aBkus",
  authDomain: "onallolabor-5c76f.firebaseapp.com",
  projectId: "onallolabor-5c76f",
  storageBucket: "onallolabor-5c76f.firebasestorage.app",
  messagingSenderId: "334404445801",
  appId: "1:334404445801:web:c540bd06f74c04124024f8",
  measurementId: "G-NJNZ4WLX22"
};
function updateUserDataMongo(user) {
  const username= user.displayName;
  const dateOfCreation = user.dateOfCreation;
  const userId = user.uid;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const user = auth.currentUser;
export { app, auth };