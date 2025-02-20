import { useLocation, useNavigate } from "react-router-dom";
import finalCard from "../assets/finalCard.png"; // Imagen de la carta final
import background from '../assets/background.png';

const GridOpenedCards = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Recibimos las cartas desde el estado
  const { openedCards } = location.state;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center">
        <h1 className="text-3xl font-bold mb-6 text-white">Resultado</h1>

        {/* Grid de cartas con 5 columnas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          {openedCards.map((card, index) => (
            <div
              key={index}
              className="relative w-32 h-48 flex justify-center items-center bg-black bg-opacity-50 rounded-lg shadow-lg"
            >
              <img
                src={card || finalCard} // Por si acaso
                alt={`Carta ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Botón para continuar */}
        <button
          className="px-6 py-2 bg-gradient-to-r from-[#8302CE] to-[#490174] text-white rounded-lg shadow-lg hover:opacity-90 transition"
          onClick={() => navigate("/home")}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default GridOpenedCards;
