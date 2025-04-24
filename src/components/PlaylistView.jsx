import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMusic, FiEdit, FiTrash2, FiArrowLeft, FiX, FiPlay, FiPause, FiHeart } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MusicPlayer from '../components/MusicPlayer';
import songsData from '../data/songs.json';

const PlaylistView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showQueueSidebar, setShowQueueSidebar] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    const foundPlaylist = playlists.find(p => p.id === parseInt(id));
    
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
      setName(foundPlaylist.name);
      setDescription(foundPlaylist.description);
      
      if (foundPlaylist.songs.length > 0) {
        const firstSong = songsData.songs.find(s => s.id === foundPlaylist.songs[0].id);
        setCurrentTrack(firstSong || null);
        const initialQueue = foundPlaylist.songs.map(song => {
          return songsData.songs.find(s => s.id === song.id);
        }).filter(song => song !== undefined);
        setQueue(initialQueue);
      }
    } else {
      navigate('/');
    }

    // Load liked songs from musicAppLikes
    const musicAppLikes = JSON.parse(localStorage.getItem('musicAppLikes')) || { playlists: [], songs: [] };
    setLikedSongs(musicAppLikes.songs || []);
  }, [id, navigate]);

  const toggleLikeSong = (songId) => {
    const musicAppLikes = JSON.parse(localStorage.getItem('musicAppLikes')) || { playlists: [], songs: [] };
    const songIndex = musicAppLikes.songs.findIndex(id => id === songId);
    
    if (songIndex === -1) {
      // Add to liked songs
      musicAppLikes.songs.push(songId);
      toast.success('Added to Liked Songs', {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      // Remove from liked songs
      musicAppLikes.songs.splice(songIndex, 1);
      toast.info('Removed from Liked Songs', {
        position: "top-right",
        autoClose: 2000,
      });
    }
    
    localStorage.setItem('musicAppLikes', JSON.stringify(musicAppLikes));
    setLikedSongs(musicAppLikes.songs);
    window.dispatchEvent(new Event('likesUpdated'));
  };

  const updatePlaylist = (e) => {
    e.preventDefault();
    
    const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    const updatedPlaylists = playlists.map(p => {
      if (p.id === parseInt(id)) {
        return { ...p, name, description };
      }
      return p;
    });
    
    localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
    setPlaylist({ ...playlist, name, description });
    setShowEditForm(false);
    
    toast.success('Playlist updated!', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const deletePlaylist = () => {
    const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    const updatedPlaylists = playlists.filter(p => p.id !== parseInt(id));
    
    localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
    
    toast.success('Playlist deleted!', {
      position: "top-right",
      autoClose: 3000,
    });
    
    navigate('/');
  };

  const playSong = (songId) => {
    const songToPlay = songsData.songs.find(s => s.id === songId);
    if (songToPlay) {
      if (currentTrack?.id === songId && isPlaying) {
        setIsPlaying(false);
        setShowQueueSidebar(false);
      } else {
        const songIndex = queue.findIndex(song => song.id === songId);
        if (songIndex !== -1) {
          setCurrentSongIndex(songIndex);
          setCurrentTrack(songToPlay);
          setIsPlaying(true);
          setShowPlayer(true);
          setShowQueueSidebar(true);
        }
      }
    }
  };

  const playAllSongs = () => {
    if (playlist?.songs?.length > 0) {
      const firstSong = songsData.songs.find(s => s.id === playlist.songs[0].id);
      if (firstSong) {
        setCurrentSongIndex(0);
        setCurrentTrack(firstSong);
        setIsPlaying(true);
        setShowPlayer(true);
        setShowQueueSidebar(true);
      }
    }
  };

  const handleNextSong = () => {
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

  if (!playlist) return null;

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex">
      <ToastContainer />
      
      {/* Main Content */}
      <div className={`h-screen bg-black text-white overflow-hidden flex flex-col ${showQueueSidebar ? 'w-[calc(100vw-360px)]' : 'w-full'}`}>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          {/* Back button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <FiArrowLeft /> Back
          </button>

          {/* Playlist Header */}
          <div className="flex flex-col md:flex-row items-start mb-8 gap-6">
            <div className="w-full md:w-48 h-48 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center shrink-0">
              {playlist.coverImage ? (
                <img src={playlist.coverImage} alt={playlist.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <FiMusic className="text-gray-500 text-6xl" />
              )}
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-4">
                <div className="flex items-center">
                  <h2 className="text-3xl font-bold mr-3 truncate max-w-xs md:max-w-md">{playlist.name}</h2>
                  <button 
                    onClick={() => setShowEditForm(true)}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
                    aria-label="Edit playlist"
                  >
                    <FiEdit size={20} />
                  </button>
                </div>
                <button
                  onClick={deletePlaylist}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all bg-red-600 hover:bg-red-700"
                >
                  <FiTrash2 />
                  Delete Playlist
                </button>
              </div>
              <p className="text-gray-400 mb-4 line-clamp-2 max-w-2xl">{playlist.description}</p>
              <div className="flex items-center text-sm text-gray-400">
                <span>{playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}</span>
              </div>
            </div>
          </div>

          {/* Edit Playlist Modal */}
          {showEditForm && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full border border-gray-800 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Edit Playlist</h3>
                  <button 
                    onClick={() => setShowEditForm(false)}
                    className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <form onSubmit={updatePlaylist}>
                  <div className="mb-4">
                    <label htmlFor="editName" className="block text-sm font-medium mb-2 text-gray-300">
                      Playlist Name
                    </label>
                    <input
                      type="text"
                      id="editName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="editDescription" className="block text-sm font-medium mb-2 text-gray-300">
                      Description
                    </label>
                    <textarea
                      id="editDescription"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows="3"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="px-4 py-2 rounded-full border border-gray-600 hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Playlist Songs */}
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={playAllSongs}
                  className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-700 transition-colors hover:scale-105"
                  aria-label="Play all songs"
                >
                  {isPlaying && currentTrack ? (
                    <FiPause size={24} />
                  ) : (
                    <FiPlay size={24} className="ml-1" />
                  )}
                </button>
                <h3 className="text-xl font-bold">Songs</h3>
              </div>
              <span className="text-sm text-gray-400">{playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}</span>
            </div>
            
            {/* Songs Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-gray-400 text-sm border-b border-gray-800 mb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-3">Artist</div>
              <div className="col-span-2">Album</div>
              <div className="col-span-1 text-right">Duration</div>
            </div>

            {playlist.songs.length > 0 ? (
              <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {playlist.songs.map((song, index) => {
                  const songDetails = songsData.songs.find(s => s.id === song.id);
                  const isCurrentPlaying = currentTrack?.id === song.id && isPlaying;
                  const isLiked = likedSongs.includes(song.id);
                  
                  return (
                    <div 
                      key={song.id} 
                      className={`grid grid-cols-12 gap-4 items-center p-3 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer ${
                        isCurrentPlaying ? 'bg-gray-800' : 'bg-gray-800/50'
                      }`}
                      onClick={() => playSong(song.id)}
                    >
                      <div className="col-span-1 flex justify-center">
                        {isCurrentPlaying ? (
                          <div className="flex items-center space-x-1 h-5">
                            <div className="w-1 h-2 bg-green-500 animate-pulse" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1 h-3 bg-green-500 animate-pulse" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1 h-4 bg-green-500 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                            <div className="w-1 h-3 bg-green-500 animate-pulse" style={{ animationDelay: '450ms' }}></div>
                          </div>
                        ) : (
                          <span className="text-gray-500">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="col-span-5 flex items-center gap-3">
                        <img 
                          src={songDetails?.cover || '/default-cover.jpg'} 
                          alt={songDetails?.title} 
                          className="w-10 h-10 rounded"
                        />
                        <span className={`truncate ${isCurrentPlaying ? 'text-green-500' : 'text-white'}`}>
                          {songDetails?.title || 'Unknown Title'}
                        </span>
                      </div>
                      
                      <div className="col-span-3 text-gray-400 truncate">
                        {songDetails?.artist || 'Unknown Artist'}
                      </div>
                      
                      <div className="col-span-2 text-gray-400 truncate">
                        {songDetails?.album || 'Unknown Album'}
                      </div>
                      
                      <div className="col-span-1 flex items-center justify-end gap-2">
                        <button
                          className={`p-1 rounded-full ${isLiked ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLikeSong(song.id);
                          }}
                          aria-label={isLiked ? "Unlike song" : "Like song"}
                        >
                          <FiHeart className={isLiked ? 'fill-current' : ''} />
                        </button>
                        <span className="text-gray-400 text-sm min-w-[40px] text-right">
                          {songDetails?.duration || '0:00'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FiMusic className="mx-auto text-4xl mb-2" />
                <p className="text-lg">This playlist is empty</p>
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
          />
        )}
      </div>

      {/* Queue Sidebar - Only shown when a song is playing */}
      {showQueueSidebar && currentTrack && (
        <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-bold">Now Playing</h3>
          </div>
          
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={currentTrack.cover || '/default-cover.jpg'} 
                alt={currentTrack.title} 
                className="w-16 h-16 rounded"
              />
              <div>
                <h4 className="font-medium truncate">{currentTrack.title}</h4>
                <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>From: {playlist.name}</span>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white p-2 rounded-full bg-green-600 hover:bg-green-700"
              >
                {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
              </button>
            </div>
          </div>
          
          <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Next in Queue</h3>
              <span className="text-sm text-gray-400">{queue.length - currentSongIndex - 1} songs</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {queue.length > currentSongIndex + 1 ? (
              <div className="divide-y divide-gray-800">
                {queue.slice(currentSongIndex + 1).map((song, index) => (
                  <div 
                    key={`${song.id}-${index}`} 
                    className="p-3 hover:bg-gray-800 cursor-pointer flex items-center gap-3"
                    onClick={() => {
                      const actualIndex = currentSongIndex + 1 + index;
                      setCurrentSongIndex(actualIndex);
                      setCurrentTrack(queue[actualIndex]);
                      setIsPlaying(true);
                      setShowPlayer(true);
                    }}
                  >
                    <img 
                      src={song.cover || '/default-cover.jpg'} 
                      alt={song.title} 
                      className="w-10 h-10 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{song.title}</h4>
                      <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                    </div>
                    <span className="text-sm text-gray-400">{song.duration || '0:00'}</span>
                  </div>
                ))}
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