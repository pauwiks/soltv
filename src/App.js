// ✅ src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { db, auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Watch from "./pages/Watch";
import Admin from "./pages/Admin";
import "./App.css";

const provider = new GoogleAuthProvider();
const ADMIN_EMAIL = "paulosolana@yahoo.com";

function App() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    title: "",
    year: "",
    videoUrl: "",
    thumbnail: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const login = () => signInWithPopup(auth, provider);
  const logout = () => signOut(auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "movies"), {
        ...form,
        year: parseInt(form.year),
        addedBy: user.email,
        timestamp: serverTimestamp(),
      });
      alert("Movie uploaded!");
      setForm({ title: "", year: "", videoUrl: "", thumbnail: "" });
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
  };

  const Home = () => (
    <div style={{ padding: "2rem" }}>
      <h1>Sol.tv</h1>
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logout}>Logout</button>
          {user.email === ADMIN_EMAIL && (
            <form onSubmit={handleUpload} style={{ marginTop: "20px" }}>
              <h3>🎬 Admin Upload</h3>
              <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
              <input name="year" placeholder="Year" value={form.year} onChange={handleChange} required />
              <input name="videoUrl" placeholder="Video URL" value={form.videoUrl} onChange={handleChange} required />
              <input name="thumbnail" placeholder="Thumbnail URL" value={form.thumbnail} onChange={handleChange} />
              <button type="submit">Upload</button>
            </form>
          )}
        </>
      ) : (
        <button onClick={login}>Login with Google</button>
      )}
      <div style={{ marginTop: "30px" }}>
        <Link to="/watch">🎥 Watch Movies</Link> | <Link to="/admin">👑 Admin Page</Link>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch" element={<Watch />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
