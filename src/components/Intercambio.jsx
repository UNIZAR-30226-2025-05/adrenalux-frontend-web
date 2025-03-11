import { useState, useEffect } from "react";
import BackButton from "../components/layout/game/BackButton";
import CartaMediana from "../components/layout/game/CartaMediana";
import CartaGrande from "../components/layout/game/CartaGrande"; // Importa el componente CartaGrande
import background from "../assets/background.png";
import Card from "../assets/cartaNormal.png";
import { getCollection, filterCards } from "../services/api/collectionApi";

const Intercambio = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState(null); // Estado para la carta seleccionada

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const data = await getCollection();
        setCards(data);
      } catch (error) {
        console.error("Error al cargar la colección:", error);
      }
    };
    fetchCollection();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("hola");
    try {
      const data = await filterCards({ nombre: search });
      console.log(data);
      setCards(data);
      console.log(data);
    } catch (error) {
      console.error("Error al filtrar las cartas:", error);
    }
  };

  const handleBackClick = () => {
    setShowAlert(true);
  };

  const handleConfirmExit = () => {
    setShowAlert(false);
    window.location.href = "/home";
  };

  // Función para manejar la selección de una carta
  const handleCardSelect = (card) => {
    setSelectedCard(card); // Establece la carta seleccionada
  };

  // Función para cerrar la alerta de la carta seleccionada
  const closeCardAlert = () => {
    setSelectedCard(null); // Limpia la carta seleccionada
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center overflow-y-auto p-10" style={{ backgroundImage: `url(${background})` }}>
      <div className="absolute top-5 left-5">
        <BackButton onClick={handleBackClick} />
      </div>

      {/* Contenedor de dos columnas */}
      <div className="flex w-full max-w-6xl space-x-6">
        
        {/* Columna izquierda */}
        <div className="w-[40%] flex flex-col space-y-6">
          {/* Caja de intercambio */}
          <div className="w-full h-[40vh] bg-black/70 rounded-2xl flex items-center justify-between p-6">
            <img src={Card} alt="Carta izquierda" className="w-[30%] max-w-[150px] shadow-lg" />
            <img src={Card} alt="Carta derecha" className="w-[30%] max-w-[150px] shadow-lg" />
          </div>

          {/* Buscador */}
          <div className="w-full bg-black/70 rounded-2xl p-6 flex flex-col items-center">
            <p className="text-white text-lg font-semibold mb-4">Buscar jugadores</p>
            <form onSubmit={handleSearch} className="w-full flex space-x-2">
              <input 
                type="text" 
                placeholder="Buscar..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Buscar</button>
            </form>
          </div>
        </div>

        {/* Columna derecha (Colección de cartas con scroll) */}
        <div className="w-[80%] bg-black/70 rounded-2xl p-4 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cards.map((card, index) => (
              <div 
                key={index} 
                className="flex justify-center items-center cursor-pointer" 
                onClick={() => handleCardSelect(card)} // Selecciona la carta al hacer clic
              >
                <CartaMediana jugador={card} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerta de confirmación de salida */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-[#1C1A1A] p-6 rounded-lg shadow-lg text-center text-white">
            <p className="text-lg font-semibold">¿Deseas abandonar el intercambio?</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={handleConfirmExit}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sí
              </button>
              <button
                onClick={() => setShowAlert(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de carta seleccionada */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-black/70 rounded-2xl p-6 shadow-lg">
            <CartaGrande jugador={selectedCard} /> {/* Muestra la carta en versión grande */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={closeCardAlert}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Intercambio;