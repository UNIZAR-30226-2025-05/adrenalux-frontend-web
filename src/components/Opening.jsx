import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import SobreEpico from "../assets/SobreEpico.png";
import SobreComun from "../assets/SobreComun.png";
import SobreRaro from "../assets/SobreRaro.png";
import background from "../assets/background.png";
import Carta from './layout/game/CartaGrande';
import { getToken } from "../services/api/authApi";

const Opening = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = getToken();
  const { openedCards, selectedCard } = location.state;

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isOpening, setIsOpening] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [envelopeAnimation, setEnvelopeAnimation] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    // Manejar la secuencia de animación para cartas especiales
    if (["Megaluxury", "Luxury XI"].includes(openedCards[currentCardIndex]?.tipo_carta)) {
      if (animationStep < 3) {
        const timer = setTimeout(() => setAnimationStep(prev => prev + 1), 1200);
        return () => clearTimeout(timer);
      } else {
        setTimeout(() => setShowContinue(true), 800);
      }
    } else {
      // Para cartas normales, mostrar el botón de continuar después de un breve retraso
      setTimeout(() => setShowContinue(true), 800);
    }
  }, [animationStep, currentCardIndex, openedCards, token, navigate]);

  const handleNextCard = () => {
    if (currentCardIndex < openedCards.length - 1) {
      // Animación de transición entre cartas
      setShowContinue(false);
      setCurrentCardIndex(prevIndex => prevIndex + 1);
      setAnimationStep(0);
    }
  };

  const getEnvelopeImage = () => {
    switch (selectedCard.tipo) {
      case "Sobre Master Lux":
        return SobreEpico;
      case "Sobre Energia Lux":
        return SobreComun;
      case "Sobre Elite Lux":
        return SobreRaro;
      default:
        return SobreComun;
    }
  };

  const handleOpenEnvelope = () => {
    setEnvelopeAnimation(true);
    
    // Iniciar la secuencia de apertura
    setTimeout(() => {
      setIsOpening(false);
    }, 600);
  };

  const handleContinue = () => {
    navigate("/grid", { state: { openedCards } });
  };

  const currentCard = openedCards[currentCardIndex];
  const isSpecialType = ["Megaluxury", "Luxury XI"].includes(currentCard?.tipo_carta);

  // Variantes de animación para diferentes elementos
  const envelopeVariants = {
    initial: { scale: 0.8, opacity: 0, y: 50 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 1.2, opacity: 0, y: -100 }
  };

  const cardRevealVariants = {
    initial: { scale: 0.1, opacity: 0, rotateY: 180 },
    animate: { scale: 1, opacity: 1, rotateY: 0 },
    exit: { scale: 0.8, opacity: 0, x: -300 }
  };

  const specialInfoVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <AnimatePresence mode="wait">
        {isOpening ? (
          <motion.div
            key="envelope"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={envelopeVariants}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative"
          >
            <motion.img
              src={getEnvelopeImage()}
              alt="Sobre"
              className="w-80 h-140 rounded-lg shadow-2xl cursor-pointer"
              onClick={handleOpenEnvelope}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              animate={envelopeAnimation ? { 
                scale: [1, 1.1, 1.1, 0],
                rotateY: [0, 0, 180, 180],
                opacity: [1, 1, 0.8, 0]
              } : {}}
              transition={envelopeAnimation ? { 
                duration: 0.8,
                times: [0, 0.3, 0.6, 1] 
              } : {}}
            />
            {!envelopeAnimation && (
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-lg font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                Toca para abrir
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              {isSpecialType && animationStep < 2 ? (
                <motion.div
                  key={`step-${animationStep}`}
                  variants={specialInfoVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                  className="text-white text-2xl font-bold p-5 bg-black bg-opacity-50 rounded-lg mb-4"
                >
                  {animationStep === 0 && (
                    <motion.div 
                      className="text-center"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentCard.posicion}
                    </motion.div>
                  )}
                  {animationStep === 1 && (
                    <motion.div 
                      className="text-center"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentCard.pais}
                    </motion.div>
                  )}
                </motion.div>
              ) : animationStep === 2 ? (
                <motion.div
                  key="escudo"
                  className="flex justify-center items-center bg-black bg-opacity-50 p-6 rounded-full"
                  variants={specialInfoVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                >
                  <motion.img
                    src={currentCard.escudo}
                    alt="Escudo"
                    className="w-28 h-28 object-contain"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={`card-${currentCardIndex}`}
                  className="cursor-pointer"
                  onClick={handleNextCard}
                  variants={cardRevealVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ 
                    duration: 0.6, 
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Carta jugador={currentCard} />
                  </motion.div>
                  
                  {currentCardIndex < openedCards.length - 1 && (
                    <motion.div 
                      className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ delay: 1.5, duration: 0.5 }}
                    >
                      <div className="text-white text-lg font-bold mt-4 bg-black bg-opacity-70 px-4 py-2 rounded-lg">
                        Toca para ver la siguiente carta
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {showContinue && currentCardIndex === openedCards.length - 1 && (
              <motion.button
                className="mt-6 px-8 py-3 text-white rounded-lg shadow-xl bg-gradient-to-r from-[#8302CE] to-[#490174] hover:opacity-90 font-bold text-lg"
                onClick={handleContinue}
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileHover="whileHover"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                Ver todas las cartas
              </motion.button>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Opening;