// ✅ src/pages/Watch.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import './Watch.css';

function Watch() {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [hoveredMovieId, setHoveredMovieId] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const snapshot = await getDocs(collection(db, 'movies'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMovies(data);
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    fetchMovies();
    return () => unsubscribe();
  }, []);

  const handleAddToWatchlist = async (movie) => {
    if (!user) return alert('Please sign in to save to watchlist.');
    await setDoc(doc(db, `users/${user.uid}/watchlist`, movie.id), movie);
    alert('✅ Added to watchlist!');
  };

  return (
    <div className="watch-container">
      <h2 className="watch-title">🎥 Watch Movies</h2>
      <Link to="/">🏠 Back to Home</Link>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            className="movie-card"
            key={movie.id}
            onMouseEnter={() => setHoveredMovieId(movie.id)}
            onMouseLeave={() => setHoveredMovieId(null)}
          >
            {hoveredMovieId === movie.id ? (
              <iframe
                src={movie.videoUrl}
                allow="autoplay; fullscreen"
                allowFullScreen
                frameBorder="0"
                style={{ width: '100%', height: '200px', borderRadius: '4px' }}
              ></iframe>
            ) : (
              <img
                src={movie.thumbnail}
                alt={movie.title}
                style={{ width: '100%', borderRadius: '4px' }}
              />
            )}
            <h3>{movie.title} ({movie.year})</h3>
            {user && (
              <button onClick={() => handleAddToWatchlist(movie)}>
                ❤️ Add to Watchlist
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Watch;