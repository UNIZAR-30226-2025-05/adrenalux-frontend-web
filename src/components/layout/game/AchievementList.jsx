import React, { useEffect, useState } from "react";
import { getAchievements } from "../../../services/api/achievementApi"; // Asegúrate de importar correctamente la API

const AchievementList = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para obtener logros al cargar el componente
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await getAchievements(); // Llamada a la API
        setAchievements(data); // Si la respuesta es válida, guardamos los logros
      } catch (error) {
        setError(error.message); // Guardamos el mensaje de error si ocurre
      } finally {
        setLoading(false); // Terminamos la carga
      }
    };

    fetchAchievements();
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  // Mostrar mensaje de carga
  if (loading) {
    return <div>Cargando logros...</div>;
  }

  // Mostrar mensaje de error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Si no hay logros
  if (achievements.length === 0) {
    return <div>No hay logros disponibles.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900 py-10">
      <h1 className="text-white text-4xl font-bold mt-9 mb-9">Logros</h1>

      <div className="bg-gray-900 bg-opacity-90 p-6 rounded-lg w-11/12 max-w-5xl max-h-[70vh] overflow-y-auto mb-10">
        <div className="grid grid-cols-2 gap-4">
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