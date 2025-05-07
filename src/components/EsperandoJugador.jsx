import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSpinner, FaUserAlt, FaTimes, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import background from "../assets/background.png";
//import { socketService } from "../services/websocket/socketService";

export default function EsperandoJugador() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showScreen, setShowScreen] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const jugador = location.state?.jugador;

  console.log(jugador);

  useEffect(() => {
    if (!jugador) return;

    // Mostrar la pantalla con una animación de entrada
    const screenTimer = setTimeout(() => setShowScreen(true), 500);
    
    // Configurar un temporizador para mostrar cuánto tiempo ha pasado
    const intervalTimer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Función que manejaría la aceptación del intercambio
    const handleAccepted = () => {
      console.log("¡El intercambio fue aceptado!");
      // socketService.off("exchange_accepted", handleAccepted);
      // socketService.off("exchange_declined", handleCancelled);
      navigate("/intercambio");
    };

    // Función que manejaría el rechazo del intercambio
    const handleCancelled = () => {
      console.log("El otro jugador rechazó el intercambio.");
      // socketService.off("exchange_accepted", handleAccepted);
      // socketService.off("exchange_declined", handleCancelled);
      alert("El jugador rechazó el intercambio");
      navigate("/home");
    };

    // Aquí se escucharían los eventos de socket
    // socketService.on("exchange_accepted", handleAccepted);
    // socketService.on("exchange_declined", handleCancelled);

    return () => {
      // Limpiar temporizadores y suscripciones de socket al desmontar
      clearTimeout(screenTimer);
      clearInterval(intervalTimer);
      // socketService.off("exchange_accepted", handleAccepted);
      // socketService.off("exchange_declined", handleCancelled);
    };
  }, [jugador, navigate]);

  // Función para cancelar y volver al home
  const handleCancel = () => {
    // Mostrar diálogo de confirmación
    setShowConfirmDialog(true);
  };

  // Función para confirmar la cancelación
  const confirmCancel = () => {
    // Emitir evento de cancelación al servidor
    // socketService.emit("cancel_exchange_request", { targetPlayer: jugador.id });
    console.log("Solicitud cancelada");
    navigate("/home");
  };

  // Formatear el tiempo transcurrido en minutos:segundos
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {showScreen && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 bg-gray-800 bg-opacity-80 rounded-xl p-8 shadow-2xl max-w-md w-full mx-4"
        >
          {/* Encabezado */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Esperando Respuesta</h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Avatar y detalles del jugador */}
          {jugador && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center mb-6"
            >
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4">
                {jugador.avatar ? (
                  <img src={jugador.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <FaUserAlt size={40} />
                )}
              </div>
              <h3 className="text-xl font-semibold text-white">{jugador.username || jugador.name || "Jugador"}</h3>
              {jugador.nivel && <p className="text-blue-300">Nivel {jugador.nivel}</p>}
            </motion.div>
          )}
          
          {/* Animación de espera */}
          <div className="flex flex-col items-center mb-8">
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
            <p className="text-white text-lg">Esperando respuesta del jugador...</p>
            <p className="text-gray-300 mt-2">Tiempo transcurrido: {formatTime(timeElapsed)}</p>
            
            {timeElapsed > 60 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-yellow-300 flex items-center"
              >
                <FaExclamationTriangle className="mr-2" />
                <span>El jugador está tardando en responder</span>
              </motion.div>
            )}
          </div>
          
          {/* Botón para cancelar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
        </motion.div>
      )}
      
      {/* Diálogo de confirmación */}
      {showConfirmDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">¿Cancelar solicitud?</h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que deseas cancelar la solicitud y volver al inicio?
            </p>
            <div className="flex gap-4">
              <button 
                onClick={confirmCancel}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
              >
                Sí, cancelar
              </button>
              <button 
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded transition-colors"
              >
                No, esperar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
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
    </motion.div>
  );
}