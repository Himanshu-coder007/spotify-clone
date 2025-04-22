import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MusicPlayer from './MusicPlayer';
import singerSongs from '../data/anirudhsongs.json';

const Singer = () => {
  const { singerId } = useParams();
  const [songs, setSongs] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch songs based on singerId
    // For now, we'll use the static data
    const formattedSongs = singerSongs.map((song, index) => ({
      id: index,
      title: song.title,
      artist: "Anirudh Ravichander", // Hardcoded for this example
      album: song.album,
      duration: song.duration,
      src: song.song_path,
      cover: song.image_url
    }));
    
    setSongs(formattedSongs);
  }, [singerId]);

  const handleSongClick = (song) => {
    setCurrentTrack(song);
    setIsPlaying(true);
    setShowPlayer(true);
    setCurrentPlayingId(song.id);
  };

  const handlePlayPause = (song) => {
    if (currentTrack && currentTrack.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      handleSongClick(song);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-green-900 to-black">
      <div className="mb-8 flex items-end">
        <div className="mr-6">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Anirudh_Ravichander_at_Audi_Ritz_Style_Awards_2017_%28cropped%29.jpg" 
            alt="Anirudh Ravichander" 
            className="w-48 h-48 object-cover shadow-2xl rounded-full"
          />
        </div>
        <div>
          <p className="text-sm uppercase text-gray-300">Artist</p>
          <h1 className="text-5xl font-bold mb-4 text-white">Anirudh Ravichander</h1>
          <p className="text-gray-400">{songs.length} songs</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <button 
            className="bg-green-500 text-black rounded-full p-3 hover:bg-green-400 transition-colors"
            onClick={() => currentTrack && handlePlayPause(currentTrack)}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        <div className="text-gray-400 border-b border-gray-800 pb-2 mb-4 grid grid-cols-12">
          <div className="col-span-1">#</div>
          <div className="col-span-5">TITLE</div>
          <div className="col-span-4">ALBUM</div>
          <div className="col-span-2 text-right">DURATION</div>
        </div>

        {songs.map((song, index) => (
          <div 
            key={song.id} 
            className={`grid grid-cols-12 items-center py-3 px-2 rounded hover:bg-gray-800 ${currentPlayingId === song.id ? 'bg-gray-800' : ''}`}
            onClick={() => handlePlayPause(song)}
          >
            <div className="col-span-1 text-gray-400 text-right pr-4">
              {currentPlayingId === song.id && isPlaying ? (
                <div className="flex items-center justify-center h-5 space-x-1">
                  <div className="w-1 h-2 bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-3 bg-green-500 animate-bounce" style={{ animationDelay: '100ms' }}></div>
                  <div className="w-1 h-4 bg-green-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-1 h-3 bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-1 h-2 bg-green-500 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              ) : (
                index + 1
              )}
            </div>
            <div className="col-span-5 flex items-center">
              <img 
                src={song.cover} 
                alt={song.title} 
                className="w-10 h-10 mr-3"
              />
              <div>
                <p className={`font-medium ${currentPlayingId === song.id ? 'text-green-500' : 'text-white'}`}>{song.title}</p>
                <p className="text-sm text-gray-400">{song.artist}</p>
              </div>
            </div>
            <div className="col-span-4 text-gray-400">{song.album}</div>
            <div className="col-span-2 text-right text-gray-400">{song.duration}</div>
          </div>
        ))}
      </div>

      {showPlayer && currentTrack && (
        <MusicPlayer 
          currentTrack={currentTrack}
          setCurrentTrack={setCurrentTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onClose={() => setShowPlayer(false)}
          songs={songs}
          setCurrentPlayingId={setCurrentPlayingId}
        />
      )}
    </div>
  );
};

export default Singer;