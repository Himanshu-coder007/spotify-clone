import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaChevronLeft, FaTimes, FaRandom, FaRedo, FaPause, FaHeart } from 'react-icons/fa';
import { MdExplicit } from 'react-icons/md';
import MusicPlayer from '../components/MusicPlayer';
import songsData from '../data/songs.json';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Playlist = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showQueue, setShowQueue] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [repeatMode, setRepeatMode] = useState("none"); // 'none', 'queue', 'song'
  const [likedSongs, setLikedSongs] = useState([]);

  // Mock playlist data
  const featuredPlaylists = [
    {
      id: "playlist-1",
      name: "Top 50 Global",
      description: "The most played tracks right now worldwide",
      images: [{ url: "/img8.jpg" }],
      tracks: { total: 50 },
    },
    {
      id: "playlist-2",
      name: "Top 50 India",
      description: "The most played tracks right now in India",
      images: [{ url: "/img9.jpg" }],
      tracks: { total: 50 },
    },
    {
      id: "playlist-3",
      name: "Trending India",
      description: "Trending tracks in India this week",
      images: [{ url: "/img10.jpg" }],
      tracks: { total: 50 },
    },
    {
      id: "playlist-4",
      name: "Trending Global",
      description: "Trending tracks worldwide this week",
      images: [{ url: "/img16.jpg" }],
      tracks: { total: 50 },
    },
    {
      id: "playlist-5",
      name: "Mega Hits",
      description: "All the biggest hits in one playlist",
      images: [{ url: "/img11.jpg" }],
      tracks: { total: 50 },
    },
    {
      id: "playlist-6",
      name: "Happy Favorites",
      description: "Feel good favorites",
      images: [{ url: "/img15.jpg" }],
      tracks: { total: 50 },
    },
  ];

  // Playlist background color mapping
  const playlistColors = {
    "playlist-1": "#2a4365",
    "playlist-2": "#22543d",
    "playlist-3": "#742a2a",
    "playlist-4": "#44337a",
    "playlist-5": "#234e52",
    "playlist-6": "#744210",
  };

  useEffect(() => {
    // Find the playlist by ID
    const foundPlaylist = featuredPlaylists.find(p => p.id === playlistId);
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
    } else {
      // Handle not found
      navigate('/');
    }

    // Load liked songs
    const musicAppLikes = JSON.parse(localStorage.getItem("musicAppLikes")) || {
      playlists: [],
      songs: [],
    };
    setLikedSongs(musicAppLikes.songs || []);
  }, [playlistId, navigate]);

  // Mock songs data for the playlist
  const playlistSongs = songsData.songs.map((song, index) => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    album: playlist?.name || "Unknown Album",
    duration: song.duration,
    dateAdded: `${Math.floor(Math.random() * 30) + 1} days ago`,
    cover: song.cover,
    src: song.src,
    explicit: song.explicit,
    lyrics: song.lyrics || null
  }));

  const toggleLikeSong = (songId) => {
    const musicAppLikes = JSON.parse(localStorage.getItem("musicAppLikes")) || {
      playlists: [],
      songs: [],
    };
    const songIndex = musicAppLikes.songs.findIndex((id) => id === songId);

    if (songIndex === -1) {
      musicAppLikes.songs.push(songId);
      toast.success("Added to Liked Songs", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      musicAppLikes.songs.splice(songIndex, 1);
      toast.info("Removed from Liked Songs", {
        position: "top-right",
        autoClose: 2000,
      });
    }

    localStorage.setItem("musicAppLikes", JSON.stringify(musicAppLikes));
    setLikedSongs(musicAppLikes.songs);
  };

  const handleTrackClick = (index) => {
    const song = playlistSongs[index];
    
    if (currentTrack && currentTrack.id === song.id) {
      // Toggle play/pause if clicking the same song
      setIsPlaying(!isPlaying);
    } else {
      // Play the new song
      setCurrentTrack({
        id: song.id,
        title: song.title,
        artist: song.artist,
        album: song.album,
        cover: song.cover,
        src: song.src,
        duration: song.duration,
        lyrics: song.lyrics
      });
      
      // Set the queue to the remaining songs in the playlist
      const newQueue = [...playlistSongs.slice(index + 1)];
      setQueue(newQueue);
      setOriginalQueue(newQueue);
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
    
    setShowPlayer(true);
    setShowQueue(true);
  };

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      const firstSong = playlistSongs[0];
      
      if (currentTrack && currentTrack.id === firstSong.id) {
        // Toggle play/pause if already playing the first song
        setIsPlaying(!isPlaying);
      } else {
        // Start playing from the beginning
        setCurrentTrack({
          id: firstSong.id,
          title: firstSong.title,
          artist: firstSong.artist,
          album: firstSong.album,
          cover: firstSong.cover,
          src: firstSong.src,
          duration: firstSong.duration,
          lyrics: firstSong.lyrics
        });
        
        // Set the queue to all songs except the first one
        const newQueue = [...playlistSongs.slice(1)];
        setQueue(newQueue);
        setOriginalQueue(newQueue);
        setCurrentSongIndex(0);
        setIsPlaying(true);
      }
      
      setShowPlayer(true);
      setShowQueue(true);
    }
  };

  const handleNext = () => {
    if (repeatMode === "song") {
      // Restart current song
      return false; // Tell MusicPlayer to restart
    }

    if (queue.length > 0) {
      const nextSong = queue[0];
      setCurrentTrack({
        id: nextSong.id,
        title: nextSong.title,
        artist: nextSong.artist,
        album: nextSong.album,
        cover: nextSong.cover,
        src: nextSong.src,
        duration: nextSong.duration,
        lyrics: nextSong.lyrics
      });
      
      // Update the queue to remove the played song
      const newQueue = [...queue.slice(1)];
      setQueue(newQueue);
      if (!isShuffled) {
        setOriginalQueue(newQueue);
      }
      setCurrentSongIndex(currentSongIndex + 1);
      return true;
    } else if (repeatMode === "queue") {
      // Loop back to the first song
      const firstSong = playlistSongs[0];
      setCurrentTrack({
        id: firstSong.id,
        title: firstSong.title,
        artist: firstSong.artist,
        album: firstSong.album,
        cover: firstSong.cover,
        src: firstSong.src,
        duration: firstSong.duration,
        lyrics: firstSong.lyrics
      });
      const newQueue = [...playlistSongs.slice(1)];
      setQueue(newQueue);
      setOriginalQueue(newQueue);
      setCurrentSongIndex(0);
      setIsPlaying(true);
      return true;
    } else {
      // No more songs in queue
      return false;
    }
  };

  const handlePrevious = () => {
    if (currentSongIndex > 0) {
      const prevSong = playlistSongs[currentSongIndex - 1];
      setCurrentTrack({
        id: prevSong.id,
        title: prevSong.title,
        artist: prevSong.artist,
        album: prevSong.album,
        cover: prevSong.cover,
        src: prevSong.src,
        duration: prevSong.duration,
        lyrics: prevSong.lyrics
      });
      
      // Add the current song back to the queue
      const newQueue = [currentTrack, ...queue];
      setQueue(newQueue);
      if (!isShuffled) {
        setOriginalQueue(newQueue);
      }
      setCurrentSongIndex(currentSongIndex - 1);
      return true;
    } else if (repeatMode === "queue") {
      // Loop to the last song
      const lastSong = playlistSongs[playlistSongs.length - 1];
      setCurrentTrack({
        id: lastSong.id,
        title: lastSong.title,
        artist: lastSong.artist,
        album: lastSong.album,
        cover: lastSong.cover,
        src: lastSong.src,
        duration: lastSong.duration,
        lyrics: lastSong.lyrics
      });
      setQueue([]);
      setOriginalQueue([]);
      setCurrentSongIndex(playlistSongs.length - 1);
      setIsPlaying(true);
      return true;
    }
    return false;
  };

  const toggleShuffle = () => {
    if (isShuffled) {
      // Return to original order
      const remainingOriginalQueue = originalQueue.slice(currentSongIndex + 1 - currentSongIndex);
      setQueue(remainingOriginalQueue);
    } else {
      // Shuffle the queue
      const shuffledQueue = [...queue];
      for (let i = shuffledQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]];
      }
      setQueue(shuffledQueue);
    }
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    // Cycle through repeat modes: none -> queue -> song -> none
    setRepeatMode(prevMode => {
      if (prevMode === "none") return "queue";
      if (prevMode === "queue") return "song";
      return "none";
    });
  };

  if (!playlist) {
    return <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-12 flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>;
  }

  const playlistBackgroundColor = playlistColors[playlist.id] || "#000000";
  const isCurrentTrackInPlaylist = currentTrack && playlistSongs.some(song => song.id === currentTrack.id);

  return (
    <div 
      className="flex-1 h-screen overflow-y-auto p-8 relative"
      style={{
        background: `linear-gradient(180deg, ${playlistBackgroundColor} 0%, #000000 100%)`
      }}
    >
      <ToastContainer />
      
      <div className={`max-w-6xl mx-auto transition-all duration-300 ${showQueue ? 'mr-80' : ''}`}>
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <FaChevronLeft className="mr-2" />
          Back
        </button>

        {/* Playlist header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="relative">
            <img 
              src={playlist.images[0]?.url || "/default-playlist.jpg"} 
              alt={playlist.name}
              className="w-48 h-48 sm:w-64 sm:h-64 object-cover shadow-xl"
              style={{ boxShadow: '0 4px 60px rgba(0,0,0,.5)' }}
            />
            <button
              onClick={handlePlayAll}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg"
            >
              <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-700 transition-colors hover:scale-105">
                {isPlaying && isCurrentTrackInPlaylist ? (
                  <FaPause size={28} />
                ) : (
                  <FaPlay size={28} className="ml-1" />
                )}
              </div>
            </button>
          </div>
          <div>
            <p className="text-white uppercase text-xs tracking-widest mb-2">Playlist</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{playlist.name}</h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {playlist.description || "A great collection of tracks"}
            </p>
            <div className="flex items-center mt-4 text-gray-400 text-sm">
              <span className="font-bold text-white">Spotify</span>
              <span className="mx-1">•</span>
              <span>{playlistSongs.length} songs</span>
              <span className="mx-1">•</span>
              <span>about {Math.floor(playlistSongs.length * 3.5 / 60)} hr</span>
            </div>
          </div>
        </div>

        {/* Play controls */}
        <div className="mb-8 flex items-center gap-4">
          <button 
            className="bg-green-500 hover:bg-green-400 transition-colors text-black rounded-full px-8 py-3 font-bold flex items-center"
            onClick={handlePlayAll}
          >
            {isPlaying && isCurrentTrackInPlaylist ? (
              <FaPause className="mr-2" />
            ) : (
              <FaPlay className="mr-2" />
            )}
            {isPlaying && isCurrentTrackInPlaylist ? "Pause" : "Play"}
          </button>
          
          <button 
            className={`p-3 rounded-full ${isShuffled ? 'bg-green-500 text-black' : 'bg-gray-800 text-white'} hover:bg-gray-700 transition-colors`}
            onClick={toggleShuffle}
            title="Shuffle"
          >
            <FaRandom />
          </button>
          
          <button 
            className={`p-3 rounded-full ${repeatMode !== "none" ? 'bg-green-500 text-black' : 'bg-gray-800 text-white'} hover:bg-gray-700 transition-colors`}
            onClick={toggleRepeat}
            title={`Repeat ${repeatMode}`}
          >
            <FaRedo />
            {repeatMode === "song" && (
              <span className="absolute -mt-6 ml-1 text-xs text-green-500">1</span>
            )}
          </button>
        </div>

        {/* Songs table */}
        <div className="rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-700">
              <tr className="text-left text-gray-400 text-sm">
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">Title</th>
                <th className="p-4 hidden md:table-cell">Album</th>
                <th className="p-4 hidden sm:table-cell">Date Added</th>
                <th className="p-4 text-right">
                  <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                </th>
              </tr>
            </thead>
            <tbody>
              {playlistSongs.map((song, index) => {
                const isCurrentTrackPlaying = currentTrack && currentTrack.id === song.id && isPlaying;
                const isLiked = likedSongs.includes(song.id);
                
                return (
                  <tr 
                    key={song.id} 
                    className={`border-b border-gray-700 hover:bg-gray-700 hover:bg-opacity-40 transition-colors ${isCurrentTrackPlaying ? 'text-green-500' : 'text-white'}`}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => handleTrackClick(index)}
                  >
                    <td className="p-4 text-center">
                      {hoveredRow === index ? (
                        isCurrentTrackPlaying ? (
                          <FaPause className="mx-auto" />
                        ) : (
                          <FaPlay className="mx-auto" />
                        )
                      ) : isCurrentTrackPlaying ? (
                        <div className="flex items-center justify-center h-5">
                          <div className="flex space-x-1">
                            <div className="w-1 h-3 bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1 h-3 bg-green-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1 h-3 bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">{index + 1}</span>
                      )}
                    </td>
                    <td className="p-4 font-medium">
                      <div className="flex items-center">
                        <div className="w-10 h-10 mr-3 flex-shrink-0">
                          <img 
                            src={song.cover} 
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className={`${isCurrentTrackPlaying ? 'text-green-500' : 'text-white'}`}>
                            {song.title}
                            {song.explicit && <MdExplicit className="inline-block ml-1 text-gray-400" />}
                          </div>
                          <div className="text-gray-400 text-sm">{song.artist}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 hidden md:table-cell">{song.album}</td>
                    <td className="p-4 text-gray-400 hidden sm:table-cell">{song.dateAdded}</td>
                    <td className="p-4 text-gray-400 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className={`p-1 rounded-full ${
                            isLiked
                              ? "text-green-500 hover:text-green-400"
                              : "text-gray-400 hover:text-white"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLikeSong(song.id);
                          }}
                          aria-label={isLiked ? "Unlike song" : "Like song"}
                        >
                          <FaHeart className={isLiked ? "fill-current" : ""} />
                        </button>
                        {isCurrentTrackPlaying ? (
                          <div className="inline-flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                            <span>{song.duration}</span>
                          </div>
                        ) : (
                          song.duration
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Queue Sidebar */}
      {showQueue && (
        <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 bg-opacity-90 backdrop-blur-sm z-10 shadow-2xl overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Queue</h2>
              <button 
                onClick={() => setShowQueue(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            {/* Now Playing */}
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Now Playing</h3>
              {currentTrack && (
                <div className="flex items-center bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <img 
                    src={currentTrack.cover} 
                    alt={currentTrack.title}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <h4 className="text-white font-medium">{currentTrack.title}</h4>
                    <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Next in Queue */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Next in Queue</h3>
              {queue.length > 0 || repeatMode === "queue" ? (
                <ul className="space-y-3">
                  {queue.map((song, index) => (
                    <li 
                      key={`${song.id}-${index}`}
                      className="flex items-center p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                      onClick={() => {
                        setCurrentTrack(song);
                        setQueue(queue.slice(index + 1));
                        setCurrentSongIndex(currentSongIndex + index + 1);
                        setIsPlaying(true);
                      }}
                    >
                      <img 
                        src={song.cover} 
                        alt={song.title}
                        className="w-12 h-12 object-cover rounded mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{song.title}</h4>
                        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                      </div>
                      <span className="text-gray-400 text-sm ml-2">{song.duration}</span>
                    </li>
                  ))}
                  {repeatMode === "queue" && currentSongIndex > 0 && (
                    <>
                      <li className="p-2 text-xs text-gray-500 text-center">
                        Queue will repeat from the beginning
                      </li>
                      {playlistSongs.slice(0, currentSongIndex).map((song, index) => (
                        <li
                          key={`repeat-${song.id}-${index}`}
                          className="flex items-center p-2 hover:bg-gray-800 rounded-lg cursor-pointer opacity-60"
                          onClick={() => {
                            setCurrentTrack(song);
                            setQueue([...playlistSongs.slice(index + 1)]);
                            setCurrentSongIndex(index);
                            setIsPlaying(true);
                          }}
                        >
                          <img 
                            src={song.cover} 
                            alt={song.title}
                            className="w-12 h-12 object-cover rounded mr-3"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate">{song.title}</h4>
                            <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                          </div>
                          <span className="text-gray-400 text-sm ml-2">{song.duration}</span>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No more songs in queue</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Music Player */}
      {showPlayer && currentTrack && (
        <MusicPlayer 
          currentTrack={currentTrack} 
          setCurrentTrack={setCurrentTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onClose={() => {
            setShowPlayer(false);
            setIsPlaying(false);
            setCurrentTrack(null);
            setShowQueue(false);
          }}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={queue.length > 0 || repeatMode === "queue"}
          hasPrevious={currentSongIndex > 0 || repeatMode === "queue"}
          queue={playlistSongs}
          currentSongIndex={currentSongIndex}
          setCurrentSongIndex={setCurrentSongIndex}
        />
      )}
    </div>
  );
};

export default Playlist;