import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiMusic, FiSearch, FiEdit, FiPlus, FiSave, FiX, FiTrash2 } from 'react-icons/fi';
import songsData from '../data/songs.json';

const CreatePlaylist = () => {
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [description, setDescription] = useState('');
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Use songs from the imported JSON file
  const recommendedSongs = songsData.songs;

  // Search function using the songs data
  const searchSongs = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = songsData.songs.filter(song => 
      song.title.toLowerCase().includes(query.toLowerCase()) || 
      song.artist.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results.slice(0, 8)); // Limit to 8 results
  };

  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(() => {
        searchSongs(searchQuery);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const savePlaylist = () => {
    const newPlaylist = {
      id: Date.now(),
      name: playlistName,
      description,
      songs,
      coverImage: songs.length > 0 ? songs[0].cover : null,
      createdAt: new Date().toISOString()
    };
    
    // Save to local storage
    const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    playlists.push(newPlaylist);
    localStorage.setItem('playlists', JSON.stringify(playlists));
    
    showSuccessToast('Playlist saved successfully!');
    // Reset form
    setPlaylistName('My Playlist');
    setDescription('');
    setSongs([]);
    setCoverImage(null);
  };

  const addSong = (song) => {
    // Check if song already exists in playlist
    if (songs.some(s => s.id === song.id)) {
      showInfoToast(`${song.title} is already in the playlist`);
      return;
    }
    
    setSongs([...songs, song]);
    if (songs.length === 0) {
      setCoverImage(song.cover);
    }
    showSuccessToast(`${song.title} added to playlist`);
  };

  const removeSong = (songId) => {
    const updatedSongs = songs.filter(song => song.id !== songId);
    setSongs(updatedSongs);
    if (updatedSongs.length > 0 && songs[0].id === songId) {
      setCoverImage(updatedSongs[0].cover);
    } else if (updatedSongs.length === 0) {
      setCoverImage(null);
    }
    showInfoToast('Song removed from playlist');
  };

  const updatePlaylist = (e) => {
    e.preventDefault();
    setShowEditForm(false);
    showSuccessToast('Playlist details updated!');
  };

  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showInfoToast = (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
        {/* Playlist Header */}
        <div className="flex flex-col md:flex-row items-start mb-8 gap-6 max-w-6xl mx-auto">
          <div className="w-full md:w-64 h-64 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center shrink-0">
            {coverImage ? (
              <img src={coverImage} alt="Playlist cover" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <FiMusic className="text-gray-500 text-6xl" />
            )}
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-4">
              <div className="flex items-center">
                <h2 className="text-4xl font-bold mr-3 truncate max-w-md">{playlistName}</h2>
                <button 
                  onClick={() => setShowEditForm(true)}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
                  aria-label="Edit playlist"
                >
                  <FiEdit size={24} />
                </button>
              </div>
              <button
                onClick={savePlaylist}
                disabled={songs.length === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${songs.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 cursor-not-allowed'}`}
              >
                <FiSave size={20} />
                Save Playlist
              </button>
            </div>
            <p className="text-gray-400 mb-4 text-lg line-clamp-2 max-w-3xl">{description}</p>
            <div className="flex items-center text-lg text-gray-400">
              <span>{songs.length} {songs.length === 1 ? 'song' : 'songs'}</span>
            </div>
          </div>
        </div>

        {/* Edit Playlist Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 p-8 rounded-lg max-w-2xl w-full border border-gray-800 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Edit Playlist</h3>
                <button 
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={updatePlaylist}>
                <div className="mb-6">
                  <label htmlFor="editName" className="block text-lg font-medium mb-3 text-gray-300">
                    Playlist Name
                  </label>
                  <input
                    type="text"
                    id="editName"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="w-full p-4 text-lg rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="editDescription" className="block text-lg font-medium mb-3 text-gray-300">
                    Description
                  </label>
                  <textarea
                    id="editDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 text-lg rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="4"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-6 py-3 text-lg rounded-full border border-gray-600 hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg rounded-full transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {/* Playlist Songs Section */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Your Playlist Songs</h3>
              <span className="text-lg text-gray-400">{songs.length} {songs.length === 1 ? 'song' : 'songs'}</span>
            </div>
            {songs.length > 0 ? (
              <div className="space-y-3">
                {songs.map((song, index) => (
                  <div 
                    key={song.id} 
                    className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <span className="text-gray-500 w-8 text-center text-lg">{index + 1}</span>
                    <img src={song.cover} alt={song.title} className="w-14 h-14 rounded mr-4" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-lg truncate">{song.title}</h4>
                      <p className="text-gray-400 truncate">{song.artist}</p>
                    </div>
                    <button 
                      onClick={() => removeSong(song.id)}
                      className="text-red-500 hover:text-red-400 p-2 transition-colors"
                      aria-label="Remove song"
                    >
                      <FiTrash2 size={22} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <FiMusic className="mx-auto text-5xl mb-4" />
                <p className="text-xl">Your playlist is empty</p>
                <p className="text-lg mt-2">Add songs from below to get started</p>
              </div>
            )}
          </div>

          {/* Search Section */}
          <div className="relative">
            <div className={`flex items-center border ${isSearchFocused ? 'border-green-500' : 'border-gray-700'} rounded-full px-6 py-4 transition-all duration-200 bg-gray-900 w-full`}>
              <FiSearch className="text-gray-500 mr-3 text-xl" />
              <input
                type="text"
                placeholder="Search for songs to add..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full bg-transparent outline-none text-white placeholder-gray-500 text-lg"
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="text-gray-500 hover:text-white ml-3 transition-colors"
                >
                  <FiX size={22} />
                </button>
              )}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-6">Search Results</h3>
              <div className="space-y-3">
                {searchResults.map(song => (
                  <div 
                    key={song.id} 
                    className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => addSong(song)}
                  >
                    <img src={song.cover} alt={song.title} className="w-14 h-14 rounded mr-4" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-lg truncate">{song.title}</h4>
                      <p className="text-gray-400 truncate">{song.artist}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addSong(song);
                      }}
                      className="text-green-500 hover:text-green-400 p-2 transition-colors"
                    >
                      <FiPlus size={22} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Songs */}
          <div className="bg-gray-900 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-bold mb-6">Recommended Songs</h3>
            <div className="space-y-3">
              {recommendedSongs.map(song => (
                <div 
                  key={song.id} 
                  className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => addSong(song)}
                >
                  <img src={song.cover} alt={song.title} className="w-14 h-14 rounded mr-4" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-lg truncate">{song.title}</h4>
                    <p className="text-gray-400 truncate">{song.artist}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addSong(song);
                    }}
                    className="text-green-500 hover:text-green-400 p-2 transition-colors"
                  >
                    <FiPlus size={22} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;