import React, { useEffect, useState } from 'react';

const Home = () => {
  const [accessToken, setAccessToken] = useState('');
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get access token
  useEffect(() => {
    const getAccessToken = async () => {
      const clientId = 'a5f6cd57e61e417aa5425c34ded3d107';
      const clientSecret = 'ec8291270c0541e7b61f933ba795dfb7';
      
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
      });

      const data = await response.json();
      setAccessToken(data.access_token);
      fetchSpotifyData(data.access_token);
    };

    getAccessToken();
  }, []);

  // Fetch all Spotify data
  const fetchSpotifyData = async (token) => {
    try {
      // Fetch featured playlists
      const featuredResponse = await fetch('https://api.spotify.com/v1/browse/featured-playlists?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const featuredData = await featuredResponse.json();
      setFeaturedPlaylists(featuredData.playlists.items);

      // Fetch top tracks (global chart)
      const topTracksResponse = await fetch('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?limit=6', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const topTracksData = await topTracksResponse.json();
      setTopTracks(topTracksData.items);

      // Fetch new releases
      const newReleasesResponse = await fetch('https://api.spotify.com/v1/browse/new-releases?limit=12', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const newReleasesData = await newReleasesResponse.json();
      setNewReleases(newReleasesData.albums.items);

      // Fetch recently played (requires user auth, so we'll mock some data)
      const recentlyPlayedResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=12', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (recentlyPlayedResponse.ok) {
        const recentlyPlayedData = await recentlyPlayedResponse.json();
        setRecentlyPlayed(recentlyPlayedData.items);
      } else {
        // Mock data if we can't get real recently played
        setRecentlyPlayed(Array(12).fill().map((_, i) => ({
          track: {
            name: `Recently Played ${i+1}`,
            artists: [{ name: 'Artist' }],
            album: { name: 'Album' }
          }
        })));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-12 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-12">
      <div className="max-w-[1800px] mx-auto">
        {/* Greeting Section */}
        <section className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-10">Good afternoon</h1>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {featuredPlaylists.slice(0, 10).map((playlist, i) => (
              <div key={playlist.id} className="bg-gray-800 bg-opacity-40 p-6 rounded-2xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
                {playlist.images && playlist.images.length > 0 ? (
                  <img 
                    src={playlist.images[0].url} 
                    alt={playlist.name}
                    className="aspect-square w-full rounded-xl mb-6 group-hover:shadow-2xl transition-shadow object-cover"
                  />
                ) : (
                  <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-purple-600 to-blue-400 mb-6 group-hover:shadow-2xl transition-shadow"></div>
                )}
                <h3 className="text-xl font-bold text-white truncate">{playlist.name}</h3>
                <p className="text-md text-gray-400 mt-2">Playlist • {playlist.tracks?.total || 'Unknown'} songs</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Charts Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">Featured Charts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Top 50 Global */}
            <div className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
              <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 mb-5 group-hover:shadow-xl transition-shadow"></div>
              <h3 className="text-lg font-bold text-white">Top 50 Global</h3>
              <p className="text-md text-gray-400 mt-2">Your weekly update of the most played tracks</p>
            </div>
            
            {/* Top 50 India */}
            <div className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
              <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-orange-600 to-yellow-500 mb-5 group-hover:shadow-xl transition-shadow"></div>
              <h3 className="text-lg font-bold text-white">Top 50 India</h3>
              <p className="text-md text-gray-400 mt-2">Your weekly update of the most played tracks</p>
            </div>
            
            {/* Trending India */}
            <div className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
              <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-green-600 to-teal-500 mb-5 group-hover:shadow-xl transition-shadow"></div>
              <h3 className="text-lg font-bold text-white">Trending India</h3>
              <p className="text-md text-gray-400 mt-2">Your weekly update of the most played tracks</p>
            </div>
            
            {/* Trending Global */}
            <div className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
              <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 mb-5 group-hover:shadow-xl transition-shadow"></div>
              <h3 className="text-lg font-bold text-white">Trending Global</h3>
              <p className="text-md text-gray-400 mt-2">Your weekly update of the most played tracks</p>
            </div>
            
            {/* Mega Hits */}
            <div className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
              <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-red-600 to-amber-500 mb-5 group-hover:shadow-xl transition-shadow"></div>
              <h3 className="text-lg font-bold text-white">Mega Hits</h3>
              <p className="text-md text-gray-400 mt-2">Your weekly update of the most played tracks</p>
            </div>
            
            {/* Happy Favorites */}
            <div className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
              <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-yellow-500 to-amber-400 mb-5 group-hover:shadow-xl transition-shadow"></div>
              <h3 className="text-lg font-bold text-white">Happy Favorites</h3>
              <p className="text-md text-gray-400 mt-2">Your weekly update of the most played tracks</p>
            </div>
          </div>
        </section>

        {/* Today's Biggest Hits Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">Today's biggest hits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTracks.map((item, index) => (
              <div key={index} className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group flex items-center gap-4">
                {item.track?.album?.images?.length > 0 ? (
                  <img 
                    src={item.track.album.images[0].url} 
                    alt={item.track.name}
                    className="w-16 h-16 rounded-lg group-hover:shadow-lg transition-shadow object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-600 to-rose-400 group-hover:shadow-lg transition-shadow"></div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-white">{item.track?.name || `Track ${index+1}`}</h3>
                  <p className="text-md text-gray-400 mt-1">
                    {item.track?.artists?.map(artist => artist.name).join(', ') || 'Various artists'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Made For You Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Made For You</h2>
            <button className="text-sm font-bold text-gray-400 hover:text-white">Show all</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {newReleases.map((album) => (
              <div key={album.id} className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
                {album.images && album.images.length > 0 ? (
                  <img 
                    src={album.images[0].url} 
                    alt={album.name}
                    className="aspect-square w-full rounded-lg mb-5 group-hover:shadow-xl transition-shadow object-cover"
                  />
                ) : (
                  <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-green-600 to-emerald-400 mb-5 group-hover:shadow-xl transition-shadow"></div>
                )}
                <h3 className="text-lg font-bold text-white truncate">{album.name}</h3>
                <p className="text-md text-gray-400 mt-2 truncate">
                  {album.artists?.map(artist => artist.name).join(', ') || 'Various artists'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Played Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Recently played</h2>
            <button className="text-sm font-bold text-gray-400 hover:text-white">Show all</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {recentlyPlayed.map((item, index) => (
              <div key={index} className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
                {item.track?.album?.images?.length > 0 ? (
                  <img 
                    src={item.track.album.images[0].url} 
                    alt={item.track.name}
                    className="aspect-square w-full rounded-lg mb-5 group-hover:shadow-xl transition-shadow object-cover"
                  />
                ) : (
                  <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-red-600 to-pink-500 mb-5 group-hover:shadow-xl transition-shadow"></div>
                )}
                <h3 className="text-lg font-bold text-white truncate">{item.track?.name || `Recently Played ${index+1}`}</h3>
                <p className="text-md text-gray-400 mt-2 truncate">
                  {item.track?.artists?.map(artist => artist.name).join(', ') || 'Artist'} • {item.track?.album?.name || 'Album'}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;