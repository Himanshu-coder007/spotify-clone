import React, { useEffect, useState } from 'react';

const Home = () => {
  const [accessToken, setAccessToken] = useState('');
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get access token
  useEffect(() => {
    const getAccessToken = async () => {
      try {
        console.log('Attempting to get access token...');
        const clientId = 'a5f6cd57e61e417aa5425c34ded3d107';
        const clientSecret = 'ec8291270c0541e7b61f933ba795dfb7';
        
        const authParams = new URLSearchParams();
        authParams.append('grant_type', 'client_credentials');
        
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
          },
          body: authParams
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Access token error response:', errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Access token received:', data.access_token ? 'Success' : 'Failed');
        setAccessToken(data.access_token);
        fetchSpotifyData(data.access_token);
      } catch (error) {
        console.error('Error getting access token:', error);
        setError(`Failed to get access token: ${error.message}`);
        setLoading(false);
      }
    };

    getAccessToken();
  }, []);

  // Fetch all Spotify data
  const fetchSpotifyData = async (token) => {
    try {
      console.log('Starting to fetch Spotify data with token...');
      
      // Fetch featured playlists
      console.log('Fetching featured playlists...');
      const [featuredResponse, topTracksResponse, newReleasesResponse] = await Promise.all([
        fetch('https://api.spotify.com/v1/browse/featured-playlists?limit=10', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?limit=6', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://api.spotify.com/v1/browse/new-releases?limit=12', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      // Handle featured playlists response
      if (!featuredResponse.ok) {
        const errorData = await featuredResponse.json();
        console.error('Featured playlists error:', errorData);
        throw new Error('Failed to fetch featured playlists');
      }
      const featuredData = await featuredResponse.json();
      console.log('Featured playlists:', featuredData.playlists.items);
      setFeaturedPlaylists(featuredData.playlists.items);

      // Handle top tracks response
      if (!topTracksResponse.ok) {
        const errorData = await topTracksResponse.json();
        console.error('Top tracks error:', errorData);
        throw new Error('Failed to fetch top tracks');
      }
      const topTracksData = await topTracksResponse.json();
      console.log('Top tracks:', topTracksData.items);
      setTopTracks(topTracksData.items);

      // Handle new releases response
      if (!newReleasesResponse.ok) {
        const errorData = await newReleasesResponse.json();
        console.error('New releases error:', errorData);
        throw new Error('Failed to fetch new releases');
      }
      const newReleasesData = await newReleasesResponse.json();
      console.log('New releases:', newReleasesData.albums.items);
      setNewReleases(newReleasesData.albums.items);

      // Mock recently played data (requires user auth)
      console.log('Creating mock recently played data...');
      const mockRecentlyPlayed = Array(12).fill().map((_, i) => ({
        track: {
          id: `mock-${i}`,
          name: `Recently Played ${i+1}`,
          artists: [{ name: 'Artist' }],
          album: { 
            name: 'Album',
            images: [{ url: '' }]
          }
        }
      }));
      setRecentlyPlayed(mockRecentlyPlayed);

      setLoading(false);
      console.log('All data fetched successfully');
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
      setError(`Failed to load data: ${error.message}`);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-12 flex items-center justify-center">
        <div className="text-white text-2xl">Loading music data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-12 flex flex-col items-center justify-center">
        <div className="text-white text-2xl mb-4">Error loading data</div>
        <div className="text-red-400 mb-6">{error}</div>
        <div className="text-gray-400 text-sm">Check console for details</div>
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
            {featuredPlaylists.map((playlist) => (
              <div key={playlist.id} className="bg-gray-800 bg-opacity-40 p-6 rounded-2xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
                {playlist.images?.length > 0 ? (
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
            {[
              { id: 1, name: "Top 50 Global", color: "from-blue-600 to-indigo-500" },
              { id: 2, name: "Top 50 India", color: "from-orange-600 to-yellow-500" },
              { id: 3, name: "Trending India", color: "from-green-600 to-teal-500" },
              { id: 4, name: "Trending Global", color: "from-purple-600 to-pink-500" },
              { id: 5, name: "Mega Hits", color: "from-red-600 to-amber-500" },
              { id: 6, name: "Happy Favorites", color: "from-yellow-500 to-amber-400" },
            ].map((chart) => (
              <div key={chart.id} className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
                <div className={`aspect-square w-full rounded-lg bg-gradient-to-br ${chart.color} mb-5 group-hover:shadow-xl transition-shadow`}></div>
                <h3 className="text-lg font-bold text-white">{chart.name}</h3>
                <p className="text-md text-gray-400 mt-2">Your weekly update of the most played tracks</p>
              </div>
            ))}
          </div>
        </section>

        {/* Today's Biggest Hits Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">Today's biggest hits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTracks.map((item) => (
              <div key={item.track?.id || Math.random()} className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group flex items-center gap-4">
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
                  <h3 className="text-lg font-bold text-white">{item.track?.name || 'Unknown Track'}</h3>
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
                {album.images?.length > 0 ? (
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
            {recentlyPlayed.map((item) => (
              <div key={item.track?.id || Math.random()} className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
                {item.track?.album?.images?.length > 0 ? (
                  <img 
                    src={item.track.album.images[0].url} 
                    alt={item.track.name}
                    className="aspect-square w-full rounded-lg mb-5 group-hover:shadow-xl transition-shadow object-cover"
                  />
                ) : (
                  <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-red-600 to-pink-500 mb-5 group-hover:shadow-xl transition-shadow"></div>
                )}
                <h3 className="text-lg font-bold text-white truncate">{item.track?.name || 'Recently Played'}</h3>
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