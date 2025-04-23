import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiBook,
  FiChevronRight,
  FiPlus,
  FiX,
  FiLogOut,
  FiMusic,
  FiTrash2,
} from "react-icons/fi";

const Sidebar = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const location = useLocation();

  // Function to load playlists from localStorage
  const loadPlaylists = () => {
    try {
      const savedPlaylists = JSON.parse(localStorage.getItem('playlists')) || [];
      setPlaylists(savedPlaylists);
    } catch (error) {
      console.error("Error loading playlists:", error);
      setPlaylists([]);
    }
  };

  // Load playlists on initial render
  useEffect(() => {
    loadPlaylists();
    
    // Set up event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'playlists') {
        loadPlaylists();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Also listen for custom events if playlists are updated within the same window
  useEffect(() => {
    const handleCustomEvent = () => loadPlaylists();
    window.addEventListener('playlistsUpdated', handleCustomEvent);
    return () => window.removeEventListener('playlistsUpdated', handleCustomEvent);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchActive(false);
  };

  const deletePlaylist = (playlistId) => {
    const updatedPlaylists = playlists.filter(playlist => playlist.id !== playlistId);
    localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
    setPlaylists(updatedPlaylists);
    setShowDeleteConfirm(null);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('playlistsUpdated'));
    
    // If we're currently viewing the deleted playlist, redirect to home
    if (location.pathname === `/playlist/${playlistId}`) {
      window.location.href = '/';
    }
  };

  return (
    <div className="w-[360px] h-screen flex flex-col bg-black border-r border-gray-800 overflow-hidden">
      {/* Fixed top section */}
      <div className="p-6 pb-0 flex-shrink-0">
        {/* Logo with text */}
        <div className="mb-8 pl-4 flex items-center">
          <img
            src="/spotify_logo.png"
            alt="Spotify"
            className="h-10 object-contain mr-4"
          />
          <h1 className="text-2xl font-bold text-white">Spotify</h1>
        </div>

        {/* Top Navigation */}
        <div className="space-y-2 mb-8">
          <Link to="/">
            <div
              className={`flex items-center px-5 py-4 ${
                location.pathname === "/"
                  ? "text-white bg-gray-800"
                  : "text-gray-300 hover:text-white"
              } rounded-lg hover:bg-gray-800 cursor-pointer transition-all duration-200`}
            >
              <FiHome className="mr-6 text-2xl min-w-[24px]" />
              <span className="text-lg font-semibold">Home</span>
            </div>
          </Link>

          {/* Search Box */}
          <div
            className={`flex items-center px-5 py-4 ${
              isSearchActive ? "bg-gray-800" : "hover:bg-gray-800"
            } rounded-lg cursor-pointer transition-all duration-200`}
            onClick={() => setIsSearchActive(true)}
          >
            <FiSearch className="mr-6 text-2xl min-w-[24px] text-gray-300" />
            {isSearchActive ? (
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="What do you want to listen to?"
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg font-semibold"
                  autoFocus
                />
                {searchQuery && (
                  <FiX
                    className="text-gray-400 ml-2 cursor-pointer hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSearch();
                    }}
                  />
                )}
              </div>
            ) : (
              <span className="text-lg font-semibold text-gray-300 hover:text-white">
                Search
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable content - hide scrollbar */}
      <div className="flex-grow overflow-y-auto px-6 scrollbar-hide">
        {/* Show search results if search is active and has query, otherwise show library */}
        {isSearchActive && searchQuery ? (
          <div className="bg-gray-900 rounded-2xl p-5">
            <h3 className="text-xl font-bold mb-6 text-white">
              Search results for "{searchQuery}"
            </h3>
            {/* Placeholder for search results */}
            <div className="text-gray-400 text-center py-10">
              <p>Search results will appear here</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl p-5">
            {/* Library Header */}
            <div className="flex justify-between items-center px-3 py-3 mb-6">
              <div className="flex items-center text-gray-300">
                <FiBook className="mr-6 text-2xl min-w-[24px]" />
                <span className="text-lg font-semibold">Your Library</span>
              </div>
              <div className="flex gap-5">
                <FiChevronRight className="text-gray-300 text-xl cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>

            {/* Library Content */}
            <div className="space-y-3">
              <Link to="/create-playlist">
                <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all duration-200">
                  <h4 className="font-bold mb-4 text-lg">
                    Create your first playlist
                  </h4>
                  <p className="text-md text-gray-400 mb-6">
                    It's easy, we'll help you
                  </p>
                  <button className="bg-white text-black text-md font-bold px-6 py-3 rounded-full hover:scale-[1.03] transition-transform">
                    Create Playlist
                  </button>
                </div>
              </Link>

              {/* User Playlists */}
              {playlists.length > 0 ? (
                playlists.map(playlist => (
                  <div 
                    key={playlist.id} 
                    className="group relative bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-200"
                  >
                    <Link to={`/savedplaylist/${playlist.id}`}>
                      <div className="p-4 flex items-center">
                        <div className="w-16 h-16 bg-gray-700 rounded mr-4 overflow-hidden">
                          {playlist.coverImage ? (
                            <img 
                              src={playlist.coverImage} 
                              alt={playlist.name} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.parentElement.innerHTML = (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FiMusic className="text-gray-500 text-xl" />
                                  </div>
                                );
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiMusic className="text-gray-500 text-xl" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-white truncate max-w-[180px]">{playlist.name}</h4>
                          <p className="text-sm text-gray-400">
                            {playlist.songs?.length || 0} {playlist.songs?.length === 1 ? 'song' : 'songs'}
                          </p>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Delete button */}
                    <button
                      className="absolute right-4 top-4 p-2 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowDeleteConfirm(playlist.id);
                      }}
                    >
                      <FiTrash2 />
                    </button>
                    
                    {/* Delete confirmation */}
                    {showDeleteConfirm === playlist.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-80 rounded-xl flex flex-col items-center justify-center p-4 z-10">
                        <p className="text-white mb-4 text-center">Delete "{playlist.name}" playlist?</p>
                        <div className="flex gap-3">
                          <button
                            className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(null);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePlaylist(playlist.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-gray-800 rounded-xl p-6 text-center">
                  <p className="text-gray-400">No playlists yet</p>
                </div>
              )}

              <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all duration-200">
                <h4 className="font-bold mb-4 text-lg">
                  Let's find podcasts to follow
                </h4>
                <p className="text-md text-gray-400 mb-6">
                  We'll keep you updated on new episodes
                </p>
                <button className="bg-white text-black text-md font-bold px-6 py-3 rounded-full hover:scale-[1.03] transition-transform">
                  Browse Podcasts
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom section with logout button */}
      <div className="p-6 pt-0 flex-shrink-0">
        <div
          className="flex items-center px-5 py-4 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800 cursor-pointer transition-all duration-200"
          onClick={onLogout}
        >
          <FiLogOut className="mr-6 text-2xl min-w-[24px]" />
          <span className="text-lg font-semibold">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;