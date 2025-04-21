// pages/Home.jsx
import React, { useState } from "react";
import MusicPlayer from "../components/MusicPlayer";
import ChartView from "../components/ChartView";
import songsData from "../data/songs.json";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(songsData.songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);

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

  // Top tracks data - updated to match all songs in songsData
  const topTracks = songsData.songs.map(song => ({
    track: {
      name: song.title,
      artists: [{ name: song.artist }],
      album: {
        name: song.album,
        images: [{ url: song.cover }],
      },
    },
  }));

  // New releases data
  const newReleases = Array(12).fill().map((_, i) => ({
    id: `album-${i}`,
    name: `New Release ${i + 1}`,
    artists: [{ name: "Artist Name" }],
    images: [{ url: "" }],
  }));

  // Recently played data
  const recentlyPlayed = Array(12).fill().map((_, i) => ({
    track: {
      name: `Recently Played ${i + 1}`,
      artists: [{ name: "Recent Artist" }],
      album: {
        name: "Recent Album",
        images: [{ url: "" }],
      },
    },
  }));

  // Handle track click from top tracks section
  const handleTrackClick = (trackIndex) => {
    if (trackIndex >= 0 && trackIndex < songsData.songs.length) {
      setCurrentTrack(songsData.songs[trackIndex]);
      setIsPlaying(true);
      setShowPlayer(true);
    }
  };

  // Handle chart click from featured charts section
  const handleChartClick = (chart) => {
    setSelectedChart(chart);
  };

  // Close the chart view
  const handleCloseChart = () => {
    setSelectedChart(null);
  };

  // Handle track click from chart view
  const handleChartTrackClick = (index) => {
    const songIndex = index % songsData.songs.length;
    setCurrentTrack(songsData.songs[songIndex]);
    setIsPlaying(true);
    setShowPlayer(true);
  };

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
        <div className="max-w-[1800px] mx-auto">
          {/* Featured Charts Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Playlists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredPlaylists.map((chart) => (
                <div
                  key={chart.id}
                  className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleChartClick(chart)}
                >
                  <div className="aspect-square w-full rounded-lg mb-5 group-hover:shadow-xl transition-shadow overflow-hidden">
                    <img 
                      src={chart.images[0].url} 
                      alt={chart.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white">{chart.name}</h3>
                  <p className="text-md text-gray-400 mt-2">
                    {chart.tracks.total} tracks • Updated weekly
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Today's Biggest Hits Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Songs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topTracks.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group flex items-center gap-4"
                  onClick={() => handleTrackClick(index)}
                >
                  {item.track?.album?.images?.length > 0 ? (
                    <img
                      src={item.track.album.images[0].url}
                      alt={item.track.name}
                      className="w-16 h-16 rounded-lg group-hover:shadow-lg transition-shadow object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-600 to-rose-400 group-hover:shadow-lg transition-shadow"></div>
                  )}
                  <div className="truncate">
                    <h3 className="text-lg font-bold text-white truncate">
                      {item.track?.name || `Track ${index + 1}`}
                    </h3>
                    <p className="text-md text-gray-400 mt-1 truncate">
                      {item.track?.artists
                        ?.map((artist) => artist.name)
                        .join(", ") || "Various artists"}
                    </p>
                  </div>
                </div>
              ))}
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