import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiPlay,
  FiPause,
  FiHeart,
  FiShuffle,
  FiRepeat,
  FiClock,
  FiPlus,
  FiMoreHorizontal,
  FiEdit,
  FiTrash2,
  FiArrowLeft,
  FiX,
  FiMusic,
} from "react-icons/fi";
import { MdExplicit } from "react-icons/md";
import MusicPlayer from "../components/MusicPlayer";
import songsData from "../data/songs.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Playlist = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showQueueSidebar, setShowQueueSidebar] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [hoveredSong, setHoveredSong] = useState(null);
  const [repeatMode, setRepeatMode] = useState("none"); // 'none', 'queue', 'song'

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
    const foundPlaylist = featuredPlaylists.find((p) => p.id === playlistId);
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
    } else {
      // Handle not found
      navigate("/");
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
    lyrics: song.lyrics || null,
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

      // Sort songs by liked status
      const likedSongsOrder = musicAppLikes.songs;
      const sortedSongs = [...playlistSongs].sort((a, b) => {
        const aIndex = likedSongsOrder.indexOf(a.id);
        const bIndex = likedSongsOrder.indexOf(b.id);

        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });

      setQueue(sortedSongs);
      setOriginalQueue(sortedSongs);

      if (currentTrack) {
        const newIndex = sortedSongs.findIndex(
          (song) => song.id === currentTrack.id
        );
        if (newIndex !== -1) {
          setCurrentSongIndex(newIndex);
        }
      }
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

  const playSong = (songId) => {
    const songToPlay = playlistSongs.find((s) => s.id === songId);
    if (songToPlay) {
      const songIndex = playlistSongs.findIndex((song) => song.id === songId);

      if (songIndex !== -1) {
        if (currentTrack?.id === songId) {
          setIsPlaying(!isPlaying);
        } else {
          setCurrentSongIndex(songIndex);
          setCurrentTrack(songToPlay);
          setIsPlaying(true);

          // Set the queue to the remaining songs
          const newQueue = [...playlistSongs.slice(songIndex + 1)];
          setQueue(newQueue);
          setOriginalQueue(newQueue);
        }
        setShowPlayer(true);
        setShowQueueSidebar(true);
      }
    }
  };

  const playAllSongs = () => {
    if (playlistSongs.length > 0) {
      const firstSong = playlistSongs[0];

      if (currentTrack?.id === firstSong.id) {
        setIsPlaying(!isPlaying);
      } else {
        setCurrentSongIndex(0);
        setCurrentTrack(firstSong);
        setIsPlaying(true);

        // Set the queue to all songs except the first one
        const newQueue = [...playlistSongs.slice(1)];
        setQueue(newQueue);
        setOriginalQueue(newQueue);
      }

      setShowPlayer(true);
      setShowQueueSidebar(true);
    }
  };

  const handleNextSong = () => {
    if (repeatMode === "song") {
      restartCurrentSong();
      return;
    }

    if (currentSongIndex < playlistSongs.length - 1) {
      const nextIndex = currentSongIndex + 1;
      setCurrentSongIndex(nextIndex);
      setCurrentTrack(playlistSongs[nextIndex]);
      setIsPlaying(true);

      // Update queue
      const newQueue = [...playlistSongs.slice(nextIndex + 1)];
      setQueue(newQueue);
      if (!isShuffled) {
        setOriginalQueue(newQueue);
      }
    } else if (repeatMode === "queue") {
      // Loop back to the first song
      setCurrentSongIndex(0);
      setCurrentTrack(playlistSongs[0]);
      setIsPlaying(true);

      // Set queue to all songs except first
      const newQueue = [...playlistSongs.slice(1)];
      setQueue(newQueue);
      setOriginalQueue(newQueue);
    } else {
      setIsPlaying(false);
      setCurrentTrack(null);
      setShowQueueSidebar(false);
    }
  };

  const handlePreviousSong = () => {
    if (currentSongIndex > 0) {
      const prevIndex = currentSongIndex - 1;
      setCurrentSongIndex(prevIndex);
      setCurrentTrack(playlistSongs[prevIndex]);
      setIsPlaying(true);

      // Add current song back to queue
      const newQueue = [playlistSongs[currentSongIndex], ...queue];
      setQueue(newQueue);
      if (!isShuffled) {
        setOriginalQueue(newQueue);
      }
    } else if (repeatMode === "queue") {
      // Loop to the last song
      const lastIndex = playlistSongs.length - 1;
      setCurrentSongIndex(lastIndex);
      setCurrentTrack(playlistSongs[lastIndex]);
      setIsPlaying(true);

      // Empty the queue
      setQueue([]);
      setOriginalQueue([]);
    }
  };

  const toggleShuffle = () => {
    if (isShuffled) {
      // Return to original order
      setQueue([...originalQueue]);
    } else {
      // Shuffle the queue
      const shuffledQueue = [...queue];
      for (let i = shuffledQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQueue[i], shuffledQueue[j]] = [
          shuffledQueue[j],
          shuffledQueue[i],
        ];
      }
      setQueue(shuffledQueue);
    }
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    // Cycle through repeat modes: none -> queue -> song -> none
    setRepeatMode((prevMode) => {
      if (prevMode === "none") return "queue";
      if (prevMode === "queue") return "song";
      return "none";
    });
  };

  const restartCurrentSong = () => {
    if (currentTrack) {
      setCurrentTrack({ ...currentTrack });
      setIsPlaying(true);
    }
  };

  if (!playlist) {
    return (
      <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-12 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const playlistBackgroundColor = playlistColors[playlist.id] || "#000000";
  const isCurrentTrackInPlaylist =
    currentTrack && playlistSongs.some((song) => song.id === currentTrack.id);

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden flex">
      <ToastContainer />

      {/* Main Content */}
      <div
        className={`h-screen overflow-hidden flex flex-col ${
          showQueueSidebar ? "w-[calc(100vw-360px)]" : "w-full"
        }`}
      >
        <div
          className="flex-1 overflow-y-auto p-6 scrollbar-hide"
          style={{
            background: `linear-gradient(180deg, ${playlistBackgroundColor} 0%, rgba(0,0,0,0.8) 100%)`,
          }}
        >
          {/* Back button */}
          <div className="flex items-center gap-6 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 transition-all"
            >
              <FiArrowLeft size={20} />
            </button>
          </div>

          {/* Playlist Header */}
          <div className="flex flex-col md:flex-row items-start mb-8 gap-6">
            <div className="w-full md:w-56 h-56 rounded-lg shadow-xl flex items-center justify-center shrink-0 relative group">
              <img
                src={playlist.images[0]?.url || "/default-playlist.jpg"}
                alt={playlist.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={playAllSongs}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
              >
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-400 transition-all hover:scale-105">
                  {isPlaying && isCurrentTrackInPlaylist ? (
                    <FiPause size={28} className="text-black" />
                  ) : (
                    <FiPlay size={28} className="ml-1 text-black" />
                  )}
                </div>
              </button>
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col">
                <span className="text-sm font-semibold mb-2">PLAYLIST</span>
                <h2 className="text-5xl font-bold mb-4 truncate max-w-2xl">
                  {playlist.name}
                </h2>
                <p className="text-gray-400 mb-6 line-clamp-2 max-w-2xl">
                  {playlist.description}
                </p>
                <div className="flex items-center text-sm text-gray-400 gap-4">
                  <span className="font-medium text-white">Spotify</span>
                  <span>
                    {playlistSongs.length}{" "}
                    {playlistSongs.length === 1 ? "song" : "songs"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Playlist Actions */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={playAllSongs}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 transition-all hover:scale-105"
              aria-label={isPlaying ? "Pause all" : "Play all"}
            >
              {isPlaying && isCurrentTrackInPlaylist ? (
                <FiPause size={28} className="text-black" />
              ) : (
                <FiPlay size={28} className="ml-1 text-black" />
              )}
            </button>
          </div>

          {/* Playlist Songs */}
          <div className="mb-24">
            {/* Songs Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-gray-400 text-sm border-b border-gray-800 mb-2">
              <div className="col-span-1 flex justify-center">#</div>
              <div className="col-span-5">TITLE</div>
              <div className="col-span-3">ARTIST</div>
              <div className="col-span-2">ALBUM</div>
              <div className="col-span-1 flex justify-end">
                <FiClock className="text-gray-400" />
              </div>
            </div>

            {playlistSongs.length > 0 ? (
              <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                {playlistSongs.map((song, index) => {
                  const isCurrentPlaying =
                    currentTrack?.id === song.id && isPlaying;
                  const isLiked = likedSongs.includes(song.id);

                  return (
                    <div
                      key={song.id}
                      className={`grid grid-cols-12 gap-4 items-center p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer ${
                        isCurrentPlaying ? "bg-gray-800" : ""
                      }`}
                      onClick={() => playSong(song.id)}
                      onMouseEnter={() => setHoveredSong(song.id)}
                      onMouseLeave={() => setHoveredSong(null)}
                    >
                      <div className="col-span-1 flex justify-center">
                        {isCurrentPlaying ? (
                          <div className="flex items-center space-x-1 h-5">
                            <div
                              className="w-1 h-2 bg-green-500 animate-pulse"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-1 h-3 bg-green-500 animate-pulse"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-1 h-4 bg-green-500 animate-pulse"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                            <div
                              className="w-1 h-3 bg-green-500 animate-pulse"
                              style={{ animationDelay: "450ms" }}
                            ></div>
                          </div>
                        ) : hoveredSong === song.id ? (
                          <button
                            className="text-white hover:scale-110 transition-transform"
                            onClick={(e) => {
                              e.stopPropagation();
                              playSong(song.id);
                            }}
                          >
                            {currentTrack?.id === song.id && isPlaying ? (
                              <FiPause size={18} />
                            ) : (
                              <FiPlay size={18} />
                            )}
                          </button>
                        ) : (
                          <span className="text-gray-500">{index + 1}</span>
                        )}
                      </div>

                      <div className="col-span-5 flex items-center gap-3">
                        <img
                          src={song.cover}
                          alt={song.title}
                          className="w-10 h-10 rounded"
                        />
                        <div className="flex flex-col">
                          <span
                            className={`truncate ${
                              isCurrentPlaying ? "text-green-500" : "text-white"
                            }`}
                          >
                            {song.title}
                          </span>
                          <span className="text-xs text-gray-400">
                            {song.explicit && <MdExplicit className="inline" />}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-3 text-gray-400 truncate">
                        {song.artist}
                      </div>

                      <div className="col-span-2 text-gray-400 truncate">
                        {song.album}
                      </div>

                      <div className="col-span-1 flex items-center justify-end gap-3">
                        <button
                          className={`p-1 ${
                            isLiked
                              ? "text-green-500"
                              : "text-gray-400 hover:text-white"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLikeSong(song.id);
                          }}
                          aria-label={isLiked ? "Unlike song" : "Like song"}
                        >
                          <FiHeart
                            size={18}
                            className={isLiked ? "fill-current" : ""}
                          />
                        </button>
                        <span className="text-gray-400 text-sm min-w-[40px] text-right">
                          {song.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <FiMusic className="mx-auto text-4xl mb-4" />
                <p className="text-lg mb-2">This playlist is empty</p>
                <p className="text-sm text-gray-600 mb-6">
                  Add some songs to get started
                </p>
                <button
                  onClick={() => navigate("/search")}
                  className="px-6 py-2 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform"
                >
                  <FiPlus className="inline mr-2" />
                  Browse Songs
                </button>
              </div>
            )}
          </div>
        </div>

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
              setShowQueueSidebar(false);
            }}
            onNext={handleNextSong}
            onPrevious={handlePreviousSong}
            hasNext={
              currentSongIndex < playlistSongs.length - 1 ||
              repeatMode === "queue"
            }
            hasPrevious={currentSongIndex > 0 || repeatMode === "queue"}
            queue={playlistSongs}
            currentSongIndex={currentSongIndex}
            setCurrentSongIndex={setCurrentSongIndex}
            repeatMode={repeatMode}
            toggleRepeat={toggleRepeat}
            restartCurrentSong={restartCurrentSong}
          />
        )}
      </div>

      {/* Queue Sidebar */}
      {showQueueSidebar && currentTrack && (
        <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Now Playing</h3>
            </div>
          </div>

          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-16 h-16 rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{currentTrack.title}</h4>
                <p className="text-sm text-gray-400 truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">
                From: {playlist.name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleRepeat}
                  className={`p-2 rounded-full ${
                    repeatMode !== "none"
                      ? "text-green-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                  aria-label={`Repeat ${repeatMode}`}
                >
                  <FiRepeat
                    size={16}
                    className={repeatMode !== "none" ? "fill-current" : ""}
                  />
                  {repeatMode === "song" && (
                    <span className="absolute -mt-6 ml-1 text-xs text-green-500">
                      1
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-black p-2 rounded-full bg-green-500 hover:bg-green-400"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Next in Queue</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {queue.length} songs
                </span>
                <button
                  onClick={toggleShuffle}
                  className={`p-2 rounded-full ${
                    isShuffled
                      ? "text-green-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                  aria-label={isShuffled ? "Unshuffle queue" : "Shuffle queue"}
                >
                  <FiShuffle
                    size={16}
                    className={isShuffled ? "fill-current" : ""}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">
            {queue.length > 0 || repeatMode === "queue" ? (
              <div className="divide-y divide-gray-800">
                {queue.map((song, index) => {
                  const isLiked = likedSongs.includes(song.id);
                  return (
                    <div
                      key={`${song.id}-${index}`}
                      className="p-3 hover:bg-gray-800 cursor-pointer flex items-center gap-3 group"
                      onClick={() => {
                        const actualIndex = currentSongIndex + 1 + index;
                        setCurrentSongIndex(actualIndex);
                        setCurrentTrack(song);
                        setIsPlaying(true);
                        setShowPlayer(true);

                        // Update queue
                        const newQueue = [...queue.slice(index + 1)];
                        setQueue(newQueue);
                        if (!isShuffled) {
                          setOriginalQueue(newQueue);
                        }
                      }}
                    >
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-10 h-10 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{song.title}</h4>
                        <p className="text-sm text-gray-400 truncate">
                          {song.artist}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className={`p-1 ${
                            isLiked
                              ? "text-green-500"
                              : "text-gray-400 hover:text-white"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLikeSong(song.id);
                          }}
                          aria-label={isLiked ? "Unlike song" : "Like song"}
                        >
                          <FiHeart
                            size={18}
                            className={isLiked ? "fill-current" : ""}
                          />
                        </button>
                        <span className="text-sm text-gray-400">
                          {song.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {repeatMode === "queue" && (
                  <>
                    <div className="p-3 text-xs text-gray-500 text-center">
                      Queue will repeat from the beginning
                    </div>
                    {playlistSongs
                      .slice(0, currentSongIndex + 1)
                      .map((song, index) => (
                        <div
                          key={`repeat-${song.id}-${index}`}
                          className="p-3 hover:bg-gray-800 cursor-pointer flex items-center gap-3 group opacity-60"
                          onClick={() => {
                            setCurrentSongIndex(index);
                            setCurrentTrack(song);
                            setIsPlaying(true);
                            setShowPlayer(true);

                            // Update queue
                            const newQueue = [
                              ...playlistSongs.slice(index + 1),
                            ];
                            setQueue(newQueue);
                            setOriginalQueue(newQueue);
                          }}
                        >
                          <img
                            src={song.cover}
                            alt={song.title}
                            className="w-10 h-10 rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">
                              {song.title}
                            </h4>
                            <p className="text-sm text-gray-400 truncate">
                              {song.artist}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className={`p-1 ${
                                likedSongs.includes(song.id)
                                  ? "text-green-500"
                                  : "text-gray-400 hover:text-white"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLikeSong(song.id);
                              }}
                              aria-label={
                                likedSongs.includes(song.id)
                                  ? "Unlike song"
                                  : "Like song"
                              }
                            >
                              <FiHeart
                                size={18}
                                className={
                                  likedSongs.includes(song.id)
                                    ? "fill-current"
                                    : ""
                                }
                              />
                            </button>
                            <span className="text-sm text-gray-400">
                              {song.duration}
                            </span>
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>Queue is empty</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlist;
