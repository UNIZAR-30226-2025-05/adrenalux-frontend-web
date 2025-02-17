import React from "react";
import {
  FaUsers,
  FaCog,
  FaShieldAlt
} from "react-icons/fa";

export default function NavbarGame() {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-gray-900 to-green-800 flex items-center justify-between px-6 shadow-lg z-50">
      {/* Left Section: Logo or Character */}
      <div className="flex items-center space-x-4">
        {/* Replace with your actual logo/character image */}
        <img
          src="/path/to/your-logo.png"
          alt="Logo"
          className="w-10 h-10 object-contain"
        />
      </div>

      {/* Middle Section: Icons / Image / Coins */}
      <div className="flex items-center space-x-6">
        {/* Example: Party or Users icon */}
        <FaUsers className="text-white text-2xl cursor-pointer hover:text-gray-200 transition-colors" />
        
        {/* Settings icon */}
        <FaCog className="text-white text-2xl cursor-pointer hover:text-gray-200 transition-colors" />
        
        {/* Example: A middle image (team, event, etc.) */}
        <img
          src="/path/to/middle-image.png"
          alt="Middle"
          className="w-10 h-10 rounded object-cover cursor-pointer"
        />
        
        {/* Coins container */}
        <div className="flex items-center space-x-2 bg-black bg-opacity-30 px-3 py-1 rounded">
          <span className="text-yellow-400 font-bold">5,000</span>
          <span className="text-green-200">e</span>
        </div>
      </div>

      {/* Right Section: Level Badge */}
      <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
        <FaShieldAlt className="text-black text-lg" />
        <span className="text-white font-semibold">LVL 99</span>
      </div>
    </nav>
  );
}
