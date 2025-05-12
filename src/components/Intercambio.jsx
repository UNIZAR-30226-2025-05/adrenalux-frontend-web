import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import BackButton from "../components/layout/game/BackButton";
import CartaMediana from "../components/layout/game/CartaMediana";
import CartaGrande from "../components/layout/game/CartaGrande";
import background from "../assets/background.png";
import Card from "../assets/cartaNormal.png";
import { getCollection } from "../services/api/collectionApi";
import { socketService } from "../services/websocket/socketService";
import { getProfile } from "../services/api/profileApi";
import { getToken } from '../services/api/authApi';
import { FiSearch, FiX, FiCheck, FiArrowRight } from "react-icons/fi";

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
  const [showExchangeAnimation, setShowExchangeAnimation] = useState(false);
  const [showReceivedCard, setShowReceivedCard] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const token = getToken();
  const navigate = useNavigate();
  const windowSize = useRef({ width: window.innerWidth, height: window.innerHeight });
  // Estado adicional para rastrear si el intercambio está completado por ambas partes
  const [exchangeCompleted, setExchangeCompleted] = useState(false);

  // Efecto para manejar la secuencia de animación del intercambio
  useEffect(() => {
    // Si ambos jugadores confirmaron y tenemos las cartas, mostrar la animación
    if (confirmedExchange && opponentConfirmedExchange && confirmedCard && opponentCard && !exchangeCompleted) {
      setExchangeCompleted(true);
      
      // Agregamos un console.log para confirmar que se inicia la secuencia
      console.log("Iniciando secuencia de animación de intercambio");
      
      // Aseguramos que todo esté limpio antes de iniciar la secuencia
      setShowExchangeAnimation(false);
      setShowReceivedCard(false);
      setShowConfetti(false);
      
      setTimeout(() => {
        console.log("Mostrando animación de intercambio");
        setShowExchangeAnimation(true);
        
        setTimeout(() => {
          console.log("Finalizando animación de intercambio, mostrando carta recibida");
          setShowExchangeAnimation(false);
          setShowReceivedCard(true);
          setShowConfetti(true);
          
          setTimeout(() => {
            console.log("Ocultando confeti");
            setShowConfetti(false);
          }, 6000);
        }, 2000);
      }, 1000);
    }
  }, [confirmedExchange, opponentConfirmedExchange, confirmedCard, opponentCard, exchangeCompleted]);

  // Cargar la colección de cartas y el perfil del usuario al montar el componente
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    
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
    }

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
  }, [exchangeId, token, navigate]);

  // Registrar el callback para recibir la carta seleccionada por el oponente
  useEffect(() => {
    const handleOpponentCardSelected = ({ card, userId }) => {
      if (userId !== String(currentUserId)) {
        console.log("Oponente seleccionó carta:", card);
        setOpponentId(userId);
        setOpponentCard(card);
        setOpponentUsername("Oponente");
      }
    };

    const handleConfirmNotification = ({ confirmations }) => {
      if (opponentId && confirmations[opponentId]) {
        console.log("Oponente confirmó intercambio");
        setOpponentConfirmedExchange(true);
        
        // Eliminamos la lógica duplicada de animación, ya se maneja en el useEffect específico
      }
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
      console.log("Seleccionando carta:", cardId);
      socketService.selectCard(exchangeId, cardId);
      setSelectedCard(null);
    }
  };

  const handleConfirmCard = () => {
    if (confirmedCard) {
      console.log("Confirmando intercambio");
      setConfirmedExchange(true);
      socketService.confirmExchange(exchangeId);
      
      // Eliminamos la lógica duplicada de animación, ya se maneja en el useEffect específico
    }
  };

  const handleCancelCard = () => {
    if (confirmedCard) {
      console.log("Cancelando confirmación");
      setConfirmedExchange(false);
      socketService.cancelConfirmation(exchangeId);
    }
  };

  const closeReceivedCardModal = () => {
    setShowReceivedCard(false);
    // Redirigir al home después de cerrar el modal
    window.location.href = "/home";
  };

  // Función para manejar cambios en el tamaño de la ventana (para el confeti)
  useEffect(() => {
    const handleResize = () => {
      windowSize.current = { width: window.innerWidth, height: window.innerHeight };
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center overflow-y-auto p-2 sm:p-4 md:p-6 lg:p-10"
      style={{ 
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute top-2 sm:top-5 left-2 sm:left-5 z-10">
        <BackButton onClick={handleBackClick} />
      </div>

      {/* Título principal */}
      <div className="absolute top-4 sm:top-6 left-0 right-0 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
          Intercambio de Cartas
        </h1>
      </div>

      {/* Contenedor de dos columnas - cambia a columna en móvil */}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl lg:space-x-6 space-y-4 lg:space-y-0 mt-16 sm:mt-20">
        {/* Columna izquierda */}
        <div className="w-full lg:w-[45%] flex flex-col space-y-5">
          {/* Caja de intercambio */}
          <div className="w-full bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl border border-gray-700/50 shadow-xl flex flex-col items-center justify-center gap-6 p-5 md:p-8">
            <h2 className="text-xl font-semibold text-green-400">Cartas en Intercambio</h2>
            
            {/* Cartas de intercambio */}
            <div className="flex items-center justify-center gap-6 md:gap-16 relative">
              {/* Carta izquierda */}
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {confirmedCard ? (
                  <motion.div 
                    className="w-28 sm:w-36 md:w-44 h-auto shadow-lg relative"
                    whileHover={{ scale: 1.05 }}
                    initial={{ rotateY: -180 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    <CartaMediana jugador={confirmedCard} />
                    
                    {confirmedExchange && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 bg-green-500 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white"
                      >
                        <FiCheck size={18} />
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-28 sm:w-36 md:w-44 h-auto shadow-lg relative"
                  >
                    <img
                      src={Card}
                      alt="Carta izquierda"
                      className="w-full h-auto shadow-lg opacity-50 rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white font-semibold text-lg">Tu carta</p>
                    </div>
                  </motion.div>
                )}
                <motion.p 
                  className={`mt-3 font-semibold ${confirmedExchange ? "text-green-400" : "text-white"}`}
                  animate={{ 
                    scale: confirmedExchange ? [1, 1.1, 1] : 1,
                    color: confirmedExchange ? ["#ffffff", "#4ade80", "#4ade80"] : "#ffffff"
                  }}
                  transition={{ duration: confirmedExchange ? 1 : 0, repeat: confirmedExchange ? 0 : 0 }}
                >
                  Tú
                </motion.p>
              </motion.div>

              {/* Flecha de intercambio */}
              <motion.div 
                className="hidden sm:flex items-center justify-center"
                animate={{ 
                  x: [0, 10, 0],
                  opacity: confirmedCard && opponentCard ? 1 : 0.3
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: confirmedCard && opponentCard ? Infinity : 0,
                  repeatType: "reverse" 
                }}
              >
                <FiArrowRight size={32} className="text-green-400" />
              </motion.div>

              {/* Carta derecha */}
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {opponentCard ? (
                  <motion.div 
                    className="w-28 sm:w-36 md:w-44 h-auto shadow-lg relative"
                    whileHover={{ scale: 1.05 }}
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    <CartaMediana jugador={opponentCard} />
                    
                    {opponentConfirmedExchange && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 bg-green-500 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white"
                      >
                        <FiCheck size={18} />
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-28 sm:w-36 md:w-44 h-auto shadow-lg relative"
                  >
                    <img
                      src={Card}
                      alt="Carta derecha"
                      className="w-full h-auto shadow-lg opacity-50 rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white font-semibold text-lg">Oponente</p>
                    </div>
                  </motion.div>
                )}
                <motion.p 
                  className={`mt-3 font-semibold ${opponentConfirmedExchange ? "text-green-400" : "text-white"}`}
                  animate={{ 
                    scale: opponentConfirmedExchange ? [1, 1.1, 1] : 1,
                    color: opponentConfirmedExchange ? ["#ffffff", "#4ade80", "#4ade80"] : "#ffffff" 
                  }}
                  transition={{ duration: opponentConfirmedExchange ? 1 : 0, repeat: opponentConfirmedExchange ? 0 : 0 }}
                >
                  {opponentUsername}
                </motion.p>
              </motion.div>
            </div>

            {/* Estado del intercambio */}
            {confirmedCard && opponentCard && (
              <motion.div 
                className="text-center text-sm sm:text-base text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {confirmedExchange && opponentConfirmedExchange ? (
                  <p className="text-green-400 font-semibold">¡Ambos jugadores han confirmado! Procesando intercambio...</p>
                ) : confirmedExchange ? (
                  <p>Esperando confirmación del oponente...</p>
                ) : opponentConfirmedExchange ? (
                  <p>El oponente está listo. ¡Confirma cuando estés preparado!</p>
                ) : (
                  <p>Ambos jugadores deben confirmar para realizar el intercambio</p>
                )}
              </motion.div>
            )}

            {/* Botones de Confirmar y Cancelar */}
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: confirmedCard ? 1 : 0.5, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={handleConfirmCard}
                disabled={!confirmedCard || confirmedExchange}
                whileHover={{ scale: confirmedCard && !confirmedExchange ? 1.05 : 1 }}
                whileTap={{ scale: confirmedCard && !confirmedExchange ? 0.95 : 1 }}
                className={`px-5 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                  confirmedCard && !confirmedExchange
                    ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg hover:from-green-700 hover:to-green-600" 
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FiCheck size={18} />
                Confirmar
              </motion.button>
              <motion.button
                onClick={handleCancelCard}
                disabled={!confirmedCard || !confirmedExchange}
                whileHover={{ scale: confirmedCard && confirmedExchange ? 1.05 : 1 }}
                whileTap={{ scale: confirmedCard && confirmedExchange ? 0.95 : 1 }}
                className={`px-5 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                  confirmedCard && confirmedExchange
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:from-red-700 hover:to-red-600" 
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FiX size={18} />
                Cancelar
              </motion.button>
            </motion.div>
          </div>

          {/* Buscador */}
          <motion.div 
            className="w-full bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl border border-gray-700/50 shadow-xl p-4 md:p-6 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white text-base sm:text-lg font-semibold mb-4">
              Buscar jugadores
            </p>
            <form onSubmit={handleSearch} className="w-full flex space-x-2">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Nombre de jugador..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pl-10"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FiSearch size={18} />
                </div>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-600 flex items-center justify-center"
              >
                <FiSearch size={18} />
                <span className="ml-2 hidden sm:inline">Buscar</span>
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Columna derecha (Colección de cartas con scroll) */}
        <motion.div 
          className="w-full lg:w-[55%] bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl border border-gray-700/50 shadow-xl p-5 overflow-y-auto max-h-[60vh] lg:max-h-[75vh]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-green-400 mb-4 text-center">Tu Colección</h2>
          
          {cards.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  className="flex justify-center items-center cursor-pointer relative"
                  onClick={() => !confirmedCard && setSelectedCard(card)}
                  whileHover={{ scale: !confirmedCard ? 1.05 : 1, zIndex: 10 }}
                  whileTap={{ scale: !confirmedCard ? 0.95 : 1 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * (index % 8) }}
                >
                  <div className="relative">
                    <CartaMediana jugador={card} />
                    {!confirmedCard && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col items-center justify-end p-2"
                      >
                        <p className="text-white text-xs sm:text-sm font-semibold truncate w-full text-center">{card.nombre}</p>
                        <p className="text-green-400 text-xs">Click para seleccionar</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-400">No se encontraron cartas disponibles</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Alerta de confirmación de salida */}
      <AnimatePresence>
        {showAlert && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-gray-900 to-black p-6 sm:p-8 rounded-xl shadow-2xl text-center text-white max-w-xs sm:max-w-sm border border-gray-700"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-2">¿Abandonar intercambio?</h3>
              <p className="text-gray-300 mb-6">
                Si abandonas ahora, se cancelará el intercambio actual.
              </p>
              <div className="flex justify-center gap-4">
                <motion.button
                  onClick={handleConfirmExit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:from-red-700 hover:to-red-600"
                >
                  Abandonar
                </motion.button>
                <motion.button
                  onClick={() => setShowAlert(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold rounded-lg shadow-lg hover:from-gray-700 hover:to-gray-600"
                >
                  Continuar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de carta seleccionada */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-gray-900 to-black/95 rounded-2xl p-6 shadow-2xl max-w-xs sm:max-w-sm md:max-w-md border border-gray-700"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-xl font-bold text-green-400 mb-4 text-center">Seleccionar Carta</h3>
              <CartaGrande jugador={selectedCard} />
              <div className="mt-6 flex justify-center gap-4">
                <motion.button
                  onClick={handleSelectCard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-600 flex items-center"
                >
                  <span className="mr-2">Intercambiar</span>
                  <FiArrowRight size={18} />
                </motion.button>
                <motion.button
                  onClick={() => setSelectedCard(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white font-semibold rounded-lg shadow-lg hover:from-gray-800 hover:to-gray-700"
                >
                  Cancelar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animación de intercambio */}
      <AnimatePresence>
      {showExchangeAnimation && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7 } }}
        >
          <div className="relative w-full max-w-md h-96 sm:h-[28rem] flex justify-center items-center">
            
            {/* Confetti particles */}
            {showConfetti && (
              <>
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#56CCF2'][i % 5],
                      top: '50%',
                      left: '50%',
                    }}
                    initial={{ scale: 0 }}
                    animate={{
                      x: Math.random() * 300 - 150,
                      y: Math.random() * 300 - 150,
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.03,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </>
            )}
            
            {/* Flashing background highlight on exchange */}
            <motion.div
              className="absolute inset-0 bg-white rounded-full"
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ 
                opacity: [0, 0.4, 0],
                scale: [0.1, 1.5, 3],
                transition: { duration: 1, delay: 0.8 }
              }}
            />
            
            {/* Connection line between cards */}
            <svg className="absolute inset-0" width="100%" height="100%">
              <motion.path
                d="M 120,140 C 0,180 0,180 -120,220"
                stroke="#FFD166"
                strokeWidth="4"
                strokeLinecap="round"
                fill="transparent"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  transition: { duration: 1.8, times: [0, 0.5, 1] }
                }}
              />
            </svg>
            
            {/* Carta del jugador */}
            <motion.div 
              className="absolute w-40 sm:w-48 h-auto z-10"
              initial={{ x: -120, y: 0, rotate: 0, scale: 1 }}
              animate={{ 
                x: [
                  -120, // start
                  0,    // middle
                  120   // end
                ], 
                y: [
                  0,     // start
                  -80,   // peak
                  0      // end
                ],
                rotate: [0, -5, 5, 0],
                scale: [1, 1.1, 1],
                filter: ["drop-shadow(0 0 0 rgba(74, 222, 128, 0))", "drop-shadow(0 0 10px rgba(74, 222, 128, 0.8))", "drop-shadow(0 0 0 rgba(74, 222, 128, 0))"]
              }}
              transition={{ 
                duration: 1.8, 
                ease: "easeInOut"
              }}
            >
              <motion.div
                animate={{
                  rotateY: [0, 180]
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.9
                }}
                style={{ backfaceVisibility: "hidden" }}
              >
                <CartaMediana jugador={confirmedCard} />
              </motion.div>
            </motion.div>
            
            {/* Carta del oponente */}
            <motion.div 
              className="absolute w-40 sm:w-48 h-auto z-10"
              initial={{ x: 120, y: 0, rotate: 0, scale: 1 }}
              animate={{ 
                x: [
                  120,  // start
                  0,    // middle
                  -120  // end
                ], 
                y: [
                  0,    // start
                  80,   // lowest point
                  0     // end
                ],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
                filter: ["drop-shadow(0 0 0 rgba(251, 146, 60, 0))", "drop-shadow(0 0 10px rgba(251, 146, 60, 0.8))", "drop-shadow(0 0 0 rgba(251, 146, 60, 0))"]
              }}
              transition={{ 
                duration: 1.8, 
                ease: "easeInOut" 
              }}
            >
              <motion.div
                animate={{
                  rotateY: [0, 180]
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.9
                }}
                style={{ backfaceVisibility: "hidden" }}
              >
                <CartaMediana jugador={opponentCard} />
              </motion.div>
            </motion.div>
            
            {/* Texto de intercambio con animación mejorada */}
            <motion.div 
              className="absolute top-52 left-0 right-0 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                y: [20, 0, 0, -20],
                scale: [0.9, 1.2, 1.2, 0.9],
                transition: { duration: 2.5, times: [0, 0.2, 0.8, 1] }
              }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-green-400 tracking-wider">
                ¡Intercambio Exitoso!
              </h2>
              
              <motion.div
                className="mt-2 text-yellow-300 text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  transition: { duration: 2.5, delay: 0.2, times: [0, 0.2, 0.8, 1] }
                }}
              >
                Cartas intercambiadas correctamente
              </motion.div>
            </motion.div>
            
            {/* Close button */}
            <motion.button
              className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={() => setShowExchangeAnimation(false)}
            >
              ✕
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* Modal de carta recibida con confeti */}
      <AnimatePresence>
        {showReceivedCard && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {showConfetti && (
              <Confetti
                width={windowSize.current.width}
                height={windowSize.current.height}
                recycle={false}
                numberOfPieces={200}
                gravity={0.15}
              />
            )}
            
            <motion.div 
              className="bg-gradient-to-br from-gray-900/90 to-black/95 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-xs sm:max-w-sm md:max-w-md border border-gray-700 relative z-10"
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-6"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">¡Nueva Carta Adquirida!</h2>
                <p className="text-gray-300">Has recibido esta carta en el intercambio:</p>
              </motion.div>
              
              <motion.div
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex justify-center"
              >
                {opponentCard && <CartaGrande jugador={opponentCard} />}
              </motion.div>
              
              <motion.div 
                className="mt-8 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <motion.button
                  onClick={closeReceivedCardModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg shadow-lg hover:from-green-700 hover:to-green-600"
                >
                  ¡Genial!
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Intercambio;