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

  const recommendedSongs = songsData.songs;

  const searchSongs = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = songsData.songs.filter(song =>
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results.slice(0, 8));
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
    if (songs.length === 0) return;

    const newPlaylist = {
      id: Date.now(),
      name: playlistName,
      description,
      songs,
      coverImage: songs.length > 0 ? songs[0].cover : null,
      createdAt: new Date().toISOString()
    };

    const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    playlists.push(newPlaylist);
    localStorage.setItem('playlists', JSON.stringify(playlists));

    toast.success('Playlist saved successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setPlaylistName('My Playlist');
    setDescription('');
    setSongs([]);
    setCoverImage(null);
  };

  const addSong = (song) => {
    if (songs.some(s => s.id === song.id)) return;
    
    setSongs([...songs, song]);
    if (songs.length === 0) {
      setCoverImage(song.cover);
    }
  };

  const removeSong = (songId) => {
    const updatedSongs = songs.filter(song => song.id !== songId);
    setSongs(updatedSongs);
    if (updatedSongs.length > 0 && songs[0].id === songId) {
      setCoverImage(updatedSongs[0].cover);
    } else if (updatedSongs.length === 0) {
      setCoverImage(null);
    }
  };

  const updatePlaylist = (e) => {
    e.preventDefault();
    setShowEditForm(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden w-[calc(100vw-360px)]">
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        ::-webkit-scrollbar-thumb {
          background: #4d4d4d;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #666;
        }
      `}</style>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="flex-1 overflow-y-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
        {/* Playlist Header */}
        <div className="flex flex-col lg:flex-row items-start mb-6 gap-4 w-full">
          <div className="w-full lg:w-48 h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg flex items-center justify-center shrink-0 overflow-hidden">
            {coverImage ? (
              <img src={coverImage} alt="Playlist cover" className="w-full h-full object-cover" />
            ) : (
              <FiMusic className="text-gray-600 text-5xl" />
            )}
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-3">
              <div className="flex items-center">
                <h2 className="text-2xl md:text-3xl font-bold mr-3 truncate max-w-full">{playlistName}</h2>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
                  aria-label="Edit playlist name"
                >
                  <FiEdit size={20} />
                </button>
              </div>
              <button
                onClick={savePlaylist}
                disabled={songs.length === 0}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all text-sm ${
                  songs.length > 0 
                    ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/30' 
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiSave size={18} />
                Save Playlist
              </button>
            </div>
            <p className="text-gray-400 mb-3 text-sm line-clamp-2 w-full">{description}</p>
            <div className="flex items-center text-gray-400 text-sm">
              <span className="bg-gray-800 px-3 py-1 rounded-full">
                {songs.length} {songs.length === 1 ? 'song' : 'songs'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md border border-gray-800 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Edit Playlist</h3>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={updatePlaylist}>
                <div className="mb-4">
                  <label htmlFor="editName" className="block text-sm font-medium mb-2 text-gray-300">
                    Playlist Name
                  </label>
                  <input
                    type="text"
                    id="editName"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="w-full p-3 text-sm rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="editDescription" className="block text-sm font-medium mb-2 text-gray-300">
                    Description
                  </label>
                  <textarea
                    id="editDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 text-sm rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-4 py-2 text-sm rounded-full border border-gray-600 hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded-full transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Playlist Songs */}
        <div className="bg-gray-900/80 rounded-xl p-4 mb-6 w-full border border-gray-800/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Your Playlist Songs</h3>
            <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
              {songs.length} {songs.length === 1 ? 'song' : 'songs'}
            </span>
          </div>
          {songs.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {songs.map((song, index) => (
                <div 
                  key={song.id} 
                  className="flex items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
                >
                  <span className="text-gray-500 w-6 text-center text-sm">{index + 1}</span>
                  <img 
                    src={song.cover} 
                    alt={song.title} 
                    className="w-12 h-12 rounded-md mr-3 object-cover" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{song.title}</h4>
                    <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                  </div>
                  <button
                    onClick={() => removeSong(song.id)}
                    className="text-gray-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove song"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FiMusic className="mx-auto text-4xl mb-3" />
              <p className="text-base font-medium">Your playlist is empty</p>
              <p className="text-sm mt-1">Add songs from below to get started</p>
            </div>
          )}
        </div>

        {/* Search Input - Updated with reduced width and left alignment */}
        <div className="mb-6 w-full max-w-md">
          <div 
            className={`flex items-center border ${
              isSearchFocused ? 'border-green-500' : 'border-gray-700'
            } rounded-full px-4 py-3 bg-gray-900/70 transition-colors`}
          >
            <FiSearch className="text-gray-500 mr-3 text-lg" />
            <input
              type="text"
              placeholder="Search for songs to add..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full bg-transparent outline-none text-white placeholder-gray-500 text-sm"
            />
            {searchQuery && (
              <button 
                onClick={clearSearch} 
                className="text-gray-500 hover:text-white ml-2 transition-colors"
                aria-label="Clear search"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-gray-900/80 rounded-xl p-4 mb-6 w-full max-w-md border border-gray-800/50">
            <h3 className="text-lg font-bold mb-4">Search Results</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map(song => (
                <div 
                  key={song.id} 
                  onClick={() => addSong(song)} 
                  className="flex items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <img 
                    src={song.cover} 
                    alt={song.title} 
                    className="w-12 h-12 rounded-md mr-3 object-cover" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{song.title}</h4>
                    <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addSong(song);
                    }}
                    className="text-gray-500 hover:text-green-400 p-2 transition-colors"
                    aria-label="Add song"
                  >
                    <FiPlus size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Songs */}
        <div className="bg-gray-900/80 rounded-xl p-4 mb-6 w-full border border-gray-800/50">
          <h3 className="text-lg font-bold mb-4">Recommended Songs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendedSongs.map(song => (
              <div 
                key={song.id} 
                onClick={() => addSong(song)} 
                className="flex items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <img 
                  src={song.cover} 
                  alt={song.title} 
                  className="w-12 h-12 rounded-md mr-3 object-cover" 
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{song.title}</h4>
                  <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addSong(song);
                  }}
                  className="text-gray-500 hover:text-green-400 p-2 transition-colors"
                  aria-label="Add song"
                >
                  <FiPlus size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;