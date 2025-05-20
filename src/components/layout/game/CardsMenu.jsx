import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { abrirSobre, sobresDisponibles } from "../../../services/api/cardApi";
import SobreRaro from "../../../assets/SobreRaro.png";
import SobreEpico from "../../../assets/SobreEpico.png";
import SobreComun from "../../../assets/SobreComun.png";
import { useTranslation } from "react-i18next";

export default function CardsMenu({ onOpenSobre }) {
  const [sobres, setSobres] = useState([]);
  const [centerCard, setCenterCard] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();


  useEffect(() => {
    const fetchSobres = async () => {
      try {
        const sobresData = await sobresDisponibles();

        if (!sobresData || sobresData.length === 0) {
          console.warn("No hay sobres disponibles.");
          // Usar datos de ejemplo si no hay sobres disponibles
          const mockSobres = [
            { id: "temp-1", tipo: "Sobre Energia Lux", nombre: "Sobre Energía", precio: 100 },
            { id: "temp-2", tipo: "Sobre Elite Lux", nombre: "Sobre Elite", precio: 250 },
            { id: "temp-3", tipo: "Sobre Master Lux", nombre: "Sobre Master", precio: 500 }
          ];
          
          const sobresConImagen = mockSobres.map(sobre => ({
            ...sobre,
            imagen: sobre.tipo === "Sobre Energia Lux" ? SobreComun :
                   sobre.tipo === "Sobre Elite Lux" ? SobreRaro :
                   sobre.tipo === "Sobre Master Lux" ? SobreEpico : null,
          }));
          
          setSobres(sobresConImagen);
          setCenterCard("temp-1");
          return;
        }

        const sobresConID = sobresData.map((sobre, index) => ({
          ...sobre,
          id: sobre.id || `temp-${index}`,
          imagen: sobre.tipo === "Sobre Energia Lux" ? SobreComun :
                  sobre.tipo === "Sobre Elite Lux" ? SobreRaro :
                  sobre.tipo === "Sobre Master Lux" ? SobreEpico :
                  sobre.imagen,
        }));

        setSobres(sobresConID);

        // Asignar siempre el sobre común al centro
        const sobreComun = sobresConID.find(sobre => sobre.tipo === "Sobre Energia Lux");
        setCenterCard(sobreComun ? sobreComun.id : sobresConID[0]?.id || null);
      } catch (error) {
        console.error("Error obteniendo sobres:", error);
        // Usar datos de ejemplo en caso de error
        const mockSobres = [
          { id: "temp-1", tipo: "Sobre Energia Lux", nombre: "Sobre Energía", precio: 100 },
          { id: "temp-2", tipo: "Sobre Elite Lux", nombre: "Sobre Elite", precio: 250 },
          { id: "temp-3", tipo: "Sobre Master Lux", nombre: "Sobre Master", precio: 500 }
        ];
        
        const sobresConImagen = mockSobres.map(sobre => ({
          ...sobre,
          imagen: sobre.tipo === "Sobre Energia Lux" ? SobreComun :
                 sobre.tipo === "Sobre Elite Lux" ? SobreRaro :
                 sobre.tipo === "Sobre Master Lux" ? SobreEpico : null,
        }));
        
        setSobres(sobresConImagen);
        setCenterCard("temp-1");
      }
    };

    fetchSobres();
  }, []);

  const handleCardClick = (id) => {
    if (id === centerCard || transitioning) return;
    
    setTransitioning(true);
    setCenterCard(id);
    
    // Desactivar el estado de transición después de la animación
    setTimeout(() => setTransitioning(false), 500);
  };

  const handleOpenClick = () => {
    if (!centerCard) {
      console.warn("No hay sobre seleccionado.");
      return;
    }
    setShowAlert(true);
  };

  const handleTransitionToOpening = async (openedCards, selectedCard) => {
    // Trigger exit animation
    setExitAnimation(true);
    
    // Wait for exit animation to complete
    setTimeout(() => {
      if (onOpenSobre) {
        // Use callback if provided
        onOpenSobre({ openedCards, selectedCard });
      } else {
        // Otherwise use direct navigation
        navigate("/opening", { 
          state: { 
            openedCards, 
            selectedCard,
            fromCardsMenu: true // Flag to trigger entrance animation
          } 
        });
      }
    }, 800);
  };

  const handleConfirm = async () => {
    setShowAlert(false);
  
    if (!centerCard) {
      console.error("Error: No hay sobre seleccionado.");
      return;
    }
  
    const sobre = sobres.find((s) => s.id === centerCard);
  
    if (!sobre) {
      console.error("Error: No se encontró el sobre seleccionado.");
      return;
    }
  
    try {
      const openedCards = await abrirSobre(sobre.tipo);
      console.log(openedCards);
      
      // Use the transition function instead of direct navigation
      handleTransitionToOpening(openedCards, sobre);
    } catch (error) {
      console.error("Error al abrir el sobre:", error);
    }
  };  

  const handleCancel = () => {
    setShowAlert(false);
  };

  const currentCard = sobres.find((s) => s.id === centerCard) || null;

  // Card motion variants
  const cardVariants = {
    normal: (isCenter) => ({
      scale: isCenter ? 1.25 : 0.85,
      opacity: isCenter ? 1 : 0.75,
      y: isCenter ? -10 : 0,
      boxShadow: isCenter ? "0px 10px 15px rgba(131, 2, 206, 0.4)" : "none",
      transition: { type: "spring", stiffness: 300 }
    }),
    hover: (isCenter) => ({
      scale: isCenter ? 1.3 : 0.9,
      y: isCenter ? -15 : -5,
      transition: { type: "spring", stiffness: 400 }
    }),
    tap: (isCenter) => ({
      scale: isCenter ? 1.35 : 0.85,
      transition: { type: "spring", stiffness: 300 }
    }),
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  // Container exit animation
  const containerVariants = {
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 1.5,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  return (
    <motion.div 
      className="flex flex-col justify-center items-center h-full gap-4 px-2"
      variants={containerVariants}
      initial="visible"
      animate={exitAnimation ? "exit" : "visible"}
    >
      {/* Contenedor de cartas con altura fija y reducida */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full">
        <AnimatePresence>
          {sobres.map((sobre) => {
            const isCenter = sobre.id === centerCard;
            
            return (
              <motion.div
                key={sobre.id}
                custom={isCenter}
                variants={cardVariants}
                initial="normal"
                animate="normal"
                whileHover="hover"
                whileTap="tap"
                exit="exit"
                className="relative"
              >
                <motion.img
                  src={sobre.imagen}
                  alt={sobre.tipo}
                  className={`w-20 h-32 sm:w-24 sm:h-36 md:w-28 md:h-40 lg:w-32 lg:h-48 cursor-pointer rounded-lg shadow-lg`}
                  onClick={() => handleCardClick(sobre.id)}
                />
                {isCenter && (
                  <motion.div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-purple-500 opacity-50"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1], opacity: [0, 0.7, 0.5] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {currentCard && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-2 text-center text-sm font-medium text-white"
        >
          {currentCard.tipo}
        </motion.div>
      )}

      <motion.button
        className={`mt-4 px-6 py-2 text-white text-base rounded-lg shadow-lg bg-gradient-to-r from-[#8302CE] to-[#490174] hover:opacity-90 transition ${
          !centerCard || transitioning ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleOpenClick}
        disabled={!centerCard || transitioning}
        whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(131, 2, 206, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {t("cardsMenu.openButton")}
      </motion.button>


      {/* Modal de confirmación */}
      <AnimatePresence>
        {showAlert && currentCard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#1C1A1A] p-4 sm:p-6 rounded-lg shadow-lg text-center text-white w-full max-w-md"
            >
              <p className="text-black dark:text-white mb-4 text-base sm:text-lg">
                {t("cardsMenu.confirmTitle", {
                  name: currentCard.nombre,
                  price: currentCard.precio,
                })}
              </p>

              <div className="flex justify-center gap-4">
                <motion.button
                  className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-white bg-[#44FE23] hover:opacity-90"
                  onClick={handleConfirm}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("cardsMenu.yes")}
                </motion.button>

                <motion.button
                  className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-white bg-[#F62C2C] hover:opacity-90"
                  onClick={handleCancel}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("cardsMenu.no")}
                </motion.button>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}