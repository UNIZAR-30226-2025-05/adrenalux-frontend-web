import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarGame from "./layout/game/NavbarGame";
import BackButton from "./layout/game/BackButton";
import background from "../assets/background.png";

const Torneo = () => {
  const navigate = useNavigate();
  const [proximoTorneo, setProximoTorneo] = useState(null);
  const [torneosDisponibles, setTorneosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Datos mockeados - luego los reemplazarás con llamadas a la API
  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock data - simula una respuesta de API
        const mockProximoTorneo = {
          id: 1,
          nombre: "Torneo Relámpago",
          hora: "17:00",
          modalidad: "1 vs 1",
          premio: "1000 puntos",
          inscrito: true
        };
        
        const mockTorneosDisponibles = [
          {
            id: 2,
            nombre: "Torneo Clásico",
            hora: "19:00",
            modalidad: "4 jugadores",
            premio: "5000 puntos",
            inscrito: false
          },
          {
            id: 3,
            nombre: "Torneo Nocturno",
            hora: "22:00",
            modalidad: "Eliminación",
            premio: "3000 puntos",
            inscrito: false
          }
        ];
        
        setProximoTorneo(mockProximoTorneo);
        setTorneosDisponibles(mockTorneosDisponibles);
      } catch (err) {
        console.error("Error al cargar torneos:", err);
        setError("No se pudieron cargar los torneos disponibles");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleBackClick = () => navigate("/home");
  const handleRetry = () => window.location.reload();
  const handleAbandonar = () => {
    // Lógica mock para abandonar torneo
    setProximoTorneo({...proximoTorneo, inscrito: false});
  };
  const handleUnirse = (torneoId) => {
    // Lógica mock para unirse a torneo
    const torneo = torneosDisponibles.find(t => t.id === torneoId);
    setProximoTorneo({...torneo, inscrito: true});
    setTorneosDisponibles(torneosDisponibles.filter(t => t.id !== torneoId));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
        <div className="text-white text-2xl">Cargando torneos...</div>
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
        <div className="mx-auto bg-gray-900 bg-opacity-90 p-4 sm:p-6 md:p-8 rounded-lg w-[95%] max-w-4xl mt-4 md:mt-16 overflow-auto max-h-[80vh]">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-8 text-center">
            Torneos Disponibles
          </h1>
          
          {/* Sección de Próximo Torneo */}
          {proximoTorneo && (
            <div className="mb-8 p-6 bg-gray-800 rounded-lg">
              <h2 className="text-white text-xl font-semibold mb-4 text-center">Próximo encuentro</h2>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 my-4">
                  {proximoTorneo.hora}
                </div>
                <p className="text-white text-lg mb-2">{proximoTorneo.nombre}</p>
                <p className="text-gray-300 text-sm">Modalidad: {proximoTorneo.modalidad}</p>
                <p className="text-gray-300 text-sm mb-4">Premio: {proximoTorneo.premio}</p>
                
                <button 
                  onClick={proximoTorneo.inscrito ? handleAbandonar : () => handleUnirse(proximoTorneo.id)}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    proximoTorneo.inscrito 
                      ? "bg-red-600 hover:bg-red-700" 
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {proximoTorneo.inscrito ? "Abandonar" : "Unirse"}
                </button>
              </div>
            </div>
          )}
          
          {/* Lista de Torneos Disponibles */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">Otros torneos</h2>
            {torneosDisponibles.length === 0 ? (
              <p className="text-white text-center py-4">No hay torneos disponibles</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white text-center border-collapse">
                  <thead>
                    <tr className="bg-blue-600">
                      <th className="p-2 text-sm sm:text-base">Hora</th>
                      <th className="p-2 text-sm sm:text-base">Nombre</th>
                      <th className="p-2 text-sm sm:text-base">Modalidad</th>
                      <th className="p-2 text-sm sm:text-base">Premio</th>
                      <th className="p-2 text-sm sm:text-base">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {torneosDisponibles.map((torneo) => (
                      <tr key={torneo.id} className="border-b border-gray-700">
                        <td className="p-2 text-sm sm:text-base">{torneo.hora}</td>
                        <td className="p-2 text-sm sm:text-base">{torneo.nombre}</td>
                        <td className="p-2 text-sm sm:text-base">{torneo.modalidad}</td>
                        <td className="p-2 text-sm sm:text-base">{torneo.premio}</td>
                        <td className="p-2 text-sm sm:text-base">
                          <button
                            onClick={() => handleUnirse(torneo.id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                          >
                            Unirse
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Torneo;