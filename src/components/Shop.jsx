import { useState, useEffect, useRef } from "react";
import { FaPlusCircle, FaCoins, FaTimes } from "react-icons/fa";
import { Search, Filter } from "lucide-react";
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
import PurchaseAnimation from "./layout/game/PurchaseAnimation";
import { useTranslation } from "react-i18next";

// Componente para la barra de búsqueda y filtros
const SearchTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("Equipo");
  const [selectedPosition, setSelectedPosition] = useState("Posición");
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();

  const equiposEspañoles = [
    "Real Betis",
    "Deportivo Alavés",
    "Getafe CF",
    "Rayo Vallecano",
    "RCD Mallorca",
    "CA Osasuna",
    "Girona FC",
    "Athletic Club",
    "UD Las Palmas",
    "CD Leganés",
    "Sevilla FC",
    "Real Valladolid CF",
    "Atlético de Madrid",
    "Real Sociedad",
    "Villarreal CF",
    "FC Barcelona",
    "RCD Espanyol de Barcelona",
    "RC Celta",
    "Valencia CF",
    "Real Madrid",
  ];

  const posiciones = ["goalkeeper", "defender", "midfielder", "forward"];

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTeam("Equipo");
    setSelectedPosition("Posición");
  };

  return (
    <div className="flex justify-center w-full p-4">
      <div className="w-full max-w-4xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-xl p-6 shadow-xl backdrop-blur-sm border border-blue-700/30">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full lg:w-auto">
            <input
              type="text"
              placeholder={t('shop.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-md text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="flex w-full lg:w-auto gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors text-white px-5 py-3 rounded-lg flex-1 shadow-md"
            >
              <Filter size={18} />
              <span>{t("shop.filter")}</span>
            </button>
            
            {/* Botón de limpiar filtros */}
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 transition-colors text-white px-5 py-3 rounded-lg flex-1 shadow-md"
              aria-label="Clear filters"
            >
              <FaTimes size={18} />
              <span>{t('shop.clear')}</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            <div>
              <label className="block text-white mb-2 font-medium">
                {t("shop.position")}
              </label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full p-3 bg-white/20 backdrop-blur-md text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 [&>option]:text-black"
              >
                <option value="Posición">{t("shop.reastPos")}</option>
                {posiciones.map((posicion) => (
                  <option key={posicion} value={posicion}>
                    {posicion}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white mb-2 font-medium">
                {t("shop.team")}
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full p-3 bg-white/20 backdrop-blur-md text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 [&>option]:text-black"
              >
                <option value="Equipo">{t("shop.reastTeam")}</option>
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
    </div>
  );
};

SearchTab.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  selectedTeam: PropTypes.string.isRequired,
  setSelectedTeam: PropTypes.func.isRequired,
  selectedPosition: PropTypes.string.isRequired,
  setSelectedPosition: PropTypes.func.isRequired,
};

SearchTab.defaultProps = {
  searchQuery: "",
  selectedTeam: "Equipo",
  selectedPosition: "Posición",
};

export default function Shop() {
  const { t } = useTranslation();

  const [showDialog, setShowDialog] = useState(false);
  const [luxurisCards, setLuxurisCards] = useState([]); // Cartas diarias
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(t("shop.team"));
  const [selectedPosition, setSelectedPosition] = useState(t("shop.position"));
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
    if (selectedTeam === "Equipo") {
      setSelectedTeam(t("shop.team"));
    }
    if (selectedPosition === "Posición") {
      setSelectedPosition(t("shop.position"));
    }
  }, [t, selectedTeam, selectedPosition]);
  useEffect(() => {
    if (topRef.current) {
      window.scrollTo(0, 0);
      topRef.current.scrollIntoView({ behavior: "smooth" });
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
    const filteredCards = allCards.filter((card) => {
      // Filtrar por nombre/búsqueda
      const matchesQuery =
        searchQuery === "" ||
        card.nombre.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtrar por equipo
      const matchesTeam =
        selectedTeam === t("shop.team") || card.equipo === selectedTeam;

      // Filtrar por posición
      const matchesPosition =
        selectedPosition === t("shop.position") ||
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
        setErrorMessage(t("shop.error"));
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
        setLuxurisCards((prevCards) =>
          prevCards.filter((card) => card.id !== selectedCard.id)
        );
      } else {
        // Actualizar tanto la lista filtrada como la lista completa
        setCards((prevCards) =>
          prevCards.filter((card) => card.id !== selectedCard.id)
        );
        setAllCards((prevCards) =>
          prevCards.filter((card) => card.id !== selectedCard.id)
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
      if (
        error.response &&
        error.response.data &&
        error.response.data.includes("adrenacoins insuficientes")
      ) {
        setErrorMessage(t("shop.error"));
      } else {
        setErrorMessage(t("shop.error2"));
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
    setVisibleCount((prev) => prev + 8);
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
    <div className="relative">
      <div
        className="min-h-screen w-screen bg-cover bg-center bg-fixed text-white flex flex-col items-center overflow-hidden"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
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
              {/* Ajuste para título más pequeño en móvil para dejar espacio */}
              <h1 className="text-2xl md:text-5xl font-bold text-center flex-grow px-2">
                {t("shop.title")}
              </h1>
              {/* Botón de monedas más pequeño en móvil */}
              <div className="flex items-center bg-gradient-to-r from-blue-900/90 to-blue-800/90 px-2 sm:px-4 py-2 rounded-lg shadow-lg shrink-0">
                <span className="text-white text-sm md:text-2xl font-semibold mr-1 sm:mr-2">
                  {adrenacoins}
                </span>
                <FaCoins className="text-yellow-400 text-lg md:text-2xl" />
                <button className="ml-1 sm:ml-3 text-lg md:text-2xl text-green-400 hover:text-green-300 transition transform hover:scale-110">
                  <FaPlusCircle />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full max-w-7xl px-4 pt-8 pb-24">
            {/* Sección de "Luxuris del día" */}
            <div className="bg-gradient-to-br from-blue-900/90 via-blue-800/90 to-blue-700/90 py-8 px-4 sm:px-6 rounded-xl shadow-2xl mb-12 backdrop-blur-sm">
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

              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
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
                  <p className="text-xl italic">{t("shop.error3")}</p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="mb-10 w-full">
                <SearchTab
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedTeam={selectedTeam}
                  setSelectedTeam={setSelectedTeam}
                  selectedPosition={selectedPosition}
                  setSelectedPosition={setSelectedPosition}
                />
              </div>
            </div>

            {/* Cartas en venta */}
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 pl-2 border-l-4 border-blue-500">
              {t("shop.selling")}
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              </div>
            ) : (
              <>
                {/* Ajuste al grid para mejor visualización en móvil */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {cards.length > 0 ? (
                    cards.slice(0, visibleCount).map((card) => (
                      <div
                        key={card.id}
                        className="cursor-pointer transform transition-all hover:scale-105 bg-blue-900/30 rounded-lg p-2 sm:p-3 backdrop-blur-sm hover:bg-blue-800/40"
                        onClick={() => handleCardClick(card, false)}
                      >
                        <Carta jugador={card} />
                        <div className="flex items-center justify-center mt-2 sm:mt-3 bg-blue-700/50 rounded-lg px-2 sm:px-3 py-1 sm:py-2">
                          <span className="text-base sm:text-lg font-semibold">
                            {card.precio}
                          </span>
                          <FaCoins className="ml-2 text-yellow-400" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 text-center py-12">
                      <p className="text-xl font-semibold">
                        {t("shop.error4")}
                      </p>
                    </div>
                  )}
                </div>

                {cards.length > visibleCount && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={loadMoreCards}
                      className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-400 transition-all transform hover:scale-105 shadow-lg"
                    >
                      {t("shop.loading2")}
                    </button>
                  </div>
                )}

                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => navigate("/cards-for-sale")}
                    className="bg-gradient-to-r from-indigo-700 to-purple-600 px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-500 transition-all shadow-lg flex items-center gap-2"
                  >
                    <span>{t("shop.view")}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Modal de compra con confirmación */}
          {showDialog && selectedCard && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div
                className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-xl shadow-2xl text-center w-full max-w-lg mx-auto border border-blue-500/30 overflow-hidden"
                style={{ maxHeight: "90vh" }}
              >
                <div className="bg-gradient-to-r from-blue-800 to-blue-700 py-3 px-4 sticky top-0 z-10">
                  <h3 className="text-xl font-bold">{t("shop.info")}</h3>
                </div>

                <div
                  className="p-4 md:p-6 overflow-y-auto"
                  style={{ maxHeight: "calc(90vh - 56px)" }}
                >
                  {!showPurchaseAnimation ? (
                    <>
                      <div className="flex justify-center mb-6 transform transition-transform hover:scale-105 max-w-full">
                        <div className="max-w-xs w-full">
                          <Carta2 jugador={selectedCard} />
                        </div>
                      </div>

                      <div className="mb-6 text-center">
                        <p className="text-xl md:text-2xl font-semibold mb-1">
                          {selectedCard.nombre}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                          <span className="bg-blue-800/60 rounded-full px-3 py-1 text-sm">
                            {selectedCard.tipo_carta}
                          </span>
                          <span className="bg-blue-800/60 rounded-full px-3 py-1 text-sm">
                            {selectedCard.posicion}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center mb-6 bg-blue-800/40 rounded-lg py-3">
                        <span className="text-xl font-semibold mr-2">
                          {t("shop.price")}: {selectedCard.precio}
                        </span>
                        <FaCoins className="text-yellow-400 text-xl" />
                      </div>

                      <p className="text-lg mb-6">{t("shop.question")}</p>

                      <div className="grid grid-cols-2 gap-4 px-4">
                        <button
                          onClick={handleBuyCard}
                          className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-3 rounded-lg hover:from-green-500 hover:to-green-400 transition-all font-semibold"
                        >
                          {t("shop.buy")}
                        </button>
                        <button
                          onClick={handleCloseDialog}
                          className="bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 rounded-lg hover:from-red-500 hover:to-red-400 transition-all font-semibold"
                        >
                          {t("shop.cancel")}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-4 flex items-center justify-center min-h-64">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
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
                <p className="text-white text-lg">{t("shop.loading")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}