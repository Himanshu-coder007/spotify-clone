// components/Queue.js

import React from 'react';
import { FiMusic } from 'react-icons/fi';

const Queue = ({ currentTrack, upcomingSongs, isPlaying }) => {
  return (
    <div className="bg-gray-900 rounded-xl p-4 h-full">
      <h3 className="text-xl font-bold mb-4">Queue</h3>
      
      {currentTrack ? (
        <div className="mb-4 flex items-center">
          <img 
            src={currentTrack.cover || '/default-cover.jpg'} 
            alt={currentTrack.title} 
            className="w-12 h-12 rounded mr-3"
          />
          <div className="flex flex-col">
            <span className="text-white">{currentTrack.title || 'Unknown Title'}</span>
            <small className="text-gray-400">{currentTrack.artist || 'Unknown Artist'}</small>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <FiMusic className="mx-auto text-4xl mb-2" />
          <p className="text-lg">No song is currently playing</p>
        </div>
      )}

      <h4 className="text-lg font-bold mb-2">Next Up</h4>
      {upcomingSongs.length > 0 ? (
        <ul className="space-y-2">
          {upcomingSongs.map((song, index) => (
            <li key={song.id} className="flex items-center">
              <span className="text-gray-400">{index + 1}. </span>
              <span className="truncate text-white">{song.title || 'Unknown Title'}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No upcoming songs</p>
      )}
    </div>
  );
};

export default Queue;