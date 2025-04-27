import { useState, useEffect } from "react";
import { FaBolt, FaPlay, FaRedo } from "react-icons/fa";
import Alineacion from "../../../assets/alineacion.png";
import { useNavigate } from "react-router-dom";
import { socketService } from "../../../services/websocket/socketService";
import { getProfile } from "../../../services/api/profileApi";

export default function PlayButton() {
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
      {showAlert && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-[#1E1E1E] text-white px-6 py-3 rounded-lg shadow-lg border border-[#7A7E68] z-50">
          No tienes ninguna plantilla activa
          <button
            onClick={() => setShowAlert(false)}
            className="ml-4 text-sm text-[#9FA383] hover:underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {showDialog && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800/90 rounded-2xl p-8 w-80 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              Selecciona modalidad
            </h2>

            <button
              onClick={playQuickMatch}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-[#777771] to-[#41401A] hover:bg-[#5C5F4A] text-white font-semibold py-3 rounded-lg mb-4 transition"
            >
              <FaPlay />
              Partida rápida
            </button>

            <button
              onClick={resumePausedMatch}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-[#9FA383] to-[#464929] hover:bg-[#7A7E68] text-white font-semibold py-3 rounded-lg transition"
            >
              <FaRedo />
              Reanudar partida
            </button>

            <button
              onClick={() => setShowDialog(false)}
              className="mt-6 text-sm text-[#9FA383] hover:underline"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center bg-gradient-to-r from-[#9FA383] to-[#464929] border-4 border-[#1E1E1E] rounded-full shadow-xl">
        <div className="flex flex-col w-[100px] items-center justify-center bg-transparent px-4 py-2 rounded-l-full hover:bg-[#7A7E68] transition">
          <FaBolt className="text-xl text-white" />
          <span className="text-sm text-white">1&nbsp;vs&nbsp;1</span>
        </div>

        <button
          onClick={handleJugarClick}
          className="flex items-center justify-center w-[150px] h-[78px] text-xl font-bold text-white bg-gradient-to-b from-[#777771] to-[#41401A] hover:bg-[#5C5F4A] transition"
          style={{
            clipPath: "polygon(0% 50%, 10% 0%, 100% 0%, 80% 100%, 10% 100%)",
          }}
        >
          Jugar
        </button>

        <button
          onClick={handleAlineacionesClick}
          className="flex flex-col items-center justify-center bg-transparent px-4 py-2 rounded-r-full hover:bg-[#7A7E68] transition"
        >
          <img src={Alineacion} alt="Alineación" className="w-6 h-6" />
          <span className="text-sm text-white">Alineaciones</span>
        </button>
      </div>
    </>
  );
}
