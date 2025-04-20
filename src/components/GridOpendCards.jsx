import { useLocation, useNavigate } from "react-router-dom";
import background from '../assets/background.png';
import Carta from './layout/game/CartaMediana';

const GridOpenedCards = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { openedCards } = location.state;

  // Dynamic sizing based on viewport and device
  const getCardSize = () => {
    return {
      width: "clamp(5rem, 8vw, 9rem)",
      height: "clamp(7rem, 10vw, 11rem)"
    };
  };

  const emptySize = getCardSize();

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center p-4" 
         style={{ backgroundImage: `url(${background})` }}>
      <div className="bg-black bg-opacity-50 p-3 sm:p-4 md:p-6 rounded-lg text-center w-full max-w-4xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 text-white">Resultado</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 mx-auto">
          {openedCards.map((card, index) => (
            <div
              key={index}
              className="relative flex justify-center items-center bg-black bg-opacity-50 rounded-lg shadow-lg mx-auto"
            >
              <Carta 
                jugador={card}
                width={emptySize.width}
                height={emptySize.height}
              />
            </div>
          ))}
        </div>
        
        <button
          className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-[#8302CE] to-[#490174] text-white text-sm sm:text-base rounded-lg shadow-lg hover:opacity-90 transition"
          onClick={() => navigate("/home")}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default GridOpenedCards;