import React, { useEffect, useState } from "react";
import { getAchievements } from "../../../services/api/achievementApi";
import { motion } from "framer-motion";
import { FaTrophy, FaLock, FaWifi, FaServer, FaExclamationTriangle, FaSync, FaSmile } from "react-icons/fa";

const AchievementList = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAchievements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAchievements();
      setAchievements(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Estado de carga
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="text-yellow-400 text-5xl mb-4"
        >
          <FaTrophy />
        </motion.div>
        <p className="text-white text-lg font-medium">Cargando tus logros...</p>
      </div>
    );
  }

  // Estado de error
  if (error) {
    const getErrorIcon = () => {
      switch(error.type) {
        case 'auth': return <FaLock className="text-red-400 text-5xl mb-4" />;
        case 'network': return <FaWifi className="text-yellow-400 text-5xl mb-4" />;
        case 'api': return <FaServer className="text-orange-400 text-5xl mb-4" />;
        case 'format': return <FaExclamationTriangle className="text-blue-400 text-5xl mb-4" />;
        default: return <FaExclamationTriangle className="text-purple-400 text-5xl mb-4" />;
      }
    };

    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          className="bg-gray-800/90 p-8 rounded-xl border border-gray-700 max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {getErrorIcon()}
          <h3 className="text-xl font-bold text-white mb-2 text-center">{error.title}</h3>
          <p className="text-gray-300 text-center mb-6">{error.message}</p>
          <button
            onClick={fetchAchievements}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-full w-full transition-colors"
          >
            <FaSync /> Reintentar
          </button>
        </motion.div>
      </div>
    );
  }

  // Estado sin logros
  if (achievements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          className="bg-gray-800/90 p-8 rounded-xl border border-gray-700 max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <FaSmile className="text-green-400 text-5xl mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-white mb-2 text-center">¡Aún no tienes logros!</h3>
          <p className="text-gray-300 text-center">
            Completa actividades para desbloquear tus primeros logros y recompensas.
          </p>
        </motion.div>
      </div>
    );
  }

  // ESTADO ORIGINAL DE LOGROS (sin cambios)
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <motion.h1 
        className="text-white text-5xl font-extrabold mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🎖 Tus Logros
      </motion.h1>

      <div className="p-6 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[70vh] overflow-y-auto border-4 border-gray-300 backdrop-blur-lg">
        <div className="grid grid-cols-1 gap-6 px-4 py-2">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className={`flex items-center justify-between p-5 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl text-gray-900 ${
                achievement.unlocked ? "bg-gradient-to-r from-yellow-500 to-orange-500" : "bg-gray-200"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center">
                <span className={`text-4xl mr-4 ${achievement.unlocked ? "text-yellow-700" : "text-gray-500"}`}>🏆</span>
                <div>
                  <h2 className="text-lg font-bold">{achievement.logro.description}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-semibold">+{achievement.logro.reward_type}</p>
                <p className="text-yellow-600 font-semibold">+{achievement.logro.reward_amount} 🪙</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementList;