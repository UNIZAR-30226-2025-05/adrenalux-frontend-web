import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchTab({
  searchQuery,
  setSearchQuery,
  selectedTeam,
  setSelectedTeam,
  selectedPosition,
  setSelectedPosition,
  onSearchEnter,
}) {
  const [teams, setTeams] = useState([]);
  const positions = ["Portero", "Defensa", "Centrocampista", "Delantero"]; // Posiciones estáticas
  const API_URL = "http://52.34.37.50.18:3000/api/v1"; //
  useEffect(() => {
    fetch(`${API_URL}/teams`)
      .then((response) => response.json())
      .then((data) => setTeams(data))
      .catch((error) => console.error("Error fetching teams:", error));
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearchEnter();
    }
  };

  return (
    <div className="flex items-center space-x-6 bg-black/70 p-6 rounded-lg w-[850px] shadow-md">
      <select
        className="bg-gray-100 text-black px-6 py-3 text-lg rounded-lg cursor-pointer
                   hover:bg-gray-200 transition-colors 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
      >
        <option>Equipo</option>
        {teams.map((team) => (
          <option key={team.id} value={team.name}>
            {team.name}
          </option>
        ))}
      </select>

      <select
        className="bg-gray-100 text-black px-6 py-3 text-lg rounded-lg cursor-pointer
                   hover:bg-gray-200 transition-colors
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedPosition}
        onChange={(e) => setSelectedPosition(e.target.value)}
      >
        <option>Posición</option>
        {positions.map((pos, index) => (
          <option key={index} value={pos}>
            {pos}
          </option>
        ))}
      </select>

      <div
        className="flex items-center bg-gray-100 rounded-lg px-5 py-3 w-[320px]
                   focus-within:ring-2 focus-within:ring-blue-500 transition-shadow"
      >
        <input
          type="text"
          placeholder="Nombre"
          className="bg-transparent text-black outline-none flex-grow text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <FaSearch className="text-gray-500 ml-3 text-xl" />
      </div>
    </div>
  );
}
