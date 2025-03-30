import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarGame from "./layout/game/NavbarGame";
import BackButton from "./layout/game/BackButton";
import background from "../assets/background.png";
import { obtenerClasificacionTotal, obtenerClasificacionUsuario } from "../services/api/clasificacionApi";

const ClasificacionJugadores = () => {
  const navigate = useNavigate();
  const [playersRanking, setPlayersRanking] = useState([]);
  const [userRanking, setUserRanking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [ranking, user] = await Promise.all([
          obtenerClasificacionTotal(),
          obtenerClasificacionUsuario()
        ]);
        
        setPlayersRanking(ranking || []);
        setUserRanking(user || null);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar los datos de clasificación");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleBackClick = () => navigate("/home");
  const handleRetry = () => window.location.reload();

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
        <div className="text-white text-2xl">Cargando clasificación...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
        <div className="text-white text-center p-4">
          <p className="text-xl mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <button 
              onClick={handleBackClick}
              className="px-4 py-2 bg-gray-600 rounded-lg"
            >
              Volver
            </button>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 rounded-lg"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      <NavBarGame />
      <div className="relative w-full h-full mt-16 md:mt-32">
        <div className="absolute left-4 top-4 z-10">
          <BackButton onClick={handleBackClick} />
        </div>
        <div className="mx-auto bg-gray-900 bg-opacity-90 p-4 sm:p-6 md:p-8 rounded-lg w-[95%] max-w-6xl mt-4 md:mt-16 overflow-auto max-h-[80vh]">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-8 text-center">
            Ranking de Jugadores
          </h1>
          
          {playersRanking.length === 0 ? (
            <p className="text-white text-center py-4 md:py-8">
              No hay datos de clasificación disponibles
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white text-center border-collapse">
                <thead>
                  <tr className="bg-blue-600">
                    <th className="p-2 text-sm sm:text-base">Posición</th>
                    <th className="p-2 text-sm sm:text-base">Nombre</th>
                    <th className="p-2 text-sm sm:text-base">Ganados</th>
                    <th className="p-2 text-sm sm:text-base">Jugados</th>
                    <th className="p-2 text-sm sm:text-base">Perdidos</th>
                    <th className="p-2 text-sm sm:text-base">Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {playersRanking.map((player) => (
                    <tr 
                      key={`${player.userid}-${player.position}`}
                      className={`border-b border-gray-700 ${
                        userRanking?.userid === player.userid ? 'bg-red-700 font-bold' : ''
                      }`}
                    >
                      <td className="p-2 text-sm sm:text-base">{player.position}</td>
                      <td className="p-2 text-sm sm:text-base">{player.name}</td>
                      <td className="p-2 text-sm sm:text-base">{player.won}</td>
                      <td className="p-2 text-sm sm:text-base">{player.played}</td>
                      <td className="p-2 text-sm sm:text-base">{player.lost}</td>
                      <td className="p-2 text-sm sm:text-base">{player.puntos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClasificacionJugadores;