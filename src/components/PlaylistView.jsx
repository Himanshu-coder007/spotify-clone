import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMusic, FiEdit, FiTrash2, FiArrowLeft, FiX, FiPlay, FiPause } from 'react-icons/fi';
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
      }
    } else {
      navigate('/');
    }
  }, [id, navigate]);

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
      } else {
        setCurrentTrack(songToPlay);
        setIsPlaying(true);
        setShowPlayer(true);
      }
    }
  };

  const playAllSongs = () => {
    if (playlist?.songs?.length > 0) {
      const firstSong = songsData.songs.find(s => s.id === playlist.songs[0].id);
      if (firstSong) {
        setCurrentTrack(firstSong);
        setIsPlaying(true);
        setShowPlayer(true);
      }
    }
  };

  if (!playlist) return null;

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col w-[calc(100vw-360px)]">
      <ToastContainer />
      
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
                    
                    <div className="col-span-1 flex items-center justify-end gap-3">
                      <span className="text-gray-400 text-sm">
                        {songDetails?.duration || '0:00'}
                      </span>
                      <button 
                        className="text-gray-400 hover:text-white p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSong(song.id);
                        }}
                        aria-label={isCurrentPlaying ? "Pause" : "Play"}
                      >
                        {isCurrentPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
                      </button>
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
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  );
};

export default PlaylistView;