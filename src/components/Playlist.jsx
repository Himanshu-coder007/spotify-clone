import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Playlist = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        // Get access token first
        const clientId = 'a5f6cd57e61e417aa5425c34ded3d107';
        const clientSecret = 'ec8291270c0541e7b61f933ba795dfb7';
        
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
          },
          body: 'grant_type=client_credentials'
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Fetch playlist details
        const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        const playlistData = await playlistResponse.json();
        setPlaylist(playlistData);

        // Fetch playlist tracks
        const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        const tracksData = await tracksResponse.json();
        setTracks(tracksData.items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching playlist data:', error);
        setLoading(false);
      }
    };

    fetchPlaylistData();
  }, [playlistId]);

  if (loading) {
    return (
      <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-12 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-12 flex items-center justify-center">
        <div className="text-white text-2xl">Playlist not found</div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-12">
      <div className="max-w-[1800px] mx-auto">
        {/* Playlist Header */}
        <div className="flex items-end gap-6 mb-8">
          {playlist.images && playlist.images.length > 0 && (
            <img 
              src={playlist.images[0].url} 
              alt={playlist.name}
              className="w-48 h-48 rounded-lg shadow-2xl object-cover"
            />
          )}
          <div className="flex flex-col justify-end">
            <span className="text-sm font-semibold text-white">Playlist</span>
            <h1 className="text-5xl font-bold text-white mt-2 mb-6">{playlist.name}</h1>
            <p className="text-md text-gray-400">
              {playlist.description || 'A great playlist'}
            </p>
            <div className="flex items-center mt-4 text-sm text-gray-400">
              <span className="font-bold text-white">Spotify</span>
              <span className="mx-1">•</span>
              <span>{playlist.followers?.total?.toLocaleString() || '0'} likes</span>
              <span className="mx-1">•</span>
              <span>{playlist.tracks?.total || '0'} songs</span>
              {playlist.tracks?.total && (
                <>
                  <span className="mx-1">•</span>
                  <span>about {Math.floor(playlist.tracks.total * 3 / 60)} hr {playlist.tracks.total * 3 % 60} min</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Playlist Controls */}
        <div className="flex items-center gap-4 mb-8">
          <button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8 py-3 font-bold text-sm transition-all duration-200 transform hover:scale-105">
            Play
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Tracks Table */}
        <div className="bg-gray-800 bg-opacity-40 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-left">
                <th className="px-6 py-4 font-medium">#</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Album</th>
                <th className="px-6 py-4 font-medium">Date Added</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((item, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {item.track?.album?.images?.[0]?.url && (
                        <img 
                          src={item.track.album.images[0].url} 
                          alt={item.track.name}
                          className="w-10 h-10 rounded"
                        />
                      )}
                      <div>
                        <div className="text-white font-medium">{item.track?.name || `Track ${index + 1}`}</div>
                        <div className="text-gray-400 text-sm">
                          {item.track?.artists?.map(artist => artist.name).join(', ') || 'Various artists'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{item.track?.album?.name || 'Unknown Album'}</td>
                  <td className="px-6 py-4 text-gray-400">5 days ago</td>
                  <td className="px-6 py-4 text-gray-400">{Math.floor(Math.random() * 3) + 2}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Playlist;