import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaTrophy, FaMedal, FaUserAlt } from "react-icons/fa";
import { GiRank3, GiPodium } from "react-icons/gi";
import BackButton from "./layout/game/BackButton";
import {
  obtenerClasificacionTotal,
  obtenerClasificacionUsuario,
} from "../services/api/clasificacionApi";
import background from "../assets/background.png";

export default function ClasificacionJugadores() {
  const navigate = useNavigate();

  const [playersRanking, setPlayersRanking] = useState([]);
  const [userRanking, setUserRanking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScreen, setShowScreen] = useState(false);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

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
          Cargando clasificación...
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
            Volver
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const stats = [
    {
      label: "Jugados",
      value: selectedPlayer
        ? (selectedPlayer.won || 0) + (selectedPlayer.lost || 0)
        : 0,
      colorBg: "from-blue-600 to-blue-800",
      icon: "bg-blue-500",
    },
    {
      label: "Ganados",
      value: selectedPlayer?.won ?? 0,
      colorBg: "from-green-600 to-green-800",
      icon: "bg-green-500",
    },
    {
      label: "Perdidos",
      value: selectedPlayer?.lost ?? 0,
      colorBg: "from-red-600 to-red-800",
      icon: "bg-red-500",
    },
    {
      label: "Puntos",
      value: selectedPlayer?.puntos ?? 0,
      colorBg: "from-yellow-600 to-yellow-800",
      icon: "bg-yellow-500",
    },
  ];

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
                RANKING DE JUGADORES
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
                        "Posición",
                        "Nombre",
                        "Ganados",
                        "Jugados",
                        "Perdidos",
                        "Puntos",
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
                                TÚ
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
              Consejo: Haz click en un jugador para ver sus estadísticas
              detalladas
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
      <AnimatePresence>
        {showPlayerModal && selectedPlayer && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePlayerModal}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-2xl w-full p-12 relative shadow-2xl border-2 border-purple-500"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative elements */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-purple-500 rounded-full"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-purple-500 rounded-full"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-purple-500 rounded-full"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-purple-500 rounded-full"></div>

              <div className="flex flex-col items-center space-y-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center overflow-hidden border-4 border-blue-400 shadow-xl">
                    {selectedPlayer.avatar ? (
                      <img
                        src={selectedPlayer.avatar}
                        alt={selectedPlayer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserAlt size={48} className="text-white" />
                    )}
                  </div>

                  {selectedPlayer.position <= 3 && (
                    <div
                      className={`absolute -top-2 -right-2 w-10 h-10 rounded-full ${
                        medalStyles[selectedPlayer.position].bg
                      } flex items-center justify-center border-2 ${
                        medalStyles[selectedPlayer.position].border
                      }`}
                    >
                      {medalStyles[selectedPlayer.position].icon}
                    </div>
                  )}
                </div>

                <motion.h2
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300"
                  animate={{
                    textShadow: "0 0 8px rgba(216, 180, 254, 0.6)",
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.5,
                  }}
                >
                  {selectedPlayer.name}
                  {userRanking?.userid === selectedPlayer.userid && (
                    <span className="ml-2 text-xs font-bold bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full align-middle">
                      TÚ
                    </span>
                  )}
                </motion.h2>

                <div className="flex items-center mb-4">
                  <GiRank3 className="text-yellow-400 mr-2" size={24} />
                  <span className="text-xl font-bold text-white">
                    Posición #{selectedPlayer.position}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-4">
                  {stats.map(({ label, value, colorBg, icon }) => (
                    <motion.div
                      key={label}
                      className={`bg-gradient-to-br ${colorBg} p-4 rounded-xl text-center shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <div
                        className={`w-8 h-8 ${icon} rounded-full mx-auto mb-2 flex items-center justify-center`}
                      >
                        <span className="text-xs font-bold text-white">
                          {label.charAt(0)}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-200 mb-1">
                        {label}
                      </p>
                      <p className="text-3xl font-bold text-white">{value}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={closePlayerModal}
                  onHoverStart={() => setIsHoveringButton(true)}
                  onHoverEnd={() => setIsHoveringButton(false)}
                  className={`px-8 py-3 rounded-lg font-bold transition-all flex items-center mx-auto mt-6 ${
                    isHoveringButton
                      ? "bg-blue-700 shadow-lg shadow-blue-900/30"
                      : "bg-blue-600 shadow-md"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  CERRAR
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
