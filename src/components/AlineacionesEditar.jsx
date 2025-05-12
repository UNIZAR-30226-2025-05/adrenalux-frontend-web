import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import for translations
import background from "../assets/backgroundAlineacion.png";
import BackButton from "../components/layout/game/BackButton";
import Formacion433 from "../components/layout/game/Formacion_4_3_3";
import CartaMediana from "../components/layout/game/CartaMediana";
import { FaPen, FaSave } from "react-icons/fa";
import { actualizarPlantilla, obtenerCartasDePlantilla, agregarCartasPlantilla } from "../services/api/alineacionesApi";
import { getToken } from "../services/api/authApi";
import { getCollection } from "../services/api/collectionApi";

// Styles for animations
const styles = {
  loadingBarAnimation: {
    animation: 'loadingBar 2s ease-in-out infinite',
  },
  bounceAnimation: {
    animation: 'bounce 1s infinite',
  },
  pulseAnimation: {
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  keyframes: `
    @keyframes loadingBar {
      0% { width: 0%; }
      50% { width: 70%; }
      100% { width: 95%; }
    }
    @keyframes bounce {
      0%, 100% {
        transform: translateY(-10%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.5;
        transform: scale(0.95);
      }
    }
  `
};

const LoadingScreen = () => {
  const { t } = useTranslation();
  // Array of dots for animation
  const [dots, setDots] = useState(1);
  
  // Effect to animate ellipsis
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev < 3 ? prev + 1 : 1);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" 
         style={{ backgroundImage: `url(${background})` }}>
      {/* Insert keyframes using a style element */}
      <style>{styles.keyframes}</style>
      
      <div className="bg-black bg-opacity-70 rounded-xl p-6 sm:p-10 max-w-md w-full mx-4 flex flex-col items-center">
        {/* Soccer ball animation */}
        <div className="mb-6 relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center"
               style={styles.bounceAnimation}>
            <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border-4 border-black relative overflow-hidden">
              {/* Simplified pentagon/hexagon pattern */}
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-black transform rotate-45"></div>
              <div className="absolute top-1/2 left-0 w-1/3 h-1/3 bg-black transform -rotate-12"></div>
              <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-black transform rotate-30"></div>
            </div>
          </div>
          
          {/* Animated shadow */}
          <div className="w-12 h-3 bg-black bg-opacity-30 rounded-full absolute -bottom-4 left-1/2 transform -translate-x-1/2"
               style={styles.pulseAnimation}></div>
        </div>
        
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">{t('lineup.loading')}</h2>
        <p className="text-gray-300 text-base sm:text-lg text-center">
          {t('lineup.preparingPlayers')}{'.'.repeat(dots)}
        </p>
        
        {/* Animated progress bar */}
        <div className="w-full max-w-xs bg-gray-700 rounded-full h-2.5 mt-6 overflow-hidden">
          <div className="bg-green-500 h-2.5 rounded-full"
               style={styles.loadingBarAnimation}></div>
        </div>
      </div>
    </div>
  );
};

