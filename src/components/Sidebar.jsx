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
  FiHeart,
} from "react-icons/fi";
import songsData from "../data/songs.json";

const Sidebar = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [allSongs, setAllSongs] = useState(songsData.songs);
  const location = useLocation();

  // Function to load playlists and liked songs from localStorage
  const loadData = () => {
    try {
      const savedPlaylists =
        JSON.parse(localStorage.getItem("playlists")) || [];
      setPlaylists(savedPlaylists);
      setFilteredPlaylists(savedPlaylists);

      // Updated to use musicAppLikes instead of collections
      const musicAppLikes = JSON.parse(
        localStorage.getItem("musicAppLikes")
      ) || { playlists: [], songs: [] };
      setLikedSongs(musicAppLikes.songs || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setPlaylists([]);
      setFilteredPlaylists([]);
      setLikedSongs([]);
    }
  };

  // Load data on initial render
  useEffect(() => {
    loadData();

    // Set up event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "playlists" || e.key === "musicAppLikes") {
        loadData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Also listen for custom events if data is updated within the same window
  useEffect(() => {
    const handleCustomEvent = () => loadData();
    window.addEventListener("likesUpdated", handleCustomEvent);
    return () => window.removeEventListener("likesUpdated", handleCustomEvent);
  }, []);

  // Filter playlists when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPlaylists(playlists);
    } else {
      const filtered = playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlaylists(filtered);
    }
  }, [searchQuery, playlists]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchActive(false);
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      setSearchQuery("");
    }
  };

  const deletePlaylist = (playlistId) => {
    const updatedPlaylists = playlists.filter(
      (playlist) => playlist.id !== playlistId
    );
    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    setPlaylists(updatedPlaylists);
    setShowDeleteConfirm(null);

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("dataUpdated"));

    // If we're currently viewing the deleted playlist, redirect to home
    if (location.pathname === `/playlist/${playlistId}`) {
      window.location.href = "/";
    }
  };

  // Get song details by ID
  const getSongDetails = (songId) => {
    return allSongs.find((song) => song.id === songId) || {};
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
        </div>
      </div>

      {/* Scrollable content - hide scrollbar */}
      <div className="flex-grow overflow-y-auto px-6 scrollbar-hide">
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

          {/* Search Playlists */}
          <div className="mb-6 relative">
            {isSearchActive ? (
              <div className="flex items-center bg-gray-800 rounded-lg px-4 py-3">
                <FiSearch className="mr-3 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search in your library"
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <FiX
                    className="text-gray-400 ml-2 cursor-pointer hover:text-white"
                    onClick={clearSearch}
                  />
                )}
              </div>
            ) : (
              <button
                onClick={toggleSearch}
                className="w-full flex items-center justify-center bg-gray-800 rounded-lg px-4 py-3 hover:bg-gray-700 transition-colors"
              >
                <FiSearch className="mr-3 text-gray-400" />
                <span className="text-gray-400">Search in your library</span>
              </button>
            )}
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
            {filteredPlaylists.length > 0 ? (
              <div className="bg-gray-800 rounded-xl p-4">
                <h4 className="font-bold text-white mb-3 px-2">
                  Your Playlists
                </h4>
                <div className="space-y-2">
                  {filteredPlaylists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="group relative hover:bg-gray-700 rounded-lg transition-all duration-200"
                    >
                      <Link to={`/savedplaylist/${playlist.id}`}>
                        <div className="p-3 flex items-center">
                          <div className="w-12 h-12 bg-gray-700 rounded mr-3 overflow-hidden">
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
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white truncate">
                              {playlist.name}
                            </h4>
                            <p className="text-sm text-gray-400 truncate">
                              {playlist.songs?.length || 0}{" "}
                              {playlist.songs?.length === 1 ? "song" : "songs"}
                            </p>
                          </div>
                        </div>
                      </Link>

                      {/* Delete button */}
                      <button
                        className="absolute right-3 top-3 p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
                        <div className="absolute inset-0 bg-black bg-opacity-80 rounded-lg flex flex-col items-center justify-center p-4 z-10">
                          <p className="text-white mb-4 text-center">
                            Delete "{playlist.name}" playlist?
                          </p>
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
                  ))}
                </div>
              </div>
            ) : searchQuery ? (
              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <p className="text-gray-400">
                  No playlists found matching "{searchQuery}"
                </p>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <p className="text-gray-400">No playlists yet</p>
              </div>
            )}

            {/* Liked Songs Section */}
            {likedSongs.length > 0 && (
              <Link to="/liked-songs">
                <div className="bg-gradient-to-br from-purple-900 to-blue-800 rounded-xl p-6 hover:opacity-90 transition-opacity">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-black bg-opacity-30 rounded flex items-center justify-center mr-4">
                      <FiHeart className="text-white text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Liked Songs</h4>
                      <p className="text-sm text-gray-200">
                        {likedSongs.length}{" "}
                        {likedSongs.length === 1 ? "song" : "songs"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )}
            {/* Liked Songs List */}
            {likedSongs.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-4">
                <h4 className="font-bold text-white mb-3 px-2">
                  Recently Liked
                </h4>
                <div className="max-h-60 overflow-y-auto">
                  {likedSongs.slice(0, 5).map((songId) => {
                    const song = getSongDetails(songId);
                    return (
                      <div
                        key={songId}
                        className="flex items-center p-2 hover:bg-gray-700 rounded"
                      >
                        <div className="w-10 h-10 bg-gray-600 rounded mr-3 flex-shrink-0 overflow-hidden">
                          {song.cover ? (
                            <img
                              src={song.cover}
                              alt={song.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiMusic className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-white font-medium truncate">
                            {song.title || "Unknown Song"}
                          </p>
                          <p className="text-gray-400 text-sm truncate">
                            {song.artist || "Unknown Artist"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Podcasts Section */}
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
