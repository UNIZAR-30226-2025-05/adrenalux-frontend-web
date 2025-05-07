import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSpinner,
  FaTimes,
  FaSearch,
  FaUserAlt,
  FaCheck,
} from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";

import background from "../assets/background.png";
import { getToken } from "../services/api/authApi";
import { socketService } from "../services/websocket/socketService";
import { getProfile } from "../services/api/profileApi";

export default function BuscandoJugador() {
  const navigate = useNavigate();
  const token = getToken();
  const [showScreen, setShowScreen] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [isHoveringCancel, setIsHoveringCancel] = useState(false);
  const [searchStatus, setSearchStatus] = useState(
    "Escaneando redes de juego..."
  );
  const [progress, setProgress] = useState(0);
  const [matchFound, setMatchFound] = useState(false);
  const [opponentData, setOpponentData] = useState(null);
  const [playerData, setPlayerData] = useState(null);

  const statusMessages = [
    "Buscando oponentes cercanos...",
    "Analizando niveles de habilidad...",
    "Verificando conexiones estables...",
    "Negociando condiciones de batalla...",
    "¡Oponente encontrado! Preparando arena...",
  ];

  // Cargar datos del jugador actual
  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        const profile = await getProfile();
        setPlayerData(profile.data);
      } catch (error) {
        console.error("Error al cargar perfil del jugador:", error);
      }
    };

    loadPlayerData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowScreen(true), 800);

    if (!token) {
      navigate("/");
      return;
    }

    // Escuchar evento de partida encontrada
    const matchFoundHandler = (data) => {
      setMatchFound(true);
      setSearchStatus("¡PARTIDA ENCONTRADA!");
      setProgress(100);

      // Simular datos del oponente (en producción vendrían del socket)
      setOpponentData({
        avatar:
          "/assets/profile_" + (Math.floor(Math.random() * 8) + 1) + ".png",
        username: "Oponente",
        level: data.opponentPuntos?.level || 15,
        puntos: data.opponentPuntos?.puntos || 1500,
      });
    };

    socketService.setOnMatchFound(matchFoundHandler);
    socketService.joinMatchmaking();

    // Search timer
    const interval = setInterval(() => {
      setSearchTime((prev) => prev + 1);
      setProgress((prev) => {
        const newProgress = Math.min(prev + Math.random() * 10, 100);
        return newProgress;
      });

      // Cycle through status messages
      if (!matchFound) {
        setSearchStatus(
          statusMessages[Math.floor(Math.random() * statusMessages.length)]
        );
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      socketService.setOnMatchFound(matchFoundHandler);
    };
  }, [token, navigate, matchFound]);

  useEffect(() => {
    if (matchFound) {
      setTimeout(() => {
        navigate("/game"); // Redirigir al juego cuando esté listo
      }, 3000);
    }
  }, [matchFound, navigate]);

  const handleCancel = () => {
    socketService.leaveMatchmaking();
    navigate("/home");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

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
          className="relative z-10 text-center text-white w-full max-w-2xl px-4"
        >
          {/* Main card */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border-2 border-purple-500 shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-purple-500 rounded-full"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-purple-500 rounded-full"></div>
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-purple-500 rounded-full"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-purple-500 rounded-full"></div>

            {/* Header */}
            <div className="flex items-center justify-center mb-6">
              <GiCrossedSwords className="text-3xl text-yellow-400 mr-3" />
              <motion.h2
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-yellow-300"
                animate={{
                  textShadow: matchFound
                    ? "0 0 12px rgba(74, 222, 128, 0.8)"
                    : "0 0 8px rgba(216, 180, 254, 0.6)",
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5,
                }}
              >
                {matchFound ? "PARTIDA ENCONTRADA" : "BUSCANDO RIVAL"}
              </motion.h2>
              <GiCrossedSwords className="text-3xl text-yellow-400 ml-3 transform rotate-180" />
            </div>

            {/* Search indicator */}
            <div className="relative mb-8">
              <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    matchFound
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <AnimatePresence>
                <motion.div
                  className="absolute -top-8 left-0 right-0 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {matchFound ? (
                    <span className="text-green-400 font-bold flex items-center justify-center">
                      <FaCheck className="mr-2" /> {searchStatus}
                    </span>
                  ) : (
                    <span className="text-gray-300">{searchStatus}</span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Player avatars */}
            <div className="flex justify-between items-center mb-10 px-10">
              {/* Jugador actual */}
              <div className="text-center">
                <div className="relative mx-auto mb-3">
                  <div
                    className={`w-20 h-20 rounded-full ${
                      matchFound
                        ? "bg-green-900 border-2 border-green-400"
                        : "bg-purple-900 border-2 border-purple-400"
                    } flex items-center justify-center overflow-hidden`}
                  >
                    {playerData ? (
                      <img
                        src={playerData.avatar}
                        alt="Tu avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserAlt
                        className={`text-3xl ${
                          matchFound ? "text-green-300" : "text-purple-300"
                        }`}
                      />
                    )}
                  </div>
                  <div className="absolute -bottom-1 left-0 right-0 text-center">
                    <span
                      className={`inline-block px-2 py-1 ${
                        matchFound ? "bg-green-600" : "bg-purple-600"
                      } text-xs font-bold rounded-full`}
                    >
                      TÚ
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  Nivel: {playerData?.level || "..."}
                </div>
              </div>

              <div className="text-4xl text-yellow-400 mx-4">VS</div>

              {/* Oponente */}
              <div className="text-center">
                <div className="relative mx-auto mb-3">
                  {!matchFound ? (
                    <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
                      <FaSearch className="text-2xl text-gray-500 animate-pulse" />
                    </div>
                  ) : (
                    <motion.div
                      className="w-20 h-20 rounded-full bg-red-900 border-2 border-red-400 flex items-center justify-center overflow-hidden"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                      }}
                    >
                      {opponentData ? (
                        <img
                          src={opponentData.avatar}
                          alt="Avatar oponente"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserAlt className="text-3xl text-red-300" />
                      )}
                    </motion.div>
                  )}
                  <div className="absolute -bottom-1 left-0 right-0 text-center">
                    {!matchFound ? (
                      <span className="inline-block px-2 py-1 bg-gray-700 text-xs font-bold rounded-full">
                        ?
                      </span>
                    ) : (
                      <motion.span
                        className="inline-block px-2 py-1 bg-red-600 text-xs font-bold rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          delay: 0.3,
                        }}
                      >
                        OPONENTE
                      </motion.span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  {!matchFound
                    ? "Buscando..."
                    : `Nivel: ${opponentData?.level || "..."}`}
                </div>
              </div>
            </div>

            {/* Stats and info */}
            <div className="flex justify-between w-full mb-10 text-base">
              <div className="bg-gray-800 bg-opacity-50 p-4 rounded-xl min-w-[120px] text-center">
                <div className="text-yellow-400 font-bold mb-2">Tiempo</div>
                <div className="text-lg">{formatTime(searchTime)}</div>
              </div>

              <div className="bg-gray-800 bg-opacity-50 p-4 rounded-xl min-w-[120px] text-center">
                <div className="text-blue-400 font-bold mb-2">Modo</div>
                <div className="text-lg">1vs1</div>
              </div>
            </div>

            {/* Cancel button */}
            {!matchFound ? (
              <motion.button
                onClick={handleCancel}
                onHoverStart={() => setIsHoveringCancel(true)}
                onHoverEnd={() => setIsHoveringCancel(false)}
                className={`px-8 py-3 rounded-lg font-bold transition-all flex items-center mx-auto ${
                  isHoveringCancel
                    ? "bg-red-700 shadow-lg shadow-red-900/30"
                    : "bg-red-600 shadow-md"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTimes className="mr-2" />
                CANCELAR BÚSQUEDA
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-green-400 font-bold text-lg"
              >
                Preparando partida...
              </motion.div>
            )}

            {/* Tips */}
            <div className="mt-6 text-xs text-gray-400">
              {matchFound
                ? "La partida comenzará en breve..."
                : "Consejo: Los jugadores con mejor conexión tienen prioridad en el emparejamiento"}
            </div>
          </div>

          {/* Background decorative elements */}
          <motion.div
            className="absolute -z-10 w-full h-full top-0 left-0"
            animate={{
              background: matchFound
                ? [
                    "radial-gradient(circle at 20% 30%, rgba(74, 222, 128, 0.15) 0%, transparent 20%)",
                    "radial-gradient(circle at 80% 70%, rgba(74, 222, 128, 0.15) 0%, transparent 20%)",
                    "radial-gradient(circle at 50% 20%, rgba(74, 222, 128, 0.15) 0%, transparent 20%)",
                  ]
                : [
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
    </motion.div>
  );
}
