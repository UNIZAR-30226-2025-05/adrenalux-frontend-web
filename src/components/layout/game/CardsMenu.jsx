import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { abrirSobre, sobresDisponibles } from "../../../services/api/cardApi";
import SobreRaro from "../../../assets/SobreRaro.png";
import SobreEpico from "../../../assets/SobreEpico.png";
import SobreComun from "../../../assets/SobreComun.png";

export default function CardsMenu() {
  const [sobres, setSobres] = useState([]);
  const [centerCard, setCenterCard] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSobres = async () => {
      try {
        const sobresData = await sobresDisponibles();

        if (!sobresData || sobresData.length === 0) {
          console.warn("No hay sobres disponibles.");
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
        setCenterCard(sobreComun ? sobreComun.id : null);
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
    if (!centerCard) {
      console.warn("No hay sobre seleccionado.");
      return;
    }
    setShowAlert(true);
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
      navigate("/opening", { state: { openedCards, selectedCard: sobre } });  // Pasa directamente 'sobre'
    } catch (error) {
      console.error("Error al abrir el sobre:", error);
    }
  };  

  const handleCancel = () => {
    setShowAlert(false);
  };

  const getCardStyle = (id) => {
    return id === centerCard 
      ? "z-10 scale-110 sm:scale-115 md:scale-120 lg:scale-125" 
      : "z-0 scale-75 sm:scale-80 md:scale-85 lg:scale-90 opacity-80";
  };

  const currentCard = sobres.find((s) => s.id === centerCard) || null;

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4 px-2">
      <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 w-full">
        <AnimatePresence>
          {sobres.map((sobre) => (
            <motion.img
              key={sobre.id}
              src={sobre.imagen}
              alt={sobre.tipo}
              className={`w-16 h-24 xs:w-20 xs:h-28 sm:w-24 sm:h-36 md:w-32 md:h-48 lg:w-40 lg:h-60 cursor-pointer rounded-lg shadow-lg ${getCardStyle(sobre.id)}`}
              initial={{ scale: sobre.id === centerCard ? 1.1 : 0.75 }}
              animate={{ scale: sobre.id === centerCard ? 1.1 : 0.75 }}
              whileTap={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleCardClick(sobre.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <button
        className={`mt-4 px-4 sm:px-6 py-2 text-white text-sm sm:text-base rounded-lg shadow-lg bg-gradient-to-r from-[#8302CE] to-[#490174] hover:opacity-90 transition ${
          !centerCard ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleOpenClick}
        disabled={!centerCard}
      >
        Abrir
      </button>

      {showAlert && currentCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 px-4">
          <div className="bg-white dark:bg-[#1C1A1A] p-4 sm:p-6 rounded-lg shadow-lg text-center text-white w-full max-w-md">
            <p className="text-black dark:text-white mb-4 text-base sm:text-lg">
              ¿Quieres comprar el sobre <strong>{currentCard.nombre}</strong> por{" "}
              <strong>{currentCard.precio}</strong> monedas?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-white bg-[#44FE23] hover:opacity-90"
                onClick={handleConfirm}
              >
                Sí
              </button>
              <button
                className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-white bg-[#F62C2C] hover:opacity-90"
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