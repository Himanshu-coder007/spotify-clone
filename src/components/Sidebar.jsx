import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiChevronRight,
  FiChevronLeft,
  FiPlus,
  FiMusic,
  FiTrash2,
  FiHeart,
  FiPlay,
  FiLogOut,
} from "react-icons/fi";
import songsData from "../data/songs.json";

const Sidebar = ({ onLogout, username }) => {
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [likedPlaylists, setLikedPlaylists] = useState([]);
  const [allSongs, setAllSongs] = useState(songsData.songs);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

  const featuredPlaylists = [
    {
      id: "playlist-1",
      name: "Top 50 Global",
      images: [{ url: "/img8.jpg" }],
      tracks: { total: 50 },
    },
    {
      id: "playlist-2",
      name: "Top 50 India",
      images: [{ url: "/img9.jpg" }],
      tracks: { total: 50 },
    },
    {
      id: "playlist-3",
      name: "Trending India",
      images: [{ url: "/img10.jpg" }],
      tracks: { total: 50 },
    },
    {
      id: "playlist-4",
      name: "Trending Global",
      images: [{ url: "/img16.jpg" }],
      tracks: { total: 50 },
    },
    {
      id: "playlist-5",
      name: "Mega Hits",
      images: [{ url: "/img11.jpg" }],
      tracks: { total: 50 },
    },
    {
      id: "playlist-6",
      name: "Happy Favorites",
      images: [{ url: "/img15.jpg" }],
      tracks: { total: 50 },
    },
  ];

  // Function to load playlists and liked songs from localStorage
  const loadData = () => {
    try {
      const savedPlaylists = JSON.parse(localStorage.getItem("playlists")) || [];
      setPlaylists(savedPlaylists);

      const musicAppLikes = JSON.parse(localStorage.getItem("musicAppLikes")) || {
        playlists: [],
        songs: [],
      };

      setLikedSongs(musicAppLikes.songs || []);
      setLikedPlaylists(musicAppLikes.playlists || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setPlaylists([]);
      setLikedSongs([]);
      setLikedPlaylists([]);
    }
  };

  useEffect(() => {
    loadData();

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

  useEffect(() => {
    const handleCustomEvent = () => loadData();
    window.addEventListener("playlistsUpdated", handleCustomEvent);
    return () =>
      window.removeEventListener("playlistsUpdated", handleCustomEvent);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const deletePlaylist = (playlistId) => {
    const updatedPlaylists = playlists.filter(
      (playlist) => playlist.id !== playlistId
    );
    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    setPlaylists(updatedPlaylists);

    window.dispatchEvent(new Event("dataUpdated"));

    if (location.pathname === `/playlist/${playlistId}`) {
      window.location.href = "/";
    }
  };

  const getSongDetails = (songId) => {
    const index = parseInt(songId.replace("song-", ""));
    return songsData.songs[index] || {};
  };

  const getLikedPlaylists = () => {
    return featuredPlaylists.filter((playlist) =>
      likedPlaylists.includes(playlist.id)
    );
  };

  if (isCollapsed) {
    return (
      <div className="hidden md:flex flex-col items-center h-full p-4 bg-[#040306] border-r border-gray-800">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 mb-6"
        >
          <FiChevronRight size={24} />
        </button>

        <Link to="/create-playlist">
          <button
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 mb-4"
            title="Create playlist"
          >
            <FiPlus size={20} />
          </button>
        </Link>
        
        <button
          onClick={onLogout}
          className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 mt-auto"
          title="Logout"
        >
          <FiLogOut size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex flex-col w-64 h-full bg-[#040306] border-r border-gray-800">
      {/* Top Navigation */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Link to="/" className="text-white text-xl font-bold">
            Home
          </Link>
          <div className="flex space-x-2">
            <Link
              to="/create-playlist"
              className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
              title="Create playlist"
            >
              <FiPlus size={18} />
            </Link>
            <button
              onClick={toggleSidebar}
              className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
            >
              <FiChevronLeft size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Library Section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Your Library</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {/* Liked Songs Section - Always visible if there are liked songs */}
        {likedSongs.length > 0 && (
          <div className="mb-4">
            <Link to="/liked-songs">
              <div className="w-full flex items-center p-2 text-gray-300 hover:text-white hover:bg-[#1E1E1E] rounded transition group">
                <div className="bg-gradient-to-br from-purple-900 to-blue-800 p-2 rounded mr-3">
                  <FiHeart className="text-white" size={14} />
                </div>
                <div className="text-left truncate flex-1">
                  <p className="truncate text-sm">Liked Songs</p>
                  <p className="text-xs text-gray-400 truncate">
                    Playlist • {likedSongs.length} songs
                  </p>
                </div>
                <button
                  className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition p-1"
                  title="Play playlist"
                >
                  <FiPlay size={12} />
                </button>
              </div>
            </Link>

            {/* Recently Liked Songs */}
            <div className="mt-2 ml-2 pl-8">
              <h4 className="text-xs text-gray-400 font-semibold mb-1">
                Recently Liked
              </h4>
              <div className="space-y-1">
                {likedSongs.slice(0, 5).map((songId) => {
                  const song = getSongDetails(songId);
                  return (
                    <Link
                      key={songId}
                      to={`/song/${songId}`}
                      className="flex items-center p-1 text-gray-400 hover:text-white rounded transition group"
                    >
                      <div className="w-8 h-8 bg-gray-700 rounded mr-2 overflow-hidden flex-shrink-0">
                        {song.cover ? (
                          <img
                            src={song.cover}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiMusic className="text-gray-500 text-xs" />
                          </div>
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs truncate">
                          {song.title || "Unknown Song"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* User Playlists */}
        {playlists.length > 0 ? (
          <div className="space-y-1">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                to={`/savedplaylist/${playlist.id}`}
                className="w-full flex items-center p-2 text-gray-300 hover:text-white hover:bg-[#1E1E1E] rounded transition group"
              >
                <div className="bg-[#282828] p-2 rounded mr-3">
                  <FiMusic className="text-gray-400" size={14} />
                </div>
                <div className="text-left truncate flex-1">
                  <p className="truncate text-sm">{playlist.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    Playlist • {playlist.songs?.length || 0} songs
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition p-1 mr-1"
                    title="Play playlist"
                  >
                    <FiPlay size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deletePlaylist(playlist.id);
                    }}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                    title="Delete playlist"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-4">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-4 mb-6">
              <h3 className="text-white font-medium mb-1">
                Create your first playlist
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                It's easy, we'll help you
              </p>
              <Link
                to="/create-playlist"
                className="bg-white text-black text-sm font-bold rounded-full px-4 py-2 flex items-center hover:scale-105 transition"
              >
                <FiPlus className="mr-2" />
                <span>Create playlist</span>
              </Link>
            </div>
          </div>
        )}

        {/* Liked Playlists Section - Always visible if there are liked playlists */}
        {likedPlaylists.length > 0 && (
          <div className="mt-4">
            <h4 className="text-white text-sm font-bold px-2 mb-2">
              Liked Playlists
            </h4>
            <div className="space-y-1">
              {getLikedPlaylists().map((playlist) => (
                <Link
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className="w-full flex items-center p-2 text-gray-300 hover:text-white hover:bg-[#1E1E1E] rounded transition group"
                >
                  <div className="bg-[#282828] p-2 rounded mr-3">
                    <FiMusic className="text-gray-400" size={14} />
                  </div>
                  <div className="text-left truncate flex-1">
                    <p className="truncate text-sm">{playlist.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      Playlist • {playlist.tracks.total} songs
                    </p>
                  </div>
                  <button
                    className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition p-1"
                    title="Play playlist"
                  >
                    <FiPlay size={12} />
                  </button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Podcasts Section */}
        <div className="px-4 mt-6">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-4">
            <h3 className="text-white font-medium mb-1">
              Let's find podcasts to follow
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              We'll keep you updated on new episodes
            </p>
            <Link
              to="/browse-podcasts"
              className="bg-white text-black text-sm font-bold rounded-full px-4 py-2 flex items-center hover:scale-105 transition"
            >
              <span>Browse Podcasts</span>
            </Link>
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
              <span className="text-white text-xs font-bold">
                {username ? username.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <span className="text-white text-sm">{username || "User"}</span>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-white p-1"
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;