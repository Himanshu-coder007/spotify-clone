// pages/Home.jsx
import React, { useState } from "react";
import MusicPlayer from "../components/MusicPlayer";
import songsData from "../data/songs.json";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(songsData.songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  // Mock data
  const featuredPlaylists = Array(10)
    .fill()
    .map((_, i) => ({
      id: `playlist-${i}`,
      name: `Featured Playlist ${i + 1}`,
      images: [{ url: "" }],
      tracks: { total: Math.floor(Math.random() * 50) + 20 },
    }));

  const topTracks = [
    {
      track: {
        name: "Summer Vibes",
        artists: [{ name: "Chill Wave" }],
        album: {
          name: "Beach Memories",
          images: [{ url: "/img1.jpg" }],
        },
      },
    },
    {
      track: {
        name: "Midnight Drive",
        artists: [{ name: "Night Rider" }],
        album: {
          name: "City Lights",
          images: [{ url: "/img2.jpg" }],
        },
      },
    },
    {
      track: {
        name: "Morning Coffee",
        artists: [{ name: "Acoustic Breeze" }],
        album: {
          name: "Quiet Moments",
          images: [{ url: "/img3.jpg" }],
        },
      },
    },
    {
      track: {
        name: "Electric Dreams",
        artists: [{ name: "Synth Master" }],
        album: {
          name: "Future Sounds",
          images: [{ url: "/img4.jpg" }],
        },
      },
    },
    {
      track: {
        name: "Rainy Day",
        artists: [{ name: "Piano Soul" }],
        album: {
          name: "Weather Moods",
          images: [{ url: "/img5.jpg" }],
        },
      },
    },
    {
      track: {
        name: "Sunset Boulevard",
        artists: [{ name: "Urban Jazz" }],
        album: {
          name: "Metropolitan",
          images: [{ url: "/img6.jpg" }],
        },
      },
    },
  ];

  const newReleases = Array(12)
    .fill()
    .map((_, i) => ({
      id: `album-${i}`,
      name: `New Release ${i + 1}`,
      artists: [{ name: "Artist Name" }],
      images: [{ url: "" }],
    }));

  const recentlyPlayed = Array(12)
    .fill()
    .map((_, i) => ({
      track: {
        name: `Recently Played ${i + 1}`,
        artists: [{ name: "Recent Artist" }],
        album: {
          name: "Recent Album",
          images: [{ url: "" }],
        },
      },
    }));

  const handleTrackClick = (trackIndex) => {
    const songs = songsData.songs;
    const clickedTrack = topTracks[trackIndex];
    const songIndex = songs.findIndex(
      song => song.cover === clickedTrack.track.album.images[0].url
    );
    
    if (songIndex !== -1) {
      setCurrentTrack(songs[songIndex]);
      setIsPlaying(true);
      setShowPlayer(true);
    }
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setShowPlayer(false);
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
      <div className="max-w-[1800px] mx-auto">
        {/* Featured Charts Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">
            Featured Charts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Top 50 Global */}
            <div className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
              <div className="aspect-square w-full rounded-lg mb-5 group-hover:shadow-xl transition-shadow overflow-hidden">
                <img 
                  src="/img8.jpg" 
                  alt="Top 50 Global"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-white">Top 50 Global</h3>
              <p className="text-md text-gray-400 mt-2">
                Your weekly update of the most played tracks
              </p>
            </div>

            {/* Top 50 India */}
            <div className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
              <div className="aspect-square w-full rounded-lg mb-5 group-hover:shadow-xl transition-shadow overflow-hidden">
                <img 
                  src="/img9.jpg" 
                  alt="Top 50 India"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-white">Top 50 India</h3>
              <p className="text-md text-gray-400 mt-2">
                Your weekly update of the most played tracks
              </p>
            </div>

            {/* Trending India */}
            <div className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
              <div className="aspect-square w-full rounded-lg mb-5 group-hover:shadow-xl transition-shadow overflow-hidden">
                <img 
                  src="/img10.jpg" 
                  alt="Trending India"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-white">Trending India</h3>
              <p className="text-md text-gray-400 mt-2">
                Your weekly update of the most played tracks
              </p>
            </div>

            {/* Trending Global */}
            <div className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
              <div className="aspect-square w-full rounded-lg mb-5 group-hover:shadow-xl transition-shadow overflow-hidden">
                <img 
                  src="/img16.jpg" 
                  alt="Trending Global"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-white">Trending Global</h3>
              <p className="text-md text-gray-400 mt-2">
                Your weekly update of the most played tracks
              </p>
            </div>

            {/* Mega Hits */}
            <div className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
              <div className="aspect-square w-full rounded-lg mb-5 group-hover:shadow-xl transition-shadow overflow-hidden">
                <img 
                  src="/img11.jpg" 
                  alt="Mega Hits"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-white">Mega Hits</h3>
              <p className="text-md text-gray-400 mt-2">
                Your weekly update of the most played tracks
              </p>
            </div>

            {/* Happy Favorites */}
            <div className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
              <div className="aspect-square w-full rounded-lg mb-5 group-hover:shadow-xl transition-shadow overflow-hidden">
                <img 
                  src="/img15.jpg" 
                  alt="Happy Favorites"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-white">Happy Favorites</h3>
              <p className="text-md text-gray-400 mt-2">
                Your weekly update of the most played tracks
              </p>
            </div>
          </div>
        </section>

        {/* Today's Biggest Hits Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">
            Today's biggest hits
          </h2>
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

      {/* Music Player */}
      {showPlayer && (
        <MusicPlayer 
          currentTrack={currentTrack} 
          setCurrentTrack={setCurrentTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
};

export default Home;