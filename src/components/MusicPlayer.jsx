// components/MusicPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaTimes, FaMusic } from 'react-icons/fa';
import { toast } from 'react-toastify';
import songsData from '../data/songs.json';

const MusicPlayer = ({ currentTrack, setCurrentTrack, isPlaying, setIsPlaying, onClose }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const audioRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const activeLyricRef = useRef(null);

  const songs = songsData.songs;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
      if (e.ctrlKey && e.code === 'KeyM') {
        e.preventDefault();
        setIsMuted(!isMuted);
      }
      if (e.ctrlKey && e.code === 'KeyL') {
        e.preventDefault();
        handleLyricsClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, isMuted, currentTrack]);

  useEffect(() => {
    if (showLyrics && lyricsContainerRef.current && currentTrack.lyrics) {
      const lyrics = currentTrack.lyrics;
      let activeIndex = -1;
      
      for (let i = 0; i < lyrics.length; i++) {
        if (currentTime >= lyrics[i].time) {
          activeIndex = i;
        } else {
          break;
        }
      }

      if (activeIndex >= 0) {
        const container = lyricsContainerRef.current;
        const lyricElements = container.querySelectorAll('p');
        
        if (lyricElements[activeIndex]) {
          const activeElement = lyricElements[activeIndex];
          activeLyricRef.current = activeElement;
          
          const containerHeight = container.clientHeight;
          const elementTop = activeElement.offsetTop;
          const elementHeight = activeElement.offsetHeight;
          const scrollPosition = elementTop - (containerHeight / 2) + (elementHeight / 2);
          
          const buffer = 50;
          const isElementInView = (
            (elementTop >= container.scrollTop - buffer) && 
            (elementTop + elementHeight <= container.scrollTop + containerHeight + buffer)
          );
          
          if (!isElementInView) {
            container.scrollTo({
              top: scrollPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    }
  }, [currentTime, showLyrics, currentTrack.lyrics]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = songs.findIndex(song => song.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentTrack(songs[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const currentIndex = songs.findIndex(song => song.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentTrack(songs[prevIndex]);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e) => {
    const seekTime = e.target.value;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleLyricsClick = () => {
    if (!currentTrack.lyrics || currentTrack.lyrics.length === 0) {
      toast.info('Lyrics not available for this track', {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true,
      });
    } else {
      setShowLyrics(!showLyrics);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={handleTimeUpdate}
      />
      
      {showLyrics && (
        <div className="fixed inset-0 bg-gradient-to-b from-emerald-900/90 to-gray-900 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-emerald-900/30 to-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden relative">
            <button 
              onClick={() => setShowLyrics(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close lyrics"
            >
              <FaTimes size={24} />
            </button>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">{currentTrack.title} - Lyrics</h2>
              <div 
                ref={lyricsContainerRef}
                className="space-y-4 h-[70vh] overflow-y-auto pr-4 scroll-smooth"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {currentTrack.lyrics ? (
                  currentTrack.lyrics.map((line, index) => {
                    const isActive = currentTime >= line.time;
                    return (
                      <p 
                        key={index} 
                        ref={isActive ? activeLyricRef : null}
                        className={`text-lg transition-all duration-300 px-2 ${
                          isActive 
                            ? 'text-emerald-400 font-medium' 
                            : 'text-gray-400'
                        }`}
                      >
                        {line.text}
                      </p>
                    );
                  })
                ) : (
                  <p className="text-lg text-gray-400 px-2">No lyrics available for this track</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center gap-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close player"
        >
          <FaTimes size={16} />
        </button>

        <div className="flex items-center gap-4 w-full md:w-1/4">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-16 h-16 rounded-md object-cover"
          />
          <div className="truncate">
            <h3 className="text-white font-medium truncate">{currentTrack.title}</h3>
            <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center w-full md:w-2/4">
          <div className="flex items-center gap-6 mb-2">
            <button 
              onClick={handlePrevious}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Previous track"
            >
              <FaStepBackward size={18} />
            </button>
            <button 
              onClick={handlePlayPause}
              className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:scale-105 transition-transform"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} className="ml-1" />}
            </button>
            <button 
              onClick={handleNext}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Next track"
            >
              <FaStepForward size={18} />
            </button>
          </div>
          
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${(currentTime / (duration || 1)) * 100}%, #4D4D4D ${(currentTime / (duration || 1)) * 100}%, #4D4D4D 100%)`
              }}
              aria-label="Track progress"
            />
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-1/4 justify-end mt-8">
          <button 
            onClick={handleLyricsClick}
            className={`p-2 rounded-full transition-colors ${currentTrack.lyrics ? 'text-gray-400 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
            aria-label="Show lyrics"
            disabled={!currentTrack.lyrics}
            title={currentTrack.lyrics ? 'Show lyrics (Ctrl+L)' : 'Lyrics not available'}
          >
            <FaMusic size={18} />
          </button>
          
          <button 
            onClick={toggleMute} 
            className="text-gray-400 hover:text-white p-2"
            aria-label={isMuted ? "Unmute" : "Mute"}
            title={isMuted ? 'Unmute (Ctrl+M)' : 'Mute (Ctrl+M)'}
          >
            {isMuted || volume === 0 ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${volume * 100}%, #4D4D4D ${volume * 100}%, #4D4D4D 100%)`
            }}
            aria-label="Volume control"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;