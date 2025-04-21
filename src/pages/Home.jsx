// pages/Home.jsx
import React, { useState, useEffect, useCallback } from "react";
import MusicPlayer from "../components/MusicPlayer";
import ChartView from "../components/ChartView";
import songsData from "../data/songs.json";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdExplicit } from "react-icons/md";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(songsData.songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentlyHoveredTrack, setCurrentlyHoveredTrack] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);

  // Animation frames for the equalizer bars
  const animationFrames = [
    [3, 6, 9, 6, 3], // Frame 1
    [4, 7, 10, 7, 4], // Frame 2
    [2, 5, 8, 5, 2], // Frame 3
    [5, 8, 11, 8, 5], // Frame 4
  ];

  // Animation loop for the equalizer bars
  useEffect(() => {
    if (!isPlaying) {
      setAnimationStep(0);
      return;
    }

    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % animationFrames.length);
    }, 300); // Adjust speed here (300ms matches Spotify's animation speed)

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

  // Format duration (ms) to MM:SS
  const formatDuration = useCallback((ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  // Top tracks data with formatted duration
  const topTracks = songsData.songs.map((song, index) => ({
    id: `track-${index}`,
    track: {
      name: song.title,
      artists: [{ name: song.artist }],
      album: {
        name: song.album,
        images: [{ url: song.cover }],
      },
      duration_ms: song.duration * 1000,
      duration_formatted: formatDuration(song.duration * 1000),
      explicit: song.explicit || false,
    },
  }));

  // Handle track click from top tracks section
  const handleTrackClick = useCallback((trackIndex) => {
    if (trackIndex >= 0 && trackIndex < songsData.songs.length) {
      setCurrentTrack(songsData.songs[trackIndex]);
      setIsPlaying(true);
      setShowPlayer(true);
    }
  }, []);

  // Handle chart click from featured charts section
  const handleChartClick = useCallback((chart) => {
    setSelectedChart(chart);
  }, []);

  // Close the chart view
  const handleCloseChart = useCallback(() => {
    setSelectedChart(null);
  }, []);

  // Handle track click from chart view
  const handleChartTrackClick = useCallback((index) => {
    const songIndex = index % songsData.songs.length;
    setCurrentTrack(songsData.songs[songIndex]);
    setIsPlaying(true);
    setShowPlayer(true);
  }, []);

  // Equalizer bars component for the playing animation
  const EqualizerBars = useCallback(() => {
    const currentHeights = animationFrames[animationStep];
    
    return (
      <div className="flex items-end h-4 space-x-0.5">
        {currentHeights.map((height, i) => (
          <div 
            key={i}
            className="w-0.5 bg-green-500 rounded-sm transition-all duration-100 ease-in-out"
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
      {selectedChart ? (
        <ChartView 
          chart={selectedChart} 
          onClose={handleCloseChart}
          onTrackClick={handleChartTrackClick}
        />
      ) : (
        <div className="max-w-[1800px] mx-auto space-y-12">
          {/* Featured Charts Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Playlists</h2>
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
                          <div className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl hover:scale-105 transform">
                            <FaPlay className="text-black ml-1" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white truncate">{chart.name}</h3>
                      <p className="text-md text-gray-400 mt-2">
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
              <h2 className="text-3xl font-bold text-white">Songs</h2>
            </div>
            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-gray-800 text-gray-400 text-sm font-medium mb-2">
              <div className="col-span-1 flex justify-center">#</div>
              <div className="col-span-5">TITLE</div>
              <div className="col-span-4">ALBUM</div>
              <div className="col-span-2 flex justify-end">DURATION</div>
            </div>
            
            {/* Songs List */}
            <div className="space-y-2">
              {topTracks.map((item, index) => {
                const isCurrentTrack = currentTrack && 
                  currentTrack.title === item.track.name && 
                  currentTrack.artist === item.track.artists[0].name;
                
                return (
                  <div
                    key={index}
                    className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 cursor-pointer group items-center ${isCurrentTrack ? 'bg-gray-800' : ''}`}
                    onClick={() => handleTrackClick(index)}
                    onMouseEnter={() => setCurrentlyHoveredTrack(index)}
                    onMouseLeave={() => setCurrentlyHoveredTrack(null)}
                  >
                    {/* Track Number */}
                    <div className="col-span-1 flex justify-center text-gray-400 group-hover:text-white">
                      {currentlyHoveredTrack === index ? (
                        <FaPlay className="text-sm" />
                      ) : isCurrentTrack && isPlaying ? (
                        <div className="flex justify-center items-center w-full h-4">
                          <EqualizerBars />
                        </div>
                      ) : (
                        <span className="group-hover:hidden">{index + 1}</span>
                      )}
                      {currentlyHoveredTrack !== index && !(isCurrentTrack && isPlaying) && (
                        <FaPlay className="text-sm hidden group-hover:block" />
                      )}
                    </div>
                    
                    {/* Track Info */}
                    <div className="col-span-5 flex items-center gap-4">
                      <div className="w-10 h-10 flex-shrink-0 relative">
                        <img
                          src={item.track.album.images[0].url}
                          alt={item.track.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className={`text-md font-medium ${isCurrentTrack ? 'text-green-500' : 'text-white'} truncate`}>
                          {item.track.name}
                          {item.track.explicit && <MdExplicit className="inline-block ml-1 text-gray-400" />}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">
                          {item.track.artists.map((artist) => artist.name).join(", ")}
                        </p>
                      </div>
                    </div>
                    
                    {/* Album */}
                    <div className="col-span-4 text-gray-400 text-sm truncate">
                      {item.track.album.name}
                    </div>
                    
                    {/* Duration */}
                    <div className="col-span-2 text-gray-400 text-sm flex justify-end items-center">
                      {isCurrentTrack && isPlaying && (
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                      )}
                      {item.track.duration_formatted}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

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