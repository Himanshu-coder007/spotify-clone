import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMusic, FiEdit, FiTrash2, FiArrowLeft, FiX } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlaylistView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    const foundPlaylist = playlists.find(p => p.id === parseInt(id));
    
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
      setName(foundPlaylist.name);
      setDescription(foundPlaylist.description);
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
            <h3 className="text-xl font-bold">Songs</h3>
            <span className="text-sm text-gray-400">{playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}</span>
          </div>
          {playlist.songs.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {playlist.songs.map((song, index) => (
                <div 
                  key={song.id} 
                  className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                >
                  <span className="text-gray-500 w-6 text-center">{index + 1}</span>
                  <img src={song.cover} alt={song.title} className="w-10 h-10 rounded mr-3" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{song.title}</h4>
                    <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FiMusic className="mx-auto text-4xl mb-2" />
              <p className="text-lg">This playlist is empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;