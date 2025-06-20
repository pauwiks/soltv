// ✅ src/pages/Admin.js
import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

function Admin() {
  const [movies, setMovies] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', year: '', videoUrl: '', thumbnail: '' });

  const fetchMovies = async () => {
    const querySnapshot = await getDocs(collection(db, "movies"));
    const movieList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMovies(movieList);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "movies", id));
    fetchMovies();
  };

  const handleEdit = (movie) => {
    setEditing(movie.id);
    setForm(movie);
  };

  const handleUpdate = async () => {
    await updateDoc(doc(db, "movies", editing), {
      title: form.title,
      year: parseInt(form.year),
      videoUrl: form.videoUrl,
      thumbnail: form.thumbnail
    });
    setEditing(null);
    fetchMovies();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🎬 Admin Dashboard</h1>
      {movies.map(movie => (
        <div key={movie.id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
          <strong>{movie.title}</strong> ({movie.year})
          <div>
            <button onClick={() => handleEdit(movie)}>✏️ Edit</button>
            <button onClick={() => handleDelete(movie.id)} style={{ marginLeft: '1rem' }}>🗑️ Delete</button>
          </div>
        </div>
      ))}

      {editing && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Editing Movie</h2>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          /><br/>
          <input
            type="number"
            placeholder="Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          /><br/>
          <input
            type="text"
            placeholder="Video URL"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
          /><br/>
          <input
            type="text"
            placeholder="Thumbnail"
            value={form.thumbnail}
            onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
          /><br/>
          <button onClick={handleUpdate}>✅ Save</button>
          <button onClick={() => setEditing(null)} style={{ marginLeft: '1rem' }}>❌ Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Admin;