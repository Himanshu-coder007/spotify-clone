import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiMusic,
  FiEdit,
  FiTrash2,
  FiArrowLeft,
  FiX,
  FiPlay,
  FiPause,
  FiHeart,
  FiShuffle,
  FiRepeat,
  FiClock,
  FiPlus,
  FiMoreHorizontal
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MusicPlayer from "../components/MusicPlayer";
import songsData from "../data/songs.json";

const PlaylistView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
  const [isRepeatOn, setIsRepeatOn] = useState(false);

  // Helper function to get numeric ID from song ID string
  const getSongIdNumber = (songId) => {
    if (typeof songId === 'string' && songId.startsWith('song-')) {
      return parseInt(songId.replace('song-', ''));
    }
    return songId;
  };

  // Load playlist and liked songs data
  useEffect(() => {
    const loadData = () => {
      const playlists = JSON.parse(localStorage.getItem("playlists")) || [];
      const foundPlaylist = playlists.find((p) => p.id === parseInt(id));

      if (foundPlaylist) {
        setPlaylist(foundPlaylist);
        setName(foundPlaylist.name);
        setDescription(foundPlaylist.description);

        if (foundPlaylist.songs.length > 0) {
          const firstSong = songsData.songs.find(
            (s) => s.id === getSongIdNumber(foundPlaylist.songs[0].id)
          );
          setCurrentTrack(firstSong || null);
          const initialQueue = foundPlaylist.songs
            .map((song) => {
              return songsData.songs.find((s) => s.id === getSongIdNumber(song.id));
            })
            .filter((song) => song !== undefined);
          setQueue(initialQueue);
          setOriginalQueue(initialQueue);
        }
      } else {
        navigate("/");
      }

      const musicAppLikes = JSON.parse(localStorage.getItem("musicAppLikes")) || {
        playlists: [],
        songs: [],
      };
      setLikedSongs(musicAppLikes.songs || []);
    };

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
  }, [id, navigate]);

  // Also listen for custom events if data is updated within the same window
  useEffect(() => {
    const handleCustomEvent = () => {
      const musicAppLikes = JSON.parse(localStorage.getItem("musicAppLikes")) || {
        playlists: [],
        songs: [],
      };
      setLikedSongs(musicAppLikes.songs || []);
    };

    window.addEventListener("likesUpdated", handleCustomEvent);
    return () => window.removeEventListener("likesUpdated", handleCustomEvent);
  }, []);

  const toggleLikeSong = (songId) => {
    const musicAppLikes = JSON.parse(localStorage.getItem("musicAppLikes")) || {
      playlists: [],
      songs: [],
    };
    const formattedSongId = `song-${getSongIdNumber(songId)}`;
    const songIndex = musicAppLikes.songs.findIndex((id) => id === formattedSongId);

    if (songIndex === -1) {
      musicAppLikes.songs.unshift(formattedSongId);
      toast.success("Added to Liked Songs", {
        position: "top-right",
        autoClose: 2000,
      });
      
      const playlists = JSON.parse(localStorage.getItem("playlists")) || [];
      const updatedPlaylists = playlists.map((p) => {
        if (p.id === parseInt(id)) {
          const likedSongsOrder = musicAppLikes.songs.map(likedId => 
            likedId.replace('song-', '')
          );
          
          const allSongs = [...p.songs];
          
          const sortedSongs = [...allSongs].sort((a, b) => {
            const aIndex = likedSongsOrder.indexOf(a.id.toString());
            const bIndex = likedSongsOrder.indexOf(b.id.toString());
            
            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
          });

          return {
            ...p,
            songs: sortedSongs
          };
        }
        return p;
      });

      localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
      setPlaylist(updatedPlaylists.find((p) => p.id === parseInt(id)));
      
      const newQueue = updatedPlaylists.find((p) => p.id === parseInt(id)).songs
        .map((song) => songsData.songs.find((s) => s.id === getSongIdNumber(song.id)))
        .filter((song) => song !== undefined);
      setQueue(newQueue);
      setOriginalQueue(newQueue);
      
      if (currentTrack) {
        const newIndex = newQueue.findIndex(song => song.id === currentTrack.id);
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
    window.dispatchEvent(new Event("likesUpdated"));
  };

  const updatePlaylist = (e) => {
    e.preventDefault();

    const playlists = JSON.parse(localStorage.getItem("playlists")) || [];
    const updatedPlaylists = playlists.map((p) => {
      if (p.id === parseInt(id)) {
        return { ...p, name, description };
      }
      return p;
    });

    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    setPlaylist({ ...playlist, name, description });
    setShowEditForm(false);

    toast.success("Playlist updated!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const deletePlaylist = () => {
    const playlists = JSON.parse(localStorage.getItem("playlists")) || [];
    const updatedPlaylists = playlists.filter((p) => p.id !== parseInt(id));

    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));

    toast.success("Playlist deleted!", {
      position: "top-right",
      autoClose: 3000,
    });

    navigate("/");
  };

  const playSong = (songId) => {
    const numericId = getSongIdNumber(songId);
    const songToPlay = songsData.songs.find((s) => s.id === numericId);
    if (songToPlay) {
      const songIndex = queue.findIndex((song) => song.id === numericId);
      
      if (songIndex !== -1) {
        if (currentTrack?.id === numericId) {
          setIsPlaying(!isPlaying);
        } else {
          setCurrentSongIndex(songIndex);
          setCurrentTrack(songToPlay);
          setIsPlaying(true);
        }
        setShowPlayer(true);
        setShowQueueSidebar(true);
      }
    }
  };

  const playAllSongs = () => {
    if (playlist?.songs?.length > 0) {
      const firstSong = songsData.songs.find(
        (s) => s.id === getSongIdNumber(playlist.songs[0].id)
      );
      if (firstSong) {
        if (currentTrack?.id === firstSong.id) {
          setIsPlaying(!isPlaying);
        } else {
          setCurrentSongIndex(0);
          setCurrentTrack(firstSong);
          setIsPlaying(true);
        }
        setShowPlayer(true);
        setShowQueueSidebar(true);
      }
    }
  };

  const handleNextSong = () => {
    if (isRepeatOn) {
      restartCurrentSong();
      return;
    }

    if (currentSongIndex < queue.length - 1) {
      const nextIndex = currentSongIndex + 1;
      setCurrentSongIndex(nextIndex);
      setCurrentTrack(queue[nextIndex]);
      setIsPlaying(true);
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
      setCurrentTrack(queue[prevIndex]);
      setIsPlaying(true);
    }
  };

  const toggleShuffle = () => {
    if (isShuffled) {
      setQueue([...originalQueue]);
      const currentIndex = originalQueue.findIndex(
        (song) => song.id === currentTrack?.id
      );
      if (currentIndex !== -1) {
        setCurrentSongIndex(currentIndex);
      }
    } else {
      if (queue.length > 1) {
        const currentSong = queue[currentSongIndex];
        const remainingSongs = [...queue];
        remainingSongs.splice(currentSongIndex, 1);

        for (let i = remainingSongs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [remainingSongs[i], remainingSongs[j]] = [
            remainingSongs[j],
            remainingSongs[i],
          ];
        }

        const newQueue = [
          ...remainingSongs.slice(0, currentSongIndex),
          currentSong,
          ...remainingSongs.slice(currentSongIndex),
        ];

        setQueue(newQueue);
      }
    }
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setIsRepeatOn(!isRepeatOn);
  };

  const restartCurrentSong = () => {
    if (currentTrack) {
      setCurrentTrack({...currentTrack});
      setIsPlaying(true);
    }
  };

  if (!playlist) return null;

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden flex">
      <ToastContainer />

      {/* Main Content */}
      <div
        className={`h-screen overflow-hidden flex flex-col ${
          showQueueSidebar ? "w-[calc(100vw-360px)]" : "w-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
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
            <div className="w-full md:w-56 h-56 bg-gradient-to-br from-purple-900 to-gray-800 rounded-lg shadow-xl flex items-center justify-center shrink-0 relative group">
              {playlist.coverImage ? (
                <img
                  src={playlist.coverImage}
                  alt={playlist.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <FiMusic className="text-gray-500 text-7xl" />
              )}
              <button
                onClick={playAllSongs}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
              >
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-400 transition-all hover:scale-105">
                  {isPlaying && currentTrack && currentTrack.id === getSongIdNumber(playlist.songs[0]?.id) ? (
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
                <h2 className="text-5xl font-bold mb-4 truncate max-w-2xl">{playlist.name}</h2>
                <p className="text-gray-400 mb-6 line-clamp-2 max-w-2xl">
                  {playlist.description}
                </p>
                <div className="flex items-center text-sm text-gray-400 gap-4">
                  <span className="font-medium text-white">Your Library</span>
                  <span>
                    {playlist.songs.length}{" "}
                    {playlist.songs.length === 1 ? "song" : "songs"}
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
              {isPlaying && currentTrack ? (
                <FiPause size={28} className="text-black" />
              ) : (
                <FiPlay size={28} className="ml-1 text-black" />
              )}
            </button>
            <button
              onClick={() => setShowEditForm(true)}
              className="text-gray-400 hover:text-white transition-colors p-2"
              aria-label="Edit playlist"
            >
              <FiEdit size={24} />
            </button>
            <button
              onClick={deletePlaylist}
              className="text-gray-400 hover:text-white transition-colors p-2"
              aria-label="Delete playlist"
            >
              <FiTrash2 size={24} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors p-2">
              <FiMoreHorizontal size={24} />
            </button>
          </div>

          {/* Edit Playlist Modal */}
          {showEditForm && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full border border-gray-700 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Edit Playlist</h3>
                  <button
                    onClick={() => setShowEditForm(false)}
                    className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <form onSubmit={updatePlaylist}>
                  <div className="mb-4">
                    <label
                      htmlFor="editName"
                      className="block text-sm font-medium mb-2 text-gray-300"
                    >
                      Playlist Name
                    </label>
                    <input
                      type="text"
                      id="editName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="editDescription"
                      className="block text-sm font-medium mb-2 text-gray-300"
                    >
                      Description
                    </label>
                    <textarea
                      id="editDescription"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows="3"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="px-4 py-2 rounded-full border border-gray-600 hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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

            {playlist.songs.length > 0 ? (
              <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                {playlist.songs.map((song, index) => {
                  const songDetails = songsData.songs.find(
                    (s) => s.id === getSongIdNumber(song.id)
                  );
                  const isCurrentPlaying =
                    currentTrack?.id === getSongIdNumber(song.id) && isPlaying;
                  const isLiked = likedSongs.includes(`song-${getSongIdNumber(song.id)}`);

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
                            {currentTrack?.id === getSongIdNumber(song.id) && isPlaying ? (
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
                          src={songDetails?.cover || "/default-cover.jpg"}
                          alt={songDetails?.title}
                          className="w-10 h-10 rounded"
                        />
                        <div className="flex flex-col">
                          <span
                            className={`truncate ${
                              isCurrentPlaying ? "text-green-500" : "text-white"
                            }`}
                          >
                            {songDetails?.title || "Unknown Title"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {songDetails?.explicit ? "Explicit" : ""}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-3 text-gray-400 truncate">
                        {songDetails?.artist || "Unknown Artist"}
                      </div>

                      <div className="col-span-2 text-gray-400 truncate">
                        {songDetails?.album || "Unknown Album"}
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
                          <FiHeart size={18} className={isLiked ? "fill-current" : ""} />
                        </button>
                        <span className="text-gray-400 text-sm min-w-[40px] text-right">
                          {songDetails?.duration || "0:00"}
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
                <p className="text-sm text-gray-600 mb-6">Add some songs to get started</p>
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
            hasNext={currentSongIndex < queue.length - 1}
            hasPrevious={currentSongIndex > 0}
            queue={queue}
            currentSongIndex={currentSongIndex}
            setCurrentSongIndex={setCurrentSongIndex}
            isRepeatOn={isRepeatOn}
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
              <button
                onClick={() => setShowQueueSidebar(false)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={currentTrack.cover || "/default-cover.jpg"}
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
              <span className="text-sm text-gray-400">From: {playlist.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleRepeat}
                  className={`p-2 rounded-full ${
                    isRepeatOn
                      ? "text-green-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                  aria-label={isRepeatOn ? "Turn off repeat" : "Turn on repeat"}
                >
                  <FiRepeat
                    size={16}
                    className={isRepeatOn ? "fill-current" : ""}
                  />
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
                  {queue.length - currentSongIndex - 1} songs
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
            {queue.length > currentSongIndex + 1 ? (
              <div className="divide-y divide-gray-800">
                {queue.slice(currentSongIndex + 1).map((song, index) => {
                  const isLiked = likedSongs.includes(`song-${song.id}`);
                  return (
                    <div
                      key={`${song.id}-${index}`}
                      className="p-3 hover:bg-gray-800 cursor-pointer flex items-center gap-3 group"
                      onClick={() => {
                        const actualIndex = currentSongIndex + 1 + index;
                        setCurrentSongIndex(actualIndex);
                        setCurrentTrack(queue[actualIndex]);
                        setIsPlaying(true);
                        setShowPlayer(true);
                      }}
                    >
                      <img
                        src={song.cover || "/default-cover.jpg"}
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
                          <FiHeart size={18} className={isLiked ? "fill-current" : ""} />
                        </button>
                        <span className="text-sm text-gray-400">
                          {song.duration || "0:00"}
                        </span>
                      </div>
                    </div>
                  );
                })}
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

export default PlaylistView;