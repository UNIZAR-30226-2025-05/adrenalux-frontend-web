import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { getProfile } from "../../../services/api/profileApi";
import { FaUsers, FaCog, FaPlusCircle, FaBars, FaTimes } from "react-icons/fa";
import SobreComun from "../../../assets/SobreComun.png";
import { abrirSobreGratis } from "../../../services/api/cardApi";

export default function NavbarGame() {
  const [infoUser, setInfoUser] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const avatar = infoUser?.data?.avatar || "./assets/profile_1.png";
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
      navigate("/opening", {
        state: { openedCards: cartas, selectedCard: "Sobre Energia Lux" },
      });
    } catch (error) {
      console.error("Error al abrir el sobre gratis:", error);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setMobileMenuOpen(false);
  };

  const handleAmigosClick = () => {
    navigate("/amigo");
    setMobileMenuOpen(false);
  };
  
  const handleAjustesClick = () => {
    navigate("/ajustes");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#A5B3A2] to-[#D1D8D1] dark:bg-gradient-to-r dark:from-[#0E2415] dark:to-[#656D68] shadow-md z-50">

      {/* Desktop View */}
      <div className="hidden md:flex items-center h-16">
        {/* Logo */}
        <div 
          className="flex items-center justify-center mr-2 lg:mr-4 bg-gradient-to-b from-[#EFF6EF] to-[#4F5A4F] h-full w-24 lg:w-[150px] cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
        </div>

        {/* Sección de usuario y barra de progreso */}
        <div className="flex items-center justify-between flex-1 px-2">
          <button
            onClick={handleProfileClick}
            className="flex items-center bg-white dark:bg-[#1E1E1E] text-white px-2 py-1 mr-2 lg:mr-4 border-2 lg:border-4 border-black rounded-lg hover:bg-[#292929] transition"
          >
            {avatar && (
              <img
                src={avatar}
                alt="Avatar del usuario"
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white object-cover mr-1 lg:mr-2"
              />
            )}
            <span className="text-black dark:text-white text-sm lg:text-base truncate max-w-[80px] lg:max-w-full">{username}</span>
          </button>

          <div className="hidden sm:flex items-center">
            <span className="text-blue-400 mr-2 text-sm lg:text-base">LVL{level}</span>
            <div className="relative w-16 lg:w-32 h-2 bg-gray-700 rounded">
              <div
                className="absolute top-0 left-0 h-2 bg-blue-400 rounded"
                style={{ width: `${porcentajeExp}%` }}
              ></div>
            </div>
          </div>

          {/* Contador de "Sobre Gratis" */}
          <div className="flex-shrink-0 mx-2">
            {countdown > 0 ? (
              <div className="flex items-center">
                <span className="text-black dark:text-white text-xs lg:text-base">{formatTime(countdown)}</span>
                <img
                  src={SobreComun}
                  alt="Sobre Comun"
                  className="w-5 h-12 lg:w-7 lg:h-17 object-cover ml-1 lg:ml-2"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <button
                  onClick={handleAbrirSobreGratis}
                  className="bg-gradient-to-r from-[#8302CE] to-[#490174] text-white px-2 py-1 lg:px-4 lg:py-2 rounded-md text-xs lg:text-base"
                >
                  Abrir
                </button>
                <img
                  src={SobreComun}
                  alt="Sobre Comun"
                  className="w-5 h-12 lg:w-7 lg:h-17 object-cover ml-1 lg:ml-2"
                />
              </div>
            )}
          </div>

          {/* Adrenacoins */}
          <div className="flex items-center bg-white dark:bg-black text-white rounded px-2 py-1 mr-2 lg:mr-4">
            <span className="text-black dark:text-white text-sm lg:text-base">{adrenacoins}</span>
            <span className="text-yellow-400">🪙</span>
            <FaPlusCircle className="text-green-500 ml-1 lg:ml-2 text-base lg:text-lg" />
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex items-center mx-2 lg:mr-[30px] lg:ml-7">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <button
              className="bg-white dark:bg-[#1E1E1E] border-2 border-black w-12 h-12 lg:w-16 lg:h-16 flex justify-center items-center rounded"
              onClick={handleAmigosClick}
            >
              <FaUsers className="text-black dark:text-white text-3xl lg:text-5xl" />
            </button>
            <button
              className="bg-white dark:bg-[#1E1E1E] border-2 border-black w-12 h-12 lg:w-16 lg:h-16 flex justify-center items-center rounded"
              onClick={handleAjustesClick}
            >
              <FaCog className="text-black dark:text-white text-3xl lg:text-5xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex items-center justify-between h-16">
        {/* Logo */}
        <div 
          className="flex items-center justify-center bg-gradient-to-b from-[#EFF6EF] to-[#4F5A4F] h-full w-20 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
        </div>

        {/* User profile and coins (condensed for mobile) */}
        <div className="flex items-center flex-1 justify-center">
          <button
            onClick={handleProfileClick}
            className="flex items-center bg-white dark:bg-[#1E1E1E] px-2 py-1 mx-1 border-2 border-black rounded-lg"
          >
            <img
              src={avatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          </button>
          
          <div className="flex items-center bg-white dark:bg-black rounded px-2 py-1 mx-1">
            <span className="text-black dark:text-white text-sm">{adrenacoins}</span>
            <span className="text-yellow-400">🪙</span>
          </div>

          {countdown <= 0 && (
            <button
              onClick={handleAbrirSobreGratis}
              className="bg-gradient-to-r from-[#8302CE] to-[#490174] text-white text-xs px-2 py-1 rounded-md mx-1"
            >
              Abrir
            </button>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <button 
          onClick={toggleMobileMenu} 
          className="p-4 focus:outline-none"
        >
          {mobileMenuOpen ? (
            <FaTimes className="text-black dark:text-white text-3xl" />
          ) : (
            <FaBars className="text-black dark:text-white text-3xl" />
          )}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-[#A5B3A2] to-[#D1D8D1] dark:bg-gradient-to-r dark:from-[#0E2415] dark:to-[#656D68] py-4 px-2 shadow-md">
          <div className="flex items-center mb-3">
            <span className="text-blue-400 mr-2">LVL{level}</span>
            <div className="relative flex-1 h-2 bg-gray-700 rounded">
              <div
                className="absolute top-0 left-0 h-2 bg-blue-400 rounded"
                style={{ width: `${porcentajeExp}%` }}
              ></div>
            </div>
          </div>
          
          {countdown > 0 && (
            <div className="flex items-center justify-center mb-3">
              <span className="text-black dark:text-white">{formatTime(countdown)}</span>
              <img
                src={SobreComun}
                alt="Sobre Comun"
                className="w-5 h-12 object-cover ml-1"
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleProfileClick}
              className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white py-2 px-4 rounded border-2 border-black flex items-center justify-center"
            >
              <span className="text-base">Perfil</span>
            </button>
            <button
              onClick={handleAmigosClick}
              className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white py-2 px-4 rounded border-2 border-black flex items-center justify-center"
            >
              <FaUsers className="text-2xl mr-2" />
              <span className="text-base">Amigos</span>
            </button>
            <button
              onClick={handleAjustesClick}
              className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white py-2 px-4 rounded border-2 border-black flex items-center justify-center col-span-2"
            >
              <FaCog className="text-2xl mr-2" />
              <span className="text-base">Ajustes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}