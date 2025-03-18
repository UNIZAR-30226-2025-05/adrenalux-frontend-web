import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { getProfile } from "../../../services/api/profileApi";
import { FaUsers, FaCog, FaPlusCircle } from "react-icons/fa";
import SobreComun from "../../../assets/SobreComun.png";
import { abrirSobreGratis } from "../../../services/api/cardApi";

export default function NavbarGame() {
  const [infoUser, setInfoUser] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [openedCards, setOpenedCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerInfo = async () => {
      try {
        const data = await getProfile();
        setInfoUser(data);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };

    obtenerInfo();
  }, []);

  useEffect(() => {
    if (infoUser?.data?.ultimo_sobre_gratis) {
      const ultimoSobreGratis = new Date(infoUser.data.ultimo_sobre_gratis);
      const ahora = new Date();
      const diferencia = ahora - ultimoSobreGratis;
      const horasRestantes = Math.max(0, 28800 - Math.floor(diferencia / 1000));

      setCountdown(horasRestantes);

      if (horasRestantes > 0) {
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [infoUser]);

  const avatar = infoUser?.data?.avatar || "";
  const username = infoUser?.data?.username || "Cargando...";
  const level = infoUser?.data?.level || 1;
  const experiencia = infoUser?.data?.experience || 0;
  const xpMax = infoUser?.data?.xpMax || 1;
  const adrenacoins = infoUser?.data?.adrenacoins || 0;
  const porcentajeExp = (experiencia / xpMax) * 100;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  const handleAbrirSobreGratis = async () => {
    try {
      const cartas = await abrirSobreGratis();
      console.log(cartas);
      setOpenedCards(cartas);
      navigate("/opening", {
        state: { openedCards: openedCards, selectedCard: "Sobre Energia Lux" },
      });
    } catch (error) {
      console.error("Error al abrir el sobre gratis:", error);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAmigosClick = () => {
    navigate("/amigo");
  };
  
  const handleAjustesClick = () => {
    navigate("/ajustes");
  };

  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-[#0E2415] to-[#656D68] shadow-md z-50 flex items-center">
      {/* Logo */}
      <div className="flex items-center justify-center mr-4 bg-gradient-to-b from-[#EFF6EF] to-[#4F5A4F] h-full w-[150px]">
        <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
      </div>

      {/* Sección de usuario y barra de progreso */}
      <div className="flex items-center justify-between w-full">
        <button
          onClick={handleProfileClick}
          className="flex items-center bg-[#1E1E1E] text-white px-3 py-1 mr-4 border-4 border-black rounded-lg hover:bg-[#292929] transition"
        >
          {avatar && (
            <img
              src={avatar}
              alt="Avatar del usuario"
              className="w-10 h-10 rounded-full border-2 border-white object-cover mr-2"
            />
          )}
          <span>{username}</span>
        </button>

        <div className="flex items-center">
          <span className="text-blue-400 mr-2">LVL{level}</span>
          <div className="relative w-32 h-2 bg-gray-700 rounded">
            <div
              className="absolute top-0 left-0 h-2 bg-blue-400 rounded"
              style={{ width: `${porcentajeExp}%` }}
            ></div>
          </div>
        </div>

        {/* Contador de "Sobre Gratis" */}
        {countdown > 0 ? (
          <div className="flex items-center mr-4">
            <span className="text-white">{formatTime(countdown)}</span>
            <img
              src={SobreComun}
              alt="Sobre Comun"
              className="w-7 h-17 object-cover ml-2"
            />
          </div>
        ) : (
          <div className="flex items-center mr-4">
            <button
              onClick={handleAbrirSobreGratis}
              className="bg-gradient-to-r from-[#8302CE] to-[#490174] text-white px-4 py-2 rounded-md"
            >
              Abrir
            </button>
            <img
              src={SobreComun}
              alt="Sobre Comun"
              className="w-7 h-17 object-cover ml-2"
            />
          </div>
        )}

        {/* Adrenacoins */}
        <div className="flex items-center bg-black text-white rounded px-2 py-1 mr-4">
          <span>{adrenacoins}</span>
          <span className="text-yellow-400">🪙</span>
          <FaPlusCircle className="text-green-500 ml-2" />
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex items-center space-x-7 ml-7 mr-[30px]">
        <div className="flex items-center space-x-4">
          <button
            className="bg-[#1E1E1E] border-4 border-black w-18 h-14 flex justify-center items-center rounded"
            onClick={handleAmigosClick}
          >
            <FaUsers className="text-white text-4xl" />
          </button>
          <button
            className="bg-[#1E1E1E] border-4 border-black w-18 h-14 flex justify-center items-center rounded"
            onClick={handleAjustesClick}
          >
            <FaCog className="text-white text-4xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
