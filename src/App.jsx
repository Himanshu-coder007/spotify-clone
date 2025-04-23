// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Playlist from './components/Playlist';
import Singer from './components/Singer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on initial load
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <div className="flex h-screen bg-black text-white">
          <Sidebar onLogout={handleLogout} />
          <Routes>
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/" element={<Home />} />
              <Route path="/playlist/:playlistId" element={<Playlist />} />
              <Route path="/singer/:singerId" element={<Singer />} />
            </Route>
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;