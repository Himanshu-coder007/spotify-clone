// components/ChartView.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChartView = ({ chart, onClose, onTrackClick }) => {
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

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black z-50 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300 text-lg"
          >
            &larr; Back
          </button>
        </div>

        {/* Chart header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <img 
            src={chart.images[0]?.url || "/default-chart.jpg"} 
            alt={chart.name}
            className="w-64 h-64 object-cover rounded-lg shadow-xl"
          />
          <div>
            <h1 className="text-5xl font-bold text-white uppercase mb-4">{chart.name}</h1>
            <p className="text-gray-400 text-lg">
              {chart.tracks?.total || 50} tracks • Updated weekly
            </p>
          </div>
        </div>

        {/* Songs table */}
        <div className="bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-700">
              <tr className="text-left text-gray-400">
                <th className="p-4 w-12">#</th>
                <th className="p-4">Title</th>
                <th className="p-4">Album</th>
                <th className="p-4">Date Added</th>
                <th className="p-4 text-right">Duration</th>
              </tr>
            </thead>
            <tbody>
              {chartSongs.map((song, index) => (
                <tr 
                  key={song.id} 
                  className="border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => onTrackClick(index)}
                >
                  <td className="p-4 text-gray-400">{index + 1}</td>
                  <td className="p-4 text-white font-medium">{song.title}</td>
                  <td className="p-4 text-gray-400">{song.album}</td>
                  <td className="p-4 text-gray-400">{song.dateAdded}</td>
                  <td className="p-4 text-gray-400 text-right">{song.duration}</td>
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