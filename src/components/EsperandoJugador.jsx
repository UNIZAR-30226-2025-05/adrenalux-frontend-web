import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSpinner, 
  FaUserAlt, 
  FaTimes, 
  FaArrowLeft, 
  FaExclamationTriangle, 
  FaGamepad, 
  FaClock, 
  FaBell, 
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaSignOutAlt,
  FaUser,
  FaMedal,
  FaCalendarAlt
} from "react-icons/fa";
import background from "../assets/background.png";

export default function EsperandoJugador() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showScreen, setShowScreen] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [animateAvatar, setAnimateAvatar] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const notificationTimeoutRef = useRef(null);
  const avatarAnimationTimeoutRef = useRef(null);
  const jugador = location.state?.jugador || {
    username: "JugadorDesconocido",
    nivel: 5,
    lastActive: "2 horas atrás",
    gamesPlayed: 120,
    ranking: 234,
    winRate: "68%",
    joinDate: "12/05/2022"
  };

  // Array de tips para mostrar mientras el jugador espera
  const tips = [
    "Mientras más partidas ganes, más puntos de experiencia ganarás.",
    "Las cartas Luxury tienen un 5% de probabilidad de aparecer.",
    "Cambia cartas con tus amigos para poder acabar la coleccion",
    "Participa en torneos con tus amigos",
    "Usa tus mejores cartas en las partidas",
    "Acuerdate de abrir tus sobres gratuitos"
  ];

  // Función para cambiar el tip actual
  const changeTip = () => {
    setCurrentTip(prev => (prev + 1) % tips.length);
  };

  // Mostrar notificación
  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    
    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Simular actividad ocasional
  const simulateActivity = () => {
    // Animar el avatar ocasionalmente
    setAnimateAvatar(true);
    if (avatarAnimationTimeoutRef.current) {
      clearTimeout(avatarAnimationTimeoutRef.current);
    }
    avatarAnimationTimeoutRef.current = setTimeout(() => {
      setAnimateAvatar(false);
    }, 1000);
  };

  useEffect(() => {
    // Simular carga inicial
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setShowScreen(true);
    }, 1500);
    
    // Configurar un temporizador para mostrar cuánto tiempo ha pasado
    const intervalTimer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    // Cambiar el tip cada 8 segundos
    const tipTimer = setInterval(changeTip, 8000);
    
    // Simular actividad ocasional cada 20 segundos
    const activityTimer = setInterval(simulateActivity, 20000);
    
    // Mostrar el primer tip después de 5 segundos
    const initialTipTimer = setTimeout(() => {
      setShowTip(true);
    }, 5000);
    
    // Simulación de respuesta automática después de cierto tiempo (para demo)
    const autoResponseTimer = setTimeout(() => {
      // Solo para propósitos de demostración
      if (Math.random() > 0.5) {
        showNotificationMessage("Procesando tu solicitud...");
      }
    }, 30000);

    return () => {
      // Limpiar temporizadores al desmontar
      clearTimeout(loadingTimer);
      clearInterval(intervalTimer);
      clearInterval(tipTimer);
      clearTimeout(initialTipTimer);
      clearInterval(activityTimer);
      clearTimeout(autoResponseTimer);
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      if (avatarAnimationTimeoutRef.current) {
        clearTimeout(avatarAnimationTimeoutRef.current);
      }
    };
  }, []);

  // Efecto para mostrar mensaje después de un tiempo
  useEffect(() => {
    if (timeElapsed === 10) {
      showNotificationMessage("Igual el jugador no está en línea");
    }
  }, [timeElapsed]);

  // Función para cancelar y volver al home
  const handleCancel = () => {
    // Mostrar diálogo de confirmación
    setShowConfirmDialog(true);
  };

  // Función para confirmar la cancelación
  const confirmCancel = () => {
    console.log("Solicitud cancelada");
    navigate("/home");
  };

  // Función para simular que el jugador acepta la solicitud
  const simulateAccept = () => {
    showNotificationMessage("¡El jugador ha aceptado tu solicitud!");
    setTimeout(() => {
      navigate("/intercambio");
    }, 1500);
  };

  // Formatear el tiempo transcurrido en minutos:segundos
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Variantes para la animación de la pantalla de carga
  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const loadingItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Componente de pantalla de carga
  const LoadingScreen = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <motion.div
        variants={loadingVariants}
        initial="hidden"
        animate="visible"
        className="relative bg-gray-800 bg-opacity-90 rounded-xl p-8 shadow-2xl max-w-md w-full mx-4 flex flex-col items-center"
      >
        <motion.div variants={loadingItemVariants} className="w-20 h-20 mb-6">
          <FaSpinner className="animate-spin text-6xl text-blue-400" />
        </motion.div>
        <motion.h2 variants={loadingItemVariants} className="text-2xl font-bold text-white mb-4">
          Conectando con el jugador
        </motion.h2>
        <motion.div variants={loadingItemVariants} className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mb-4">
          <motion.div 
            className="h-full bg-blue-500"
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        <motion.p variants={loadingItemVariants} className="text-gray-300 text-center">
          Preparando conexión segura
        </motion.p>
      </motion.div>
    </div>
  );

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Fondo que cubre toda la pantalla */}
      <div 
        className="fixed inset-0 -z-10"
        style={{ 
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat"
        }}
      />
      
      {/* Contenido principal con scroll */}
      <div className="relative w-full h-screen overflow-y-auto">
        {/* Pantalla de carga */}
        {isLoading && <LoadingScreen />}
        
        {/* Pantalla principal */}
        <AnimatePresence>
          {showScreen && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 bg-gray-800 bg-opacity-90 rounded-xl shadow-2xl max-w-md w-full mx-auto my-8 overflow-hidden"
            >
              {/* Barra superior decorativa */}
              <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
              
              {/* Encabezado */}
              <div className="text-center p-6 pb-4">
                <h2 className="text-3xl font-bold text-white mb-2">Esperando Respuesta</h2>
                <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
              </div>
              
              {/* Avatar y detalles del jugador */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center px-6 pb-4"
                onClick={() => setShowProfileInfo(!showProfileInfo)}
              >
                <div className="relative">
                  <motion.div 
                    className={`w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4 ${animateAvatar ? 'ring-4 ring-blue-400' : ''}`}
                    animate={animateAvatar ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {jugador.avatar ? (
                      <img src={jugador.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <FaUserAlt size={40} />
                    )}
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-white flex items-center">
                  {jugador.username || jugador.name || "Jugador"}
                  <motion.span
                    whileHover={{ rotate: 180 }}
                    className="ml-2 text-gray-400 cursor-pointer"
                  >
                    {showProfileInfo ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                  </motion.span>
                </h3>
                <div className="flex items-center mt-1">
                  <FaMedal className="text-yellow-400 mr-1" />
                  <p className="text-blue-300">Nivel {jugador.nivel}</p>
                </div>
                
                {/* Información extendida del perfil */}
                <AnimatePresence>
                  {showProfileInfo && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-gray-700 rounded-lg p-4 mt-4 w-full overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center">
                          <FaGamepad className="text-blue-400 mr-2" />
                          <div>
                            <span className="text-gray-300">Partidas</span>
                            <p className="text-white font-medium">{jugador.gamesPlayed}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaUser className="text-blue-400 mr-2" />
                          <div>
                            <span className="text-gray-300">Ranking</span>
                            <p className="text-white font-medium">#{jugador.ranking}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="text-blue-400 mr-2" />
                          <div>
                            <span className="text-gray-300">Última vez</span>
                            <p className="text-white font-medium">{jugador.lastActive}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-blue-400 mr-2" />
                          <div>
                            <span className="text-gray-300">Se unió</span>
                            <p className="text-white font-medium">{jugador.joinDate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Victorias</span>
                          <span className="text-white font-medium">{jugador.winRate}</span>
                        </div>
                        <div className="w-full bg-gray-600 h-2 rounded-full mt-1 overflow-hidden">
                          <div className="bg-green-500 h-full" style={{ width: jugador.winRate }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Animación de espera */}
              <div className="flex flex-col items-center px-6 py-4">
                <div className="relative mb-4">
                  <FaSpinner className="animate-spin text-5xl text-blue-400" />
                  <motion.div 
                    className="absolute inset-0 rounded-full border-4 border-blue-400"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                <p className="text-white text-lg text-center">Esperando respuesta del jugador...</p>
                <div className="flex items-center justify-center mt-2 text-gray-300">
                  <FaClock className="mr-2" />
                  <p>Tiempo transcurrido: {formatTime(timeElapsed)}</p>
                </div>
                
                {/* Indicador de tiempo extendido */}
                <AnimatePresence>
                  {timeElapsed > 60 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 text-yellow-300 flex items-center bg-yellow-900 bg-opacity-30 px-4 py-2 rounded-lg"
                    >
                      <FaExclamationTriangle className="mr-2" />
                      <span>El jugador está tardando en responder</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Opciones adicionales */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="w-full mt-6"
                >
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="w-full flex items-center justify-center text-gray-300 hover:text-white py-2"
                  >
                    Opciones adicionales
                    {showOptions ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                  </button>
                  
                  <AnimatePresence>
                    {showOptions && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <button 
                            onClick={() => setShowInfoPanel(true)}
                            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center"
                          >
                            <FaInfoCircle className="mr-2" />
                            Ver detalles
                          </button>
                          <button
                            onClick={() => simulateAccept()} // Solo para demostración
                            className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center"
                          >
                            <FaBell className="mr-2" />
                            Recordar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              
              {/* Tips para el jugador */}
              <AnimatePresence>
                {showTip && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-4"
                  >
                    <div className="bg-gray-700 bg-opacity-70 rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="flex items-start">
                        <FaInfoCircle className="text-blue-400 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-blue-300 font-medium mb-1">Consejo para jugadores</h4>
                          <p className="text-gray-300 text-sm">{tips[currentTip]}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Separador */}
              <div className="px-6">
                <div className="border-t border-gray-700 my-2"></div>
              </div>
              
              {/* Botón para cancelar */}
              <div className="px-6 pb-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCancel}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center justify-center transition-colors"
                >
                  <FaTimes className="mr-2" />
                  Cancelar solicitud
                </motion.button>
                
                {/* Nota informativa */}
                <p className="text-gray-400 text-sm text-center mt-4">
                  Puedes cancelar en cualquier momento para volver al inicio
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Botón para volver al inicio */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={handleCancel}
        className="absolute top-6 left-6 z-10 bg-gray-800 bg-opacity-60 hover:bg-gray-700 p-3 rounded-full text-white transition-colors"
        aria-label="Volver al inicio"
      >
        <FaArrowLeft />
      </motion.button>
      
      {/* Diálogo de confirmación */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-20 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-auto border border-gray-700 shadow-xl"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-red-600 bg-opacity-20 flex items-center justify-center mr-3">
                  <FaSignOutAlt className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">¿Cancelar solicitud?</h3>
              </div>
              <p className="text-gray-300 mb-6">
                ¿Estás seguro de que deseas cancelar la solicitud y volver al inicio? El jugador no recibirá más notificaciones.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={confirmCancel}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                  <FaTimes className="mr-2" />
                  Sí, cancelar
                </button>
                <button 
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  No, esperar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Panel de información */}
      <AnimatePresence>
        {showInfoPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-20 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-gray-800 rounded-lg max-w-md w-full mx-auto overflow-hidden border border-gray-700 shadow-xl"
            >
              <div className="p-4 bg-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Detalles de la solicitud</h3>
                <button 
                  onClick={() => setShowInfoPanel(false)}
                  className="p-1 rounded-full hover:bg-gray-600"
                >
                  <FaTimes className="text-gray-300" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-sm text-gray-400 mb-1">Estado de la solicitud</h4>
                  <p className="text-white">Pendiente de respuesta</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm text-gray-400 mb-1">Tiempo de espera</h4>
                  <p className="text-white">{formatTime(timeElapsed)}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm text-gray-400 mb-1">Detalles del jugador</h4>
                  <p className="text-white">{jugador.username} (Nivel {jugador.nivel})</p>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm text-gray-400 mb-1">Última actividad</h4>
                  <p className="text-white">{jugador.lastActive}</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm text-yellow-400 mb-2 flex items-center">
                    <FaInfoCircle className="mr-2" />
                    Información importante
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Las solicitudes pendientes expiran después de 24 horas. Si el jugador no responde en ese tiempo, la solicitud será cancelada automáticamente.
                  </p>
                </div>
                
                <button 
                  onClick={() => setShowInfoPanel(false)}
                  className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Notificación emergente */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-gray-800 border border-blue-500 rounded-lg shadow-lg px-6 py-4 max-w-sm w-full mx-4 flex items-center pointer-events-auto">
              <FaBell className="text-blue-400 mr-3 flex-shrink-0 text-xl" />
              <span className="text-white">{notificationMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}