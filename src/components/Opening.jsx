import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import SobreEpico from "../assets/SobreEpico.png";
import SobreComun from "../assets/SobreComun.png";
import SobreRaro from "../assets/SobreRaro.png";
import background from "../assets/background.png";
import Carta from './layout/game/Carta';


const Opening = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openedCards, selectedCard } = location.state;

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isOpening, setIsOpening] = useState(true);

  const handleNextCard = () => {
    if (currentCardIndex < openedCards.length - 1) {
      setCurrentCardIndex(prevIndex => prevIndex + 1);
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
        return null;
    }
  };

  const handleContinue = () => {
    navigate("/grid", { state: { openedCards } });
  };

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
            <motion.div
              key={currentCardIndex}
              className="cursor-pointer"
              onClick={handleNextCard}
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.1, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
            >
              <Carta jugador={openedCards[currentCardIndex]} />
            </motion.div>

            {currentCardIndex === openedCards.length - 1 && (
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
