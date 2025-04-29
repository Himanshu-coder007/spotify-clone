import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import MusicPlayer from './MusicPlayer';
import anirudhSongs from '../data/anirudhsongs.json';
import arijitSongs from '../data/arijitsongs.json';
import singers from '../data/singers.json';
import { FaPlay, FaPause, FaTimes, FaList, FaHeart, FaRegHeart, FaRandom, FaRedo, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { MdQueueMusic, MdAlbum, MdAccessTime } from 'react-icons/md';
import { BiSearchAlt2 } from 'react-icons/bi';
import { IoMdMusicalNote } from 'react-icons/io';

const Singer = () => {
  const { singerId } = useParams();
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [singer, setSinger] = useState(null);
  const [isPlayAllActive, setIsPlayAllActive] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [queue, setQueue] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [repeatMode, setRepeatMode] = useState(false);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const songsContainerRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    
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
      cover: song.cover || song.image_url || song.image || selectedSinger?.image || "",
      year: song.year || "2023",
      genre: song.genre || "Bollywood"
    }));

    setSongs(formattedSongs);
    setFilteredSongs(formattedSongs);
    setIsLoading(false);
    
    const storedFavorites = localStorage.getItem(`favorites_${singerId}`);
    if (storedFavorites) {
      setFavorites(new Set(JSON.parse(storedFavorites)));
    }
  }, [singerId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(song => 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [searchQuery, songs]);

  useEffect(() => {
    if (currentTrack && songs.length > 0) {
      let newQueue = [];
      if (shuffleMode) {
        const currentIndex = shuffledIndices.indexOf(songs.findIndex(s => s.id === currentTrack.id));
        if (currentIndex !== -1 && currentIndex < shuffledIndices.length - 1) {
          newQueue = shuffledIndices.slice(currentIndex + 1).map(idx => songs[idx]);
        }
      } else {
        const currentIndex = songs.findIndex(song => song.id === currentTrack.id);
        if (currentIndex !== -1) {
          newQueue = songs.slice(currentIndex + 1);
        }
      }
      setQueue(newQueue);
    }
  }, [currentTrack, songs, shuffleMode, shuffledIndices]);

  useEffect(() => {
    if (shuffleMode) {
      const indices = [...Array(songs.length).keys()];
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledIndices(indices);
    }
  }, [shuffleMode, songs.length]);

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
    if (filteredSongs.length > 0) {
      if (isPlayAllActive && isPlaying) {
        setIsPlaying(false);
        setIsPlayAllActive(false);
      } else {
        let songToPlay;
        if (shuffleMode && shuffledIndices.length > 0) {
          songToPlay = songs[shuffledIndices[0]];
        } else {
          songToPlay = filteredSongs.find(song => song.src) || filteredSongs[0];
        }
        handleSongClick(songToPlay);
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

  const toggleFavorite = (songId, e) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(songId)) {
      newFavorites.delete(songId);
    } else {
      newFavorites.add(songId);
    }
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${singerId}`, JSON.stringify(Array.from(newFavorites)));
  };

  const handleNextTrack = () => {
    if (queue.length > 0) {
      handleSongClick(queue[0]);
    } else if (repeatMode) {
      if (shuffleMode && shuffledIndices.length > 0) {
        handleSongClick(songs[shuffledIndices[0]]);
      } else {
        handleSongClick(filteredSongs[0]);
      }
    }
  };

  const handlePreviousTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = songs.findIndex(s => s.id === currentTrack.id);
    if (currentIndex > 0) {
      if (shuffleMode) {
        const shuffledIndex = shuffledIndices.indexOf(currentIndex);
        if (shuffledIndex > 0) {
          handleSongClick(songs[shuffledIndices[shuffledIndex - 1]]);
        }
      } else {
        handleSongClick(songs[currentIndex - 1]);
      }
    }
  };

  const formatDuration = (duration) => {
    if (typeof duration === 'number') {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    }
    return duration;
  };

  const scrollToCurrentSong = () => {
    if (currentPlayingId && songsContainerRef.current) {
      const songElement = document.getElementById(`song-${currentPlayingId}`);
      if (songElement) {
        songElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  if (!singer || isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-green-900 to-black flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-700 mb-4"></div>
          <div className="h-8 w-48 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-green-900 to-black relative">
      <div 
        className="absolute top-0 left-0 w-full h-80 bg-cover bg-center opacity-20 pointer-events-none"
        style={{ backgroundImage: `url(${singer.image})` }}
      ></div>
      
      <div className="relative z-10 mb-8 flex flex-col md:flex-row items-start md:items-end">
        <div className="mr-6 mb-4 md:mb-0 flex-shrink-0">
          <img 
            src={singer.image} 
            alt={singer.name} 
            className="w-48 h-48 object-cover shadow-2xl rounded-full border-4 border-green-500/30 hover:border-green-500 transition-all duration-300"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm uppercase text-gray-300 tracking-widest">{singer.designation}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">{singer.name}</h1>
          <p className="text-gray-400 mb-4">{singer.bio || 'One of the most popular singers in India'}</p>
          
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center text-gray-300">
              <IoMdMusicalNote className="mr-1" /> {songs.length} songs
            </span>
            <span className="flex items-center text-gray-300">
              <MdAlbum className="mr-1" /> {new Set(songs.map(s => s.album)).size} albums
            </span>
            <span className="text-gray-300">{singer.followers || '10M'} followers</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-96">
            <BiSearchAlt2 className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search songs, albums..."
              className="w-full bg-gray-800/70 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                shuffleMode ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setShuffleMode(!shuffleMode)}
              title={shuffleMode ? 'Shuffle On' : 'Shuffle Off'}
            >
              <FaRandom className="h-4 w-4" />
              <span className="hidden md:inline">Shuffle</span>
            </button>
            
            <button 
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                repeatMode ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setRepeatMode(!repeatMode)}
              title={repeatMode ? 'Repeat On' : 'Repeat Off'}
            >
              <FaRedo className="h-4 w-4" />
              <span className="hidden md:inline">Repeat</span>
            </button>
            
            <button 
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                isPlayAllActive && isPlaying ? 'bg-green-500 text-black' : 'bg-green-600 text-white hover:bg-green-500'
              }`}
              onClick={handlePlayAll}
              disabled={filteredSongs.length === 0}
            >
              {isPlayAllActive && isPlaying ? (
                <FaPause className="h-4 w-4" />
              ) : (
                <FaPlay className="h-4 w-4" />
              )}
              <span className="hidden md:inline">Play All</span>
            </button>
            
            {currentTrack && (
              <button 
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  showQueue ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={toggleQueue}
                title="Queue"
              >
                <MdQueueMusic className="h-5 w-5" />
                <span className="hidden md:inline">Queue</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10" ref={songsContainerRef}>
        <div className="text-gray-400 border-b border-gray-800 pb-2 mb-4 grid grid-cols-12 gap-2 sticky top-0 bg-gradient-to-b from-green-900/90 to-transparent backdrop-blur-sm pt-2">
          <div className="col-span-1 flex justify-center">#</div>
          <div className="col-span-5 flex items-center">
            <span>TITLE</span>
            <button 
              className="ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={scrollToCurrentSong}
              title="Scroll to current song"
            >
              {currentPlayingId && '🔍'}
            </button>
          </div>
          <div className="col-span-3 hidden md:block">ALBUM</div>
          <div className="col-span-2 hidden sm:block">YEAR</div>
          <div className="col-span-1 sm:col-span-2 flex justify-end items-center">
            <MdAccessTime className="mr-2" />
          </div>
        </div>

        {filteredSongs.length > 0 ? (
          filteredSongs.map((song, index) => (
            <div 
              key={song.id}
              id={`song-${song.id}`}
              className={`grid grid-cols-12 gap-2 items-center py-3 px-2 rounded-lg group hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer ${
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
                  <div className="group-hover:hidden text-center">{index + 1}</div>
                )}
                <div className="hidden group-hover:block">
                  {currentPlayingId !== song.id && (
                    <FaPlay className="text-white h-4 w-4 mx-auto" />
                  )}
                  {currentPlayingId === song.id && !isPlaying && (
                    <FaPlay className="text-green-500 h-4 w-4 mx-auto" />
                  )}
                </div>
              </div>
              
              <div className="col-span-5 flex items-center overflow-hidden">
                <div className="relative flex-shrink-0 mr-3">
                  <img 
                    src={song.cover} 
                    alt={song.title} 
                    className="w-10 h-10 rounded"
                    onError={(e) => {
                      e.target.src = singer.image;
                      e.target.onerror = null;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:opacity-100 opacity-0 flex items-center justify-center transition-opacity">
                    <FaPlay className="text-white h-3 w-3" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className={`font-medium truncate ${
                    currentPlayingId === song.id ? 'text-green-500' : 'text-white'
                  }`}>
                    {song.title}
                  </p>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>
              </div>
              
              <div className="col-span-3 text-gray-400 hidden md:block truncate pr-2">
                {song.album}
              </div>
              
              <div className="col-span-2 text-gray-400 hidden sm:block">
                {song.year}
              </div>
              
              <div className="col-span-1 flex justify-end items-center space-x-3">
                <span className="text-gray-400 text-sm">
                  {formatDuration(song.duration)}
                </span>
                <button 
                  onClick={(e) => toggleFavorite(song.id, e)}
                  className="text-gray-400 hover:text-green-500 transition-colors"
                >
                  {favorites.has(song.id) ? (
                    <FaHeart className="text-green-500" />
                  ) : (
                    <FaRegHeart className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-12 text-center py-12 text-gray-400">
            {searchQuery ? 'No songs match your search' : 'No songs found for this artist'}
          </div>
        )}
      </div>

      {showQueue && currentTrack && (
        <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gray-900/95 backdrop-blur-lg z-50 shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out">
          <div className="p-4 flex justify-between items-center border-b border-gray-800 sticky top-0 bg-gray-900/90 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white flex items-center">
              <MdQueueMusic className="mr-2" /> Queue
            </h2>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400">{queue.length} songs</span>
              <button 
                onClick={toggleQueue}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-800">
            <h3 className="text-sm uppercase text-gray-400 mb-2">Now Playing</h3>
            <div className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-lg">
              <div className="relative">
                <img 
                  src={currentTrack.cover} 
                  alt={currentTrack.title} 
                  className="w-14 h-14 rounded"
                  onError={(e) => {
                    e.target.src = singer.image;
                    e.target.onerror = null;
                  }}
                />
                {isPlaying && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{currentTrack.title}</p>
                <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePreviousTrack()}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 disabled:opacity-30"
                  disabled={!currentTrack}
                >
                  <FaStepBackward />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-green-500 text-black p-2 rounded-full hover:bg-green-400"
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button 
                  onClick={() => handleNextTrack()}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 disabled:opacity-30"
                  disabled={queue.length === 0 && !repeatMode}
                >
                  <FaStepForward />
                </button>
              </div>
            </div>
          </div>

          {queue.length > 0 ? (
            <div className="p-4">
              <h3 className="text-sm uppercase text-gray-400 mb-2">Next Up</h3>
              <div className="space-y-2">
                {queue.map((song, index) => (
                  <div 
                    key={`queue-${song.id}`}
                    className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors ${
                      index === 0 ? 'bg-gray-800/30' : ''
                    }`}
                    onClick={() => handlePlayFromQueue(song)}
                  >
                    <span className="text-gray-400 text-sm w-5 text-center">{index + 1}</span>
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
                    <span className="text-gray-400 text-sm">{formatDuration(song.duration)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 text-gray-400 text-center">
              {repeatMode ? (
                <p>Queue will repeat after current playlist ends</p>
              ) : (
                <p>No more songs in queue</p>
              )}
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
          onNextTrack={handleNextTrack}
          onPreviousTrack={handlePreviousTrack}
          repeatMode={repeatMode}
          shuffleMode={shuffleMode}
          toggleRepeatMode={() => setRepeatMode(!repeatMode)}
          toggleShuffleMode={() => setShuffleMode(!shuffleMode)}
        />
      )}
    </div>
  );
};

export default Singer;