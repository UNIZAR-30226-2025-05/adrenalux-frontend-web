import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import SobreEpico from "../../../assets/SobreEpico.png";
import SobreComun from "../../../assets/SobreComun.png";
import SobreRaro from "../../../assets/SobreRaro.png";
import { motion, AnimatePresence } from "framer-motion";

const cards = [
  { id: 1, img: SobreEpico, name: "Epico", price: 250 },
  { id: 2, img: SobreComun, name: "Comun", price: 50 },
  { id: 3, img: SobreRaro, name: "Raro", price: 150 },
];

export default function CardsMenu() {
  const [centerCard, setCenterCard] = useState(2);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null); // Corregido: Estado para almacenar la carta seleccionada
  const navigate = useNavigate(); // Hook de navegación

  const handleCardClick = (id) => {
    setCenterCard(id);
  };

  const handleOpenClick = () => {
    setShowAlert(true);
  };

  const handleConfirm = () => {
    setShowAlert(false);
    const card = cards.find((card) => card.id === centerCard);
    setSelectedCard(card); // Guardar la carta seleccionada en el estado
    navigate("/opening", { state: { card: card } }); // Enviar el estado a la nueva página
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const getCardStyle = (id) => {
    return id === centerCard ? "z-10 scale-125" : "z-0 scale-90 opacity-80";
  };

  const currentCard = cards.find((card) => card.id === centerCard);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <div className="flex justify-center items-center gap-4">
        <AnimatePresence>
          {cards.map((card) => (
            <motion.img
              key={card.id}
              src={card.img}
              alt={card.name}
              className={`w-40 h-60 cursor-pointer rounded-lg shadow-lg ${getCardStyle(card.id)}`}
              initial={{ scale: card.id === centerCard ? 1.25 : 0.9, x: 0 }}
              animate={{ scale: card.id === centerCard ? 1.25 : 0.9, x: 0 }}
              whileTap={{ scale: 1.3 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </AnimatePresence>
      </div>
      <button
        className="mt-4 px-6 py-2 text-white rounded-lg shadow-lg bg-gradient-to-r from-[#8302CE] to-[#490174] hover:opacity-90 transition"
        onClick={handleOpenClick}
      >
        Abrir
      </button>

      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-[#1C1A1A] p-6 rounded-lg shadow-lg text-center text-white">
            <p className="mb-4 text-lg">
              ¿Quieres comprar el sobre <strong>{currentCard.name}</strong> por <strong>{currentCard.price}</strong> monedas?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#44FE23] hover:opacity-90"
                onClick={handleConfirm}
              >
                Sí
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#F62C2C] hover:opacity-90"
                onClick={handleCancel}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
