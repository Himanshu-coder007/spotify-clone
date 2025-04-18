import React, { useState } from 'react';
import { FiHome, FiSearch, FiBook, FiChevronRight, FiPlus, FiX } from 'react-icons/fi';

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchActive(false);
  };

  return (
    <div className="w-[360px] h-screen flex flex-col bg-black border-r border-gray-800 overflow-hidden">
      {/* Fixed top section */}
      <div className="p-6 pb-0 flex-shrink-0">
        {/* Logo */}
        <div className="mb-8 pl-4">
          <h1 className="text-2xl font-bold text-white">Spotify</h1>
        </div>

        {/* Top Navigation */}
        <div className="space-y-2 mb-8">
          <div className="flex items-center px-5 py-4 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800 cursor-pointer transition-all duration-200">
            <FiHome className="mr-6 text-2xl min-w-[24px]" />
            <span className="text-lg font-semibold">Home</span>
          </div>
          
          {/* Search Box */}
          <div 
            className={`flex items-center px-5 py-4 ${isSearchActive ? 'bg-gray-800' : 'hover:bg-gray-800'} rounded-lg cursor-pointer transition-all duration-200`}
            onClick={() => setIsSearchActive(true)}
          >
            <FiSearch className="mr-6 text-2xl min-w-[24px] text-gray-300" />
            {isSearchActive ? (
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="What do you want to listen to?"
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg font-semibold"
                  autoFocus
                />
                {searchQuery && (
                  <FiX 
                    className="text-gray-400 ml-2 cursor-pointer hover:text-white" 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSearch();
                    }}
                  />
                )}
              </div>
            ) : (
              <span className="text-lg font-semibold text-gray-300 hover:text-white">Search</span>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-grow overflow-y-auto custom-scrollbar px-6">
        {/* Show search results if search is active and has query, otherwise show library */}
        {isSearchActive && searchQuery ? (
          <div className="bg-gray-900 rounded-2xl p-5">
            <h3 className="text-xl font-bold mb-6 text-white">Search results for "{searchQuery}"</h3>
            {/* Placeholder for search results */}
            <div className="text-gray-400 text-center py-10">
              <p>Search results will appear here</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl p-5">
            {/* Library Header */}
            <div className="flex justify-between items-center px-3 py-3 mb-6">
              <div className="flex items-center text-gray-300">
                <FiBook className="mr-6 text-2xl min-w-[24px]" />
                <span className="text-lg font-semibold">Your Library</span>
              </div>
              <div className="flex gap-5">
                <FiChevronRight className="text-gray-300 text-xl cursor-pointer hover:text-white transition-colors" />
                <FiPlus className="text-gray-300 text-xl cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>

            {/* Library Content */}
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all duration-200">
                <h4 className="font-bold mb-4 text-lg">Create your first playlist</h4>
                <p className="text-md text-gray-400 mb-6">It's easy, we'll help you</p>
                <button className="bg-white text-black text-md font-bold px-6 py-3 rounded-full hover:scale-[1.03] transition-transform">
                  Create Playlist
                </button>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all duration-200">
                <h4 className="font-bold mb-4 text-lg">Let's find podcasts to follow</h4>
                <p className="text-md text-gray-400 mb-6">We'll keep you updated on new episodes</p>
                <button className="bg-white text-black text-md font-bold px-6 py-3 rounded-full hover:scale-[1.03] transition-transform">
                  Browse Podcasts
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;