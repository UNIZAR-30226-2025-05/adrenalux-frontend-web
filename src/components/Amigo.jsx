import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { FaArrowLeft, FaPlus, FaTrash, FaSyncAlt } from "react-icons/fa";
import background from "../assets/background.png";
import BackButton from "../components/layout/game/BackButton"; // Importar BackButton

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

export default function Amigo() {
  const navigate = useNavigate(); // Crear la función navigate

  const [currentTab, setCurrentTab] = useState("amigos");

  const [currentFriends, setCurrentFriends] = useState(15);
  const maxFriends = 99;

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const handleTrashClick = (item) => {
    console.log("Eliminar a:", item.nombre);
  };
  const handleSyncClick = (item) => {
    console.log("Invitar / Mover / Sincronizar con:", item.nombre);
  };

  const renderRow = (item) => {
    return (
      <div
        key={item.id}
        className="flex items-center justify-between bg-[#0190D2] rounded-lg p-3 mb-2 w-[500px]"
      >
        <div className="flex items-center space-x-3">
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
    if (solicitudesRecibidasData.length === 0) {
      content = <p className="text-white mt-4">No hay solicitudes recibidas</p>;
    } else {
      content = solicitudesRecibidasData.map((sol) => renderRow(sol));
    }
  }

  // Función para manejar el click en el botón de regreso
  const handleBackClick = () => {
    navigate("/home");
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center text-white flex flex-col items-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Back button */}
      <div className="absolute top-5 left-5">
        <BackButton onClick={handleBackClick} /> {/* Botón de regreso */}
      </div>

      {/* Title + friend counter + plus icon */}
      <div className="flex items-center justify-between bg-[#006298] px-6 py-4 mt-12 w-[600px] rounded-lg">
        <h2 className="text-2xl font-bold">Amigos</h2>
        <div className="flex items-center space-x-8">
          <p className="text-white text-sm">
            {currentFriends}/{maxFriends}
          </p>
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
