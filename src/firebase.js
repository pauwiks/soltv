// firebase.js (shared config)
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrF5m9nM83Fza4AUqwPdk1_PhKb3lez3A",
  authDomain: "soltv-f789d.firebaseapp.com",
  projectId: "soltv-f789d",
  storageBucket: "soltv-f789d.appspot.com",
  messagingSenderId: "744268830742",
  appId: "1:744268830742:web:1f23fe7a9fa085047f3d37"
};

// Only initialize if no app is already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
