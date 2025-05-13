import { useState, useEffect } from "react";
import {
  FaExchangeAlt,
  FaPlus,
  FaTrash,
  FaTimes,
  FaCheck,
  FaTrophy,
  FaUserFriends,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
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
import { useTranslation } from "react-i18next";

export default function Amigo() {
  const [currentTab, setCurrentTab] = useState("amigos");
  const [amigos, setAmigos] = useState([]);
  const [user, setUser] = useState([]);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState([]);
  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState([]);
  const [currentFriends, setCurrentFriends] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const maxFriends = 99;
  const token = getToken();

  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendCode, setNewFriendCode] = useState("");

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState(null);
  const { t } = useTranslation();

  const navigate = useNavigate();

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const listItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: "0px 0px 8px rgba(255, 255, 255, 0.5)" },
    tap: { scale: 0.9 },
  };

  const tabVariants = {
    inactive: { backgroundColor: "rgba(0, 0, 0, 0.5)", scale: 1 },
    active: {
      backgroundColor: "#2B5C94",
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
  };

  const modalVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: {
      y: 50,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Notificación de solicitud de amistad
  const [notification, setNotification] = useState(null);
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

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
      setAmigos(friends || []);
      setSolicitudesRecibidas(requests || []);
      setCurrentFriends(friends?.length || 0);
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
      showNotification(t("friend.requestSent"));
      fetchData();
    } catch (error) {
      console.error("Error al enviar solicitud de amistad:", error);
      showNotification(t("friend.errorSendingRequest"));
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
      showNotification(t("friend.requestAccepted"));
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
      showNotification(t("friend.requestRejected"));
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
      showNotification(t("friend.friendRemoved"));
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

  // Filtro de búsqueda
  const filteredFriends = amigos?.filter((amigo) =>
    amigo.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRow = (item, tab, id) => {
    return (
      <motion.div
        key={item.id || id}
        className="flex items-center justify-between bg-gradient-to-r from-[#0179A8] to-[#0190D2] rounded-lg p-3 mb-3 w-full backdrop-blur-sm shadow-lg"
        variants={listItemVariants}
        whileHover={{
          scale: 1.02,
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <div className="flex items-center space-x-3">
          {item.crest ? (
            <motion.img
              src={item.crest}
              alt="crest"
              className="w-12 h-12 object-contain rounded-full border-2 border-white shadow-md"
              initial={{ rotate: -10 }}
              whileHover={{ rotate: 10, scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            />
          ) : (
            <motion.div
              className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white shadow-md"
              initial={{ rotate: -10 }}
              whileHover={{ rotate: 10, scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {item.username?.[0]?.toUpperCase() || "?"}
            </motion.div>
          )}
          <div className="flex flex-col">
            <motion.p
              className="text-sm text-white opacity-80"
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Nivel {item.level || "?"}
            </motion.p>
            <motion.p
              className="text-lg text-white font-bold shadow-text"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {item.username}
            </motion.p>
          </div>
        </div>

        {tab === "amigos" && (
          <div className="flex items-center space-x-3">
            <motion.button
              className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-2 rounded-full flex items-center justify-center shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleChallenge(item)}
              title="Desafiar"
            >
              <FaTrophy size={16} />
            </motion.button>
            <motion.button
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-2 rounded-full flex items-center justify-center shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
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
              className="bg-gradient-to-br from-red-500 to-red-600 text-white p-2 rounded-full flex items-center justify-center shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
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
          <div className="flex items-center space-x-3">
            <motion.button
              className="bg-gradient-to-br from-green-500 to-green-600 text-white p-2 rounded-full flex items-center justify-center shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleAcceptRequest(id)}
              title="Aceptar"
            >
              <FaCheck size={16} />
            </motion.button>
            <motion.button
              className="bg-gradient-to-br from-red-500 to-red-600 text-white p-2 rounded-full flex items-center justify-center shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
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
      <motion.div
        className="h-16 w-16 rounded-full border-t-4 border-b-4 border-white"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  const EmptyState = ({ message }) => (
    <motion.div
      className="flex flex-col items-center justify-center h-40 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <motion.div
        className="text-6xl text-gray-400 mb-4"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {currentTab === "amigos" ? <FaUserFriends /> : <FaBell />}
      </motion.div>
      <p className="text-white text-lg">{message}</p>
    </motion.div>
  );

  const Notification = ({ message }) => (
    <motion.div
      className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
    >
      {message}
    </motion.div>
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
        className="flex items-center justify-between bg-gradient-to-r from-[#025682] to-[#006298] px-6 py-4 mt-12 w-full max-w-[600px] rounded-lg mx-2 shadow-lg backdrop-blur-sm"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.h2
          className="text-2xl font-bold shadow-text"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t("friend.title")}
        </motion.h2>
        <div className="flex items-center space-x-8">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <motion.div
              className="w-4 h-4 bg-blue-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                backgroundColor: ["#60A5FA", "#3B82F6", "#60A5FA"],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <p className="text-white text-sm font-medium">
              {currentFriends}/{maxFriends}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <button
              className="bg-gradient-to-br from-green-500 to-green-600 text-white p-3 rounded-full flex items-center justify-center shadow-xl"
              onClick={handleOpenAddFriendModal}
              title={t("friend.addFriend")}
            >
              <FaPlus size={16} />
            </button>
          </motion.div>
        </div>
      </motion.div>

      {currentTab === "amigos" && (
        <motion.div
          className="relative w-full max-w-[600px] px-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("friend.searchFriend")}
              className="w-full bg-black/40 backdrop-blur-sm text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </motion.div>
      )}

      <motion.div
        className="bg-black/40 backdrop-blur-sm mt-4 w-full max-w-[600px] rounded-lg p-4 flex flex-col items-center max-h-[500px] overflow-y-auto mx-2 shadow-lg border border-gray-800/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <AnimatePresence mode="wait">
            {currentTab === "amigos" && (
              <motion.div
                className="w-full"
                key="amigos-tab"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                {!filteredFriends || filteredFriends.length === 0 ? (
                  <EmptyState message={t("friend.noFriends")} />
                ) : (
                  filteredFriends.map((amigo) => renderRow(amigo, "amigos"))
                )}
              </motion.div>
            )}

            {currentTab === "recibidas" && (
              <motion.div
                className="w-full"
                key="recibidas-tab"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                {!solicitudesRecibidas || solicitudesRecibidas.length === 0 ? (
                  <EmptyState message={t("friend.noRequests")} />
                ) : (
                  solicitudesRecibidas.map((sol) =>
                    renderRow(sol.sender, "recibidas", sol.id)
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      <div className="flex space-x-6 md:space-x-8 mt-6 mb-10">
        <motion.button
          onClick={() => setCurrentTab("amigos")}
          variants={tabVariants}
          animate={currentTab === "amigos" ? "active" : "inactive"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-md text-white font-medium flex items-center space-x-2 shadow-lg"
        >
          <FaUserFriends />
          <span>{t("friend.title")}</span>
          {amigos?.length > 0 && (
            <motion.span
              className="bg-blue-500 text-xs px-2 py-1 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {amigos.length}
            </motion.span>
          )}
        </motion.button>

        <motion.button
          onClick={() => setCurrentTab("recibidas")}
          variants={tabVariants}
          animate={currentTab === "recibidas" ? "active" : "inactive"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-md text-white font-medium flex items-center space-x-2 shadow-lg"
        >
          <FaBell />
          <span>{t("friend.requestsReceived")}</span>
          {solicitudesRecibidas?.length > 0 && (
            <motion.span
              className="bg-red-500 text-xs px-2 py-1 rounded-full"
              initial={{ scale: 0 }}
              animate={{
                scale: [1, 1.2, 1],
                transition: {
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 1,
                },
              }}
            >
              {solicitudesRecibidas.length}
            </motion.span>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {showDeleteConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-gradient-to-b from-[#2B5C94] to-[#1a3a60] p-6 rounded-lg shadow-xl w-80 mx-2 border border-blue-400/30"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.h2
                className="text-xl font-bold mb-6 text-center"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {t("friend.confirmDelete")} "{friendToDelete?.username}"?
              </motion.h2>
              <div className="flex justify-around">
                <motion.button
                  onClick={handleDeleteFriend}
                  className="bg-gradient-to-br from-green-600 to-green-700 px-4 py-2 rounded hover:from-green-500 hover:to-green-600 transition shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 8px rgba(0, 255, 0, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("friend.yes")}
                </motion.button>
                <motion.button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="bg-gradient-to-br from-red-600 to-red-700 px-4 py-2 rounded hover:from-red-500 hover:to-red-600 transition shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 8px rgba(255, 0, 0, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("friend.no")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddFriendModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-gradient-to-b from-[#2B5C94] to-[#1a3a60] p-6 rounded-lg shadow-xl w-80 mx-2 border border-blue-400/30"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.h2
                className="text-xl font-bold mb-4 text-center"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {t("friend.addFriendModal.title")}
              </motion.h2>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="text"
                  value={newFriendCode}
                  onChange={(e) => setNewFriendCode(e.target.value)}
                  className="w-full px-4 py-3 mb-4 rounded-md text-black bg-white/90 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("friend.addFriendModal.placeholder")}
                />
              </motion.div>
              <div className="flex justify-around">
                <motion.button
                  onClick={handleAddFriend}
                  className="bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-2 rounded hover:from-blue-500 hover:to-blue-600 transition shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 8px rgba(0, 0, 255, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("friend.sendRequest")}
                </motion.button>
                <motion.button
                  onClick={handleCloseAddFriendModal}
                  className="bg-gradient-to-br from-red-600 to-red-700 px-4 py-2 rounded hover:from-red-500 hover:to-red-600 transition shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 8px rgba(255, 0, 0, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("friend.cancel")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && <Notification message={notification} />}
      </AnimatePresence>
    </div>
  );
}
