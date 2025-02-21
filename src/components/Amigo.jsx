import React, { useState } from "react";
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaSyncAlt,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import background from "../assets/background.png";
import BackButton from "../components/layout/game/BackButton"; // Importar BackButton
import { useNavigate } from "react-router-dom";

// Datos iniciales de ejemplo para cada pestaña:
const initialAmigosData = [
  {
    id: 1,
    nivel: 1,
    nombre: "Pablo_villa",
    crest: "/src/assets/manchester_united.png",
  },
  {
    id: 2,
    nivel: 23,
    nombre: "Dario_hueso",
    crest: "/src/assets/manchester_united.png",
  },
  {
    id: 3,
    nivel: 99,
    nombre: "Tahir_berga",
    crest: "/src/assets/real.png",
  },
  {
    id: 4,
    nivel: 1,
    nombre: "Pablo_villa",
    crest: "/src/assets/manchester_united.png",
  },
  {
    id: 8,
    nivel: 1,
    nombre: "Pablo_villa",
    crest: "/src/assets/manchester_united.png",
  },
  {
    id: 7,
    nivel: 23,
    nombre: "Dario_hueso",
    crest: "/src/assets/manchester_united.png",
  },
  {
    id: 6,
    nivel: 99,
    nombre: "Tahir_berga",
    crest: "/src/assets/real.png",
  },
  {
    id: 5,
    nivel: 1,
    nombre: "Pablo_villa",
    crest: "/src/assets/manchester_united.png",
  },
];

const initialSolicitudesEnviadasData = [
  {
    id: 101,
    nivel: 5,
    nombre: "Juanito_sent",
    crest: "/src/assets/portugal.png",
  },
];
const initialSolicitudesRecibidasData = [
  {
    id: 201,
    nivel: 10,
    nombre: "Marcos_received",
    crest: "/src/assets/villarreal.png",
  },
];

