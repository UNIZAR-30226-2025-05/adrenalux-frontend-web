import React from "react";

const AchievementList = () => {
  // Lista de logros (esto podría venir de una API en el futuro)
  const logros = [
    { id: 1, nombre: "Primer Gol", descripcion: "Marca tu primer gol.", icono: "⚽" },
    { id: 2, nombre: "Hat-Trick", descripcion: "Marca 3 goles en un partido.", icono: "🥇" },
    { id: 3, nombre: "Campeón", descripcion: "Gana un torneo.", icono: "🏆" },
    { id: 4, nombre: "Leyenda", descripcion: "Juega 100 partidos.", icono: "🔥" },
  ];

  return (
    <div className="bg-black bg-opacity-70 p-6 rounded-lg w-3/4 max-w-lg mx-auto shadow-lg">
      <h2 className="text-white text-2xl font-bold text-center mb-4">🏅 Logros Desbloqueados</h2>
      <div className="max-h-80 overflow-y-auto">
        <ul className="space-y-3">
          {logros.map((logro) => (
            <li key={logro.id} className="flex items-center bg-gray-900 p-3 rounded-lg text-white shadow-md">
              <span className="text-2xl mr-3">{logro.icono}</span>
              <div>
                <h3 className="text-lg font-semibold">{logro.nombre}</h3>
                <p className="text-sm text-gray-300">{logro.descripcion}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AchievementList;
