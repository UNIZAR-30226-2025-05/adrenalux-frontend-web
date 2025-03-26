import React, { useEffect, useState } from "react";
import { getAchievements } from "../../../services/api/achievementApi";

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
    return <div>Cargando logros...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (achievements.length === 0) {
    return <div>No hay logros disponibles.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900 py-10">
      <h1 className="text-white text-4xl font-bold mt-9 mb-9">Logros</h1>

      <div className="bg-gray-900 bg-opacity-90 p-6 rounded-lg w-full max-w-5xl mx-auto max-h-[70vh] overflow-y-auto mb-10 border-4 border-gray-700">
        {/* Agregamos bordes laterales al contenedor y limitamos la altura */}
        <div className="grid grid-cols-1 gap-4 px-6 py-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg shadow-md text-white ${
                achievement.unlocked ? "bg-blue-500" : "bg-gray-700"
              }`}
            >
              <div className="flex items-center">
                <span
                  className={`text-3xl mr-4 ${
                    achievement.unlocked ? "text-yellow-400" : "text-gray-400"
                  }`}
                >
                  🏆
                </span>
                <div>
                  <h2 className="text-lg font-semibold">{achievement.logro.description}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400">+{achievement.logro.reward_type}</p>
                <p className="text-yellow-400">+{achievement.logro.reward_amount} 🪙</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementList;
