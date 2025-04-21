// components/MusicPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import songsData from '../data/songs.json';

const MusicPlayer = ({ currentTrack, setCurrentTrack, isPlaying, setIsPlaying }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const songs = songsData.songs;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
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
      
      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-4 w-full md:w-1/4">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-16 h-16 rounded-md object-cover"
          />
          <div>
            <h3 className="text-white font-medium">{currentTrack.title}</h3>
            <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-full md:w-2/4">
          <div className="flex items-center gap-6 mb-2">
            <button 
              onClick={handlePrevious}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaStepBackward size={18} />
            </button>
            <button 
              onClick={handlePlayPause}
              className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} className="ml-1" />}
            </button>
            <button 
              onClick={handleNext}
              className="text-gray-400 hover:text-white transition-colors"
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
                background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${(currentTime / duration) * 100}%, #4D4D4D ${(currentTime / duration) * 100}%, #4D4D4D 100%)`
              }}
            />
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 w-full md:w-1/4 justify-end">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white">
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
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;