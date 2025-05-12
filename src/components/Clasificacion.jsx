import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy, FaMedal, FaUserAlt, FaUserPlus } from "react-icons/fa";
import { GiRank3, GiPodium } from "react-icons/gi";
import BackButton from "./layout/game/BackButton";
import {
  obtenerClasificacionTotal,
  obtenerClasificacionUsuario,
} from "../services/api/clasificacionApi";
import { sendFriendRequest } from "../services/api/friendApi";
import background from "../assets/background.png";
import { useTranslation } from "react-i18next";

export default function ClasificacionJugadores() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [playersRanking, setPlayersRanking] = useState([]);
  const [userRanking, setUserRanking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScreen, setShowScreen] = useState(false);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [notification, setNotification] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);

  /* ──────────────── cargar ranking ──────────────── */
  useEffect(() => {
    const timer = setTimeout(() => setShowScreen(true), 800);

    (async () => {
      try {
        setLoading(true);
        const [ranking, user] = await Promise.all([
          obtenerClasificacionTotal(),
          obtenerClasificacionUsuario(),
        ]);
        setPlayersRanking(ranking ?? []);
        setUserRanking(user ?? null);
      } catch (err) {
        console.error(err);
        setError("Error al cargar la clasificación");
      } finally {
        setLoading(false);
      }
    })();

    return () => clearTimeout(timer);
  }, []);

  const handleBackClick = () => navigate("/home");

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddFriend = async (friendCode) => {
    if (!friendCode || sendingRequest) return;

    try {
      setSendingRequest(true);
      await sendFriendRequest(friendCode); // Now using friend code
      showNotification(t("friend.requestSent"));
    } catch (error) {
      console.error("Error al enviar solicitud de amistad:", error);
      showNotification(t("friend.errorSendingRequest"));
    } finally {
      setSendingRequest(false);
    }
  };

  const medalStyles = {
    1: {
      bg: "bg-[#FFD700]/90",
      border: "border-[#FFD700]",
      icon: <FaTrophy className="text-yellow-800" size={16} />,
    },
    2: {
      bg: "bg-[#C0C0C0]/90",
      border: "border-[#C0C0C0]",
      icon: <FaMedal className="text-gray-700" size={16} />,
    },
    3: {
      bg: "bg-[#CD7F32]/90",
      border: "border-[#CD7F32]",
      icon: <FaMedal className="text-amber-800" size={16} />,
    },
  };

  const openPlayerModal = (player) => {
    setSelectedPlayer(player);
    setShowPlayerModal(true);
  };

  const closePlayerModal = () => {
    setShowPlayerModal(false);
    setSelectedPlayer(null);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="bg-black bg-opacity-60 absolute inset-0" />
        <motion.div
          className="text-white text-3xl relative z-10 font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-yellow-300"
          animate={{
            textShadow: "0 0 8px rgba(216, 180, 254, 0.6)",
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.5,
          }}
        >
          {t("standing.loading")}{" "}
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="bg-black bg-opacity-60 absolute inset-0" />
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border-2 border-red-500 shadow-2xl relative z-10 text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <motion.button
            onClick={handleBackClick}
            className="px-6 py-3 bg-blue-600 rounded-lg text-white font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("standing.back")}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const stats = [
    {
      label: t("standing.played"),
      value: selectedPlayer
        ? (selectedPlayer.won || 0) + (selectedPlayer.lost || 0)
        : 0,
      colorBg: "from-blue-600 to-blue-800",
      icon: "bg-blue-500",
    },
    {
      label: t("standing.won"),
      value: selectedPlayer?.won ?? 0,
      colorBg: "from-green-600 to-green-800",
      icon: "bg-green-500",
    },
    {
      label: t("standing.lost"),
      value: selectedPlayer?.lost ?? 0,
      colorBg: "from-red-600 to-red-800",
      icon: "bg-red-500",
    },
    {
      label: t("standing.points"),
      value: selectedPlayer?.puntos ?? 0,
      colorBg: "from-yellow-600 to-yellow-800",
      icon: "bg-yellow-500",
    },
  ];

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {showScreen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="relative z-10 w-full max-w-5xl px-4 py-8 text-white"
        >
          <BackButton
            onClick={handleBackClick}
            className="absolute top-0 left-4 text-white z-20"
          />

          {/* Main card */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border-2 border-purple-500 shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-purple-500 rounded-full"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-purple-500 rounded-full"></div>
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-purple-500 rounded-full"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-purple-500 rounded-full"></div>

            {/* Header */}
            <div className="flex items-center justify-center mb-10">
              <GiPodium className="text-3xl text-yellow-400 mr-3" />
              <motion.h2
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-yellow-300"
                animate={{
                  textShadow: "0 0 8px rgba(216, 180, 254, 0.6)",
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5,
                }}
              >
                {t("standing.title")}{" "}
              </motion.h2>
              <GiPodium className="text-3xl text-yellow-400 ml-3 transform rotate-180" />
            </div>

            {/* Table container with glass effect */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg mb-6">
              <div className="max-h-[60vh] overflow-y-auto scrollbar-none">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gradient-to-r from-purple-900 to-blue-900">
                    <tr>
                      {[
                        t("standing.standing"),
                        t("standing.name"),
                        t("standing.won"),
                        t("standing.played"),
                        t("standing.lost"),
                        t("standing.points"),
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-4 text-left text-white text-sm uppercase tracking-wider font-bold"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-700 bg-gray-800 bg-opacity-50">
                    {playersRanking.map((player) => {
                      const isTop3 = player.position <= 3;
                      const isCurrentUser =
                        userRanking?.userid === player.userid;

                      /* estilo por puesto */
                      const circleClass = isTop3
                        ? `${medalStyles[player.position].bg} ${
                            medalStyles[player.position].border
                          }`
                        : "bg-blue-700 border-blue-700";

                      return (
                        <motion.tr
                          key={player.userid}
                          onClick={() => openPlayerModal(player)}
                          className={`cursor-pointer transition hover:bg-purple-900/30 ${
                            isCurrentUser ? "bg-yellow-600/30" : ""
                          }`}
                          whileHover={{ scale: 1.01 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full border-2 ${circleClass} flex items-center justify-center mr-2`}
                              >
                                {isTop3 ? (
                                  medalStyles[player.position].icon
                                ) : (
                                  <span className="text-xs font-bold text-white">
                                    {player.position}
                                  </span>
                                )}
                              </div>
                              {isTop3 && (
                                <span className="font-bold">
                                  {player.position}º
                                </span>
                              )}
                            </div>
                          </td>

                          {/* resto de columnas */}
                          <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                            {player.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs font-bold bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full">
                                {t("standing.me")}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-green-400 font-medium">
                            {player.won}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-blue-400 font-medium">
                            {player.played || player.won + player.lost}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-red-400 font-medium">
                            {player.lost}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-yellow-400 font-bold">
                            {player.puntos}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tips */}
            <div className="text-xs text-gray-400 text-center mt-4">
              {t("standing.suggestion")}
            </div>
          </div>

          {/* Background decorative elements */}
          <motion.div
            className="absolute -z-10 w-full h-full top-0 left-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 30%, rgba(124, 58, 237, 0.15) 0%, transparent 20%)",
                "radial-gradient(circle at 80% 70%, rgba(124, 58, 237, 0.15) 0%, transparent 20%)",
                "radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.15) 0%, transparent 20%)",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>
      )}

      {/* Player details modal */}
      {/* Player details modal */}
      <AnimatePresence>
        {showPlayerModal && selectedPlayer && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePlayerModal}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl max-w-2xl w-full mx-4 relative shadow-2xl border border-gray-700 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-3xl p-[2px] pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-3xl opacity-20 blur-md"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-3xl opacity-10"></div>
              </div>

              {/* Close button */}
              <button
                onClick={closePlayerModal}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="relative z-0 p-8">
                {/* Player header */}
                <div className="flex flex-col items-center mb-8">
                  {/* Avatar with rank badge */}
                  <div className="relative mb-4">
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center overflow-hidden border-4 border-blue-400/80 shadow-xl">
                      {selectedPlayer.avatar ? (
                        <img
                          src={selectedPlayer.avatar}
                          alt={selectedPlayer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserAlt
                          size={48}
                          className="text-white opacity-80"
                        />
                      )}
                    </div>

                    {/* Position badge */}
                    {selectedPlayer.position <= 3 ? (
                      <div
                        className={`absolute -top-2 -right-2 w-12 h-12 rounded-full ${
                          medalStyles[selectedPlayer.position].bg
                        } flex items-center justify-center border-2 ${
                          medalStyles[selectedPlayer.position].border
                        } shadow-lg`}
                      >
                        {medalStyles[selectedPlayer.position].icon}
                        <span className="absolute text-xs font-bold text-white">
                          {selectedPlayer.position}º
                        </span>
                      </div>
                    ) : (
                      <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-blue-700/90 border-2 border-blue-600 flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-white">
                          #{selectedPlayer.position}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Player name */}
                  <motion.h2
                    className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300"
                    animate={{
                      textShadow: "0 0 12px rgba(167, 139, 250, 0.5)",
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 2,
                    }}
                  >
                    {selectedPlayer.name}
                    {userRanking?.userid === selectedPlayer.userid && (
                      <span className="ml-3 text-sm font-bold bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full align-middle inline-block">
                        {t("standing.me")}
                      </span>
                    )}
                  </motion.h2>

                  {/* Player stats summary */}
                  <div className="flex items-center justify-center space-x-6 mt-2">
                    <div className="flex items-center text-green-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-bold">
                        {selectedPlayer.won || 0}
                      </span>
                    </div>
                    <div className="flex items-center text-red-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-bold">
                        {selectedPlayer.lost || 0}
                      </span>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-bold">
                        {selectedPlayer.puntos || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats cards grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {stats.map(({ label, value, colorBg, icon }) => (
                    <motion.div
                      key={label}
                      className={`bg-gradient-to-br ${colorBg} p-5 rounded-xl shadow-lg border border-gray-700 overflow-hidden relative`}
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-white/5 rounded-xl"></div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
                              {label}
                            </p>
                            <p className="text-3xl font-bold text-white">
                              {value}
                            </p>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            <div
                              className={`w-8 h-8 ${icon} rounded-full flex items-center justify-center`}
                            >
                              <span className="text-xs font-bold text-white">
                                {label.charAt(0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Win rate progress */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">
                      {t("standing.winRate")}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {selectedPlayer.played > 0
                        ? Math.round(
                            (selectedPlayer.won / selectedPlayer.played) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <motion.div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          selectedPlayer.played > 0
                            ? (selectedPlayer.won / selectedPlayer.played) * 100
                            : 0
                        }%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                  {/* Add friend button - only shown if not current user */}
                  {userRanking?.userid !== selectedPlayer.userid && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddFriend(selectedPlayer.friend_code);
                      }}
                      disabled={sendingRequest}
                      className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-all ${
                        sendingRequest
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {sendingRequest ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {t("friend.sending")}
                        </>
                      ) : (
                        <>
                          <FaUserPlus className="mr-2" />
                          {t("friend.addFriend")}
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 w-full h-full top-0 left-0 opacity-20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600 rounded-full filter blur-3xl"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {notification && <Notification message={notification} />}
      </AnimatePresence>
    </motion.div>
  );
}
