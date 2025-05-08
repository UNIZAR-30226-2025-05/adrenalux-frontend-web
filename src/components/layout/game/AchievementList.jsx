import React, { useEffect, useState } from "react";
import { getAchievements } from "../../../services/api/achievementApi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import {
  FaTrophy, FaLock, FaWifi, FaServer, FaExclamationTriangle,
  FaSync, FaSmile, FaHome
} from "react-icons/fa";

const AchievementList = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const navigate = useNavigate();

  const fetchAchievements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAchievements();
      setAchievements(data);
    } catch (err) {
      if (err.type === "format") {
        setAchievements([]);
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allUnlocked = achievements.length > 0 && achievements.every(a => a.unlocked);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="text-indigo-400 text-5xl mb-4"
        >
          <FaTrophy />
        </motion.div>
        <p className="text-white text-lg font-medium">Cargando tus logros...</p>
      </div>
    );
  }

  if (error) {
    const getErrorIcon = () => {
      switch (error.type) {
        case "auth": return <FaLock className="text-red-400 text-5xl mb-4" />;
        case "network": return <FaWifi className="text-yellow-400 text-5xl mb-4" />;
        case "api": return <FaServer className="text-orange-400 text-5xl mb-4" />;
        default: return <FaExclamationTriangle className="text-purple-400 text-5xl mb-4" />;
      }
    };

    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          className="bg-gray-900/90 p-8 rounded-xl border border-gray-700 max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {getErrorIcon()}
          <h3 className="text-xl font-bold text-white mb-2 text-center">{error.title}</h3>
          <p className="text-gray-300 text-center mb-6">{error.message}</p>
          <button
            onClick={fetchAchievements}
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-2 px-6 rounded-full w-full transition-colors"
          >
            <FaSync /> Reintentar
          </button>
        </motion.div>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          className="bg-gray-900/90 p-8 rounded-xl border border-gray-700 max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <FaSmile className="text-indigo-400 text-5xl mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-white mb-2 text-center">¡Todavía no tienes logros!</h3>
          <p className="text-gray-300 text-center mb-6">
            ¿Qué esperas? Empieza tu camino ahora.
          </p>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-full w-full transition-colors"
          >
            <FaHome /> Ir al inicio
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10">
      {allUnlocked && (
        <>
          <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={250} />
          <motion.div
            className="text-3xl text-yellow-300 font-bold mb-6 text-center"
            initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
            animate={{ scale: [1.2, 1], rotate: [10, -10, 0], opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
          >
            🥳 ¡Has desbloqueado todos los logros!
          </motion.div>
        </>
      )}

      <motion.h1
        className="text-indigo-400 text-5xl font-extrabold mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🎖 Tus Logros
      </motion.h1>

      <div className="p-6 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[70vh] overflow-y-auto scrollbar-none border-4 border-violet-500 backdrop-blur-lg">
        <div className="grid grid-cols-1 gap-6 px-4 py-2">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className={`flex items-center justify-between p-5 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl text-white ${
                achievement.unlocked
                  ? "bg-gradient-to-r from-indigo-500 to-purple-700"
                  : "bg-violet-500"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center">
                <span className={`text-4xl mr-4 ${achievement.unlocked ? "text-yellow-300" : "text-gray-400"}`}>🏆</span>
                <div>
                  <h2 className="text-lg font-bold">{achievement.logro.description}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-300 font-semibold">+{achievement.logro.reward_type}</p>
                <p className="text-yellow-300 font-semibold">+{achievement.logro.reward_amount} 🪙</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementList;
