import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import background from "../assets/backgroundAlineacion.png";
import BackButton from "../components/layout/game/BackButton";
import Formacion433 from "../components/layout/game/Formacion_4_3_3";
import CartaMediana from "../components/layout/game/CartaMediana";
import { FaPen } from "react-icons/fa";
import { actualizarPlantilla, obtenerCartasDePlantilla } from "../services/api/alineacionesApi";
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
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [filteredCards, setFilteredCards] = useState([]);
  const [cartasIds, setCartasIds] = useState([]); // Array de IDs de cartas
  const [posiciones, setPosiciones] = useState([]); // Array de posiciones

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id || !token) return;
        
        const [cartasPlantilla, coleccionUsuario] = await Promise.all([
          obtenerCartasDePlantilla(id, token),
          getCollection(token)
        ]);
        
        const procesarColeccion = (coleccion) => {
          return Array.isArray(coleccion?.data) 
            ? coleccion.data.filter(card => card.disponible === true) 
            : [];
        };

        const jugadoresPlantilla = Array.isArray(cartasPlantilla?.data) ? cartasPlantilla.data : [];
        
        // Inicializar arrays separados
        const initialIds = jugadoresPlantilla.map(j => j.id);
        const initialPositions = jugadoresPlantilla.map(j => j.posicion);
        
        setCartasIds(initialIds);
        setPosiciones(initialPositions);
        setJugadores(jugadoresPlantilla);
        setJugadoresUsuario(procesarColeccion(coleccionUsuario));
        
      } catch (err) {
        if (err.response?.status === 404) {
          console.log("No se encontraron cartas, mostrando formación vacía");
          setJugadores([]);
          setCartasIds([]);
          setPosiciones([]);
          try {
            const coleccion = await getCollection(token);
            const jugadoresUser = coleccion.filter(card => card.disponible === true);
            setJugadoresUsuario(jugadoresUser);
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
  }, [id, token]);

  const handleJugadorClick = ({ posicion }) => {
    setSelectedPosition(posicion);
    
    const cartasFiltradas = Array.isArray(jugadoresUsuario) 
      ? jugadoresUsuario.filter(carta => carta?.posicion === posicion)
      : [];
    
    setFilteredCards(cartasFiltradas);
    setShowCardSelector(true);
  };

  const handleSelectCard = (carta) => {
    // Actualizar los arrays de cartasIds y posiciones
    const posIndex = posiciones.indexOf(selectedPosition);
    
    if (posIndex !== -1) {
      // Reemplazar la carta existente
      const newCartasIds = [...cartasIds];
      newCartasIds[posIndex] = carta.id;
      setCartasIds(newCartasIds);
    } else {
      // Añadir nueva carta
      setCartasIds([...cartasIds, carta.id]);
      setPosiciones([...posiciones, selectedPosition]);
    }

    // Actualizar la vista de jugadores
    const updatedPlayer = {
      id: carta.id,
      nombre: carta.nombre,
      posicion: selectedPosition,
      imagen: carta.imagen,
    };

    setJugadores(prev => {
      const existingIndex = prev.findIndex(j => j.posicion === selectedPosition);
      if (existingIndex !== -1) {
        const newPlayers = [...prev];
        newPlayers[existingIndex] = updatedPlayer;
        return newPlayers;
      }
      return [...prev, updatedPlayer];
    });

    setShowCardSelector(false);
  };

  const handleBackClick = () => {
    setShowAlert(true);
  };

  const handleConfirm = () => {
    setShowAlert(false);
    navigate("/alineaciones");
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleDiscard = () => {
    setShowAlert(false);
    navigate("/alineaciones");
  };

  const handleSaveName = () => {
    setNombrePlantilla(newName);
    setShowNameEdit(false);
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
      <div className="absolute top-5 left-5">
        <BackButton onClick={handleBackClick} />
      </div>

      {/* Encabezado con nombre de plantilla */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-4 py-2 rounded-lg shadow-lg flex items-center">
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

      {/* Renderización de la formación 4-3-3 */}
      <div className="absolute top-[100px] left-1/2 transform -translate-x-1/2 text-white">
        <Formacion433 
          jugadores={jugadores} 
          onJugadorClick={handleJugadorClick}
          plantillaId={id}
        />
      </div>

      {/* Selector de cartas - 4 por fila con scroll después de 2 filas */}
      {showCardSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-30">
          <div className="bg-[#1C1A1A] p-6 rounded-lg shadow-lg w-full max-w-[80vh] max-h-[80vh] flex flex-col">
            <h3 className="text-white text-xl mb-4 text-center">
              Selecciona una carta para {selectedPosition}
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

      {/* Alerta de confirmación al salir */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white dark:bg-[#1C1A1A] p-6 rounded-lg shadow-lg text-center text-white">
            <p className="text-black dark:text-white mb-4 text-lg">¿Quieres guardar los cambios antes de salir?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#44FE23] hover:opacity-90"
                onClick={handleConfirm}
              >
                Sí
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#F62C2C] hover:opacity-90"
                onClick={handleDiscard}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-gray-500 hover:opacity-90"
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