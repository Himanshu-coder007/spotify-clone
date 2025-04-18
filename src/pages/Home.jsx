import React from 'react';

const Home = () => {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-12">
      <div className="max-w-[1800px] mx-auto">
        {/* Greeting Section */}
        <section className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-10">Good afternoon</h1>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-800 bg-opacity-40 p-6 rounded-2xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
                <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-purple-600 to-blue-400 mb-6 group-hover:shadow-2xl transition-shadow"></div>
                <h3 className="text-xl font-bold text-white truncate">Liked Songs {i+1}</h3>
                <p className="text-md text-gray-400 mt-2">Playlist • {i+5} songs</p>
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
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-600 to-rose-400 group-hover:shadow-lg transition-shadow"></div>
                <div>
                  <h3 className="text-lg font-bold text-white">Song {item === 1 ? 'One' : item === 2 ? 'Two' : item === 3 ? 'Three' : item === 4 ? 'Four' : item === 5 ? 'Five' : 'Six'}</h3>
                  <p className="text-md text-gray-400 mt-1">Put a smile on your face with these happy tunes</p>
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
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
                <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-green-600 to-emerald-400 mb-5 group-hover:shadow-xl transition-shadow"></div>
                <h3 className="text-lg font-bold text-white truncate">Daily Mix {i+1}</h3>
                <p className="text-md text-gray-400 mt-2 truncate">Made For You • Updated daily</p>
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
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
                <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-red-600 to-pink-500 mb-5 group-hover:shadow-xl transition-shadow"></div>
                <h3 className="text-lg font-bold text-white truncate">Recently Played {i+1}</h3>
                <p className="text-md text-gray-400 mt-2 truncate">Artist • Album</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;