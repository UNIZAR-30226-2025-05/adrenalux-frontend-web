import React from "react";

const achievements = [
  { name: "Primerizo", description: "Gana 1 partida", xp: 100, coins: 1000, unlocked: true },
  { name: "Amateur", description: "Gana 10 partidas", xp: 1000, coins: 10000, unlocked: true },
  { name: "Profesional", description: "Gana 100 partidas", xp: 10000, coins: 100000, unlocked: true },
  { name: "Clase Mundial", description: "Gana 500 partidas", xp: 25000, coins: 250000, unlocked: false },
  { name: "Primeros pasos", description: "Colecciona 10 cartas", xp: 100, coins: 1000, unlocked: true },
  { name: "Ojeador", description: "Colecciona 100 cartas", xp: 1000, coins: 10000, unlocked: true },
  { name: "Entrenador", description: "Colecciona 250 cartas", xp: 10000, coins: 100000, unlocked: false },
  { name: "Presidente", description: "Obtén todas las cartas", xp: 25000, coins: 250000, unlocked: false },
  { name: "Real Valladolid", description: "Gana 1 torneo", xp: 100, coins: 1000, unlocked: true },
  { name: "Celta de Vigo", description: "Gana 10 torneos", xp: 1000, coins: 10000, unlocked: true },
  { name: "Athletic Club", description: "Gana 50 torneos", xp: 10000, coins: 100000, unlocked: false },
  { name: "Real Madrid", description: "Gana 100 torneos", xp: 25000, coins: 250000, unlocked: false },
  { name: "Mercader", description: "Pon a la venta 500 cartas", xp: 50000, coins: 500000, unlocked: true },
  { name: "LuxuryMen", description: "Llega al top 1 global", xp: 100000, coins: 1000000, unlocked: false }
];

const AchievementList = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900 py-10">
      <h1 className="text-white text-4xl font-bold mt-16 mb-6">Logros</h1>
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
                <span className={
                  `text-3xl mr-4 ${achievement.unlocked ? "text-yellow-400" : "text-gray-400"}`
                }>
                  🏆
                </span>
                <div>
                  <h2 className="text-lg font-semibold">{achievement.name}</h2>
                  <p className="text-sm">{achievement.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400">+{achievement.xp} XP</p>
                <p className="text-yellow-400">+{achievement.coins} 🪙</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementList;