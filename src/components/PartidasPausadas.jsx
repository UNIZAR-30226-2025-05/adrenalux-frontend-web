import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPartidasPausadas } from "../services/api/pausadasApi";
import { getToken } from "../services/api/authApi";
import { socketService } from "../services/websocket/socketService";
import {
  FaSpinner,
  FaTimes,
  FaPlayCircle,
  FaChessKnight,
  FaArrowLeft,
} from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";
import { useTranslation } from "react-i18next";

export default function PartidasPausadas() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const navigate = useNavigate();
  const token = getToken();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchPaused() {
      setLoading(true);
      setError("");
      try {
        const partidas = await getPartidasPausadas(token);
        console.log("RESPUESTA PAUSADAS:", partidas);
        setMatches(Array.isArray(partidas) ? partidas : []);
      } catch (err) {
        console.error("Error al cargar partidas pausadas:", err);
        setError("No se pudieron cargar tus partidas pausadas.");
      } finally {
        setLoading(false);
      }
    }
    fetchPaused();
  }, [token]);

  const handleResume = (matchId) => {
    socketService.resume(matchId);
    navigate(`/partida/${matchId}`);
  };

  const handleSelectMatch = (match) => {
    setSelectedMatch(match === selectedMatch ? null : match);
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center px-4 py-8">
      {/* Header con elementos decorativos */}
      <div className="flex items-center justify-center mb-8">
        <GiCrossedSwords className="text-3xl text-yellow-400 mr-3" />
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-yellow-300">
          {t("paused.title")}
        </h2>
        <GiCrossedSwords className="text-3xl text-yellow-400 ml-3 transform rotate-180" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-8">
          <FaSpinner className="text-purple-500 text-4xl animate-spin mb-4" />
          <div className="text-gray-300 text-lg">{t("paused.loading")}</div>
        </div>
      ) : error ? (
        <div className="bg-gray-800 bg-opacity-70 rounded-xl p-8 text-center border-2 border-red-500 shadow-lg max-w-3xl mx-auto">
          <FaTimes className="text-red-500 text-4xl mx-auto mb-4" />
          <div className="text-red-400 text-lg">{error}</div>
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-gray-800 bg-opacity-70 rounded-xl p-8 text-center border-2 border-purple-500 shadow-lg max-w-3xl mx-auto">
          <FaChessKnight className="text-purple-400 text-5xl mx-auto mb-4" />
          <div className="text-gray-300 text-lg">{t("paused.error1")}</div>
          <div className="text-gray-400 text-sm mt-2">{t("paused.error2")}</div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border-2 border-purple-500 shadow-2xl w-full max-w-3xl mx-auto relative">
          {/* Decorative elements */}
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-purple-500 rounded-full"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-purple-500 rounded-full"></div>
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-purple-500 rounded-full"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-purple-500 rounded-full"></div>

          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                onClick={() => handleSelectMatch(match)}
                className={`relative overflow-hidden rounded-lg border-2 ${
                  selectedMatch === match
                    ? "border-yellow-400"
                    : "border-purple-500"
                } transition-all duration-300`}
              >
                {/* Highlight effect when selected */}
                {selectedMatch === match && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-yellow-500/20" />
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-800 bg-opacity-80 px-6 py-4">
                  <div className="flex flex-col text-center sm:text-left mb-4 sm:mb-0">
                    <span className="font-bold text-xl text-white mb-1">
                      {t("paused.match")}#{match.id}
                    </span>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm">
                      <span className="text-gray-300">
                        <span className="text-purple-400">
                          {" "}
                          {t("paused.state")}:
                        </span>{" "}
                        {match.estado || t("paused.state2")}
                      </span>
                      <span className="text-gray-300">
                        <span className="text-blue-400">
                          {" "}
                          {t("paused.turn")}:
                        </span>{" "}
                        {match.turno || "N/A"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-300 mt-1">
                      <span className="text-yellow-400">
                        {" "}
                        {t("paused.points")}:
                      </span>{" "}
                      {match.puntuacion1 || 0} - {match.puntuacion2 || 0}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      {match.fecha
                        ? new Date(match.fecha).toLocaleString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : t("paused.error3")}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResume(match.id);
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-5 py-2 rounded-lg font-bold flex items-center shadow-lg shadow-green-900/30"
                  >
                    <FaPlayCircle className="mr-2" />
                    {t("paused.return")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-10 flex items-center justify-center text-gray-300 hover:text-white font-medium transition-colors duration-300"
      >
        <FaArrowLeft className="mr-2" />
        {t("paused.back")}
      </button>
    </div>
  );
}
