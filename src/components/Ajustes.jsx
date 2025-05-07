import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { logout, getToken } from "../services/api/authApi";
import { useLanguage } from "../context/LanguageProvider";
import BackButton from "./layout/game/BackButton";
import background from "../assets/background.png";
import { changeMusicVolume } from "../utils/soundManager";
import {
  FaVolumeUp,
  FaVolumeMute,
  FaSun,
  FaMoon,
  FaGlobe,
  FaInfoCircle,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";

const Ajustes = () => {
  const navigate = useNavigate();
  const token = getToken();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const [musicVolume, setMusicVolume] = useState(
    parseInt(localStorage.getItem("musicVolume")) || 50
  );
  const [language, setLanguage] = useState(currentLanguage || "es");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [showScreen, setShowScreen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowScreen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("musicVolume", musicVolume);
    changeMusicVolume(musicVolume / 100);
  }, [musicVolume]);

  useEffect(() => {
    changeLanguage(language);
  }, [language, changeLanguage]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);

    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        navigate("/login");
      } else {
        throw new Error("Error al cerrar sesión en el servidor");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Hubo un problema al cerrar sesión. Inténtalo de nuevo.");
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
  };

  const renderLanguageButton = (lang, label, flag) => {
    const isActive = language === lang;
    return (
      <motion.button
        onClick={() => handleLanguageChange(lang)}
        onHoverStart={() => setIsHovered(lang)}
        onHoverEnd={() => setIsHovered(null)}
        className={`relative overflow-hidden px-6 py-4 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg"
            : "bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-md"
        }`}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-white opacity-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
            }}
          />
        )}
        <span className="text-2xl mr-3">{flag}</span>
        <span className="font-medium text-lg">{label}</span>
      </motion.button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 overflow-y-auto bg-cover bg-center scrollbar-none"
      style={{
        backgroundImage: `url(${background})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {showScreen && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-full min-h-screen flex flex-col items-center pt-24 pb-8 px-4 z-10"
        >
          {/* Back button */}
          <div className="absolute left-6 top-24 z-10">
            <BackButton
              onClick={handleBackClick}
              className="hover:scale-110 transition-transform duration-200"
            />
          </div>

          {/* Main settings container */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border-2 border-purple-500 shadow-2xl w-full max-w-4xl">
            {/* Decorative elements */}
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-purple-500 rounded-full"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-purple-500 rounded-full"></div>
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-purple-500 rounded-full"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-purple-500 rounded-full"></div>

            {/* Title */}
            <div className="flex items-center justify-center mb-10">
              <GiCrossedSwords className="text-3xl text-yellow-400 mr-3" />
              <motion.h2
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-yellow-300"
                animate={{
                  textShadow: "0 0 8px rgba(216, 180, 254, 0.6)",
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5,
                }}
              >
                {t("settings.title").toUpperCase()}
              </motion.h2>
              <GiCrossedSwords className="text-3xl text-yellow-400 ml-3 transform rotate-180" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-8">
                {/* Theme section */}
                <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl border border-purple-500 relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500 rounded-full opacity-10"></div>
                  <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
                    {theme === "light" ? (
                      <FaSun className="text-yellow-400 mr-3" />
                    ) : (
                      <FaMoon className="text-indigo-300 mr-3" />
                    )}
                    {t("settings.theme.title")}
                  </h2>
                  <motion.button
                    onClick={toggleTheme}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-5 px-6 rounded-xl flex justify-between items-center transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span className="text-xl font-bold">
                      {theme === "light"
                        ? t("settings.theme.light")
                        : t("settings.theme.dark")}
                    </span>
                    <motion.span
                      className="text-3xl"
                      animate={{
                        rotate: isHovered === "theme" ? [0, 15, -15, 0] : 0,
                        scale: isHovered === "theme" ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                      onHoverStart={() => setIsHovered("theme")}
                      onHoverEnd={() => setIsHovered(null)}
                    >
                      {theme === "light" ? "🌞" : "🌙"}
                    </motion.span>
                  </motion.button>
                </div>

                {/* Sound settings */}
                <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl border border-purple-500 relative overflow-hidden">
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500 rounded-full opacity-10"></div>
                  <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
                    {musicVolume > 0 ? (
                      <FaVolumeUp className="text-green-400 mr-3" />
                    ) : (
                      <FaVolumeMute className="text-red-400 mr-3" />
                    )}
                    {t("settings.sound.title")}
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white text-lg mb-4 font-medium">
                        {t("settings.sound.music")}
                      </label>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl text-gray-300">
                          {musicVolume > 0 ? "🔈" : "🔇"}
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={musicVolume}
                          onChange={(e) => setMusicVolume(e.target.value)}
                          className="w-full h-3 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-b [&::-webkit-slider-thumb]:from-purple-400 [&::-webkit-slider-thumb]:to-purple-600"
                        />
                        <span className="text-2xl text-gray-300">🔊</span>
                      </div>
                      <motion.p
                        className="text-purple-300 text-base mt-3 text-center font-medium"
                        animate={{
                          scale: [1, 1.05, 1],
                          textShadow: "0 0 8px rgba(192, 132, 252, 0.6)",
                        }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 2,
                        }}
                      >
                        {t("settings.sound.volume", { value: musicVolume })}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-8">
                {/* Language selection */}
                <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl border border-purple-500 relative overflow-hidden">
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-green-500 rounded-full opacity-10"></div>
                  <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
                    <FaGlobe className="text-blue-400 mr-3" />
                    {t("settings.language.title")}
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {renderLanguageButton(
                      "es",
                      t("settings.language.es"),
                      "🇪🇸"
                    )}
                    {renderLanguageButton(
                      "en",
                      t("settings.language.en"),
                      "🇬🇧"
                    )}
                    {renderLanguageButton(
                      "fr",
                      t("settings.language.fr"),
                      "🇫🇷"
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl border border-purple-500 relative overflow-hidden">
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-red-500 rounded-full opacity-10"></div>
                  <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
                    <GiCrossedSwords className="text-yellow-400 mr-3" />
                    {t("common.actions")}
                  </h2>
                  <div className="flex flex-col gap-5">
                    <motion.button
                      className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white py-4 px-6 rounded-xl flex items-center justify-center shadow-lg"
                      onClick={() => setShowAboutUs(true)}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaInfoCircle className="h-7 w-7 mr-3 text-yellow-300" />
                      <span className="font-bold text-lg">
                        {t("settings.buttons.aboutUs")}
                      </span>
                    </motion.button>
                    <motion.button
                      className="relative overflow-hidden bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white py-4 px-6 rounded-xl flex items-center justify-center shadow-lg"
                      onClick={handleLogout}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaSignOutAlt className="h-7 w-7 mr-3 text-yellow-300" />
                      <span className="font-bold text-lg">
                        {t("settings.buttons.logout")}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background decorative elements */}
          <motion.div
            className="absolute -z-10 w-full h-full top-0 left-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 30%, rgba(124, 58, 237, 0.15) 0%, transparent 20%)",
                "radial-gradient(circle at 80% 70%, rgba(124, 58, 237, 0.15) 0%, transparent 20%)",
                "radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.15) 0%, transparent 20%)",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>
      )}

      {/* About Us Modal */}
      <AnimatePresence>
        {showAboutUs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 overflow-y-auto bg-cover bg-center scrollbar-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-gray-900 border-2 border-purple-500 p-8 rounded-xl w-11/12 max-w-lg shadow-2xl relative"
            >
              {/* Decorative elements */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-purple-500 rounded-full"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-purple-500 rounded-full"></div>

              <motion.button
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
                onClick={() => setShowAboutUs(false)}
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              ></motion.button>

              <div className="text-center mb-6">
                <motion.h2
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-3xl font-bold mb-2"
                  animate={{
                    textShadow: "0 0 8px rgba(216, 180, 254, 0.6)",
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.5,
                  }}
                >
                  {t("aboutUs.title")}
                </motion.h2>
                <div className="w-1/3 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4"></div>
              </div>

              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                {t("aboutUs.content")}
              </p>

              <div className="flex justify-center">
                <motion.button
                  className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white py-3 px-8 rounded-xl font-bold shadow-lg"
                  onClick={() => setShowAboutUs(false)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("settings.buttons.close")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Ajustes;
