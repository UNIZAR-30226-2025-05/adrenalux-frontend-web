import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import SobreEpico from "../assets/SobreEpico.png";
import SobreComun from "../assets/SobreComun.png";
import SobreRaro from "../assets/SobreRaro.png";
import background from "../assets/background.png";
import finalCard from "../assets/finalCard.png";

const Opening = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openedCards, selectedCard } = location.state;

  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Mantener el índice de la carta actual
  const [showContinueButton, setShowContinueButton] = useState(false); // Botón de continuar
  const [isOpening, setIsOpening] = useState(true); // Estado para abrir el sobre

  // Función para manejar el avance de las cartas
  const handleNextCard = () => {
    if (currentCardIndex < openedCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1); // Avanzar al siguiente índice
    } else {
      setShowContinueButton(true); // Si todas las cartas se han mostrado, mostrar el botón de continuar
    }
  };

  // Función para mostrar la imagen del sobre según el tipo
  const getEnvelopeImage = () => {
    switch (selectedCard.name) {
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

  // Función para continuar a la siguiente pantalla
  const handleContinue = () => {
    navigate("/grid", { state: { openedCards } });
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <AnimatePresence>
        {/* Animación del sobre al principio */}
        {isOpening && (
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
              onClick={() => setIsOpening(false)} // Cambiar a la animación de cartas
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}

        {/* Animación de las cartas desde el centro hacia su tamaño normal */}
        {!isOpening && (
          <motion.div
            key={currentCardIndex}
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.1, opacity: 0 }}
            transition={{
              duration: 0.4, // Duración más rápida
              ease: "easeOut",
              delay: currentCardIndex * 0.15, // Retraso entre cartas
            }}
          >
            <motion.img
              src={openedCards[currentCardIndex]?.foto || finalCard} // Mostrar la carta
              alt={`Carta ${currentCardIndex + 1}`}
              className="w-80 h-140 rounded-lg shadow-lg cursor-pointer"
              onClick={handleNextCard} // Avanzar a la siguiente carta
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón de continuar al final */}
      {showContinueButton && (
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
  );
};

export default Opening;
