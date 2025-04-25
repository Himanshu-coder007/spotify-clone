import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MusicPlayer from "../components/MusicPlayer";
import songsData from "../data/songs.json";
import {
  FaPlay,
  FaPause,
  FaBell,
  FaUserCircle,
  FaChevronDown,
  FaCrown,
  FaMobileAlt,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { MdExplicit } from "react-icons/md";
import Singers from "../components/Singers";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(songsData.songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [hoveredPlaylist, setHoveredPlaylist] = useState(null);
  const [hoveredSong, setHoveredSong] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLeftArrowPlaylists, setShowLeftArrowPlaylists] = useState(false);
  const [showRightArrowPlaylists, setShowRightArrowPlaylists] = useState(true);
  const [showLeftArrowSongs, setShowLeftArrowSongs] = useState(false);
  const [showRightArrowSongs, setShowRightArrowSongs] = useState(true);
  const [likedItems, setLikedItems] = useState({
    playlists: [],
    songs: [],
  });
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' or 'liked'
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    songs: [],
    playlists: [],
    artists: [],
  });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const playlistsRef = useRef(null);
  const songsRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // Load liked items from localStorage on component mount
  useEffect(() => {
    const storedLikes = localStorage.getItem("musicAppLikes");
    if (storedLikes) {
      setLikedItems(JSON.parse(storedLikes));
    }
  }, []);

  // Save liked items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("musicAppLikes", JSON.stringify(likedItems));
    // Dispatch event to notify other components about the update
    window.dispatchEvent(new Event("playlistsUpdated"));
  }, [likedItems]);

  // Animation frames for the equalizer bars
  const animationFrames = [
    [3, 6, 9, 6, 3],
    [4, 7, 10, 7, 4],
    [2, 5, 8, 5, 2],
    [5, 8, 11, 8, 5],
  ];

  // Animation loop for the equalizer bars
  useEffect(() => {
    if (!isPlaying) {
      setAnimationStep(0);
      return;
    }

    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % animationFrames.length);
    }, 300);

    return () => clearInterval(interval);
  }, [isPlaying, animationFrames.length]);

  // Check scroll position for arrows
  const checkScrollPosition = useCallback(() => {
    if (playlistsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = playlistsRef.current;
      setShowLeftArrowPlaylists(scrollLeft > 0);
      setShowRightArrowPlaylists(scrollLeft < scrollWidth - clientWidth);
    }

    if (songsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = songsRef.current;
      setShowLeftArrowSongs(scrollLeft > 0);
      setShowRightArrowSongs(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  // Set up scroll event listeners
  useEffect(() => {
    const playlistsElement = playlistsRef.current;
    const songsElement = songsRef.current;

    if (playlistsElement) {
      playlistsElement.addEventListener("scroll", checkScrollPosition);
    }
    if (songsElement) {
      songsElement.addEventListener("scroll", checkScrollPosition);
    }

    // Initial check
    checkScrollPosition();

    return () => {
      if (playlistsElement) {
        playlistsElement.removeEventListener("scroll", checkScrollPosition);
      }
      if (songsElement) {
        songsElement.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, [checkScrollPosition, activeFilter]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search function
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults({
        songs: [],
        playlists: [],
        artists: [],
      });
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();

    // Search songs
    const songResults = songsData.songs
      .filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          song.album.toLowerCase().includes(query)
      )
      .slice(0, 5); // Limit to 5 results

    // Search playlists (from featuredPlaylists)
    const playlistResults = featuredPlaylists
      .filter((playlist) => playlist.name.toLowerCase().includes(query))
      .slice(0, 5);

    // Search artists (from songsData)
    const artistSet = new Set();
    songsData.songs.forEach((song) => {
      if (song.artist.toLowerCase().includes(query)) {
        artistSet.add(song.artist);
      }
    });
    const artistResults = Array.from(artistSet).slice(0, 5);

    setSearchResults({
      songs: songResults,
      playlists: playlistResults,
      artists: artistResults,
    });

    if (
      songResults.length > 0 ||
      playlistResults.length > 0 ||
      artistResults.length > 0
    ) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
    searchInputRef.current.focus();
  };

  // Scroll handlers
  const scrollPlaylists = (direction) => {
    if (playlistsRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      playlistsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollSongs = (direction) => {
    if (songsRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      songsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Featured charts data
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

  const durationToMs = (durationString) => {
    const [minutes, seconds] = durationString.split(":").map(Number);
    return (minutes * 60 + seconds) * 1000;
  };

  const topTracks = songsData.songs.map((song, index) => {
    return {
      id: `song-${index}`,
      track: {
        name: song.title,
        artists: [{ name: song.artist }],
        album: {
          name: song.album,
          images: [{ url: song.cover }],
        },
        duration_ms: durationToMs(song.duration),
        duration_formatted: song.duration,
        explicit: false,
      },
    };
  });

  // Filter playlists and songs based on active filter
  const filteredPlaylists =
    activeFilter === "liked"
      ? featuredPlaylists.filter((playlist) =>
          likedItems.playlists.includes(playlist.id)
        )
      : featuredPlaylists;

  const filteredSongs =
    activeFilter === "liked"
      ? topTracks.filter((song) => likedItems.songs.includes(song.id))
      : topTracks;

  const handleTrackClick = useCallback((trackIndex) => {
    if (trackIndex >= 0 && trackIndex < songsData.songs.length) {
      setCurrentTrack(songsData.songs[trackIndex]);
      setIsPlaying(true);
      setShowPlayer(true);
      setShowSearchResults(false);
      setIsSearchFocused(false);
    }
  }, []);

  const handleChartClick = useCallback(
    (chart) => {
      navigate(`/playlist/${chart.id}`);
      setShowSearchResults(false);
      setIsSearchFocused(false);
    },
    [navigate]
  );

  // Toggle like for a playlist
  const togglePlaylistLike = (playlistId, e) => {
    e.stopPropagation();
    setLikedItems((prev) => {
      const isLiked = prev.playlists.includes(playlistId);
      return {
        ...prev,
        playlists: isLiked
          ? prev.playlists.filter((id) => id !== playlistId)
          : [...prev.playlists, playlistId],
      };
    });
  };

  // Toggle like for a song
  const toggleSongLike = (songId, e) => {
    e.stopPropagation();
    setLikedItems((prev) => {
      const isLiked = prev.songs.includes(songId);
      return {
        ...prev,
        songs: isLiked
          ? prev.songs.filter((id) => id !== songId)
          : [...prev.songs, songId],
      };
    });
  };

  const handleSearchItemClick = (type, item, index) => {
    if (type === "song") {
      const songIndex = songsData.songs.findIndex(
        (song) => song.title === item.title
      );
      if (songIndex !== -1) {
        handleTrackClick(songIndex);
      }
    } else if (type === "playlist") {
      handleChartClick(item);
    } else if (type === "artist") {
      // Navigate to artist page or filter by artist
      // For now, just filter songs by this artist
      setSearchQuery(item);
    }
    setShowSearchResults(false);
    setIsSearchFocused(false);
  };

  const EqualizerBars = useCallback(() => {
    const currentHeights = animationFrames[animationStep];

    return (
      <div className="flex items-end h-4 space-x-0.5">
        {currentHeights.map((height, i) => (
          <div
            key={i}
            className="w-0.5 bg-black rounded-sm transition-all duration-100 ease-in-out"
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
    );
  }, [animationStep]);

  if (loading) {
    return (
      <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-12 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-12 pb-32">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative" ref={searchRef}>
          <div
            className={`flex items-center bg-gray-800 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-white focus-within:ring-opacity-50 transition-all duration-200 ${
              isSearchFocused ? "w-96" : ""
            }`}
          >
            <FaSearch className="text-gray-400 mr-2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for songs, artists, albums..."
              className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim() !== "") setShowSearchResults(true);
                setIsSearchFocused(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowSearchResults(false);
                  setIsSearchFocused(false);
                }
              }}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {showSearchResults && (
            <div className="absolute top-12 left-0 w-96 bg-gray-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
              <div className="p-2">
                <h3 className="text-gray-400 text-sm font-semibold px-3 py-1">
                  Search results for "{searchQuery}"
                </h3>

                {searchResults.songs.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-gray-400 text-xs uppercase tracking-wider font-semibold px-3 py-1">
                      Songs
                    </h4>
                    {searchResults.songs.map((song, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
                        onClick={() =>
                          handleSearchItemClick("song", song, index)
                        }
                      >
                        <img
                          src={song.cover}
                          alt={song.title}
                          className="w-10 h-10 rounded-md mr-3"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white truncate font-medium">
                            {song.title}
                          </p>
                          <p className="text-gray-400 text-sm truncate">
                            {song.artist} • {song.album}
                          </p>
                        </div>
                        <div className="text-gray-500 text-xs">
                          {song.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.playlists.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-gray-400 text-xs uppercase tracking-wider font-semibold px-3 py-1">
                      Playlists
                    </h4>
                    {searchResults.playlists.map((playlist, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
                        onClick={() =>
                          handleSearchItemClick("playlist", playlist, index)
                        }
                      >
                        <img
                          src={playlist.images[0].url}
                          alt={playlist.name}
                          className="w-10 h-10 rounded-md mr-3"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white truncate font-medium">
                            {playlist.name}
                          </p>
                          <p className="text-gray-400 text-sm truncate">
                            {playlist.tracks.total} tracks
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.artists.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-gray-400 text-xs uppercase tracking-wider font-semibold px-3 py-1">
                      Artists
                    </h4>
                    {searchResults.artists.map((artist, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
                        onClick={() =>
                          handleSearchItemClick("artist", artist, index)
                        }
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                          <FaUserCircle className="text-xl text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white truncate font-medium">
                            {artist}
                          </p>
                          <p className="text-gray-400 text-sm truncate">
                            Artist
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.songs.length === 0 &&
                  searchResults.playlists.length === 0 &&
                  searchResults.artists.length === 0 && (
                    <div className="p-4 text-center text-gray-400">
                      No results found for "{searchQuery}"
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Install App Button */}
          <button className="hidden md:flex items-center space-x-2 bg-transparent hover:bg-gray-800 text-white px-4 py-2 rounded-full transition-colors duration-200">
            <FaMobileAlt />
            <span>Install App</span>
          </button>

          {/* Explore Premium Button */}
          <button
            className="hidden md:flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors duration-200"
            onClick={() => navigate("/premium")}
          >
            <FaCrown className="text-yellow-500" />
            <span>Explore Premium</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200 relative"
              onClick={() => {
                setShowNotificationDropdown(!showNotificationDropdown);
                setShowProfileDropdown(false);
              }}
            >
              <FaBell className="text-xl text-gray-300 hover:text-white" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
            </button>

            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">
                    Notifications
                  </p>
                </div>
                <div className="py-1 max-h-60 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-700 cursor-pointer">
                    <p className="text-sm text-white">
                      New release from your favorite artist
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-700 cursor-pointer">
                    <p className="text-sm text-white">
                      Your playlist has been updated
                    </p>
                    <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-700 cursor-pointer">
                    <p className="text-sm text-white">
                      Exclusive content available for premium users
                    </p>
                    <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                  </div>
                </div>
                <div className="py-1 border-t border-gray-700">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer text-center"
                  >
                    View all notifications
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none cursor-pointer"
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotificationDropdown(false);
              }}
            >
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer">
                <FaUserCircle className="text-xl" />
              </div>
              <span className="hidden md:inline-block">User</span>
              <FaChevronDown className="hidden md:inline-block text-xs" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm text-white">Signed in as</p>
                  <p className="text-sm font-medium text-white truncate">
                    user@example.com
                  </p>
                </div>
                <div className="py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                  >
                    Account Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                  >
                    Upgrade to Premium
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                  >
                    Help
                  </a>
                </div>
                <div className="py-1 border-t border-gray-700">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                  >
                    Log out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto space-y-12">
        {/* Featured Charts Section */}
        {filteredPlaylists.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white cursor-default">
                Playlists
              </h2>
            </div>
            <div className="relative">
              {showLeftArrowPlaylists && activeFilter === "all" && (
                <button
                  onClick={() => scrollPlaylists("left")}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-gray-800 bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-lg"
                  style={{ marginLeft: "-20px" }}
                >
                  <FaChevronLeft className="text-gray-300 text-xl hover:text-white" />
                </button>
              )}
              <div
                ref={playlistsRef}
                className="overflow-x-auto pb-4 scrollbar-hide"
              >
                <div className="flex space-x-6 w-max">
                  {filteredPlaylists.map((chart) => (
                    <div
                      key={chart.id}
                      className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group flex-shrink-0 w-64 relative transform hover:scale-105 transition-transform ease-in-out duration-300"
                      onClick={() => handleChartClick(chart)}
                      onMouseEnter={() => setHoveredPlaylist(chart.id)}
                      onMouseLeave={() => setHoveredPlaylist(null)}
                    >
                      <div className="aspect-square w-full rounded-lg mb-5 group-hover:shadow-xl transition-shadow overflow-hidden relative">
                        <img
                          src={chart.images[0].url}
                          alt={chart.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={(e) => togglePlaylistLike(chart.id, e)}
                            className="p-2 bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 transition-all"
                          >
                            {likedItems.playlists.includes(chart.id) ? (
                              <FaHeart className="text-red-500 text-lg" />
                            ) : (
                              <FaRegHeart className="text-white text-lg" />
                            )}
                          </button>
                        </div>
                        {hoveredPlaylist === chart.id && (
                          <div className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl hover:scale-105 transform cursor-pointer">
                            <FaPlay className="text-black ml-1" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white truncate cursor-pointer">
                        {chart.name}
                      </h3>
                      <p className="text-md text-gray-400 mt-2 cursor-pointer">
                        {chart.tracks.total} tracks • Updated weekly
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {showRightArrowPlaylists && activeFilter === "all" && (
                <button
                  onClick={() => scrollPlaylists("right")}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-gray-800 bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-lg"
                  style={{ marginRight: "-20px" }}
                >
                  <FaChevronRight className="text-gray-300 text-xl hover:text-white" />
                </button>
              )}
            </div>
          </section>
        )}

        {/* Songs Section */}
        {filteredSongs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white cursor-default">
                Songs
              </h2>
            </div>

            <div className="relative">
              {showLeftArrowSongs && activeFilter === "all" && (
                <button
                  onClick={() => scrollSongs("left")}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-gray-800 bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-lg"
                  style={{ marginLeft: "-20px" }}
                >
                  <FaChevronLeft className="text-gray-300 text-xl hover:text-white" />
                </button>
              )}
              <div
                ref={songsRef}
                className="overflow-x-auto pb-4 scrollbar-hide"
              >
                <div className="flex space-x-6 w-max">
                  {filteredSongs.map((item, index) => {
                    const isCurrentTrack =
                      currentTrack &&
                      currentTrack.title === item.track.name &&
                      currentTrack.artist === item.track.artists[0].name;
                    const songId = `song-${index}`;

                    return (
                      <div
                        key={index}
                        className="bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group flex-shrink-0 w-48 relative transform hover:scale-105 transition-transform ease-in-out duration-300"
                        onClick={() => handleTrackClick(index)}
                        onMouseEnter={() => setHoveredSong(index)}
                        onMouseLeave={() => setHoveredSong(null)}
                      >
                        <div className="aspect-square w-full rounded-lg mb-4 group-hover:shadow-xl transition-shadow overflow-hidden relative">
                          <img
                            src={item.track.album.images[0].url}
                            alt={item.track.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={(e) => toggleSongLike(songId, e)}
                              className="p-2 bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 transition-all"
                            >
                              {likedItems.songs.includes(songId) ? (
                                <FaHeart className="text-red-500 text-lg" />
                              ) : (
                                <FaRegHeart className="text-white text-lg" />
                              )}
                            </button>
                          </div>
                          {hoveredSong === index && (
                            <div className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl hover:scale-105 transform cursor-pointer">
                              <FaPlay className="text-black ml-1" />
                            </div>
                          )}
                          {isCurrentTrack && isPlaying && (
                            <div className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl cursor-pointer">
                              <div className="flex items-center justify-center w-full h-4">
                                <EqualizerBars />
                              </div>
                            </div>
                          )}
                        </div>
                        <h3
                          className={`text-md font-bold text-white truncate ${
                            isCurrentTrack ? "text-green-500" : ""
                          } cursor-pointer`}
                        >
                          {item.track.name}
                          {item.track.explicit && (
                            <MdExplicit className="inline-block ml-1 text-gray-400" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1 truncate cursor-pointer">
                          {item.track.artists
                            .map((artist) => artist.name)
                            .join(", ")}
                        </p>
                        <p className="text-xs text-gray-500 mt-2 cursor-pointer">
                          {item.track.duration_formatted}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {showRightArrowSongs && activeFilter === "all" && (
                <button
                  onClick={() => scrollSongs("right")}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-gray-800 bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-lg"
                  style={{ marginRight: "-20px" }}
                >
                  <FaChevronRight className="text-gray-300 text-xl hover:text-white" />
                </button>
              )}
            </div>
          </section>
        )}

        {/* Popular Artists Section - Only shown in "All" view */}
        {activeFilter === "all" && <Singers />}
      </div>

      {/* Music Player */}
      {showPlayer && (
        <MusicPlayer
          currentTrack={currentTrack}
          setCurrentTrack={setCurrentTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  );
};

export default Home;