export default function Amigo({ onBack }) {
  // Pestañas: "amigos", "enviadas", "recibidas"
  const [currentTab, setCurrentTab] = useState("amigos");

  // Estados para almacenar y modificar los datos
  const [amigos, setAmigos] = useState(initialAmigosData);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState(
    initialSolicitudesEnviadasData
  );
  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState(
    initialSolicitudesRecibidasData
  );

  // Contador de amigos
  const [currentFriends, setCurrentFriends] = useState(amigos.length);
  const maxFriends = 99;

  // Estados para el diálogo de eliminación
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  // Estado para el modal de "Agregar amigo"
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  // Estado para guardar lo que se escribe en el input
  const [newFriendName, setNewFriendName] = useState("");

  // Cambiar pestaña
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  // Al hacer click en eliminar, guardamos el ítem y abrimos el diálogo
  const handleTrashClick = (item) => {
    setDeleteItem(item);
    setShowDeleteDialog(true);
  };
  const navigate = useNavigate();

  // Maneja la acción de "sincronizar" o "invitar"
  const handleSyncClick = (item) => {
    console.log("Invitar / Mover / Sincronizar con:", item.nombre);
  };

  // Maneja la acción de cancelar solicitud (solicitudes enviadas)
  const handleCancelRequest = (item) => {
    setDeleteItem(item);
    setShowDeleteDialog(true);
  };

  // Maneja la acción de aceptar o rechazar (solicitudes recibidas)
  const handleAcceptRequest = (item) => {
    console.log("Solicitud aceptada:", item.nombre);
    // Remueve la solicitud de la lista de solicitudes recibidas
    setSolicitudesRecibidas(
      solicitudesRecibidas.filter((sol) => sol.id !== item.id)
    );
    // Agrega el item a la lista de amigos
    setAmigos([...amigos, item]);
    // Actualiza el contador de amigos
    setCurrentFriends(currentFriends + 1);
  };
  const handleRejectRequest = (item) => {
    setDeleteItem(item);
    setShowDeleteDialog(true);
  };

  // Función para confirmar la eliminación (diálogo)
  const confirmDelete = () => {
    console.log("Eliminado:", deleteItem.nombre);
    if (currentTab === "amigos") {
      setAmigos(amigos.filter((amigo) => amigo.id !== deleteItem.id));
      setCurrentFriends(currentFriends - 1);
    } else if (currentTab === "enviadas") {
      setSolicitudesEnviadas(
        solicitudesEnviadas.filter((sol) => sol.id !== deleteItem.id)
      );
    } else {
      setSolicitudesRecibidas(
        solicitudesRecibidas.filter((sol) => sol.id !== deleteItem.id)
      );
    }
    setShowDeleteDialog(false);
  };

  // Abre el modal de "Agregar amigo"
  const handleOpenAddFriendModal = () => {
    setShowAddFriendModal(true);
  };

  // Cierra el modal de "Agregar amigo"
  const handleCloseAddFriendModal = () => {
    setShowAddFriendModal(false);
    setNewFriendName(""); // limpiar input
  };

  // Cuando el usuario confirma la acción de agregar, se envía una solicitud (se agrega a solicitudes enviadas)
  const handleAddFriend = () => {
    if (!newFriendName.trim()) return;
    const newId = Date.now();
    const newFriendRequest = {
      id: newId,
      nivel: 1,
      nombre: newFriendName,
      crest: "/src/assets/manchester_united.png",
    };
    setSolicitudesEnviadas([...solicitudesEnviadas, newFriendRequest]);
    handleCloseAddFriendModal();
  };

  // Renderiza una fila según la pestaña actual
  const renderRow = (item, tab) => {
    return (
      <div
        key={item.id}
        className="flex items-center justify-between bg-[#0190D2] rounded-lg p-3 mb-2 w-[500px]"
      >
        {/* Crest + nivel + nombre */}
        <div className="flex items-center space-x-3">
          {item.crest && (
            <img
              src={item.crest}
              alt="crest"
              className="w-10 h-10 object-contain"
            />
          )}
          <div className="flex flex-col">
            <p className="text-sm text-white">Nivel {item.nivel}</p>
            <p className="text-md text-white font-bold">{item.nombre}</p>
          </div>
        </div>

        {/* Parte derecha varía según la pestaña */}
        {tab === "amigos" && (
          <div className="flex space-x-4">
            <FaSyncAlt
              className="text-white cursor-pointer hover:text-green-500"
              onClick={() => handleSyncClick(item)}
            />
            <FaTrash
              className="text-white cursor-pointer hover:text-red-500"
              onClick={() => handleTrashClick(item)}
            />
          </div>
        )}

        {tab === "enviadas" && (
          <button
            onClick={() => handleCancelRequest(item)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition"
          >
            Cancelar solicitud
          </button>
        )}

        {tab === "recibidas" && (
          <div className="flex space-x-4">
            <FaCheck
              className="text-green-500 cursor-pointer hover:text-green-400"
              onClick={() => handleAcceptRequest(item)}
            />
            <FaTimes
              className="text-red-500 cursor-pointer hover:text-red-400"
              onClick={() => handleRejectRequest(item)}
            />
          </div>
        )}
      </div>
    );
  };

  // Determina el contenido según la pestaña actual
  let content;
  if (currentTab === "amigos") {
    content =
      amigos.length === 0 ? (
        <p className="text-white mt-4">No hay amigos</p>
      ) : (
        amigos.map((amigo) => renderRow(amigo, "amigos"))
      );
  } else if (currentTab === "enviadas") {
    content =
      solicitudesEnviadas.length === 0 ? (
        <p className="text-white mt-4">No hay solicitudes enviadas</p>
      ) : (
        solicitudesEnviadas.map((sol) => renderRow(sol, "enviadas"))
      );
  } else {
    content =
      solicitudesRecibidas.length === 0 ? (
        <p className="text-white mt-4">No hay solicitudes recibidas</p>
      ) : (
        solicitudesRecibidas.map((sol) => renderRow(sol, "recibidas"))
      );
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

      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-5 left-5 bg-black/50 p-3 rounded hover:bg-black transition"
        >
          <FaArrowLeft className="text-white text-2xl" />
        </button>
      )}

      <div className="flex items-center justify-between bg-[#006298] px-6 py-4 mt-12 w-[600px] rounded-lg">
        <h2 className="text-2xl font-bold">Amigos</h2>
        <div className="flex items-center space-x-8">
          <p className="text-white text-sm">
            {currentFriends}/{maxFriends}
          </p>
          <FaPlus
            className="text-white text-xl cursor-pointer hover:text-green-300"
            onClick={handleOpenAddFriendModal}
          />
        </div>
      </div>

      <div className="bg-black/50 mt-6 w-[600px] rounded-lg p-4 flex flex-col items-center max-h-[500px] overflow-y-auto">
        {content}
      </div>

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

      {showDeleteDialog && deleteItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2B5C94] bg-opacity-90 p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto">
            <p className="text-lg mb-6">
              {currentTab === "amigos"
                ? `¿Realmente deseas eliminar a ${deleteItem.nombre}?`
                : currentTab === "enviadas"
                ? `¿Realmente deseas cancelar la solicitud con ${deleteItem.nombre}?`
                : `¿Realmente deseas rechazar la solicitud de ${deleteItem.nombre}?`}
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={confirmDelete}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
              >
                Sí
              </button>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddFriendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2B5C94] p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-center">
              Agregar amigo
            </h2>
            <input
              type="text"
              className="w-full px-3 py-2 mb-4 rounded text-white bg-black"
              placeholder="Nombre del amigo..."
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
            />
            <div className="flex justify-around">
              <button
                onClick={handleAddFriend}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
              >
                Agregar
              </button>
              <button
                onClick={handleCloseAddFriendModal}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
