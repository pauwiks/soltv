// uploadMovies.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { movies } from "./movies.js";

// ✅ Your Firebase config (Sol.tv)
const firebaseConfig = {
  apiKey: "AIzaSyDrF5m9nM83Fza4AUqwPdk1_PhKb3lez3A",
  authDomain: "soltv-f789d.firebaseapp.com",
  projectId: "soltv-f789d",
  storageBucket: "soltv-f789d.appspot.com",
  messagingSenderId: "744268830742",
  appId: "1:744268830742:web:1f23fe7a9fa085047f3d37"
};

// 🔧 Init Firebase + Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📼 Bulk upload
async function uploadMovies() {
  for (const movie of movies) {
    try {
      await addDoc(collection(db, "movies"), {
        ...movie,
        year: parseInt(movie.year),
        addedBy: "script",
        timestamp: serverTimestamp()
      });
      console.log("✅ Uploaded:", movie.title);
    } catch (error) {
      console.error("❌ Failed to upload:", movie.title, error);
    }
  }
}

uploadMovies();
