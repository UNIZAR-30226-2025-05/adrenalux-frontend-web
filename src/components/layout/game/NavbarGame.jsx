import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../assets/logo.png";
import { getProfile } from "../../../services/api/profileApi";
import {
  FaUsers,
  FaCog,
  FaPlusCircle,
  FaBars,
  FaTimes,
  FaCoins,
} from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";
import SobreComun from "../../../assets/SobreComun.png";
import { abrirSobreGratis } from "../../../services/api/cardApi";
import { useTranslation } from "react-i18next";

export default function NavbarGame() {
  const { t } = useTranslation();

  const [infoUser, setInfoUser] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHoveringButtons, setIsHoveringButtons] = useState({
    profile: false,
    amigos: false,
    ajustes: false,
    abrir: false,
  });
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
  const username = infoUser?.data?.username || t("navigation.loading");
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

  const handleHover = (button, isHovering) => {
    setIsHoveringButtons((prev) => ({
      ...prev,
      [button]: isHovering,
    }));
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
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg border-b-2 border-purple-500 z-50"
    >
      {/* Desktop View */}
      <div className="hidden md:flex items-center h-16">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center mr-4 bg-gradient-to-b from-gray-800 to-gray-900 h-full w-[150px] cursor-pointer border-r-2 border-purple-500"
          onClick={() => navigate("/home")}
        >
          <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
        </motion.div>

        {/* Sección de usuario y barra de progreso */}
        <div className="flex items-center justify-between flex-1 px-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProfileClick}
            onMouseEnter={() => handleHover("profile", true)}
            onMouseLeave={() => handleHover("profile", false)}
            className={`flex items-center px-3 py-2 mr-4 rounded-lg transition-all duration-300 ${
              isHoveringButtons.profile
                ? "bg-purple-700 shadow-lg shadow-purple-900/30"
                : "bg-gray-800 border border-purple-500"
            }`}
          >
            {avatar && (
              <div className="w-10 h-10 rounded-full border-2 border-purple-400 overflow-hidden mr-3">
                <img
                  src={avatar}
                  alt="Avatar del usuario"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <span className="text-white text-base font-bold truncate max-w-[120px] block">
                {username}
              </span>
              <div className="flex items-center">
                <span className="text-blue-400 mr-2 text-sm">LVL{level}</span>
                <div className="relative w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${porcentajeExp}%` }}
                    transition={{ duration: 1 }}
                    className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full"
                  ></motion.div>
                </div>
              </div>
            </div>
          </motion.button>

          {/* Contador de "Sobre Gratis" */}
          <div className="flex-shrink-0 mx-4">
            {countdown > 0 ? (
              <div className="flex items-center bg-gray-800 border border-purple-500 rounded-lg px-3 py-2">
                <span className="text-white text-base mr-2">
                  {formatTime(countdown)}
                </span>
                <img
                  src={SobreComun}
                  alt="Sobre Comun"
                  className="w-7 h-16 object-cover"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAbrirSobreGratis}
                  onMouseEnter={() => handleHover("abrir", true)}
                  onMouseLeave={() => handleHover("abrir", false)}
                  className={`flex items-center px-4 py-2 rounded-lg font-bold transition-all ${
                    isHoveringButtons.abrir
                      ? "bg-purple-700 shadow-lg shadow-purple-900/30"
                      : "bg-gradient-to-r from-purple-700 to-purple-900"
                  }`}
                >
                  {t("navigation.open")}
                </motion.button>
                <img
                  src={SobreComun}
                  alt="Sobre Comun"
                  className="w-7 h-16 object-cover ml-2"
                />
              </div>
            )}
          </div>

          {/* Adrenacoins */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center bg-gray-800 border border-yellow-500 text-white rounded-lg px-3 py-2 mr-4"
          >
            <span className="text-white text-base mr-2">{adrenacoins}</span>
            <FaCoins className="text-yellow-400 text-xl" />
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="ml-2 bg-green-600 rounded-full p-1 cursor-pointer"
            >
              <FaPlusCircle className="text-white text-lg" />
            </motion.div>
          </motion.div>
        </div>

        {/* Botones de navegación */}
        <div className="flex items-center mr-8 ml-4">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gray-800 border-2 border-purple-500 w-14 h-14 flex justify-center items-center rounded-lg hover:bg-purple-700 transition-colors duration-300"
              onClick={handleAmigosClick}
              onMouseEnter={() => handleHover("amigos", true)}
              onMouseLeave={() => handleHover("amigos", false)}
            >
              <FaUsers
                className={`text-3xl ${
                  isHoveringButtons.amigos ? "text-white" : "text-purple-400"
                }`}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gray-800 border-2 border-purple-500 w-14 h-14 flex justify-center items-center rounded-lg hover:bg-purple-700 transition-colors duration-300"
              onClick={handleAjustesClick}
              onMouseEnter={() => handleHover("ajustes", true)}
              onMouseLeave={() => handleHover("ajustes", false)}
            >
              <FaCog
                size={36}
                className={`${
                  isHoveringButtons.ajustes ? "text-white" : "text-purple-400"
                }`}
              />{" "}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex items-center justify-between h-16">
        {/* Logo */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 h-full w-20 border-r border-purple-500"
          onClick={() => navigate("/home")}
        >
          <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
        </motion.div>

        {/* User profile and coins (condensed for mobile) */}
        <div className="flex items-center flex-1 justify-center space-x-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleProfileClick}
            className="flex items-center bg-gray-800 border border-purple-500 px-2 py-1 rounded-lg"
          >
            <div className="w-8 h-8 rounded-full border-2 border-purple-400 overflow-hidden">
              <img
                src={avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.button>

          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex items-center bg-gray-800 border border-yellow-500 rounded-lg px-2 py-1"
          >
            <span className="text-white text-sm mr-1">{adrenacoins}</span>
            <FaCoins className="text-yellow-400 text-sm" />
          </motion.div>

          {countdown <= 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAbrirSobreGratis}
              className="bg-gradient-to-r from-purple-700 to-purple-900 text-white text-xs px-2 py-1 rounded-lg"
            >
              {t("navigation.open")}
            </motion.button>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleMobileMenu}
          className="p-4 focus:outline-none"
        >
          {mobileMenuOpen ? (
            <FaTimes className="text-white text-2xl" />
          ) : (
            <FaBars className="text-white text-2xl" />
          )}
        </motion.button>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900 py-4 px-3 shadow-md border-t border-purple-500"
          >
            <div className="flex items-center mb-4">
              <span className="text-blue-400 mr-2">LVL{level}</span>
              <div className="relative flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${porcentajeExp}%` }}
                  className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full"
                ></motion.div>
              </div>
            </div>

            {countdown > 0 && (
              <div className="flex items-center justify-center mb-4 bg-gray-800 border border-purple-500 rounded-lg p-2">
                <span className="text-white mr-2">{formatTime(countdown)}</span>
                <img
                  src={SobreComun}
                  alt="Sobre Comun"
                  className="w-5 h-12 object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleProfileClick}
                className="bg-gray-800 border border-purple-500 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors duration-300"
              >
                <span className="text-base font-bold">
                  {" "}
                  {t("navigation.profile")}
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAmigosClick}
                className="bg-gray-800 border border-purple-500 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors duration-300"
              >
                <FaUsers className="text-xl mr-2 text-purple-400" />
                <span className="text-base font-bold">
                  {" "}
                  {t("navigation.friends")}
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAjustesClick}
                className="bg-gray-800 border border-purple-500 text-white py-3 px-4 rounded-lg flex items-center justify-center col-span-2 hover:bg-purple-700 transition-colors duration-300"
              >
                <FaCog size={28} className="text-purple-400" />
                <span className="text-base font-bold">
                  {" "}
                  {t("navigation.settings")}
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