export default function AlineacionEditar() {
  const { t } = useTranslation();
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Window resize detector
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
              // Separate counters
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
  
        setJugadores(jugadoresPlantilla);
        setJugadoresUsuario(procesarColeccion(coleccionUsuario));
      } catch (err) {
        if (err.response?.status === 400) {
          console.log("No cards found, showing empty formation");
          setJugadores([]);
          try {
            const coleccion = await getCollection(token);
            const userPlayers = coleccion.filter((card) => card.disponible === true);
  
            setJugadoresUsuario(userPlayers);
          } catch (error) {
            console.error("Error getting collection:", error);
            setJugadoresUsuario([]);
          }
        } else {
          setError(err.message);
          console.error("Error fetching data:", err);
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
    
    // Get IDs of already assigned players (except the current one if we're replacing)
    const idsAsignados = jugadores
      .filter(j => !jugador || j.id !== jugador.id)
      .map(j => j.id);

    // Filter cards by generic type and not already assigned
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
      // Remove player from previous position if exists
      const filtered = prev.filter(j => 
        j.posicion !== selectedPosition.id && 
        j.id !== carta.id
      );
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
      console.error("Error saving:", error);
      setError("Error saving changes");
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
    return <LoadingScreen />;
  }

  if (error && error !== "404") {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" 
           style={{ backgroundImage: `url(${background})` }}>
        <div className="bg-black bg-opacity-70 rounded-xl p-6 max-w-md w-full mx-4 text-center">
          <div className="text-red-500 text-3xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-bold mb-2">{t('lineup.error')}</h2>
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => navigate("/alineaciones")}
            className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            {t('lineup.backToLineups')}
          </button>
        </div>
      </div>
    );
  }

  const getGridCols = () => {
    if (windowWidth < 640) return "grid-cols-2"; // mobile
    if (windowWidth < 1024) return "grid-cols-3"; // tablet
    return "grid-cols-4"; // desktop
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start bg-cover bg-center overflow-hidden" 
         style={{ backgroundImage: `url(${background})` }}>
      
      {/* Top bar with controls - responsive version */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center bg-black bg-opacity-70 px-3 py-2 md:px-5 md:py-3 z-20">
        <BackButton onClick={handleBackClick} />
        
        <div className="flex-1 mx-2 md:mx-4 text-center">
          {!showNameEdit ? (
            <div className="flex items-center justify-center">
              <h2 className="text-white text-lg md:text-xl mr-2 truncate max-w-[60vw]">{nombrePlantilla}</h2>
              <button 
                onClick={() => setShowNameEdit(true)}
                className="text-white hover:text-gray-300"
                aria-label={t('lineup.editName')}
              >
                <FaPen size={14} className="md:text-base" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-wrap gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="px-2 py-1 rounded text-sm md:text-base max-w-[40vw] md:max-w-[50vw]"
                placeholder={t('lineup.newName')}
              />
              <div className="flex gap-1">
                <button
                  className="px-2 py-1 bg-green-500 text-white rounded text-sm md:text-base"
                  onClick={handleSaveName}
                >
                  {t('lineup.saveName')}
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm md:text-base"
                  onClick={handleCancelNameEdit}
                >
                  {t('lineup.cancelNameEdit')}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {hasChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-1 md:gap-2 bg-green-500 hover:bg-green-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg transition-colors text-sm md:text-base"
          >
            <FaSave className="text-xs md:text-base" /> 
            <span className="hidden sm:inline">{t('lineup.save')}</span>
          </button>
        )}
        {!hasChanges && <div className="w-8 md:w-12"></div>}
      </div>
  
      {/* Formation container - MODIFIED to increase size */}
      <div className="fixed inset-0 flex items-center justify-center pt-16 md:pt-20 pb-2 md:pb-4 px-2 md:px-4">
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem'
          }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              maxWidth: '95vw',
              maxHeight: 'calc(100vh - 5rem)'
            }}
          >
            <Formacion433 
              jugadores={jugadores} 
              onJugadorClick={handleJugadorClick}
            />
          </div>
        </div>
      </div>

      {/* Card selector - improved for responsive */}
      {showCardSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-30 p-2 md:p-4">
          <div className="bg-[#1C1A1A] p-3 md:p-6 rounded-lg shadow-lg w-full max-w-[95vh] max-h-[90vh] flex flex-col">
            <h3 className="text-white text-base md:text-xl mb-2 md:mb-4 text-center">
              {t('lineup.selectPlayerFor')} {selectedPosition.id}
            </h3>
            
            <div className={`grid ${getGridCols()} gap-2 md:gap-4 overflow-y-auto p-1`} style={{
              maxHeight: windowWidth < 640 ? '300px' : '400px',
              gridAutoRows: 'minmax(120px, auto)'
            }}>
              {filteredCards.length > 0 ? (
                filteredCards.map((carta) => (
                  <button
                    key={carta.id}
                    className="relative bg-transparent border-none p-0 cursor-pointer h-full flex flex-col items-center transform hover:scale-105 transition-transform"
                    onClick={() => handleSelectCard(carta)}
                  >
                    <CartaMediana 
                      jugador={carta} 
                      className="w-full h-full object-contain" 
                      responsive={true}
                      small={windowWidth < 640}
                    />
                  </button>
                ))
              ) : (
                <div className="col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center h-40">
                  <p className="text-white text-center text-sm md:text-base">
                    {t('lineup.noAvailableCards')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-3 md:mt-4">
              <button
                className="px-3 py-1 md:px-4 md:py-2 bg-red-500 text-white rounded-lg text-sm md:text-base"
                onClick={() => setShowCardSelector(false)}
              >
                {t('lineup.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation alert - responsive */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-40 p-3 md:p-4">
          <div className="bg-white dark:bg-[#1C1A1A] p-3 md:p-6 rounded-lg shadow-lg text-center text-white w-full max-w-xs md:max-w-md mx-2 md:mx-4">
            <p className="text-black dark:text-white mb-3 md:mb-4 text-sm md:text-lg">
              {t('lineup.saveChangesPrompt')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
              <button
                className="px-3 py-1 rounded-lg text-white bg-[#44FE23] hover:opacity-90 text-xs md:text-base"
                onClick={handleConfirm}
              >
                {t('lineup.yesSave')}
              </button>
              <button
                className="px-3 py-1 rounded-lg text-white bg-[#F62C2C] hover:opacity-90 text-xs md:text-base mt-2 sm:mt-0"
                onClick={handleDiscard}
              >
                {t('lineup.noDiscard')}
              </button>
              <button
                className="px-3 py-1 rounded-lg text-white bg-gray-500 hover:opacity-90 text-xs md:text-base mt-2 sm:mt-0"
                onClick={handleCancel}
              >
                {t('lineup.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}