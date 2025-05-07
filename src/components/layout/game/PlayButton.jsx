import { useState, useEffect } from "react";
import { FaBolt, FaPlay, FaRedo, FaTimes } from "react-icons/fa";
import { GiSwordman } from "react-icons/gi";
import Alineacion from "../../../assets/alineacion.png";
import { useNavigate } from "react-router-dom";
import { socketService } from "../../../services/websocket/socketService";
import { getProfile } from "../../../services/api/profileApi";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

export default function PlayButton({ className = "", iconClassName = "" }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getProfile();
      setProfile(data);
    })();
  }, []);

  const handleAlineacionesClick = () => navigate("/alineaciones");

  const handleJugarClick = () => {
    if (!profile) return;
    if (profile.data.plantilla_activa_id != null) {
      setShowDialog(true);
    } else {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const playQuickMatch = () => {
    socketService.joinMatchmaking();
    navigate("/buscandoPartida");
  };

  const resumePausedMatch = () => {
    navigate("/partidasPausadas");
  };

  return (
    <>
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg border-2 border-purple-500 z-50 flex items-center"
          >
            <GiSwordman className="text-yellow-400 mr-2" />
            <span>No tienes ninguna plantilla activa</span>
            <button
              onClick={() => setShowAlert(false)}
              className="ml-4 text-purple-300 hover:text-white"
            >
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border-2 border-purple-500 relative"
            >
              {/* Decorative elements */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-500 rounded-full"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-purple-500 rounded-full"></div>

              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-300 mb-6">
                Selecciona modalidad
              </h2>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={playQuickMatch}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg"
                >
                  <FaPlay className="text-yellow-300" />
                  <span>Partida rápida</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={resumePausedMatch}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white font-semibold py-3 rounded-lg transition-all shadow-lg border border-purple-500/30"
                >
                  <FaRedo className="text-purple-300" />
                  <span>Reanudar partida</span>
                </motion.button>
              </div>

              <motion.button
                onClick={() => setShowDialog(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mt-6 text-sm text-purple-300 hover:text-white flex items-center justify-center mx-auto"
              >
                <FaTimes className="mr-1" />
                Cancelar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`flex items-center justify-center bg-gradient-to-r from-purple-900/80 to-gray-900/80 border-2 border-purple-500 rounded-full shadow-xl backdrop-blur-sm overflow-hidden ${className}`}
      >
        <button
          onClick={handleAlineacionesClick}
          className="flex flex-col items-center justify-center px-4 py-2 hover:bg-purple-900/50 transition group"
        >
          <div className="relative">
            <img
              src={Alineacion}
              alt="Alineación"
              className="w-6 h-6 group-hover:scale-110 transition"
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition"></div>
          </div>
          <span className="text-xs text-gray-300 group-hover:text-white mt-1">
            Alineaciones
          </span>
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleJugarClick}
          className="flex items-center justify-center w-36 h-16 text-lg font-bold text-white bg-gradient-to-b from-purple-600 to-purple-900 hover:from-purple-500 hover:to-purple-800 transition relative"
          style={{
            clipPath:
              "polygon(0% 50%, 10% 0%, 100% 0%, 90% 50%, 100% 100%, 10% 100%)",
          }}
        >
          <span className="relative z-10">Jugar</span>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 hover:opacity-100 transition"></div>
        </motion.button>

        <button className="flex flex-col items-center justify-center px-4 py-2 hover:bg-purple-900/50 transition group">
          <div className="relative">
            <FaBolt className={`text-xl text-yellow-400 group-hover:scale-110 transition ${iconClassName}`} />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition"></div>
          </div>
          <span className="text-xs text-gray-300 group-hover:text-white mt-1">
            1 vs 1
          </span>
        </button>
      </motion.div>
    </>
  );
}

PlayButton.propTypes = {
  className: PropTypes.string,
  iconClassName: PropTypes.string,
};
