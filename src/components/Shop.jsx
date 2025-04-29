import { useState, useEffect, useRef  } from "react";
import { FaPlusCircle, FaCoins, FaSearch, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.png";
import MarqueeText from "./layout/MarqueeText";
import BackButton from "../components/layout/game/BackButton";
import Card3D from "./layout/game/Card3D";
import PropTypes from "prop-types";
import { getToken } from "../services/api/authApi";
import {
  obtenerCartasEnVenta,
  obtenerCartasDiarias,
  comprarCarta,
  comprarCartaDiaria,
} from "../services/api/shopApi";
import { getProfile } from "../services/api/profileApi";
import Carta from "./layout/game/CartaMediana";
import Carta2 from "./layout/game/CartaGrande";
import PurchaseAnimation from "./layout/game/PurchaseAnimation"; // Importar el componente de animación

// Componente para la barra de búsqueda y filtros
const SearchTab = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedTeam, 
  setSelectedTeam, 
  selectedPosition, 
  setSelectedPosition 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const equiposEspañoles = [
    "Real Betis", "Deportivo Alavés", "Getafe CF", "Rayo Vallecano", "RCD Mallorca",
    "CA Osasuna", "Girona FC", "Athletic Club", "UD Las Palmas", "CD Leganés",
    "Sevilla FC", "Real Valladolid CF", "Atlético de Madrid", "Real Sociedad",
    "Villarreal CF", "FC Barcelona", "RCD Espanyol de Barcelona", "RC Celta",
    "Valencia CF", "Real Madrid"
  ];

  const posiciones = ["goalkeeper", "defender", "midfielder", "forward"];

  return (
    <div className="w-full max-w-4xl bg-gradient-to-r from-blue-900/80 via-blue-800/80 to-blue-900/80 rounded-xl p-4 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full lg:w-auto">
          <input
            type="text"
            placeholder="Buscar cartas..."
            className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-md text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
        </div>

        <button 
          onClick={() => setShowFilters(!showFilters)} 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors text-white px-5 py-3 rounded-lg w-full lg:w-auto"
        >
          <FaFilter />
          <span>Filtros</span>
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          <div>
            <label className="block text-white mb-2 font-medium">Posición</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full p-3 bg-white/20 backdrop-blur-md text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 [&>option]:text-black"
            >
              <option value="Posición">Todas las posiciones</option>
              {posiciones.map((posicion) => (
                <option key={posicion} value={posicion}>
                  {posicion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white mb-2 font-medium">Equipo</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full p-3 bg-white/20 backdrop-blur-md text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 [&>option]:text-black"
            >
              <option value="Equipo">Todos los equipos</option>
              {equiposEspañoles.map((equipo) => (
                <option key={equipo} value={equipo}>
                  {equipo}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

SearchTab.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  selectedTeam: PropTypes.string.isRequired,
  setSelectedTeam: PropTypes.func.isRequired,
  selectedPosition: PropTypes.string.isRequired,
  setSelectedPosition: PropTypes.func.isRequired
};

SearchTab.defaultProps = {
  searchQuery: "",
  selectedTeam: "Equipo",
  selectedPosition: "Posición"
};

export default function Shop() {
  const [showDialog, setShowDialog] = useState(false);
  const [luxurisCards, setLuxurisCards] = useState([]); // Cartas diarias
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("Equipo");
  const [selectedPosition, setSelectedPosition] = useState("Posición");
  const [cards, setCards] = useState([]); // Cartas generales
  const [infoUser, setInfoUser] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  // Estado para la animación de compra
  const [showPurchaseAnimation, setShowPurchaseAnimation] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState("initial"); // initial, processing, success
  const [errorMessage, setErrorMessage] = useState(null); // Para mostrar errores en alertas
  const token = getToken();
  const topRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (topRef.current) {
      window.scrollTo(0, 0);
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    const obtenerInfo = async () => {
      try {
        const data = await getProfile();
        setInfoUser(data);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };
    obtenerInfo();
  }, [token, navigate]);

  const adrenacoins = infoUser?.data?.adrenacoins || 0;

  // Estado para almacenar todas las cartas sin filtrar
  const [allCards, setAllCards] = useState([]);
  
  // Obtener todas las cartas solo una vez
  useEffect(() => {
    const fetchAllCards = async () => {
      setLoading(true);
      try {
        const data = await obtenerCartasEnVenta();
        console.log("📥 Cartas en venta recibidas (generales):", data);
        const mappedData = data.map((card) => ({
          alias: card.nombre || "Sin nombre",
          ataque: card.ataque ?? 0,
          control: card.control ?? 0,
          medio: card.medio ?? 0,
          defensa: card.defensa ?? 0,
          equipo: card.club || "Sin club",
          escudo: card.escudo || "default_escudo.png",
          photo: card.photo || "default.png",
          tipo_carta: card.tipo_carta || "Normal",
          id: card.id,
          nombre: card.nombre || "Sin nombre",
          pais: card.nacionalidad || "Desconocido",
          posicion: card.posicion || "N/A",
          precio: card.precio || 0,
          mercadoCartaId: card.mercadoCartaId,
          isDaily: false,
        }));
        setAllCards(mappedData);
        setCards(mappedData);
      } catch (error) {
        console.error("Error al obtener cartas del mercado:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCards();
  }, []);
  
  // Filtrar cartas en memoria cuando cambien los filtros
  useEffect(() => {
    if (allCards.length === 0) return;
    
    setLoading(true);
    
    // Filtrar en memoria
    const filteredCards = allCards.filter(card => {
      // Filtrar por nombre/búsqueda
      const matchesQuery = searchQuery === "" || 
        card.nombre.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtrar por equipo
      const matchesTeam = selectedTeam === "Equipo" || 
        card.equipo === selectedTeam;
      
      // Filtrar por posición
      const matchesPosition = selectedPosition === "Posición" || 
        card.posicion === selectedPosition;
      
      return matchesQuery && matchesTeam && matchesPosition;
    });
    
    setCards(filteredCards);
    setLoading(false);
  }, [searchQuery, selectedTeam, selectedPosition, allCards]);

  useEffect(() => {
    const fetchDailyCards = async () => {
      try {
        const data = await obtenerCartasDiarias();
        console.log("📥 Cartas diarias recibidas:", data);
        const mappedDaily = data.map((card) => ({
          alias: card.nombre || "Sin nombre",
          ataque: card.ataque ?? 0,
          control: card.control ?? 0,
          medio: card.medio ?? 0,
          defensa: card.defensa ?? 0,
          equipo: card.club || "Sin club",
          escudo: card.escudo || "default_escudo.png",
          photo: card.photo || "default.png",
          tipo_carta: card.tipo_carta || "Normal",
          id: card.id,
          nombre: card.nombre || "Sin nombre",
          pais: card.nacionalidad || "Desconocido",
          posicion: card.posicion || "N/A",
          precio: card.precio || 0,
          mercadoCartaId: card.mercadoCartaId,
          isDaily: true,
        }));
        setLuxurisCards(mappedDaily);
      } catch (error) {
        console.error("Error al obtener cartas diarias:", error);
      }
    };

    fetchDailyCards();
  }, []);

  // Restauramos el método original para manejar el clic en una carta - muestra confirmación primero
  const handleCardClick = (card, isDaily = false) => {
    setSelectedCard({ ...card, isDaily });
    setShowDialog(true);
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  // Método para manejar la compra de cartas con verificación de saldo
  const handleBuyCard = async () => {
    if (!selectedCard) return;
    
    try {
      // Verificar si el usuario tiene suficientes adrenacoins
      if (selectedCard.precio > adrenacoins) {
        setShowDialog(false);
        setErrorMessage("No tienes suficientes Adrenacoins para comprar esta carta.");
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
        return;
      }
      
      // Mostrar animación de compra
      setShowPurchaseAnimation(true);
      setPurchaseStatus("processing");
      
      // Procesar la compra según el tipo de carta
      if (selectedCard.isDaily) {
        await comprarCartaDiaria(selectedCard.id);
      } else {
        await comprarCarta(selectedCard.mercadoCartaId);
      }
      
      // Si la compra fue exitosa, mostrar animación de éxito
      setPurchaseStatus("success");
      
      // Actualizar perfil del usuario para reflejar los nuevos adrenacoins
      const data = await getProfile();
      setInfoUser(data);
      
      // Actualizar listas según el tipo de carta comprada
      if (selectedCard.isDaily) {
        setLuxurisCards(prevCards => 
          prevCards.filter(card => card.id !== selectedCard.id)
        );
      } else {
        // Actualizar tanto la lista filtrada como la lista completa
        setCards(prevCards => 
          prevCards.filter(card => card.id !== selectedCard.id)
        );
        setAllCards(prevCards => 
          prevCards.filter(card => card.id !== selectedCard.id)
        );
      }
      
      // Después de mostrar la animación de éxito por un tiempo, cerrar todo
      setTimeout(() => {
        setShowPurchaseAnimation(false);
        setShowDialog(false);
        setPurchaseStatus("initial");
      }, 2000);
      
    } catch (error) {
      console.error("Error al comprar la carta:", error);
      setPurchaseStatus("initial");
      setShowPurchaseAnimation(false);
      
      // Verificar si el error es por falta de adrenacoins
      if (error.response && error.response.data && error.response.data.includes("adrenacoins insuficientes")) {
        setErrorMessage("No tienes suficientes Adrenacoins para comprar esta carta.");
      } else {
        setErrorMessage("Hubo un error al comprar la carta.");
      }
      
      // Ocultar el mensaje de error después de 3 segundos
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      
      setShowDialog(false);
    }
  };
  
  // Función para cerrar el diálogo de compra
  const handleCloseDialog = () => {
    setShowDialog(false);
    setShowPurchaseAnimation(false);
    setPurchaseStatus("initial");
  };
  
  const loadMoreCards = () => {
    setVisibleCount(prev => prev + 8);
  };

  // Componente para mostrar la animación de compra
  const PurchaseAnimationWithStatus = () => {
    return (
      <div className="w-full">
        <PurchaseAnimation stage={purchaseStatus} />
      </div>
    );
  };

  return (
  <div className="relative"> {/* Nuevo contenedor padre */}
    <div 
      className="min-h-screen w-screen bg-cover bg-center bg-fixed text-white flex flex-col items-center overflow-hidden"
      style={{ 
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Referencia para el scroll al inicio */}
      <div ref={topRef} className="absolute top-0" />
      
      {/* Contenedor de scroll interno */}
      <div className="w-full h-screen overflow-y-auto">
      
      {/* Header y barra superior */}
      <div className="sticky top-0 w-full bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm z-10 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <BackButton onClick={handleBackClick} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-center flex-grow">Tienda</h1>
          <div className="flex items-center bg-gradient-to-r from-blue-900/90 to-blue-800/90 px-4 py-2 rounded-lg shadow-lg">
            <span className="text-white text-lg md:text-2xl font-semibold mr-2">{adrenacoins}</span>
            <FaCoins className="text-yellow-400 text-lg md:text-2xl" />
            <button className="ml-3 text-lg md:text-2xl text-green-400 hover:text-green-300 transition transform hover:scale-110">
              <FaPlusCircle />
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-7xl px-4 pt-8 pb-24">
        {/* Sección de "Luxuris del día" */}
        <div className="bg-gradient-to-br from-blue-900/90 via-blue-800/90 to-blue-700/90 py-8 px-6 rounded-xl shadow-2xl mb-12 backdrop-blur-sm">
          <div
            className="relative overflow-hidden w-full h-12 flex items-center justify-center mb-8"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
            }}
          >
            <MarqueeText text="★ LUXURIS DEL DÍA ★" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
            {luxurisCards.length > 0 ? (
              luxurisCards.map((card) => (
                <div
                  key={card.id}
                  className="cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => handleCardClick(card, true)}
                >
                  <Card3D card={card} />
                  <div className="flex items-center justify-center mt-3 text-lg font-semibold bg-blue-800/60 rounded-lg px-3 py-1 backdrop-blur-sm">
                    <span>{card.precio}</span>
                    <FaCoins className="ml-2 text-yellow-400" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xl italic">No hay cartas premium disponibles hoy</p>
            )}
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-10">
          <SearchTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
          />
        </div>

        {/* Cartas en venta */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 pl-2 border-l-4 border-blue-500">
          Cartas en Venta
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {cards.length > 0 ? (
                cards.slice(0, visibleCount).map((card) => (
                  <div
                    key={card.id}
                    className="cursor-pointer transform transition-all hover:scale-105 bg-blue-900/30 rounded-lg p-3 backdrop-blur-sm hover:bg-blue-800/40"
                    onClick={() => handleCardClick(card, false)}
                  >
                    <Carta jugador={card} />
                    <div className="flex items-center justify-center mt-3 bg-blue-700/50 rounded-lg px-3 py-2">
                      <span className="text-lg font-semibold">{card.precio}</span>
                      <FaCoins className="ml-2 text-yellow-400" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center py-12">
                  <p className="text-xl font-semibold">No hay cartas disponibles con estos filtros</p>
                </div>
              )}
            </div>
            
            {cards.length > visibleCount && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMoreCards}
                  className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-400 transition-all transform hover:scale-105 shadow-lg"
                >
                  Cargar más cartas
                </button>
              </div>
            )}
            
            <div className="flex justify-center mt-10">
              <button
                onClick={() => navigate("/cards-for-sale")}
                className="bg-gradient-to-r from-indigo-700 to-purple-600 px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-500 transition-all shadow-lg flex items-center gap-2"
              >
                <span>Ver todas las cartas en venta</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal de compra con confirmación */}
      {showDialog && selectedCard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-xl shadow-2xl text-center max-w-md w-full mx-auto border border-blue-500/30 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-800 to-blue-700 py-3 px-4">
              <h3 className="text-xl font-bold">Detalles de la Carta</h3>
            </div>
            
            <div className="p-6">
              {!showPurchaseAnimation ? (
                // Vista normal del modal de compra
                <>
                  <div className="flex justify-center mb-6 transform transition-transform hover:scale-105">
                    <Carta2 jugador={selectedCard} />
                  </div>
                  
                  <div className="mb-6 text-center">
                    <p className="text-2xl font-semibold mb-1">{selectedCard.nombre}</p>
                    <div className="flex justify-center gap-3">
                      <span className="bg-blue-800/60 rounded-full px-3 py-1 text-sm">{selectedCard.tipo_carta}</span>
                      <span className="bg-blue-800/60 rounded-full px-3 py-1 text-sm">{selectedCard.posicion}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center mb-6 bg-blue-800/40 rounded-lg py-3">
                    <span className="text-xl font-semibold mr-2">Precio: {selectedCard.precio}</span>
                    <FaCoins className="text-yellow-400 text-xl" />
                  </div>
                  
                  <p className="text-lg mb-8">¿Deseas comprar esta carta?</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleBuyCard}
                      className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 rounded-lg hover:from-green-500 hover:to-green-400 transition-all font-semibold"
                    >
                      Comprar
                    </button>
                    <button
                      onClick={handleCloseDialog}
                      className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 rounded-lg hover:from-red-500 hover:to-red-400 transition-all font-semibold"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                // Vista de animación de compra
                <div className="py-4">
                  <PurchaseAnimationWithStatus />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alerta de error (para cuando no hay suficientes adrenacoins) */}
      {errorMessage && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Indicador de carga general */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-blue-900/80 p-6 rounded-xl shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Cargando tienda...</p>
          </div>
        </div>
      )}
      </div>
      </div>
    </div>
  );
}