import React from "react";
import { FaPlay } from "react-icons/fa";
import singersData from "../data/singers.json";

const Singers = () => {
  return (
    <div className="px-5 py-6 mx-4 my-5">
      <h2 className="text-white text-2xl mb-4 font-semibold">Popular Artists</h2>
      <div className="flex overflow-x-auto gap-5 py-3 scrollbar-hide">
        {singersData.map((singer, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center min-w-[150px] transition-transform duration-300 hover:scale-105 cursor-pointer group"
          >
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-3">
              <img
                src={singer.image}
                alt={singer.name}
                className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transform transition-transform">
                  <FaPlay className="text-black ml-1" />
                </div>
              </div>
            </div>
            <h3 className="text-white text-center text-base font-medium mt-1 group-hover:text-green-500 transition-colors duration-300">
              {singer.name}
            </h3>
            <p className="text-gray-500 text-xs uppercase tracking-wider">
              {singer.designation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Singers;