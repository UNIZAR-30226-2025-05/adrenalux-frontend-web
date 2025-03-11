import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import background from "../assets/background.png";

export default function EsperandoJugador() {
  const navigate = useNavigate();
  const [showScreen, setShowScreen] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowScreen(true), 800);
  }, []);

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
          className="text-center text-white text-3xl font-bold"
        >
          <p className="mb-4">Esperando al jugador...</p>
          <FaSpinner className="animate-spin text-5xl" />
        </motion.div>
      )}
    </motion.div>
  );
}
