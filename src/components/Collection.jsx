import { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Check, X, ChevronUp, DollarSign } from "lucide-react";
import background from "../assets/background.png";
import Carta from "./layout/game/CartaMediana";
import Carta2 from "./layout/game/CartaGrande";
import Carta3 from "./layout/game/CartaNoDisponible";
import { getCollection, filterCards } from "../services/api/collectionApi";
import { publicarCarta, retirarCarta } from "../services/api/shopApi";
import BackButton from "../components/layout/game/BackButton";
import { getToken } from "../services/api/authApi";
import PropTypes from "prop-types";
import {
  getEquipos,
  getRaridades,
  getPosiciones,
} from "../services/api/teamsApi";

import circle from "../assets/circle.png";
import { useTranslation } from "react-i18next";

// Enhanced Alert Component for Sale Success
const SaleAlert = ({ player, price, visible, onClose }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`fixed bottom-8 right-8 transition-all duration-500 transform ${
        visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      } z-50`}
    >
      <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-lg shadow-lg p-4 w-80 border border-green-500">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-full p-1 mr-2">
              <Check size={16} />
            </div>
            <h3 className="text-white font-bold text-lg">
              {t("collection.sell")}
            </h3>
          </div>
          <button
            className="text-white hover:text-green-200 transition-colors"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center bg-black bg-opacity-20 rounded-lg p-3 mb-3">
          <div className="relative mr-3">
            <img
              src={player?.photo || "/api/placeholder/100/100"}
              alt={player?.nombre || "Player"}
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 animate-pulse">
              <ChevronUp size={12} />
            </div>
          </div>

          <div className="flex-1">
            <p className="text-white font-bold">{player?.nombre || "Player"}</p>
            <p className="text-green-200 text-sm">{player?.equipo || "Team"}</p>
          </div>

          <div className="flex items-center bg-yellow-500 px-2 py-1 rounded">
            <DollarSign size={14} className="mr-1" />
            <span className="font-bold">{price}</span>
          </div>
        </div>

        <div className="text-center text-green-100 text-sm">
          {t("collection.sell2")}
        </div>
      </div>
    </div>
  );
};

SaleAlert.propTypes = {
  player: PropTypes.object,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

// Añade este componente después del SaleAlert, alrededor de la línea 67
const WithdrawAlert = ({ player, visible, onClose }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`fixed bottom-8 right-8 transition-all duration-500 transform ${
        visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      } z-50`}
    >
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-lg shadow-lg p-4 w-80 border border-blue-500">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-full p-1 mr-2">
              <Check size={16} />
            </div>
            <h3 className="text-white font-bold text-lg">
              {" "}
              {t("collection.with")}
            </h3>
          </div>
          <button
            className="text-white hover:text-blue-200 transition-colors"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center bg-black bg-opacity-20 rounded-lg p-3 mb-3">
          <div className="relative mr-3">
            <img
              src={player?.photo || "/api/placeholder/100/100"}
              alt={player?.nombre || "Player"}
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 animate-pulse">
              <ChevronUp size={12} />
            </div>
          </div>

          <div className="flex-1">
            <p className="text-white font-bold">{player?.nombre || "Player"}</p>
            <p className="text-blue-200 text-sm">{player?.equipo || "Team"}</p>
          </div>
        </div>

        <div className="text-center text-blue-100 text-sm">
          {t("collection.with2")}
        </div>
      </div>
    </div>
  );
};

