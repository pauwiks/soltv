// Sol.tv MVP - Starter React Frontend with Firebase Auth and Plyr.js

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

// ✅ Firebase config for Sol.tv
const firebaseConfig = {
  apiKey: "AIzaSyDrF5m9nM83Fza4AUqwPdk1_PhKb3lez3A",
  authDomain: "soltv-f789d.firebaseapp.com",
  projectId: "soltv-f789d",
  storageBucket: "soltv-f789d.appspot.com",
  messagingSenderId: "744268830742",
  appId: "1:744268830742:web:1f23fe7a9fa085047f3d37"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Login = ({ setUser }) => {
  const login = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };
  return <button onClick={login}>Sign in with Google</button>;
};

const Logout = ({ setUser }) => {
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };
  return <button onClick={logout}>Logout</button>;
};

const Home = ({ user }) => {
  return (
    <div>
      <h1>Welcome to Sol.tv</h1>
      {user ? <p>Hello, {user.displayName}</p> : <p>Please sign in to watch.</p>}
    </div>
  );
};

const Watch = () => {
  return (
    <div>
      <h2>Now Playing</h2>
      <Plyr
        source={{
          type: "video",
          sources: [
            {
              src: "https://archive.org/download/Plan_9_from_Outer_Space/Plan_9_from_Outer_Space_512kb.mp4",
              type: "video/mp4"
            }
          ]
        }}
      />
    </div>
  );
};

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <Router>
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Sol.tv</h1>
        {user ? <Logout setUser={setUser} /> : <Login setUser={setUser} />}
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/watch" element={<Watch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
