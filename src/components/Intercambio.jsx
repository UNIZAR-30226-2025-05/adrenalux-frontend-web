import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/layout/game/BackButton";
import CartaMediana from "../components/layout/game/CartaMediana";
import CartaGrande from "../components/layout/game/CartaGrande";
import background from "../assets/background.png";
import Card from "../assets/cartaNormal.png";
import { getCollection } from "../services/api/collectionApi";
import { socketService } from "../services/websocket/socketService";
import { getProfile } from "../services/api/profileApi";

const Intercambio = () => {
  const { exchangeId } = useParams();
  const [showAlert, setShowAlert] = useState(false);
  const [allCards, setAllCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [confirmedCard, setConfirmedCard] = useState(null);
  const [confirmedExchange, setConfirmedExchange] = useState(null);
  const [opponentConfirmedExchange, setOpponentConfirmedExchange] = useState(null);
  const [opponentCard, setOpponentCard] = useState(null);
  const [opponentId, setOpponentId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [opponentUsername, setOpponentUsername] = useState("Oponente");

  // Cargar la colección de cartas y el perfil del usuario al montar el componente
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const data = await getCollection();
        console.log(data);

        // Filtrar las cartas disponibles
        const availableCards = data.filter(card => card.disponible === true);
        setAllCards(availableCards); // Guardar solo las cartas disponibles
        setCards(availableCards); // Mostrar solo las cartas disponibles
      } catch (error) {
        console.error("Error al cargar la colección:", error);
      }
    };

    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setCurrentUserId(profile.data.id);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    };

    fetchCollection();
    fetchProfile();
  }, [exchangeId]);

  // Registrar el callback para recibir la carta seleccionada por el oponente
  useEffect(() => {
    const handleOpponentCardSelected = ({ card, userId }) => {
      if (userId !== String(currentUserId)) {
        setOpponentId(userId);
        setOpponentCard(card);
        setOpponentUsername("Oponente");
      }
    };

    const handleConfirmNotification = ({ confirmations }) => {
      setOpponentConfirmedExchange(confirmations[opponentId]);
    };

    socketService.setOnOpponentCardSelected(handleOpponentCardSelected);
    socketService.setOnConfirmationUpdate(handleConfirmNotification);

    return () => {
      socketService.setOnOpponentCardSelected(null);
      socketService.setOnConfirmationUpdate(null);
    };
  }, [currentUserId, opponentId]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchLower = search.toLowerCase();
    const filteredCards = allCards.filter((card) =>
      card.nombre.toLowerCase().includes(searchLower)
    );
    setCards(filteredCards);
  };

  const handleBackClick = () => setShowAlert(true);

  const handleConfirmExit = () => {
    setShowAlert(false);
    socketService.cancelExchange(exchangeId);
    window.location.href = "/home";
  };

  const handleSelectCard = () => {
    if (selectedCard) {
      if (!socketService.socket || !socketService.socket.connected) {
        console.error("Socket no conectado.");
        return;
      }
      const cardId = `${selectedCard.id}`;
      setConfirmedCard(selectedCard);
      setConfirmedExchange(false);
      socketService.selectCard(exchangeId, cardId);
      setSelectedCard(null);
    }
  };

  const handleConfirmCard = () => {
    if (confirmedCard) {
      setConfirmedExchange(true);
      socketService.confirmExchange(exchangeId);
    }
  };

  const handleCancelCard = () => {
    if (confirmedCard) {
      setConfirmedExchange(false);
      socketService.cancelConfirmation(exchangeId);
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center overflow-y-auto p-10"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute top-5 left-5">
        <BackButton onClick={handleBackClick} />
      </div>

      {/* Contenedor de dos columnas */}
      <div className="flex w-full max-w-6xl space-x-6">
        {/* Columna izquierda */}
        <div className="w-[45%] flex flex-col space-y-6">
          {/* Caja de intercambio */}
          <div className="w-full h-[50vh] bg-black/70 rounded-2xl flex flex-col items-center justify-center gap-6 p-6">
            {/* Cartas de intercambio */}
            <div className="flex items-center gap-[60px]">
              <div className="flex flex-col items-center">
                {confirmedCard ? (
                  <CartaMediana jugador={confirmedCard} className="w-40 h-[225px]" />
                ) : (
                  <img
                    src={Card}
                    alt="Carta izquierda"
                    className="w-40 h-[225px] shadow-lg opacity-50"
                  />
                )}
                <p className={`mt-2 ${confirmedExchange ? "text-green-500" : "text-white"}`}>
                  Tú
                </p>
              </div>
              <div className="flex flex-col items-center">
                {opponentCard ? (
                  <CartaMediana jugador={opponentCard} />
                ) : (
                  <img
                    src={Card}
                    alt="Carta derecha"
                    className="w-40 h-[220px] shadow-lg opacity-50"
                  />
                )}
                <p className={`mt-2 ${opponentConfirmedExchange ? "text-green-500" : "text-white"}`}>
                  {opponentUsername}
                </p>
              </div>
            </div>

            {/* Botones de Confirmar y Cancelar */}
            <div className="flex gap-4">
              <button
                onClick={handleConfirmCard}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={handleCancelCard}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Buscador */}
          <div className="w-full bg-black/70 rounded-2xl p-6 flex flex-col items-center">
            <p className="text-white text-lg font-semibold mb-4">
              Buscar jugadores
            </p>
            <form onSubmit={handleSearch} className="w-full flex space-x-2">
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Buscar
              </button>
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
                onClick={() => setSelectedCard(card)}
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
            <p className="text-lg font-semibold">
              ¿Deseas abandonar el intercambio?
            </p>
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

      {/* Modal de carta seleccionada */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-black/70 rounded-2xl p-6 shadow-lg">
            <CartaGrande jugador={selectedCard} />
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={handleSelectCard}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Intercambiar
              </button>
              <button
                onClick={() => setSelectedCard(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Intercambio;