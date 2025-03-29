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
    console.log('[UI] Iniciando carga de datos de clasificación');
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('[UI] Obteniendo datos en paralelo...');
        const [ranking, user] = await Promise.all([
          obtenerClasificacionTotal(),
          obtenerClasificacionUsuario()
        ]);
        
        console.log('[UI] Resultados obtenidos:', {
          jugadores: ranking?.length || 0,
          usuario: user ? 'Encontrado' : 'No encontrado'
        });

        setPlayersRanking(ranking || []);
        setUserRanking(user || null);

      } catch (err) {
        console.error('[UI] Error al cargar datos:', {
          message: err.message,
          stack: err.stack
        });
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
    console.log('[UI] Mostrando estado de carga');
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
        <div className="text-white text-2xl">Cargando clasificación...</div>
      </div>
    );
  }

  if (error) {
    console.log('[UI] Mostrando estado de error');
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
        <div className="text-white text-center">
          <p className="text-xl mb-4">{error}</p>
          <button 
            onClick={handleBackClick}
            className="px-4 py-2 bg-gray-600 rounded-lg mr-2"
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
    );
  }

  console.log('[UI] Renderizando tabla con datos:', {
    jugadores: playersRanking.length,
    usuario: userRanking ? 'Resaltado' : 'No resaltado'
  });

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      <NavBarGame />
      <div className="relative w-full h-screen mt-32">
        <div className="absolute left-4 top-4 z-10">
          <BackButton onClick={handleBackClick} />
        </div>
        <div className="mx-auto bg-gray-900 bg-opacity-90 p-8 rounded-lg w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] max-w-4xl mt-16">
          <h1 className="text-white text-4xl font-bold mb-8 text-center">Ranking de Jugadores</h1>
          
          {playersRanking.length === 0 ? (
            <p className="text-white text-center">No hay datos de clasificación disponibles</p>
          ) : (
            <table className="w-full text-white text-center border-collapse">
              <thead>
                <tr className="bg-blue-600">
                  <th className="p-2">Posición</th>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Ganados</th>
                  <th className="p-2">Jugados</th>
                  <th className="p-2">Perdidos</th>
                  <th className="p-2">Puntos</th>
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
                    <td className="p-2">{player.position}</td>
                    <td className="p-2">{player.name}</td>
                    <td className="p-2">{player.won}</td>
                    <td className="p-2">{player.played}</td>
                    <td className="p-2">{player.lost}</td>
                    <td className="p-2">{player.puntos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClasificacionJugadores;