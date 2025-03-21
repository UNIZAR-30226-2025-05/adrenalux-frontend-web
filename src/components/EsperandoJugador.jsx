import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import background from "../assets/background.png";
//import { socketService } from "../services/websocket/socketService";// Asegúrate de importar el servicio de socket

export default function EsperandoJugador() {
  const navigate = useNavigate();
  const location = useLocation(); // Obtienes el objeto location
  const [showScreen, setShowScreen] = useState(false);
  const jugador = location.state?.jugador; // Accedes a los datos de `jugador` enviados por navigate

  console.log(jugador); // Esto debería mostrar el objeto correctamente

  useEffect(() => {
    if (!jugador) return; // Si no hay jugador, no hacer nada

    setTimeout(() => setShowScreen(true), 800);

    // Función que manejará el caso cuando el intercambio sea aceptado
    /*const handleAccepted = () => {
      console.log("¡El intercambio fue aceptado!");
      navigate("/intercambio");
    };*/

    // Función que manejará el caso cuando el intercambio sea rechazado
    /*const handleCancelled = () => {
      console.log("El otro jugador rechazó el intercambio.");
      alert("El jugador rechazó el intercambio");
      navigate("/home");
    };*/

    // Limpiar cuando el componente se desmonte
    return () => {
    };
  }, [jugador, navigate]);

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