WithdrawAlert.propTypes = {
  player: PropTypes.object,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function Collection({ onBack }) {
  const { t } = useTranslation();

  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [price, setPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showIndexModal, setShowIndexModal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [rarities, setRarities] = useState({});
  const [positions, setPositions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertPlayer, setAlertPlayer] = useState(null);
  const [alertPrice, setAlertPrice] = useState(0);
  const [showWithdrawAlert, setShowWithdrawAlert] = useState(false);
  const [withdrawPlayer, setWithdrawPlayer] = useState(null);

  // Responsive state for grid layout
  const [screenSize, setScreenSize] = useState({
    isXs: false, // < 640px (Mobile)
    isSm: false, // 640px - 768px (Small tablets)
    isMd: false, // 768px - 1024px (Tablets)
    isLg: false, // 1024px - 1280px (Small laptops)
    isXl: true, // > 1280px (Desktops and above)
  });

  // Animation ref for card transition
  const cardGridRef = useRef(null);

  // Default cards per page (will be adjusted based on screen size)
  const [cardsPerPage, setCardsPerPage] = useState(18);
  const token = getToken();
  const navigate = useNavigate();
  const validRarezas = ["MEGALUXURY", "LUXURYXI", "LUXURY"];

  const images = import.meta.glob("../assets/*.png", { eager: true });

  const rarityToStars = (tipo) => {
    switch (tipo.toLowerCase()) {
      case "megaluxury":
        return 5;
      case "luxury xi":
        return 4;
      case "luxury":
        return 3;
      default:
        return 1; // normal o cualquier otro tipo
    }
  };

  const getImageSrc = (filename) => {
    return images[`../assets/${filename}`]?.default;
  };

  // Handle screen size detection and updates
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      // Update screen size state
      setScreenSize({
        isXs: width < 640,
        isSm: width >= 640 && width < 768,
        isMd: width >= 768 && width < 1024,
        isLg: width >= 1024 && width < 1280,
        isXl: width >= 1280,
      });

      // Adjust cards per page based on screen size
      if (width < 640) {
        setCardsPerPage(4); // 2x2 grid for mobile
      } else if (width < 768) {
        setCardsPerPage(6); // 3x2 grid for small tablets
      } else if (width < 1024) {
        setCardsPerPage(9); // 3x3 grid for tablets
      } else if (width < 1280) {
        setCardsPerPage(12); // 4x3 grid for small laptops
      } else {
        setCardsPerPage(18); // 6x3 grid for desktops (original layout)
      }
    };

    // Initial sizing
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchCollection();
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const fetchCollection = async () => {
    setLoading(true);
    try {
      const data = await getCollection();
      const mappedData = data.map((card) => ({
        alias: card.nombreCompleto || card.nombre || "Sin nombre",
        ataque: card.ataque ?? 0,
        control: card.control ?? 0,
        medio: card.medio ?? 0,
        defensa: card.defensa ?? 0,
        equipo: card.equipo || card.club || "Sin club",
        escudo: card.escudo || "default_escudo.png",
        photo: card.photo || "default.png",
        tipo_carta: card.tipo_carta || "Normal",
        id: card.id,
        nombre: card.nombreCompleto || card.nombre || "Sin nombre",
        pais: card.nacionalidad || "Desconocido",
        posicion: card.posicion || "N/A",
        disponible: card.disponible,
        enVenta: card.enVenta || false,
        cantidad: card.cantidad,
        mercadoCartaId: card.mercadoCartaId || null,
      }));
      setCards(mappedData);
      setCurrentPage(1);

      // Add subtle animation to cards appearing
      if (cardGridRef.current) {
        cardGridRef.current.classList.add("fade-in");
      }
    } catch (error) {
      console.error("Error al cargar la colección:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenIndexModal = async () => {
    setShowIndexModal(true);
    try {
      const equipos = await getEquipos();
      setTeams(equipos);
      const raritiesData = await getRaridades();
      console.log(raritiesData);
      setRarities(raritiesData);
      const posData = await getPosiciones();
      setPositions(posData.equipos || []);
    } catch (error) {
      console.error("Error al cargar índice:", error);
    }
  };

  const handleTeamClick = async (team) => {
    try {
      const filtered = await filterCards({ equipo: team.nombre });
      updateCollection(filtered);
      setShowIndexModal(false);
    } catch (error) {
      console.error("Error al filtrar por equipo:", error);
    }
  };

  const handleRarityClick = async (rarityKey) => {
    try {
      console.log(rarityKey);
      const filtered = await filterCards({ rareza: rarityKey });
      updateCollection(filtered);
      setShowIndexModal(false);
    } catch (error) {
      console.error("Error al filtrar por rareza:", error);
    }
  };

  const handlePositionClick = async (position) => {
    try {
      const filtered = await filterCards({ posicion: position.nombre });
      updateCollection(filtered);
      setShowIndexModal(false);
    } catch (error) {
      console.error("Error al filtrar por posición:", error);
    }
  };

  const updateCollection = (data) => {
    const cardsData = data || [];
    const mappedData = cardsData.map((card) => ({
      alias: card.nombreCompleto || card.nombre || "Sin nombre",
      ataque: card.ataque ?? 0,
      control: card.control ?? 0,
      medio: card.medio ?? 0,
      defensa: card.defensa ?? 0,
      equipo: card.club || "Sin club",
      escudo: card.escudo || "default_escudo.png",
      photo: card.photo || "default.png",
      tipo_carta: card.tipo_carta || "Normal",
      id: card.id,
      nombre: card.nombreCompleto || card.nombre || "Sin nombre",
      pais: card.nacionalidad || "Desconocido",
      posicion: card.posicion || "N/A",
      disponible: card.disponible,
      enVenta: card.enVenta || false,
      cantidad: card.cantidad,
      mercadoCartaId: card.mercadoCartaId || null,
    }));

    // Add transition effect to card grid
    if (cardGridRef.current) {
      cardGridRef.current.classList.add("fade-out");
      setTimeout(() => {
        setCards(mappedData);
        setCurrentPage(1);
        setTimeout(() => {
          if (cardGridRef.current) {
            cardGridRef.current.classList.remove("fade-out");
            cardGridRef.current.classList.add("fade-in");
          }
        }, 50);
      }, 300);
    } else {
      setCards(mappedData);
      setCurrentPage(1);
    }
  };

  const totalPages = Math.ceil(cards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const visibleCards = cards.slice(startIndex, startIndex + cardsPerPage);

  // For responsive grid, calculate column counts based on screen size
  const getColumnCount = () => {
    if (screenSize.isXs) return 2; // Mobile: 2 columns
    if (screenSize.isSm) return 3; // Small tablets: 3 columns
    if (screenSize.isMd) return 3; // Tablets: 3 columns
    if (screenSize.isLg) return 4; // Small laptops: 4 columns
    return 6; // Desktop: 6 columns (original layout with 2 sides of 3 columns)
  };

  // Split cards for display in responsive grid
  const getGridLayout = () => {
    const columnCount = getColumnCount();

    // For large screens, maintain the original 2-sided layout
    if (screenSize.isXl) {
      const leftCardsCount = visibleCards.slice(0, 9).length;
      const rightCardsCount = visibleCards.slice(9, 18).length;

      const leftRangeStart = startIndex + 1;
      const leftRangeEnd = startIndex + leftCardsCount;
      const rightRangeStart = leftRangeEnd + 1;
      const rightRangeEnd = startIndex + leftCardsCount + rightCardsCount;

      return {
        isTwoSided: true,
        leftCards: visibleCards.slice(0, 9),
        rightCards: visibleCards.slice(9, 18),
        leftRange: `${leftRangeStart}-${leftRangeEnd}`,
        rightRange:
          rightCardsCount > 0 ? `${rightRangeStart}-${rightRangeEnd}` : null,
      };
    }

    // For smaller screens, use a single grid layout
    return {
      isTwoSided: false,
      allCards: visibleCards,
      range: `${startIndex + 1}-${Math.min(
        startIndex + visibleCards.length,
        cards.length
      )}`,
      columnCount,
    };
  };

  const gridLayout = getGridLayout();

  const handlePrevPage = () => {
    if (cardGridRef.current) {
      cardGridRef.current.classList.add("slide-right");
      setTimeout(() => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
        setTimeout(() => {
          if (cardGridRef.current) {
            cardGridRef.current.classList.remove("slide-right");
          }
        }, 50);
      }, 300);
    } else {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleNextPage = () => {
    if (cardGridRef.current) {
      cardGridRef.current.classList.add("slide-left");
      setTimeout(() => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
        setTimeout(() => {
          if (cardGridRef.current) {
            cardGridRef.current.classList.remove("slide-left");
          }
        }, 50);
      }, 300);
    } else {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setPrice("");
    setShowModal(true);
  };

  // Confirmar venta con animación mejorada
  const handleConfirmSale = async () => {
    if (!price || isNaN(price) || price <= 0) {
      alert("Por favor, ingresa un precio válido.");
      return;
    }

    try {
      setLoading(true); // Show loading state

      await publicarCarta(selectedCard.id, price);

      const updatedCard = {
        ...selectedCard,
        enVenta: true,
        precio: price,
        mercadoCartaId: selectedCard.id,
      };

      setCards((prevCards) =>
        prevCards.map((c) => (c.id === selectedCard.id ? updatedCard : c))
      );

      // Set alert data
      setAlertPlayer(updatedCard);
      setAlertPrice(price);

      // Close modal first
      setShowModal(false);

      // Wait a moment to show success alert
      setTimeout(() => {
        setShowAlert(true);

        // Auto-hide alert after 5 seconds
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }, 600);
    } catch (error) {
      console.error("Error al poner la carta en venta:", error);
      alert("Hubo un error al poner la carta en venta.");
    } finally {
      setLoading(false);
    }
  };

  // Retirar carta del mercado
  const handleRetirarCarta = async () => {
    try {
      setLoading(true);

      await retirarCarta(selectedCard.id);

      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === selectedCard.id
            ? { ...c, disponible: true, enVenta: false, precio: null }
            : c
        )
      );

      // Guardar la carta retirada
      setWithdrawPlayer(selectedCard);

      // Cerrar el modal primero
      setShowModal(false);

      // Mostrar la alerta de retirada después de un momento
      setTimeout(() => {
        setShowWithdrawAlert(true);

        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
          setShowWithdrawAlert(false);
        }, 5000);
      }, 600);

      // Mantener la notificación del navegador como fallback
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Carta retirada del mercado", {
          body: `La carta ${selectedCard.nombre} ha sido retirada del mercado correctamente.`,
          icon: selectedCard.photo || "/assets/default.png",
        });
      }
    } catch (error) {
      console.error("Error al retirar la carta:", error);
      alert("Hubo un error al retirar la carta.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (onBack) onBack();
    else navigate("/home");
  };

  // Add CSS styles for animations
  useEffect(() => {
    // Create style element for our animations
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(10px); }
      }
      
      @keyframes slideLeft {
        from { transform: translateX(0); }
        to { transform: translateX(-15px); opacity: 0; }
      }
      
      @keyframes slideRight {
        from { transform: translateX(0); }
        to { transform: translateX(15px); opacity: 0; }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes shine {
        0% { background-position: -100px; }
        40%, 100% { background-position: 140px; }
      }
      
      .fade-in {
        animation: fadeIn 0.3s ease-out forwards;
      }
      
      .fade-out {
        animation: fadeOut 0.3s ease-in forwards;
      }
      
      .slide-left {
        animation: slideLeft 0.3s ease-in forwards;
      }
      
      .slide-right {
        animation: slideRight 0.3s ease-in forwards;
      }
      
      .card-pulse {
        animation: pulse 0.6s ease-in-out;
      }
      
      .card-shine {
        position: relative;
        overflow: hidden;
      }
      
      .card-shine::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          to right, 
          rgba(255, 255, 255, 0) 0%, 
          rgba(255, 255, 255, 0.3) 50%, 
          rgba(255, 255, 255, 0) 100%
        );
        transform: skewX(-25deg);
        animation: shine 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      // Cleanup
      document.head.removeChild(styleEl);
    };
  }, []);

  // Helper function to render card
  const renderCard = (card) => {
    return (
      <div
        key={card.id}
        onClick={card.disponible ? () => handleCardClick(card) : undefined}
        className={`
          cursor-${card.disponible ? "pointer" : "not-allowed"}
          bg-black/40 rounded p-2 flex flex-col items-center justify-center 
          ${
            card.disponible
              ? "hover:bg-black/70 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              : "opacity-70"
          }
        `}
      >
        {card.disponible ? <Carta jugador={card} /> : <Carta3 jugador={card} />}
        <div className="mt-1 text-center text-xs">
          <p>{card.tipo_carta}</p>
          <p>{card.posicion}</p>
        </div>
      </div>
    );
  };

  // Modal for card details and selling - versión responsive
  const renderCardModal = () => {
    if (!showModal || !selectedCard) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn p-2 sm:p-4 overflow-y-auto">
        <div className="bg-gradient-to-b from-gray-900 to-black p-4 sm:p-6 rounded-lg shadow-2xl max-w-md mx-auto border border-gray-700 w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {t("shop.info")}
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative w-32 h-44 sm:w-40 sm:h-56 md:w-44 md:h-60 card-shine">
              <Carta2 jugador={selectedCard} container="modal" />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="bg-black/40 p-2 sm:p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-300 text-sm sm:text-base">
                  {t("standing.name")}:
                </span>
                <span className="font-bold text-sm sm:text-base">
                  {selectedCard.nombre}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-300 text-sm sm:text-base">
                  {t("shop.team")}:
                </span>
                <span className="text-sm sm:text-base">
                  {selectedCard.equipo}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-300 text-sm sm:text-base">
                  {t("shop.position")}:
                </span>
                <span className="text-sm sm:text-base">
                  {selectedCard.posicion}
                </span>
              </div>
            </div>

            {selectedCard.enVenta ? (
              <div className="space-y-3">
                <div className="bg-yellow-800/40 p-2 sm:p-3 rounded-lg border border-yellow-700/50">
                  <p className="text-yellow-300 text-center font-medium text-sm sm:text-base">
                    {t("collection.notAvailable")}
                  </p>
                </div>
                <button
                  onClick={handleRetirarCarta}
                  className="w-full bg-red-600 hover:bg-red-700 transition-colors p-2 sm:p-3 rounded-lg font-medium text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? t("collection.take") : t("collection.take2")}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-black/40 p-2 sm:p-3 rounded-lg">
                  <label className="block text-gray-300 mb-1 text-sm sm:text-base">
                    {t("collection.price")}
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={16}
                      className="absolute top-2 sm:top-3 left-3 text-yellow-500"
                    />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-black/70 border border-gray-700 p-1 sm:p-2 pl-8 sm:pl-9 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-sm sm:text-base"
                      placeholder="Ingresa el precio"
                    />
                  </div>
                </div>
                <button
                  onClick={handleConfirmSale}
                  className="w-full bg-green-600 hover:bg-green-700 transition-colors p-2 sm:p-3 rounded-lg font-medium flex items-center justify-center space-x-2 text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <span> {t("collection.published")}</span>
                  ) : (
                    <>
                      <DollarSign size={16} className="sm:w-5 sm:h-5" />
                      <span>{t("collection.sell3")}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Index modal for filtering
  const renderIndexModal = () => {
    if (!showIndexModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn p-4 overflow-y-auto">
        <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-2xl w-full max-w-2xl mx-auto border border-gray-700 my-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">
              {t("collection.index")}
            </h3>
            <button
              onClick={() => setShowIndexModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Equipos */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-200">
                {t("shop.team")}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleTeamClick(team)}
                    className="bg-black/40 hover:bg-black/70 transition-all duration-300 p-2 rounded flex items-center space-x-2 border border-transparent hover:border-gray-700"
                  >
                    <img
                      src={team.escudo || "/api/placeholder/32/32"}
                      alt={team.nombre}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-sm">{team.nombre}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Raridades */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-200">
                {t("collection.rarity")}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(rarities).map(([key, rarity]) => (
                  <button
                    key={key}
                    onClick={() => handleRarityClick(key)}
                    className="bg-black/40 hover:bg-black/70 transition-all duration-300 p-3 rounded flex items-center space-x-2 border border-transparent hover:border-gray-700"
                  >
                    <div className="flex">
                      {Array.from({ length: rarityToStars(key) }).map(
                        (_, i) => (
                          <FaStar key={i} className="text-yellow-500" />
                        )
                      )}
                    </div>
                    <span>{key}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Posiciones */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-200">
                {t("shop.position")}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {positions.map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => handlePositionClick(pos)}
                    className="bg-black/40 hover:bg-black/70 transition-all duration-300 p-2 rounded text-center border border-transparent hover:border-gray-700"
                  >
                    {pos.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center text-white flex flex-col items-center pt-10"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="fixed top-4 left-4 z-40 md:top-10 md:left-10">
        <BackButton onClick={handleBackClick} />
      </div>

      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-shadow">
        {t("collection.title")}
      </h1>

      {/* Index button */}
      <button
        onClick={handleOpenIndexModal}
        className="bg-black/50 px-3 py-2 md:px-4 md:py-2 rounded-md hover:bg-black transition-all duration-300 mb-4 hover:shadow-lg border border-gray-700 text-sm md:text-base"
      >
        {t("collection.index")}
      </button>

      {/* Range indicator */}
      {gridLayout.isTwoSided ? (
        <div className="flex justify-between items-center w-full max-w-5xl px-4 mb-2 text-sm md:text-lg font-semibold">
          <span>{gridLayout.leftRange}</span>
          {gridLayout.rightRange && <span>{gridLayout.rightRange}</span>}
        </div>
      ) : (
        <div className="flex justify-center items-center w-full px-4 mb-2 text-sm md:text-lg font-semibold">
          <span>{gridLayout.range}</span>
        </div>
      )}

      {/* Card grid - responsive based on screen size */}
      <div className="relative w-full max-w-5xl px-2 md:px-4">
        {/* Navigation buttons */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black transition-all duration-300 p-2 md:p-3 rounded-full disabled:opacity-50 z-10 hover:shadow-lg"
        >
          <FaChevronLeft size={screenSize.isXs ? 16 : 20} />
        </button>

        {/* Responsive card grid layouts */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : gridLayout.isTwoSided ? (
          // Original two-sided grid for XL screens
          <div className="flex justify-between px-4" ref={cardGridRef}>
            <div className="grid grid-cols-3 grid-rows-3 gap-2 w-1/2 pr-2">
              {gridLayout.leftCards.map(renderCard)}
            </div>
            <div className="grid grid-cols-3 grid-rows-3 gap-2 w-1/2 pl-2">
              {gridLayout.rightCards.map(renderCard)}
            </div>
          </div>
        ) : (
          // Responsive single grid for smaller screens
          <div
            className={`grid grid-cols-${gridLayout.columnCount} gap-2 mx-auto px-2`}
            ref={cardGridRef}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridLayout.columnCount}, minmax(0, 1fr))`,
            }}
          >
            {gridLayout.allCards.map(renderCard)}
          </div>
        )}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black transition-all duration-300 p-2 md:p-3 rounded-full disabled:opacity-50 z-10 hover:shadow-lg"
        >
          <FaChevronRight size={screenSize.isXs ? 16 : 20} />
        </button>
      </div>

      {/* Pagination indicators */}
      <div className="mt-4 flex items-center justify-center space-x-1">
        {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
          // Show limited pagination dots
          let pageToShow;
          if (totalPages <= 5) {
            pageToShow = index + 1;
          } else if (currentPage <= 3) {
            pageToShow = index + 1;
          } else if (currentPage >= totalPages - 2) {
            pageToShow = totalPages - 4 + index;
          } else {
            pageToShow = currentPage - 2 + index;
          }

          return (
            <button
              key={pageToShow}
              onClick={() => setCurrentPage(pageToShow)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentPage === pageToShow
                  ? "bg-white w-4"
                  : "bg-gray-500 hover:bg-gray-300"
              }`}
              aria-label={`Page ${pageToShow}`}
            />
          );
        })}
      </div>

      {/* Card modal */}
      {renderCardModal()}

      {/* Index modal */}
      {renderIndexModal()}

      {/* Success alert for sales */}
      <SaleAlert
        player={alertPlayer}
        price={alertPrice}
        visible={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <WithdrawAlert
        player={withdrawPlayer}
        visible={showWithdrawAlert}
        onClose={() => setShowWithdrawAlert(false)}
      />
    </div>
  );
}
