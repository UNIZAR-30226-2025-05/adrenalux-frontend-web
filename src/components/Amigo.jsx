import React, { useState } from "react";
import { FaArrowLeft, FaPlus, FaTrash, FaSyncAlt } from "react-icons/fa";
import background from "../assets/background.png";

// Example data for each tab:
const amigosData = [
  {
    id: 1,
    nivel: 1,
    nombre: "Pablo_villa",
    crest: "/src/assets/manchester_united.png", // Example crest
  },
  {
    id: 2,
    nivel: 23,
    nombre: "Dario_hueso",
    crest: "/src/assets/manchester_united.png", // Another crest
  },
  {
    id: 3,
    nivel: 99,
    nombre: "Tahir_berga",
    crest: "/src/assets/real.png",
  },
];
const solicitudesEnviadasData = [
  {
    id: 101,
    nivel: 5,
    nombre: "Juanito_sent",
    crest: "/src/assets/portugal.png",
  },
];
const solicitudesRecibidasData = [
  {
    id: 201,
    nivel: 10,
    nombre: "Marcos_received",
    crest: "/src/assets/villarreal.png",
  },
];

export default function Amigo({ onBack }) {
  // Tabs: "amigos", "enviadas", "recibidas"
  const [currentTab, setCurrentTab] = useState("amigos");

  // Example counters
  const [currentFriends, setCurrentFriends] = useState(15);
  const maxFriends = 99;

  // Handle bottom tabs
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  // Example: handle icon clicks (trash, sync)
  const handleTrashClick = (item) => {
    console.log("Eliminar a:", item.nombre);
  };
  const handleSyncClick = (item) => {
    console.log("Invitar / Mover / Sincronizar con:", item.nombre);
  };

  // Render a single row item
  const renderRow = (item) => {
    return (
      <div
        key={item.id}
        className="flex items-center justify-between bg-[#0190D2] rounded-lg p-3 mb-2 w-[500px]"
      >
        {/* Crest + level + name */}
        <div className="flex items-center space-x-3">
          {/* Club crest */}
          {item.crest && (
            <img
              src={item.crest}
              alt="crest"
              className="w-10 h-10 object-contain"
            />
          )}
          <div className="flex flex-col">
            <p className="text-sm text-white">
              Nivel {item.nivel}
            </p>
            <p className="text-md text-white font-bold">
              {item.nombre}
            </p>
          </div>
        </div>

        {/* Icons on the right */}
        <div className="flex space-x-4">
          <FaSyncAlt
            className="text-white cursor-pointer hover:text-gray-200"
            onClick={() => handleSyncClick(item)}
          />
          <FaTrash
            className="text-white cursor-pointer hover:text-red-300"
            onClick={() => handleTrashClick(item)}
          />
        </div>
      </div>
    );
  };

  // Render the list depending on the tab
  let content;
  if (currentTab === "amigos") {
    if (amigosData.length === 0) {
      content = <p className="text-white mt-4">No hay amigos</p>;
    } else {
      content = amigosData.map((amigo) => renderRow(amigo));
    }
  } else if (currentTab === "enviadas") {
    if (solicitudesEnviadasData.length === 0) {
      content = <p className="text-white mt-4">No hay solicitudes enviadas</p>;
    } else {
      content = solicitudesEnviadasData.map((sol) => renderRow(sol));
    }
  } else {
    // recibidas
    if (solicitudesRecibidasData.length === 0) {
      content = <p className="text-white mt-4">No hay solicitudes recibidas</p>;
    } else {
      content = solicitudesRecibidasData.map((sol) => renderRow(sol));
    }
  }

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center text-white flex flex-col items-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Back arrow (top-left) */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-5 left-5 bg-black/50 p-3 rounded hover:bg-black transition"
        >
          <FaArrowLeft className="text-white text-2xl" />
        </button>
      )}

      {/* Title + friend counter + plus icon */}
      <div className="flex items-center justify-between bg-[#006298] px-6 py-4 mt-12 w-[600px] rounded-lg">
        <h2 className="text-2xl font-bold">Amigos</h2>
        <div className="flex items-center space-x-8">
          {/* 15/99 */}
          <p className="text-white text-sm">
            {currentFriends}/{maxFriends}
          </p>
          {/* Plus icon */}
          <FaPlus className="text-white text-xl cursor-pointer hover:text-green-300" />
        </div>
      </div>

      {/* Main box with the list */}
      <div className="bg-black/50 mt-6 w-[600px] rounded-lg p-4 flex flex-col items-center">
        {content}
      </div>

      {/* Bottom tabs */}
      <div className="flex space-x-8 mt-6">
        <button
          onClick={() => handleTabChange("amigos")}
          className={`px-4 py-2 rounded-md ${
            currentTab === "amigos" ? "bg-[#2B5C94]" : "bg-black/50"
          }`}
        >
          Amigos
        </button>
        <button
          onClick={() => handleTabChange("enviadas")}
          className={`px-4 py-2 rounded-md ${
            currentTab === "enviadas" ? "bg-[#2B5C94]" : "bg-black/50"
          }`}
        >
          Solicitudes enviadas
        </button>
        <button
          onClick={() => handleTabChange("recibidas")}
          className={`px-4 py-2 rounded-md ${
            currentTab === "recibidas" ? "bg-[#2B5C94]" : "bg-black/50"
          }`}
        >
          Solicitudes recibidas
        </button>
      </div>
    </div>
  );
}
