import React from "react";
import { FaBolt, FaUsers } from "react-icons/fa";

export default function PlayButton() {
  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-green-700 text-white px-6 py-4 rounded-full shadow-xl cursor-pointer hover:bg-green-800 transition duration-300">
      {/* 1 vs 1 Button */}
      <button className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full">
        <FaBolt className="text-xl" />
        <span className="text-md font-semibold">1 vs 1</span>
      </button>
      
      {/* Main Jugar Button */}
      <button className="flex items-center justify-center px-6 py-3 bg-green-600 text-xl font-bold rounded-full shadow-md">
        Jugar
      </button>
      
      {/* Alineación Button */}
      <button className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full">
        <FaUsers className="text-xl" />
        <span className="text-md font-semibold">Alineación</span>
      </button>
    </div>
  );
}