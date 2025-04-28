import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPartidasPausadas } from "../services/api/pausadasApi"; // crea esta función abajo
import { getToken } from "../services/api/authApi";
import { socketService } from "../services/websocket/socketService";

export default function PartidasPausadas() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    async function fetchPaused() {
      setLoading(true);
      setError("");
      try {
        const partidas = await getPartidasPausadas(token);
        console.log("RESPUESTA PAUSADAS:", partidas); // ← AQUÍ

        setMatches(partidas);
      } catch (err) {
        setError("No se pudieron cargar tus partidas pausadas.");
      }
      setLoading(false);
    }
    fetchPaused();
  }, [token]);

  const handleResume = (matchId) => {
    socketService.resume(matchId);
    navigate(`/partida/${matchId}`);
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full bg-[#151516] flex flex-col items-center justify-center px-4 py-8">
      {/* Header fuera de la caja */}
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Partidas pausadas
      </h2>
      {loading ? (
        <div className="text-gray-400 text-center mb-3">Cargando...</div>
      ) : error ? (
        <div className="text-red-400 text-center mb-3">{error}</div>
      ) : matches.length === 0 ? (
        <div className="text-gray-300 text-center mb-3">
          No tienes ninguna partida pausada.
        </div>
      ) : (
        <div className="bg-[#232323] rounded-2xl p-8 shadow-xl w-full max-w-3xl mx-auto">
          {matches.map((m) => (
            <div
              key={m.id}
              className="flex flex-col sm:flex-row justify-between items-center bg-[#232323] px-6 py-4 rounded-lg"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-white">
                  Partida #{m.id}
                </span>
                <span className="text-xs text-gray-400">
                  Estado: {m.estado} | Turno: {m.turno}
                </span>
                <span className="text-xs text-gray-400">
                  Puntuación: {m.puntuacion1} - {m.puntuacion2}
                </span>
                <span className="text-xs text-gray-400">
                  Fecha:{" "}
                  {new Date(m.fecha).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <button
                onClick={() => handleResume(m.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded font-semibold mt-2 sm:mt-0"
              >
                Reanudar
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => navigate(-1)}
        className="mt-10 w-full max-w-3xl mx-auto text-center text-[#bdbdbd] hover:underline"
      >
        Volver atrás
      </button>
    </div>
  );
}
