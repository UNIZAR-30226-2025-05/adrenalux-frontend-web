import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import background from "../assets/backgroundAlineacion.png";
import BackButton from "../components/layout/game/BackButton";
import Formacion433 from "../components/layout/game/Formacion_4_3_3";
import CartaMediana from "../components/layout/game/CartaMediana";
import { FaPen, FaSave } from "react-icons/fa";
import { actualizarPlantilla, obtenerCartasDePlantilla, agregarCartasPlantilla } from "../services/api/alineacionesApi";
import { getToken } from "../services/api/authApi";
import { getCollection } from "../services/api/collectionApi";

export default function AlineacionEditar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { id, nombre: nombreInicial } = location.state || {};
  const token = getToken();
  
  const [showAlert, setShowAlert] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [nombrePlantilla, setNombrePlantilla] = useState(nombreInicial || "");
  const [newName, setNewName] = useState(nombreInicial || "");
  const [jugadores, setJugadores] = useState([]);
  const [jugadoresUsuario, setJugadoresUsuario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState({ id: null, type: null });
  const [filteredCards, setFilteredCards] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
  
    const fetchData = async () => {
      try {
        if (!id) return;
  
        const [cartasPlantilla, coleccionUsuario] = await Promise.all([
          obtenerCartasDePlantilla(id, token),
          getCollection(token),
        ]);
  
        const procesarColeccion = (coleccion) =>
          Array.isArray(coleccion)
            ? coleccion.filter((card) => card.disponible === true)
            : [];
  
            const jugadoresPlantilla = Array.isArray(cartasPlantilla?.data)
            ? (() => {
                // Contadores separados
                const counters = {
                  forward: 0,
                  midfielder: 0,
                  defender: 0,
                  goalkeeper: 0
                };
          
                return cartasPlantilla.data.map(jugador => {
                  let posicionEspecifica;
                  
                  switch (jugador.posicion) {
                    case "forward":
                      counters.forward++;
                      posicionEspecifica = `forward${counters.forward}`;
                      break;
                    case "midfielder":
                      counters.midfielder++;
                      posicionEspecifica = `midfielder${counters.midfielder}`;
                      break;
                    case "defender":
                      counters.defender++;
                      posicionEspecifica = `defender${counters.defender}`;
                      break;
                    default:
                      counters.goalkeeper++;
                      posicionEspecifica = "goalkeeper1";
                  }
          
                  return {
                    ...jugador,
                    posicion: posicionEspecifica,
                    posicionType: jugador.posicion
                  };
                });
              })()
            : [];

          console.log(jugadoresPlantilla)
  
        setJugadores(jugadoresPlantilla);
        setJugadoresUsuario(procesarColeccion(coleccionUsuario));
      } catch (err) {
        if (err.response?.status === 400) {
          console.log("No se encontraron cartas, mostrando formación vacía");
          setJugadores([]);
          try {
            const coleccion = await getCollection(token);
            const userPlayers = coleccion.filter((card) => card.disponible === true);
  
            setJugadoresUsuario(userPlayers);
          } catch (error) {
            console.error("Error al obtener colección:", error);
            setJugadoresUsuario([]);
          }
        } else {
          setError(err.message);
          console.error("Error al obtener datos:", err);
          setJugadoresUsuario([]);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id, token, navigate]);  

  const handleJugadorClick = ({ posicionId, posicion, jugador }) => {
    setSelectedPosition({
      id: posicionId,
      type: posicion
    });
    
    // Obtener IDs de jugadores ya asignados (excepto el actual si estamos reemplazando)
    const idsAsignados = jugadores
      .filter(j => !jugador || j.id !== jugador.id)
      .map(j => j.id);

    // Filtrar cartas por tipo genérico y que no estén ya asignadas
    const cartasFiltradas = jugadoresUsuario.filter(carta => {
      return carta.posicion === posicion && 
             !idsAsignados.includes(carta.id);
    });
    
    setFilteredCards(cartasFiltradas);
    setShowCardSelector(true);
  };

  const handleSelectCard = (carta) => {
    const jugadorActualizado = {
      ...carta,
      posicion: selectedPosition.id,
      posicionType: selectedPosition.type
    };

    setJugadores(prev => {
      // Eliminar jugador de su posición anterior si existe
      const filtered = prev.filter(j => 
        j.posicion !== selectedPosition.id && 
        j.id !== carta.id
      );
      console.log(jugadorActualizado)
      return [...filtered, jugadorActualizado];
    });

    setHasChanges(true);
    setShowCardSelector(false);
  };

  const handleConfirm = async () => {
    try {
      const jugadoresParaAPI = jugadores.map(jugador => ({
        id: jugador.id,
      }));

      const posicionesParaAPI = jugadores.map(jugador => jugador.posicionType);

      await agregarCartasPlantilla(id, jugadoresParaAPI, posicionesParaAPI, token);
      
      setShowAlert(false);
      setHasChanges(false);
      navigate("/alineaciones");
    } catch (error) {
      console.error("Error al guardar:", error);
      setError("Error al guardar los cambios");
    }
  };

  const handleSave = async () => {
    const jugadoresParaAPI = jugadores.map(jugador => ({
      id: jugador.id,
    }));

    const posicionesParaAPI = jugadores.map(jugador => jugador.posicionType);

    await agregarCartasPlantilla(id, jugadoresParaAPI, posicionesParaAPI, token);

    setHasChanges(false);
  };

  const handleBackClick = () => {
    if (hasChanges) {
      setShowAlert(true);
    } else {
      navigate("/alineaciones");
    }
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleDiscard = () => {
    setShowAlert(false);
    navigate("/alineaciones");
  };

  const handleSaveName = async () => {
    setNombrePlantilla(newName);
    await actualizarPlantilla(id, newName, token);
    setShowNameEdit(false);
    setHasChanges(true);
  };

  const handleCancelNameEdit = () => {
    setNewName(nombrePlantilla);
    setShowNameEdit(false);
  };

  if (loading) {
    return <div className="text-white text-center mt-10">Cargando jugadores...</div>;
  }

  if (error && error !== "404") {
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-start bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      {/* Botón Atrás (funcionará correctamente) */}
      <div className="absolute top-5 left-5 z-20">
        <BackButton onClick={handleBackClick} />
      </div>
  
      {/* Botón Guardar (funcionará correctamente) */}
      {hasChanges && (
        <div className="absolute top-5 right-5 z-20">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaSave /> Guardar
          </button>
        </div>
      )}
  
      {/* Header de nombre de plantilla */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-4 py-2 rounded-lg shadow-lg flex items-center z-10">
        {!showNameEdit ? (
          <>
            <h2 className="text-white text-xl mr-2">{nombrePlantilla}</h2>
            <button 
              onClick={() => setShowNameEdit(true)}
              className="text-white hover:text-gray-300"
            >
              <FaPen size={16} />
            </button>
          </>
        ) : (
          <div className="flex items-center">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-2 py-1 mr-2 rounded"
              placeholder="Nuevo nombre"
            />
            <button
              className="px-2 py-1 bg-green-500 text-white rounded mr-1"
              onClick={handleSaveName}
            >
              Guardar
            </button>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded"
              onClick={handleCancelNameEdit}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
  
      {/* Contenedor de la formación */}
      <div className="absolute inset-0 flex items-center justify-center pt-[4.5rem] pb-4 px-4">
        <div 
          className="relative w-full max-w-[1800px] mx-auto overflow-auto"
          style={{
            height: 'calc(100vh - 4.5rem - 1rem)',
            maxHeight: '90vh',
            minHeight: '500px',
            aspectRatio: '16/10'
          }}
        >
          <Formacion433 
            jugadores={jugadores} 
            onJugadorClick={handleJugadorClick}
          />
        </div>
      </div>

      {showCardSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-30">
          <div className="bg-[#1C1A1A] p-6 rounded-lg shadow-lg w-full max-w-[80vh] max-h-[80vh] flex flex-col">
            <h3 className="text-white text-xl mb-4 text-center">
              Selecciona un jugador para {selectedPosition.id}
            </h3>
            
            <div className="grid grid-cols-4 gap-4 overflow-y-auto" style={{
              maxHeight: '400px',
              gridAutoRows: 'minmax(240px, auto)'
            }}>
              {filteredCards.length > 0 ? (
                filteredCards.map((carta) => (
                  <button
                    key={carta.id}
                    className="relative bg-transparent border-none p-0 cursor-pointer h-full flex flex-col items-center"
                    onClick={() => handleSelectCard(carta)}
                  >
                    <CartaMediana 
                      jugador={carta} 
                      className="w-full h-full h-[160px] object-contain" 
                    />
                  </button>
                ))
              ) : (
                <div className="col-span-4 flex items-center justify-center h-40">
                  <p className="text-white text-center">
                    No tienes cartas disponibles para esta posición
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={() => setShowCardSelector(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 p-4">
          <div className="bg-white dark:bg-[#1C1A1A] p-4 md:p-6 rounded-lg shadow-lg text-center text-white w-full max-w-md mx-4">
            <p className="text-black dark:text-white mb-4 text-base md:text-lg">
              ¿Quieres guardar los cambios antes de salir?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                className="px-3 py-1 md:px-4 md:py-2 rounded-lg text-white bg-[#44FE23] hover:opacity-90 text-sm md:text-base"
                onClick={handleConfirm}
              >
                Sí, guardar
              </button>
              <button
                className="px-3 py-1 md:px-4 md:py-2 rounded-lg text-white bg-[#F62C2C] hover:opacity-90 text-sm md:text-base"
                onClick={handleDiscard}
              >
                No, descartar
              </button>
              <button
                className="px-3 py-1 md:px-4 md:py-2 rounded-lg text-white bg-gray-500 hover:opacity-90 text-sm md:text-base"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}