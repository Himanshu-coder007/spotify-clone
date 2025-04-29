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
import MusicPlayer from "./components/MusicPlayer";
import songsData from "./data/songs.json";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [username, setUsername] = useState(localStorage.getItem("currentuser") || "");

  // Effect to check authentication status
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
      setUsername(localStorage.getItem("currentuser") || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentuser");
    setIsAuthenticated(false);
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentSongIndex < queue.length - 1) {
      const nextIndex = currentSongIndex + 1;
      setCurrentSongIndex(nextIndex);
      setCurrentTrack(queue[nextIndex]);
    } else {
      // End of queue
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentSongIndex > 0) {
      const prevIndex = currentSongIndex - 1;
      setCurrentSongIndex(prevIndex);
      setCurrentTrack(queue[prevIndex]);
    }
  };

  const hasNext = currentSongIndex < queue.length - 1;
  const hasPrevious = currentSongIndex > 0;

  return (
    <Router>
      {isAuthenticated ? (
        <div className="flex h-screen bg-black text-white">
          <Sidebar 
            onLogout={handleLogout} 
            username={username}
            setCurrentTrack={setCurrentTrack}
            setIsPlaying={setIsPlaying}
          />
          <div className="flex-1 overflow-y-auto pb-24"> {/* Added padding bottom for player */}
            <Routes>
              <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                <Route path="/" element={<Home 
                  setCurrentTrack={setCurrentTrack}
                  setIsPlaying={setIsPlaying}
                  setQueue={setQueue}
                  setCurrentSongIndex={setCurrentSongIndex}
                />} />
                <Route path="/playlist/:playlistId" element={<Playlist 
                  setCurrentTrack={setCurrentTrack}
                  setIsPlaying={setIsPlaying}
                  setQueue={setQueue}
                  setCurrentSongIndex={setCurrentSongIndex}
                />} />
                <Route path="/singer/:singerId" element={<Singer 
                  setCurrentTrack={setCurrentTrack}
                  setIsPlaying={setIsPlaying}
                  setQueue={setQueue}
                  setCurrentSongIndex={setCurrentSongIndex}
                />} />
                <Route path="/create-playlist" element={<CreatePlaylist />} />
                <Route path="/savedplaylist/:id" element={<PlaylistView 
                  setCurrentTrack={setCurrentTrack}
                  setIsPlaying={setIsPlaying}
                  setQueue={setQueue}
                  setCurrentSongIndex={setCurrentSongIndex}
                />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/liked-songs" element={<PlaylistView 
                  setCurrentTrack={setCurrentTrack}
                  setIsPlaying={setIsPlaying}
                  setQueue={setQueue}
                  setCurrentSongIndex={setCurrentSongIndex}
                />} />
              </Route>
            </Routes>
          </div>
          
          {/* Music Player */}
          {currentTrack && (
            <MusicPlayer
              currentTrack={currentTrack}
              setCurrentTrack={setCurrentTrack}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              queue={queue}
              currentSongIndex={currentSongIndex}
              setCurrentSongIndex={setCurrentSongIndex}
              onClose={() => {
                setCurrentTrack(null);
                setIsPlaying(false);
              }}
            />
          )}
        </div>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />}
          />
          <Route
            path="/register"
            element={<Register setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;