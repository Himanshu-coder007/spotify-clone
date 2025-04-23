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
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
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

  const playlistsRef = useRef(null);
  const songsRef = useRef(null);

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
  }, [checkScrollPosition, activeFilter]); // Added activeFilter to dependencies

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
  const filteredPlaylists = activeFilter === "liked" 
    ? featuredPlaylists.filter(playlist => likedItems.playlists.includes(playlist.id))
    : featuredPlaylists;

  const filteredSongs = activeFilter === "liked"
    ? topTracks.filter(song => likedItems.songs.includes(song.id))
    : topTracks;

  const handleTrackClick = useCallback((trackIndex) => {
    if (trackIndex >= 0 && trackIndex < songsData.songs.length) {
      setCurrentTrack(songsData.songs[trackIndex]);
      setIsPlaying(true);
      setShowPlayer(true);
    }
  }, []);

  const handleChartClick = useCallback(
    (chart) => {
      navigate(`/playlist/${chart.id}`);
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
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === "all"
                ? "bg-white text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === "liked"
                ? "bg-white text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
            onClick={() => setActiveFilter("liked")}
          >
            Liked
          </button>
        </div>
        <div className="flex items-center space-x-4">
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