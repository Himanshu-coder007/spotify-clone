// components/ChartView.jsx
import React, { useState, useEffect } from 'react';

const ChartView = ({ chart, onClose, onTrackClick, currentlyPlaying }) => {
  // Mock songs data for the chart
  const chartSongs = [
    { id: 1, title: "Summer Vibes", album: chart.name, duration: "3:00", dateAdded: "5 days ago" },
    { id: 2, title: "Midnight Drive", album: chart.name, duration: "2:20", dateAdded: "5 days ago" },
    { id: 3, title: "Morning Coffee", album: chart.name, duration: "2:32", dateAdded: "5 days ago" },
    { id: 4, title: "Electric Dreams", album: chart.name, duration: "2:50", dateAdded: "5 days ago" },
    { id: 5, title: "Rainy Day", album: chart.name, duration: "3:10", dateAdded: "5 days ago" },
    { id: 6, title: "Sunset Boulevard", album: chart.name, duration: "2:45", dateAdded: "5 days ago" },
    { id: 7, title: "Mountain High", album: chart.name, duration: "2:18", dateAdded: "5 days ago" },
    { id: 8, title: "Ocean Deep", album: chart.name, duration: "2:35", dateAdded: "5 days ago" },
    { id: 9, title: "Desert Wind", album: chart.name, duration: "2:35", dateAdded: "5 days ago" },
    { id: 10, title: "Forest Echo", album: chart.name, duration: "2:35", dateAdded: "5 days ago" },
  ];

  const [hoveredRow, setHoveredRow] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);

  useEffect(() => {
    if (currentlyPlaying !== null) {
      setIsPlaying(currentlyPlaying);
    }
  }, [currentlyPlaying]);

  return (
    <div className="fixed inset-0 bg-spotify-black z-50 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onClose}
            className="text-white hover:text-spotify-green transition-colors text-lg flex items-center"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Chart header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="relative">
            <img 
              src={chart.images[0]?.url || "/default-chart.jpg"} 
              alt={chart.name}
              className="w-48 h-48 sm:w-64 sm:h-64 object-cover shadow-xl"
              style={{ boxShadow: '0 4px 60px rgba(0,0,0,.5)' }}
            />
            {isPlaying !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <div className="w-12 h-12 rounded-full bg-spotify-green flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div>
            <p className="text-white uppercase text-xs tracking-widest mb-2">Playlist</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{chart.name}</h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {chart.description || "The hottest tracks right now"}
            </p>
            <div className="flex items-center mt-4 text-gray-400 text-sm">
              <span className="font-bold text-white">Spotify</span>
              <span className="mx-1">•</span>
              <span>{chart.tracks?.total || 50} songs</span>
              <span className="mx-1">•</span>
              <span>about {Math.floor((chart.tracks?.total || 50) * 3.5 / 60)} hr</span>
            </div>
          </div>
        </div>

        {/* Play button */}
        <div className="mb-8">
          <button 
            className="bg-spotify-green hover:bg-spotify-light-green transition-colors text-black rounded-full px-8 py-3 font-bold flex items-center"
            onClick={() => onTrackClick(0)}
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Play
          </button>
        </div>

        {/* Songs table */}
        <div className="bg-spotify-dark-gray bg-opacity-40 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-spotify-light-gray border-opacity-20">
              <tr className="text-left text-gray-400 text-sm">
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">Title</th>
                <th className="p-4 hidden md:table-cell">Album</th>
                <th className="p-4 hidden sm:table-cell">Date Added</th>
                <th className="p-4 text-right">
                  <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                </th>
              </tr>
            </thead>
            <tbody>
              {chartSongs.map((song, index) => (
                <tr 
                  key={song.id} 
                  className={`border-b border-spotify-light-gray border-opacity-10 hover:bg-white hover:bg-opacity-10 transition-colors ${isPlaying === index ? 'text-spotify-green' : 'text-white'}`}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => onTrackClick(index)}
                >
                  <td className="p-4 text-center">
                    {hoveredRow === index ? (
                      <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    ) : isPlaying === index ? (
                      <div className="flex items-center justify-center h-5">
                        <div className="flex space-x-1">
                          <div className="w-1 h-3 bg-spotify-green animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1 h-3 bg-spotify-green animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1 h-3 bg-spotify-green animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">{index + 1}</span>
                    )}
                  </td>
                  <td className="p-4 font-medium">
                    <div className="flex items-center">
                      <div className="w-10 h-10 mr-3 flex-shrink-0">
                        <img 
                          src={chart.images[0]?.url || "/default-chart.jpg"} 
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className={`${isPlaying === index ? 'text-spotify-green' : 'text-white'}`}>{song.title}</div>
                        <div className="text-gray-400 text-sm">{chart.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 hidden md:table-cell">{song.album}</td>
                  <td className="p-4 text-gray-400 hidden sm:table-cell">{song.dateAdded}</td>
                  <td className="p-4 text-gray-400 text-right">
                    {isPlaying === index ? (
                      <div className="inline-flex items-center">
                        <div className="w-2 h-2 rounded-full bg-spotify-green mr-1 animate-pulse"></div>
                        <span>{song.duration}</span>
                      </div>
                    ) : (
                      song.duration
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChartView;