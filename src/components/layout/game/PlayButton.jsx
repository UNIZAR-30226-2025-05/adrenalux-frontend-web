import { useState, useEffect } from "react";
import { FaBolt } from "react-icons/fa";
import Alineacion from "../../../assets/alineacion.png";
import { useNavigate } from "react-router-dom";
import { socketService } from '../../../services/websocket/socketService';
import { getProfile } from '../../../services/api/profileApi';

export default function PlayButton() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleAlineacionesClick = () => {
    navigate("/alineaciones");
  };

  const handleJugarClick = () => {
    if (!profile) return;

    if (profile.data.plantilla_activa_id != null) {
      socketService.joinMatchmaking();
      navigate("/buscandoPartida");
    } else {
      setShowAlert(true);
    }
  };

  return (
    <>
      {showAlert && (
        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 bg-[#1E1E1E] text-white px-6 py-3 rounded-lg shadow-lg border border-[#7A7E68] z-50">
          No tienes ninguna plantilla activa
          <button
            onClick={() => setShowAlert(false)}
            className="ml-4 text-sm text-[#9FA383] hover:underline"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center bg-gradient-to-r from-[#9FA383] to-[#464929] border-4 border-[#1E1E1E] rounded-full shadow-xl">
        <div className="flex flex-col w-[100px] items-center justify-center bg-transparent px-4 py-2 rounded-l-full hover:bg-[#7A7E68] transition">
          <FaBolt className="text-xl text-white" />
          <span className="text-sm text-white">1 vs 1</span>
        </div>

        <button
          onClick={handleJugarClick}
          className="flex items-center rounded-sm justify-center w-[150px] h-[78px] text-xl font-bold text-white bg-gradient-to-b from-[#777771] to-[#41401A] hover:bg-[#5C5F4A] transition"
          style={{
            clipPath: "polygon(0% 50%, 10% 0%, 100% 0%, 80% 100%, 10% 100%)",
          }}
        >
          Jugar
        </button>

        <button
          className="flex flex-col items-center justify-center bg-transparent px-4 py-2 rounded-r-full hover:bg-[#7A7E68] transition"
          onClick={handleAlineacionesClick}
        >
          <img src={Alineacion} alt="Alineación" className="w-6 h-6" />
          <span className="text-sm text-white">Alineaciones</span>
        </button>
      </div>
    </>
  );
}
