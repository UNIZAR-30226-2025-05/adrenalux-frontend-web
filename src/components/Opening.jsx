import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import SobreEpico from "../assets/SobreEpico.png";
import SobreComun from "../assets/SobreComun.png";
import SobreRaro from "../assets/SobreRaro.png";
import background from "../assets/background.png";
import finalCard from "../assets/finalCard.png"; // Imagen de la carta final

const Opening = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { card } = location.state;

  // Definir la cantidad de cartas según el tipo de sobre
  const cardCount = card.name === "Epico" ? 10 : card.name === "Raro" ? 7 : 5;

  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [isOpening, setIsOpening] = useState(true); // Estado para saber si se está abriendo el sobre

  // Generar las cartas por abrir
  useEffect(() => {
    const newCards = Array(cardCount).fill(finalCard); // Usamos la carta final para todas
    setCards(newCards);
  }, [cardCount]);

  // Función para manejar el avance de las cartas
  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setShowContinueButton(true);
    }
  };

  // Función para continuar después de la última carta
  const handleContinue = () => {
    navigate("/home"); // Redirigir a la página de inicio
  };

  // Función para mostrar la imagen del sobre según el tipo
  const getEnvelopeImage = () => {
    switch (card.name) {
      case "Epico":
        return SobreEpico;
      case "Comun":
        return SobreComun;
      case "Raro":
        return SobreRaro;
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <AnimatePresence>
        {/* Animación de la carta del sobre al principio */}
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
              src={cards[currentCardIndex]}
              alt={`Carta ${currentCardIndex + 1}`}
              className="w-80 h-140 rounded-lg shadow-lg cursor-pointer"
              onClick={handleNextCard}
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
