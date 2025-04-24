import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MusicPlayer from './MusicPlayer';
import anirudhSongs from '../data/anirudhsongs.json';
import arijitSongs from '../data/arijitsongs.json';
import singers from '../data/singers.json';
import { FaPlay, FaPause, FaTimes, FaList } from 'react-icons/fa';

const Singer = () => {
  const { singerId } = useParams();
  const [songs, setSongs] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [singer, setSinger] = useState(null);
  const [isPlayAllActive, setIsPlayAllActive] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const selectedSinger = singers.find(s => s.id === singerId);
    setSinger(selectedSinger);

    let songsData = [];
    if (singerId === '1') {
      songsData = arijitSongs.songs || arijitSongs || [];
    } else {
      songsData = anirudhSongs.songs || anirudhSongs || [];
    }

    const formattedSongs = songsData.map((song, index) => ({
      id: song.id || index,
      title: song.title || song.name || "Unknown Track",
      artist: selectedSinger?.name || "Unknown Artist",
      album: song.album || "Unknown Album",
      duration: song.duration || "3:30",
      src: song.src || song.song_path || song.audio_url || "",
      cover: song.cover || song.image_url || song.image || selectedSinger?.image || ""
    }));

    setSongs(formattedSongs);
  }, [singerId]);

  // Update queue when current track changes
  useEffect(() => {
    if (currentTrack && songs.length > 0) {
      const currentIndex = songs.findIndex(song => song.id === currentTrack.id);
      if (currentIndex !== -1) {
        const newQueue = songs.slice(currentIndex + 1);
        setQueue(newQueue);
      }
    }
  }, [currentTrack, songs]);

  const handleSongClick = (song) => {
    if (!song.src) {
      console.error("No audio source available for this song:", song.title);
      return;
    }

    if (currentTrack && currentTrack.id === song.id) {
      setIsPlaying(!isPlaying);
      setIsPlayAllActive(!isPlaying);
    } else {
      setCurrentTrack(song);
      setIsPlaying(true);
      setIsPlayAllActive(true);
      setCurrentPlayingId(song.id);
    }
    setShowPlayer(true);
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      if (isPlayAllActive && isPlaying) {
        // If currently playing and play all is active, pause
        setIsPlaying(false);
        setIsPlayAllActive(false);
      } else {
        // Otherwise, play the first song
        const firstPlayableSong = songs.find(song => song.src) || songs[0];
        handleSongClick(firstPlayableSong);
        setIsPlayAllActive(true);
      }
    }
  };

  const handlePlayFromQueue = (song) => {
    handleSongClick(song);
  };

  const toggleQueue = () => {
    setShowQueue(!showQueue);
  };

  if (!singer) {
    return <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-green-900 to-black">Loading...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-green-900 to-black relative">
      <div className="mb-8 flex items-end">
        <div className="mr-6">
          <img 
            src={singer.image} 
            alt={singer.name} 
            className="w-48 h-48 object-cover shadow-2xl rounded-full"
          />
        </div>
        <div>
          <p className="text-sm uppercase text-gray-300">{singer.designation}</p>
          <h1 className="text-5xl font-bold mb-4 text-white">{singer.name}</h1>
          <p className="text-gray-400">{songs.length} songs</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <button 
            className="bg-green-500 text-black rounded-full p-3 hover:bg-green-400 transition-colors duration-200"
            onClick={handlePlayAll}
            disabled={songs.length === 0}
          >
            {isPlayAllActive && isPlaying ? (
              <FaPause className="h-5 w-5" />
            ) : (
              <FaPlay className="h-5 w-5" />
            )}
          </button>
          
          {currentTrack && (
            <button 
              className="bg-gray-700 text-white rounded-full p-3 hover:bg-gray-600 transition-colors duration-200"
              onClick={toggleQueue}
            >
              <FaList className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="text-gray-400 border-b border-gray-800 pb-2 mb-4 grid grid-cols-12">
          <div className="col-span-1">#</div>
          <div className="col-span-5">TITLE</div>
          <div className="col-span-4">ALBUM</div>
          <div className="col-span-2 text-right">DURATION</div>
        </div>

        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div 
              key={song.id} 
              className={`grid grid-cols-12 items-center py-3 px-2 rounded group hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer ${
                currentPlayingId === song.id ? 'bg-gray-800/70' : ''
              }`}
              onClick={() => handleSongClick(song)}
            >
              <div className="col-span-1 text-gray-400 flex items-center justify-center">
                {currentPlayingId === song.id && isPlaying ? (
                  <div className="flex items-center justify-center h-5 space-x-1">
                    <div className="w-1 h-2 bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-3 bg-green-500 animate-bounce" style={{ animationDelay: '100ms' }}></div>
                    <div className="w-1 h-4 bg-green-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-1 h-3 bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-1 h-2 bg-green-500 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  </div>
                ) : (
                  <div className="group-hover:hidden">{index + 1}</div>
                )}
                <div className="hidden group-hover:block">
                  {currentPlayingId !== song.id && (
                    <FaPlay className="text-white h-4 w-4" />
                  )}
                  {currentPlayingId === song.id && !isPlaying && (
                    <FaPlay className="text-green-500 h-4 w-4" />
                  )}
                </div>
              </div>
              <div className="col-span-5 flex items-center">
                <img 
                  src={song.cover} 
                  alt={song.title} 
                  className="w-10 h-10 mr-3 rounded"
                  onError={(e) => {
                    e.target.src = singer.image;
                    e.target.onerror = null;
                  }}
                />
                <div>
                  <p className={`font-medium ${
                    currentPlayingId === song.id ? 'text-green-500' : 'text-white'
                  }`}>
                    {song.title}
                  </p>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
              </div>
              <div className="col-span-4 text-gray-400">{song.album}</div>
              <div className="col-span-2 text-right text-gray-400">{song.duration}</div>
            </div>
          ))
        ) : (
          <div className="col-span-12 text-center py-8 text-gray-400">
            No songs found for this artist
          </div>
        )}
      </div>

      {/* Queue Sidebar */}
      {showQueue && currentTrack && (
        <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 z-50 shadow-2xl overflow-y-auto">
          <div className="p-4 flex justify-between items-center border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Queue</h2>
            <button 
              onClick={toggleQueue}
              className="text-gray-400 hover:text-white"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 border-b border-gray-800">
            <h3 className="text-sm uppercase text-gray-400 mb-2">Now Playing</h3>
            <div className="flex items-center space-x-3">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title} 
                className="w-12 h-12 rounded"
                onError={(e) => {
                  e.target.src = singer.image;
                  e.target.onerror = null;
                }}
              />
              <div>
                <p className="font-medium text-white">{currentTrack.title}</p>
                <p className="text-sm text-gray-400">{currentTrack.artist}</p>
              </div>
            </div>
          </div>

          {queue.length > 0 ? (
            <div className="p-4">
              <h3 className="text-sm uppercase text-gray-400 mb-2">Next Up</h3>
              <div className="space-y-3">
                {queue.map((song, index) => (
                  <div 
                    key={`queue-${song.id}`}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 cursor-pointer"
                    onClick={() => handlePlayFromQueue(song)}
                  >
                    <span className="text-gray-400 text-sm w-5">{index + 1}</span>
                    <img 
                      src={song.cover} 
                      alt={song.title} 
                      className="w-10 h-10 rounded"
                      onError={(e) => {
                        e.target.src = singer.image;
                        e.target.onerror = null;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{song.title}</p>
                      <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                    </div>
                    <span className="text-gray-400 text-sm">{song.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 text-gray-400 text-center">
              No more songs in queue
            </div>
          )}
        </div>
      )}

      {showPlayer && currentTrack && (
        <MusicPlayer 
          currentTrack={currentTrack}
          setCurrentTrack={setCurrentTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onClose={() => setShowPlayer(false)}
          songs={songs}
          setCurrentPlayingId={setCurrentPlayingId}
          setIsPlayAllActive={setIsPlayAllActive}
        />
      )}
    </div>
  );
};

export default Singer;