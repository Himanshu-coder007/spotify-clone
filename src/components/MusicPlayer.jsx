// components/MusicPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaTimes } from 'react-icons/fa';
import songsData from '../data/songs.json';

const MusicPlayer = ({ currentTrack, setCurrentTrack, isPlaying, setIsPlaying, onClose }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

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
      // Spacebar to play/pause
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent default spacebar behavior (scrolling)
        setIsPlaying(!isPlaying);
      }
      
      // Ctrl+M to toggle mute
      if (e.ctrlKey && e.code === 'KeyM') {
        e.preventDefault();
        setIsMuted(!isMuted);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, isMuted]);

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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={handleTimeUpdate}
      />
      
      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center gap-4 relative">
        {/* Close Button - Top Right */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close player"
        >
          <FaTimes size={16} />
        </button>

        {/* Track Info */}
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

        {/* Player Controls */}
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
          
          {/* Progress Bar */}
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

        {/* Volume Control */}
        <div className="flex items-center gap-2 w-full md:w-1/4 justify-end mt-8">
          <button 
            onClick={toggleMute} 
            className="text-gray-400 hover:text-white"
            aria-label={isMuted ? "Unmute" : "Mute"}
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