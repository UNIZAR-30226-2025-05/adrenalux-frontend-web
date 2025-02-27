import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { abrirSobre, sobresDisponibles } from '../../../services/api/cardApi';

export default function CardsMenu() {
  const [sobres, setSobres] = useState([]);
  const [centerCard, setCenterCard] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSobres = async () => {
      try {
        const sobresData = await sobresDisponibles();
        setSobres(sobresData);
        if (sobresData.length > 0) setCenterCard(sobresData[0].id);
      } catch (error) {
        console.error("Error obteniendo sobres:", error);
      }
    };

    fetchSobres();
  }, []);

  const handleCardClick = (id) => {
    setCenterCard(id);
  };

  const handleOpenClick = () => {
    setShowAlert(true);
  };

  const handleConfirm = async () => {
    setShowAlert(false);
    const sobre = sobres.find((s) => s.id === centerCard);
    setSelectedCard(sobre);

    try {
      const openedCards = await abrirSobre(sobre.tipo);
      navigate("/opening", { state: { openedCards, selectedCard: sobre } });
    } catch (error) {
      console.error("Error al abrir el sobre:", error);
    }
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const getCardStyle = (id) => {
    return id === centerCard ? "z-10 scale-125" : "z-0 scale-90 opacity-80";
  };

  const currentCard = sobres.find((s) => s.id === centerCard);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <div className="flex justify-center items-center gap-4">
        <AnimatePresence>
          {sobres.map((sobre) => (
            <motion.img
              key={sobre.id}
              src={sobre.img} // Asegúrate de que el backend envíe la URL de la imagen
              alt={sobre.nombre}
              className={`w-40 h-60 cursor-pointer rounded-lg shadow-lg ${getCardStyle(sobre.id)}`}
              initial={{ scale: sobre.id === centerCard ? 1.25 : 0.9, x: 0 }}
              animate={{ scale: sobre.id === centerCard ? 1.25 : 0.9, x: 0 }}
              whileTap={{ scale: 1.3 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleCardClick(sobre.id)}
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

      {showAlert && currentCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-[#1C1A1A] p-6 rounded-lg shadow-lg text-center text-white">
            <p className="mb-4 text-lg">
              ¿Quieres comprar el sobre <strong>{currentCard.nombre}</strong> por <strong>{currentCard.precio}</strong> monedas?
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
