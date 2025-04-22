import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Playlist from './components/Playlist';
import Singer from './components/Singer';

const App = () => {
  return (
    <Router>
      <div className="flex h-screen bg-black text-white">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlist/:playlistId" element={<Playlist />} />
          <Route path="/singer/:singerId" element={<Singer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;