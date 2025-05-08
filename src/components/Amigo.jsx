import { useState, useEffect } from "react";
import {
  FaExchangeAlt,
  FaPlus,
  FaTrash,
  FaTimes,
  FaCheck,
  FaTrophy,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import background from "../assets/background.png";
import BackButton from "../components/layout/game/BackButton";
import { socketService } from "../services/websocket/socketService";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/api/authApi";
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  deleteFriend,
} from "../services/api/friendApi";
import { getProfile } from "../services/api/profileApi";

export default function Amigo() {
  const [currentTab, setCurrentTab] = useState("amigos");
  const [amigos, setAmigos] = useState([]);
  const [user, setUser] = useState([]);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState([]);
  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState([]);
  const [currentFriends, setCurrentFriends] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const maxFriends = 99;
  const token = getToken();

  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendCode, setNewFriendCode] = useState("");

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();

    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const friends = await getFriends();
      const requests = await getFriendRequests();
      const user = await getProfile();
      setUser(user);
      setAmigos(friends);
      setSolicitudesRecibidas(requests || []);
    } catch (error) {
      console.error("Error cargando los datos:", error);
    } finally {
      setIsLoading(false);
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
      if (!friendToDelete) return;
      await deleteFriend(friendToDelete.id);
      setAmigos(amigos.filter((amigo) => amigo.id !== friendToDelete.id));
      setCurrentFriends(currentFriends - 1);
      setShowDeleteConfirmation(false);
      fetchData();
    } catch (error) {
      console.error("Error al eliminar amigo:", error);
    }
  };

  const handleChallenge = (friend) => {
    // Envía desafío al amigo y navega al home
    socketService.sendChallengeRequest(friend.id, user.data.username);
    navigate("/esperando", { state: { jugador: friend } });
  };

  const renderRow = (item, tab, id) => {
    return (
      <motion.div
        key={item.id}
        className="flex items-center justify-between bg-[#0190D2] rounded-lg p-3 mb-2 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center space-x-3">
          {item.crest && (
            <img
              src={item.crest}
              alt="crest"
              className="w-10 h-10 object-contain rounded-full"
            />
          )}
          <div className="flex flex-col">
            <p className="text-sm text-white">Nivel {item.level}</p>
            <p className="text-md text-white font-bold">{item.username}</p>
          </div>
        </div>

        {tab === "amigos" && (
          <div className="flex items-center space-x-2">
            <motion.button
              className="bg-yellow-500 hover:bg-yellow-400 text-white p-2 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleChallenge(item)}
              title="Desafiar"
            >
              <FaTrophy size={16} />
            </motion.button>
            <motion.button
              className="bg-blue-500 hover:bg-blue-400 text-white p-2 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                socketService.sendExchangeRequest(
                  item["id"],
                  user.data.username
                );
                navigate("/esperando", { state: { jugador: item } });
              }}
              title="Intercambiar"
            >
              <FaExchangeAlt size={16} />
            </motion.button>
            <motion.button
              className="bg-red-500 hover:bg-red-400 text-white p-2 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setFriendToDelete(item);
                setShowDeleteConfirmation(true);
              }}
              title="Eliminar"
            >
              <FaTrash size={16} />
            </motion.button>
          </div>
        )}

        {tab === "recibidas" && (
          <div className="flex items-center space-x-2">
            <motion.button
              className="bg-green-500 hover:bg-green-400 text-white p-2 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAcceptRequest(id)}
              title="Aceptar"
            >
              <FaCheck size={16} />
            </motion.button>
            <motion.button
              className="bg-red-500 hover:bg-red-400 text-white p-2 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleRejectRequest(id)}
              title="Rechazar"
            >
              <FaTimes size={16} />
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 w-full h-full bg-cover bg-center text-white flex flex-col items-center overflow-auto"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute top-5 left-5">
        <BackButton onClick={() => navigate("/home")} />
      </div>

      <motion.div
        className="flex items-center justify-between bg-[#006298] px-6 py-4 mt-12 w-full max-w-[600px] rounded-lg mx-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold">Amigos</h2>
        <div className="flex items-center space-x-8">
          <p className="text-white text-sm">
            {currentFriends}/{maxFriends}
          </p>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <button
              className="bg-green-500 hover:bg-green-400 text-white p-2 rounded-full flex items-center justify-center"
              onClick={handleOpenAddFriendModal}
              title="Añadir amigo"
            >
              <FaPlus size={16} />
            </button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="bg-black/50 mt-6 w-full max-w-[600px] rounded-lg p-4 flex flex-col items-center max-h-[500px] overflow-y-auto mx-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <AnimatePresence mode="wait">
            {currentTab === "amigos" && (
              <motion.div
                className="w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="amigos-tab"
              >
                {amigos == null || amigos.length === 0 ? (
                  <motion.p
                    className="text-white text-center py-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Aún no tienes amigos.
                  </motion.p>
                ) : (
                  amigos?.map((amigo) => renderRow(amigo, "amigos"))
                )}
              </motion.div>
            )}

            {currentTab === "recibidas" && (
              <motion.div
                className="w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="recibidas-tab"
              >
                {solicitudesRecibidas == null ||
                solicitudesRecibidas.length === 0 ? (
                  <motion.p
                    className="text-white text-center py-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    No tienes solicitudes de amistad.
                  </motion.p>
                ) : (
                  solicitudesRecibidas?.map((sol) =>
                    renderRow(sol.sender, "recibidas", sol.id)
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      <div className="flex space-x-4 md:space-x-8 mt-6 mb-10">
        <motion.button
          onClick={() => setCurrentTab("amigos")}
          className={`px-4 py-2 rounded-md ${
            currentTab === "amigos" ? "bg-[#2B5C94]" : "bg-black/50"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Amigos
        </motion.button>

        <motion.button
          onClick={() => setCurrentTab("recibidas")}
          className={`px-4 py-2 rounded-md ${
            currentTab === "recibidas" ? "bg-[#2B5C94]" : "bg-black/50"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Solicitudes recibidas
        </motion.button>
      </div>

      <AnimatePresence>
        {showDeleteConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#2B5C94] p-6 rounded-lg shadow-lg w-80 mx-2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-4 text-center">
                ¿Estás seguro de que deseas eliminar a{" "}
                {friendToDelete?.username}?
              </h2>
              <div className="flex justify-around">
                <motion.button
                  onClick={handleDeleteFriend}
                  className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sí
                </motion.button>
                <motion.button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  No
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddFriendModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#2B5C94] p-6 rounded-lg shadow-lg w-80 mx-2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-4 text-center">
                Ingresa el código de amigo
              </h2>
              <input
                type="text"
                value={newFriendCode}
                onChange={(e) => setNewFriendCode(e.target.value)}
                className="w-full px-4 py-2 mb-4 rounded-md text-black bg-white/90"
                placeholder="Código de amigo"
              />
              <div className="flex justify-around">
                <motion.button
                  onClick={handleAddFriend}
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enviar solicitud
                </motion.button>
                <motion.button
                  onClick={handleCloseAddFriendModal}
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancelar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
