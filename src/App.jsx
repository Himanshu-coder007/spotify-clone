import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Playlist from "./components/Playlist";
import Singer from "./components/Singer";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import CreatePlaylist from "./components/CreatePlaylist";
import PlaylistView from "./components/PlaylistView";

import Premium from "./components/Premium";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize state from localStorage
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // Effect to check authentication status whenever it changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    };

    // Listen for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentuser");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <div className="flex h-screen bg-black text-white">
          <Sidebar onLogout={handleLogout} />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route
                element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
              >
                <Route path="/" element={<Home />} />
                <Route path="/playlist/:playlistId" element={<Playlist />} />
                <Route path="/singer/:singerId" element={<Singer />} />
                <Route path="/create-playlist" element={<CreatePlaylist />} />
                <Route path="/savedplaylist/:id" element={<PlaylistView />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/liked-songs" element={<Premium />} />
              </Route>
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/register"
            element={<Register setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
