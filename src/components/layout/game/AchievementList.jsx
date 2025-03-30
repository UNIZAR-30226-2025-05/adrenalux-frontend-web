import React, { useEffect, useState } from "react";
import { getAchievements } from "../../../services/api/achievementApi";
import { motion } from "framer-motion";

const AchievementList = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await getAchievements();
        setAchievements(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return <div className="text-gray-700 text-2xl text-center py-10">Cargando logros...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">Error: {error}</div>;
  }

  if (achievements.length === 0) {
    return <div className="text-gray-500 text-center py-10">No hay logros disponibles.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <motion.h1 
        className="text-white text-5xl font-extrabold mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🎖 Logros
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
