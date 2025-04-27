import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
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

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerAvatar, setPlayerAvatar] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  /* ──────────────── cargar ranking ──────────────── */
  useEffect(() => {
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
  }, []);

  const handleBackClick = () => navigate("/home");

  const medalStyles = {
    1: { bg: "bg-[#FFD700]/90", border: "border-[#FFD700]" }, // oro
    2: { bg: "bg-[#C0C0C0]/90", border: "border-[#C0C0C0]" }, // plata
    3: { bg: "bg-[#CD7F32]/90", border: "border-[#CD7F32]" }, // bronce
  };
  const openPlayerModal = (player) => {
    setSelectedPlayer(player);
    setPlayerAvatar(player.avatar);
    setShowPlayerModal(true);
  };

  const closePlayerModal = () => {
    setShowPlayerModal(false);
    setSelectedPlayer(null);
    setPlayerAvatar(null);
  };

  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="animate-pulse text-white text-3xl">
          Cargando clasificación...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="bg-gray-900 bg-opacity-80 p-8 rounded-lg text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-blue-600 rounded-lg text-white"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Jugados",
      value: selectedPlayer ? selectedPlayer.won + selectedPlayer.lost : 0,
      colorBg: "bg-blue-100",
      colorText: "text-green-900",
    },
    {
      label: "Ganados",
      value: selectedPlayer?.won ?? 0,
      colorBg: "bg-green-100",
      colorText: "text-blue-900",
    },
    {
      label: "Perdidos",
      value: selectedPlayer?.lost ?? 0,
      colorBg: "bg-red-100",
      colorText: "text-red-900",
    },
    {
      label: "Puntos",
      value: selectedPlayer?.puntos ?? 0,
      colorBg: "bg-yellow-100",
      colorText: "text-yellow-900",
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="relative max-w-6xl mx-auto mt-24 p-4">
        <BackButton
          onClick={handleBackClick}
          className="absolute top-4 left-4 text-white"
        />

        <h1 className="text-center text-4xl font-extrabold text-white mb-8 drop-shadow-lg">
          Ranking de Jugadores
        </h1>

        <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl shadow-xl overflow-auto max-h-[60vh]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-700">
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
                    className="px-6 py-3 text-left text-white uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-600">
              {playersRanking.map((player) => {
                const isTop3 = player.position <= 3;

                /* estilo por puesto */
                const circleClass = isTop3
                  ? `${medalStyles[player.position].bg} ${
                      medalStyles[player.position].border
                    }`
                  : "bg-blue-700/80 border-blue-700";

                return (
                  <tr
                    key={player.userid}
                    onClick={() => openPlayerModal(player)}
                    className={`cursor-pointer hover:bg-white/30 transition ${
                      userRanking?.userid === player.userid
                        ? "bg-yellow-600/50"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-7 h-7">
                        {/* círculo (medalla o azul) */}
                        <div
                          className={`absolute inset-0 rounded-full border-2 ${circleClass}`}
                        />

                        {/* número centrado encima del círculo */}
                        <span
                          className={`
        absolute inset-0 flex items-center justify-center
        text-[10px] font-extrabold
        ${player.position <= 3 ? "text-gray-900" : "text-white"}
      `}
                        >
                          {player.position}
                        </span>
                      </div>
                    </td>

                    {/* resto de columnas */}
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {player.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {player.won}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {player.played}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {player.lost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {player.puntos}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showPlayerModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          {/* panel: antes bg-white … */}
          <div className="bg-gray-800/90 rounded-3xl max-w-2xl w-full p-12 relative shadow-2xl">
            <button
              onClick={closePlayerModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            >
              <FaTimes size={24} />
            </button>

            <div className="flex flex-col items-center space-y-8">
              <img
                src={playerAvatar ?? "/default_profile.png"}
                alt={selectedPlayer.name}
                className="w-40 h-40 rounded-full border-4 border-blue-600 object-cover shadow-md"
              />

              <h2 className="text-4xl font-bold text-white">
                {selectedPlayer.name}
              </h2>

              <div className="grid grid-cols-4 gap-8 w-full">
                {stats.map(({ label, value, colorBg, colorText }) => (
                  <div
                    key={label}
                    className={`${colorBg} p-6 rounded-2xl text-center`}
                  >
                    <p className="text-xl font-semibold text-black mb-2">
                      {label}
                    </p>
                    <p className={`text-5xl font-bold ${colorText}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
