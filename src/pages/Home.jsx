import React, { useState, useEffect, useCallback } from "react";
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
} from "react-icons/fa";
import { MdExplicit } from "react-icons/md";
import Singers from "../components/Singers";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(songsData.songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentlyHoveredTrack, setCurrentlyHoveredTrack] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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
      id: `track-${index}`,
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
        <div></div>
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
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white cursor-default">
              Playlists
            </h2>
          </div>
          <div className="relative">
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex space-x-6 w-max">
                {featuredPlaylists.map((chart) => (
                  <div
                    key={chart.id}
                    className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group flex-shrink-0 w-64 relative"
                    onClick={() => handleChartClick(chart)}
                    onMouseEnter={() => setHoveredItem(`playlist-${chart.id}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="aspect-square w-full rounded-lg mb-5 group-hover:shadow-xl transition-shadow overflow-hidden relative">
                      <img
                        src={chart.images[0].url}
                        alt={chart.name}
                        className="w-full h-full object-cover"
                      />
                      {hoveredItem === `playlist-${chart.id}` && (
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
          </div>
        </section>

        {/* Songs Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white cursor-default">
              Songs
            </h2>
          </div>

          <div className="relative">
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex space-x-6 w-max">
                {topTracks.map((item, index) => {
                  const isCurrentTrack =
                    currentTrack &&
                    currentTrack.title === item.track.name &&
                    currentTrack.artist === item.track.artists[0].name;

                  return (
                    <div
                      key={index}
                      className="bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group flex-shrink-0 w-48 relative"
                      onClick={() => handleTrackClick(index)}
                      onMouseEnter={() => setCurrentlyHoveredTrack(index)}
                      onMouseLeave={() => setCurrentlyHoveredTrack(null)}
                    >
                      <div className="aspect-square w-full rounded-lg mb-4 group-hover:shadow-xl transition-shadow overflow-hidden relative">
                        <img
                          src={item.track.album.images[0].url}
                          alt={item.track.name}
                          className="w-full h-full object-cover"
                        />
                        {currentlyHoveredTrack === index ? (
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transform transition-transform cursor-pointer">
                              <FaPlay className="text-black ml-1" />
                            </div>
                          </div>
                        ) : isCurrentTrack && isPlaying ? (
                          <div className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl cursor-pointer">
                            <div className="flex items-center justify-center w-full h-4">
                              <EqualizerBars />
                            </div>
                          </div>
                        ) : null}
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
          </div>
        </section>

        {/* Popular Artists Section - Moved below Songs section */}
        <Singers />
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
