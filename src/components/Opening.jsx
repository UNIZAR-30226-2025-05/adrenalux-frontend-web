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

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    if (["Megaluxury", "Luxury XI"].includes(openedCards[currentCardIndex]?.tipo_carta)) {
      if (animationStep < 3) {
        const timer = setTimeout(() => setAnimationStep(prev => prev + 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setTimeout(() => setShowContinue(true), 1000);
      }
    } else {
      setShowContinue(true);
    }
  }, [animationStep, currentCardIndex, openedCards, token, navigate]);

  const handleNextCard = () => {
    if (currentCardIndex < openedCards.length - 1) {
      setCurrentCardIndex(prevIndex => prevIndex + 1);
      setAnimationStep(0);
      setShowContinue(false);
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

  const handleContinue = () => {
    navigate("/grid", { state: { openedCards } });
  };

  const currentCard = openedCards[currentCardIndex];
  const isSpecialType = ["Megaluxury", "Luxury XI"].includes(currentCard.tipo_carta);

  return (
    <div
      className="fixed inset-0 flex flex-col justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <AnimatePresence>
        {isOpening ? (
          <motion.div
            key="envelope"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <motion.img
              src={getEnvelopeImage()}
              alt="Sobre"
              className="w-80 h-140 rounded-lg shadow-lg cursor-pointer"
              onClick={() => setIsOpening(false)}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center">
            {isSpecialType && animationStep < 2 ? (
              <motion.div
                key={`step-${animationStep}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="text-white text-xl font-bold p-4 bg-black bg-opacity-50 rounded-lg"
              >
                {animationStep === 0 && <div className="text-center">{currentCard.posicion}</div>}
                {animationStep === 1 && <div className="text-center">{currentCard.pais}</div>}
              </motion.div>
            ) : animationStep === 2 ? (
              <motion.div
                className="flex justify-center items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={currentCard.escudo}
                  alt="Escudo"
                  className="w-24 h-24 object-contain"
                />
              </motion.div>
            ) : (
              <motion.div
                key={currentCardIndex}
                className="cursor-pointer"
                onClick={handleNextCard}
                initial={{ scale: 0.1, opacity: 0, x: "50%", y: "50%" }}  // Empieza desde el centro
                animate={{ scale: 1, opacity: 1, x: 0, y: 0 }} // Termina en su lugar normal
                exit={{ scale: 0.1, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
              >
                <Carta jugador={currentCard} />
              </motion.div>
            )}
            {showContinue && currentCardIndex === openedCards.length - 1 && (
              <motion.button
                className="mt-4 px-6 py-2 text-white rounded-lg shadow-lg bg-gradient-to-r from-[#8302CE] to-[#490174] hover:opacity-90 transition"
                onClick={handleContinue}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Continuar
              </motion.button>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Opening;
