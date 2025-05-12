import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaCoins, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import background from "../assets/background.png";
import { getToken } from "../services/api/authApi";
import { motion, AnimatePresence } from "framer-motion";

import {
  obtenerCartasEnVenta,
  comprarCarta,
  comprarCartaDiaria,
} from "../services/api/shopApi";
import { getProfile } from "../services/api/profileApi";

import Carta from "./layout/game/CartaMediana";
import Carta2 from "./layout/game/CartaGrande";
import { useWindowSize } from "../hooks/useWindowSize"; 

export default function CardsForSaleAlbum() {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [infoUser, setInfoUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const token = getToken();
  const { width } = useWindowSize();
  
  // Determinar el layout basado en el ancho de la pantalla
  const isMobile = width < 768; // Breakpoint para móviles
  const isTablet = width >= 768 && width < 1024; // Breakpoint para tablets
  
  // Ajustar cardsPerPage según el tamaño de la pantalla
  const cardsPerPage = isMobile ? 6 : isTablet ? 12 : 18;
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerInfo = async () => {
      try {
        const data = await getProfile();
        setInfoUser(data);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };
    obtenerInfo();
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const data = await obtenerCartasEnVenta();
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
        setCards(mappedData);
      } catch (error) {
        console.error("Error al obtener cartas en venta:", error);
      } finally {
        // Simula un pequeño retraso para mostrar la animación de carga
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };
    fetchCards();
  }, []);

  const totalPages = Math.ceil(cards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const visibleCards = cards.slice(startIndex, startIndex + cardsPerPage);

  const leftRangeStart = startIndex + 1;
  const leftRangeEnd = leftRangeStart + 8;
  const rightRangeStart = leftRangeEnd + 1;
  const rightRangeEnd = rightRangeStart + 8;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setPurchaseError(false);
    setErrorMessage("");
    setShowDialog(true);
  };

  const handleBuyCard = async () => {
    if (!selectedCard) return;
    try {
      setPurchaseSuccess(false);
      setPurchaseError(false);
      setErrorMessage("");
      setLoading(true);
      
      if (selectedCard.isDaily) {
        await comprarCartaDiaria(selectedCard.id);
      } else {
        await comprarCarta(selectedCard.mercadoCartaId);
      }
      
      const data = await getProfile();
      setInfoUser(data);
      setPurchaseSuccess(true);
      
      // Espera para mostrar la animación de éxito antes de cerrar
      setTimeout(() => {
        setShowDialog(false);
        setCards((prevCards) =>
          prevCards.filter((c) => c.id !== selectedCard.id)
        );
        setPurchaseSuccess(false);
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error al comprar la carta:", error);
      setLoading(false);
      setPurchaseError(true);
      setErrorMessage(t("shop.insufficient_coins") || "¡No tienes suficientes AdrenaCoins para esta compra!");
    }
  };

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
    exit: { opacity: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.5)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 22 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center text-white flex flex-col items-center pt-10"
      style={{ backgroundImage: `url(${background})` }}
    >
      <motion.button
        onClick={() => navigate("/shop")}
        className="bg-red-600 px-4 py-2 rounded mb-6 hover:bg-red-500 transition absolute top-4 left-4"
        whileHover={buttonVariants.hover}
        whileTap={buttonVariants.tap}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {t("shop.cancel")}
      </motion.button>

      <motion.h1 
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t("shop.selling")}
      </motion.h1>

      <motion.div 
        className="flex justify-between items-center w-full max-w-5xl px-4 mb-2 text-lg font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span>{`${leftRangeStart}-${leftRangeEnd}`}</span>
        <span>{`${rightRangeStart}-${rightRangeEnd}`}</span>
      </motion.div>

      <div className="relative w-full max-w-5xl">
        <motion.button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black transition p-3 rounded-full disabled:opacity-50 z-10"
          whileHover={!currentPage === 1 && buttonVariants.hover}
          whileTap={buttonVariants.tap}
        >
          <FaChevronLeft size={20} />
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPage}
            className="w-full px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {isMobile ? (
              // Vista móvil: una sola columna
              <div className="grid grid-cols-2 gap-2 w-full">
                {visibleCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className="bg-black/40 rounded p-2 flex flex-col items-center justify-center cursor-pointer transition"
                    variants={cardVariants}
                    whileHover="hover"
                    custom={index}
                  >
                    <Carta jugador={card} />
                    <motion.div 
                      className="mt-1 text-center text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.03 }}
                    >
                      <p>{card.tipo_carta}</p>
                      <p>{card.posicion}</p>
                    </motion.div>
                    <motion.div 
                      className="flex items-center justify-center mt-1 text-base font-semibold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.03 }}
                    >
                      <span>{card.precio}</span>
                      <FaCoins className="ml-1 text-yellow-400" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            ) : isTablet ? (
              // Vista tablet: 3 columnas
              <div className="grid grid-cols-3 gap-3 w-full">
                {visibleCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className="bg-black/40 rounded p-2 flex flex-col items-center justify-center cursor-pointer transition"
                    variants={cardVariants}
                    whileHover="hover"
                    custom={index}
                  >
                    <Carta jugador={card} />
                    <motion.div 
                      className="mt-1 text-center text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.03 }}
                    >
                      <p>{card.tipo_carta}</p>
                      <p>{card.posicion}</p>
                    </motion.div>
                    <motion.div 
                      className="flex items-center justify-center mt-2 text-lg font-semibold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.03 }}
                    >
                      <span>{card.precio}</span>
                      <FaCoins className="ml-1 text-yellow-400" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Vista desktop: diseño original con dos columnas de 3x3
              <div className="flex flex-wrap justify-between">
                <div className="grid grid-cols-3 grid-rows-3 gap-2 w-1/2 pr-2">
                  {visibleCards.slice(0, 9).map((card, index) => (
                    <motion.div
                      key={card.id}
                      onClick={() => handleCardClick(card)}
                      className="bg-black/40 rounded p-2 flex flex-col items-center justify-center cursor-pointer transition"
                      variants={cardVariants}
                      whileHover="hover"
                      custom={index}
                    >
                      <Carta jugador={card} />
                      <motion.div 
                        className="flex items-center justify-center mt-2 text-lg font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.03 }}
                      >
                        <span>{card.precio}</span>
                        <FaCoins className="ml-1 text-yellow-400" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-3 grid-rows-3 gap-2 w-1/2 pl-2">
                  {visibleCards.slice(9, 18).map((card, index) => (
                    <motion.div
                      key={card.id}
                      onClick={() => handleCardClick(card)}
                      className="bg-black/40 rounded p-2 flex flex-col items-center justify-center cursor-pointer transition"
                      variants={cardVariants}
                      whileHover="hover"
                      custom={index + 9}
                    >
                      <Carta jugador={card} />
                      <motion.div 
                        className="mt-1 text-center text-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + (index + 9) * 0.03 }}
                      >
                        <p>{card.tipo_carta}</p>
                        <p>{card.posicion}</p>
                      </motion.div>
                      <motion.div 
                        className="flex items-center justify-center mt-2 text-lg font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + (index + 9) * 0.03 }}
                      >
                        <span>{card.precio}</span>
                        <FaCoins className="ml-1 text-yellow-400" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black transition p-3 rounded-full disabled:opacity-50 z-10"
          whileHover={!currentPage === totalPages && buttonVariants.hover}
          whileTap={buttonVariants.tap}
        >
          <FaChevronRight size={20} />
        </motion.button>
      </div>

      <AnimatePresence>
        {showDialog && selectedCard && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowDialog(false);
            }}
          >
            <motion.div 
              className="bg-blue-900 bg-opacity-90 p-4 md:p-6 rounded-lg shadow-lg text-center w-full max-w-xs md:max-w-sm mx-auto relative"
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {purchaseSuccess && (
                <motion.div 
                  className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div 
                    className="text-white text-xl md:text-2xl font-bold"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1.2 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 10,
                      repeat: 0
                    }}
                  >
                    ¡{t("shop.buy")}!
                  </motion.div>
                </motion.div>
              )}
              
              {purchaseError && (
                <AnimatePresence>
                  <motion.div 
                    className="mb-3 bg-red-500 bg-opacity-80 p-3 rounded-lg flex items-center"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <FaExclamationCircle className="text-white mr-2" />
                    <p className="text-white text-sm md:text-base">{errorMessage}</p>
                  </motion.div>
                </AnimatePresence>
              )}
              
              <motion.div 
                className="flex justify-center mb-2 md:mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Carta2 jugador={selectedCard} />
              </motion.div>
              <motion.div 
                className="mb-2 md:mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-lg md:text-xl font-semibold">{selectedCard.nombre}</p>
                <p className="text-base md:text-lg">{selectedCard.tipo_carta}</p>
                <p className="text-base md:text-lg">{selectedCard.posicion}</p>
              </motion.div>
              <motion.p 
                className="text-base md:text-lg my-2 md:my-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t("shop.question")}{" "}
                {selectedCard.isDaily ? "(Diaria)" : ""}
              </motion.p>
              <motion.div 
                className="flex justify-center space-x-4 md:space-x-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  onClick={handleBuyCard}
                  className="bg-green-600 px-3 py-2 md:px-4 md:py-2 rounded hover:bg-green-500 transition flex items-center justify-center text-sm md:text-base"
                  whileHover={buttonVariants.hover}
                  whileTap={buttonVariants.tap}
                  disabled={loading}
                >
                  {loading ? 
                    <FaSpinner className="animate-spin mr-2" /> : 
                    t("shop.yes")
                  }
                </motion.button>
                <motion.button
                  onClick={() => setShowDialog(false)}
                  className="bg-red-600 px-3 py-2 md:px-4 md:py-2 rounded hover:bg-red-500 transition text-sm md:text-base"
                  whileHover={buttonVariants.hover}
                  whileTap={buttonVariants.tap}
                  disabled={loading}
                >
                  {t("shop.no")}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && !showDialog && (
          <motion.div 
            className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ 
                rotate: 360,
                transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
              }}
              className="text-4xl text-white mb-4"
            >
              <FaSpinner />
            </motion.div>
            <motion.p 
              className="text-white text-lg"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {t("shop.loading")}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}