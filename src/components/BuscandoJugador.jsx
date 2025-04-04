import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSpinner, FaTimes } from "react-icons/fa";
import background from "../assets/background.png";
import { getToken } from "../services/api/authApi";
import { socketService } from '../services/websocket/socketService';

export default function BuscandoJugador() {
  const navigate = useNavigate();
  const token = getToken();
  const [showScreen, setShowScreen] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowScreen(true), 800);
    if (!token) {
      navigate("/");
    }

    socketService.joinMatchmaking();
    
  }, [token, navigate]);

  const handleCancel = () => {
    socketService.leaveMatchmaking();
    navigate("/home");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {showScreen && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white"
        >
          <div className="relative bg-black bg-opacity-70 p-8 rounded-lg max-w-md">
            
            <h2 className="text-3xl font-bold mb-6">Buscando jugador...</h2>
            
            <div className="flex flex-col items-center">
              <FaSpinner className="animate-spin text-5xl mb-6" />
              
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <FaTimes /> Cancelar búsqueda
              </button>
              
              <p className="mt-4 text-gray-300 text-sm">
                Puede tomar unos momentos encontrar un oponente
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}