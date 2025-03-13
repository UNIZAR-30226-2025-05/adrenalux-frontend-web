import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaPlus, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import background from "../assets/background.png";
import BackButton from "../components/layout/game/BackButton";
import { socketService } from "../services/websocket/socketService";
import { useNavigate } from "react-router-dom";
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  deleteFriend,
} from "../services/api/friendApi";

export default function Amigo() {
  const [currentTab, setCurrentTab] = useState("amigos");
  const [amigos, setAmigos] = useState([]);
  const [user, setUser] = useState([]);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState([]);
  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState([]);
  const [currentFriends, setCurrentFriends] = useState(0);
  const maxFriends = 99;

  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendCode, setNewFriendCode] = useState("");

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // Nuevo estado
  const [friendToDelete, setFriendToDelete] = useState(null); // Para almacenar el amigo a eliminar

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const friends = (await getFriends()) ?? [];
      const requests = await getFriendRequests();
      const user = await getProfile();
      setUser(user);
      setAmigos(friends);
      setSolicitudesEnviadas(requests.sent || []);
      setSolicitudesRecibidas(requests.received || []);

      setCurrentFriends(friends.length);
    } catch (error) {
      console.error("Error cargando los datos:", error);
    }
  };

  const handleOpenAddFriendModal = () => {
    setShowAddFriendModal(true);
  };

  const handleCloseAddFriendModal = () => {
    setShowAddFriendModal(false);
    setNewFriendCode("");
  };

  const handleAddFriend = async () => {
    if (!newFriendCode.trim()) return;
    try {
      await sendFriendRequest(newFriendCode);
      setSolicitudesEnviadas([
        ...solicitudesEnviadas,
        { nombre: newFriendCode },
      ]);
      handleCloseAddFriendModal();
      fetchData();
    } catch (error) {
      console.error("Error al enviar solicitud de amistad:", error);
    }
  };

  const handleAcceptRequest = async (item) => {
    try {
      await acceptFriendRequest(item);
      setSolicitudesRecibidas(
        solicitudesRecibidas.filter((sol) => sol.id !== item)
      );
      setAmigos([...amigos, item]);
      setCurrentFriends(currentFriends + 1);
      fetchData();
    } catch (error) {
      console.error("Error al aceptar solicitud:", error);
    }
  };

  const handleRejectRequest = async (item) => {
    try {
      await declineFriendRequest(item);
      setSolicitudesRecibidas(
        solicitudesRecibidas.filter((sol) => sol.id !== item)
      );
      fetchData();
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
    }
  };

  const handleDeleteFriend = async () => {
    try {
      await deleteFriend(deleteItem.id);
      setAmigos(amigos.filter((amigo) => amigo.id !== deleteItem.id));
      setCurrentFriends(currentFriends - 1);
      setShowDeleteDialog(false);
      fetchData();
    } catch (error) {
      console.error("Error al eliminar amigo:", error);
    }
  };

  const renderRow = (item, tab, id) => {
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
            <p className="text-sm text-white">Nivel {item.level}</p>
            <p className="text-md text-white font-bold">{item.username}</p>
          </div>
        </div>

        {tab === "amigos" && (
          <FaTrash
            className="text-white cursor-pointer hover:text-red-500"
            onClick={() => {
              setDeleteItem(item);
              setShowDeleteDialog(true);
            }}
          />
        )}

        {tab === "enviadas" && (
          <button
            onClick={() => handleRejectRequest(item)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition"
          >
            Cancelar solicitud
          </button>
        )}

        {tab === "recibidas" && (
          <div className="flex space-x-4">
            <FaCheck
              className="text-green-500 cursor-pointer hover:text-green-400"
              onClick={() => handleAcceptRequest(id)}
            />
            <FaTimes
              className="text-red-500 cursor-pointer hover:text-red-400"
              onClick={() => handleRejectRequest(id)}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center text-white flex flex-col items-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute top-5 left-5">
        <BackButton onClick={() => navigate("/home")} />
      </div>

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
        {currentTab === "amigos" &&
          amigos.map((amigo) => renderRow(amigo, "amigos"))}
        {currentTab === "enviadas" &&
          solicitudesEnviadas.map((sol) => renderRow(sol, "enviadas"))}
        {currentTab === "recibidas" &&
          solicitudesRecibidas.map((sol) => renderRow(sol, "recibidas"))}
      </div>

      <div className="flex space-x-8 mt-6">
        <button
          onClick={() => setCurrentTab("amigos")}
          className={`px-4 py-2 rounded-md ${
            currentTab === "amigos" ? "bg-[#2B5C94]" : "bg-black/50"
          }`}
        >
          Amigos
        </button>

        <button
          onClick={() => setCurrentTab("recibidas")}
          className={`px-4 py-2 rounded-md ${
            currentTab === "recibidas" ? "bg-[#2B5C94]" : "bg-black/50"
          }`}
        >
          Solicitudes recibidas
        </button>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2B5C94] p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-center">
              ¿Estás seguro de que deseas eliminar a {friendToDelete?.username}?
            </h2>
            <div className="flex justify-around">
              <button
                onClick={handleDeleteFriend}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
              >
                Sí
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
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
              Ingresa el código de amigo
            </h2>
            <input
              type="text"
              value={newFriendCode}
              onChange={(e) => setNewFriendCode(e.target.value)}
              className="w-full px-4 py-2 mb-4 rounded-md text-white"
              placeholder="Código de amigo"
            />
            <div className="flex justify-around">
              <button
                onClick={handleAddFriend}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
              >
                Enviar solicitud
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
