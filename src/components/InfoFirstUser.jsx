import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaTimes,
  FaCheck,
  FaUsers,
  FaExchangeAlt,
  FaTrophy,
  FaGamepad,
  FaGlobe,
} from "react-icons/fa";
import {
  GiSoccerBall,
  GiSoccerField,
  GiCardPlay,
  GiTrophy,
  GiCardRandom,
  GiCardPickup,
} from "react-icons/gi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.png";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageProvider";
import { useLocation } from "react-router-dom";
// Sample football cards for illustration
const cardImages = [
  "src/assets/card_luxury.png",
  "/assets/card_sample_2.png",
  "/assets/card_sample_3.png",
];

export default function WelcomeLanding() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showLanding, setShowLanding] = useState(false);
  const [hasSkipped, setHasSkipped] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const location = useLocation();
  // Simulate staggered entrance
  useEffect(() => {
    const checkUserStatus = () => {
      // Verifica si viene de /home a través del estado de navegación
      const comesFromHome =
        location.state?.fromHome ||
        new URLSearchParams(location.search).get("fromHome") === "true";

      if (comesFromHome) {
        // Si viene de /home, muestra el tutorial sin importar si ya lo ha visto
        setShowLanding(true);
      } else {
        // Lógica original para nuevos usuarios
        const isNewUser = localStorage.getItem("isNewUser") === "true";
        const hasSeenTutorial =
          localStorage.getItem("welcomeTutorialSeen") === "true";

        if (!isNewUser || hasSeenTutorial) {
          navigate("/home");
        } else {
          setShowLanding(true);
        }
      }
    };

    const timer = setTimeout(checkUserStatus, 100);
    return () => clearTimeout(timer);
  }, [navigate, location]);

  // Football game features data
  const gameFeatures = [
    {
      title: t("info.features.openCardPacks.title"),
      description: t("info.features.openCardPacks.description"),
      icon: <GiCardRandom className="text-5xl text-purple-400" />,
      color: "from-purple-400 to-purple-600",
      bg: "bg-purple-900/30",
      border: "border-purple-500",
    },
    {
      title: t("info.features.duelYourFriends.title"),
      description: t("info.features.duelYourFriends.description"),
      icon: <IoGameController className="text-5xl text-red-400" />,
      color: "from-red-400 to-red-600",
      bg: "bg-red-900/30",
      border: "border-red-500",
    },
    {
      title: t("info.features.tradeInTheMarketplace.title"),
      description: t("info.features.tradeInTheMarketplace.description"),
      icon: <MdOutlineShoppingCart className="text-5xl text-green-400" />,
      color: "from-green-400 to-green-600",
      bg: "bg-green-900/30",
      border: "border-green-500",
    },
    {
      title: t("info.features.buildYourDreamTeam.title"),
      description: t("info.features.buildYourDreamTeam.description"),
      icon: <GiSoccerField className="text-5xl text-blue-400" />,
      color: "from-blue-400 to-blue-600",
      bg: "bg-blue-900/30",
      border: "border-blue-500",
    },
    {
      title: t("info.features.howToPlay.title"),
      description: t("info.features.howToPlay.description"),
      icon: <FaGamepad className="text-5xl text-yellow-400" />,
      color: "from-yellow-400 to-yellow-600",
      bg: "bg-yellow-900/30",
      border: "border-yellow-500",
    },
  ];

  const handleContinue = () => {
    if (currentStep < gameFeatures.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem("welcomeTutorialSeen", "true");
      localStorage.removeItem("isNewUser");
      navigate("/home");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("welcomeTutorialSeen", "true");
    localStorage.removeItem("isNewUser");
    navigate("/home");
  };

  const handleLanguageChange = (newLang) => {
    changeLanguage(newLang);
    setShowLanguageModal(false);
  };

  const getButtonText = () => {
    if (currentStep === gameFeatures.length - 1) {
      return t("info.buttons.hitThePitch");
    }
    return t("info.buttons.next");
  };

  const renderLanguageButton = (lang, label, flag) => {
    const isActive = currentLanguage === lang;
    return (
      <motion.button
        onClick={() => handleLanguageChange(lang)}
        onHoverStart={() => setIsHovered(lang)}
        onHoverEnd={() => setIsHovered(null)}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg"
            : "bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-md"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-white opacity-10 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
            }}
          />
        )}
        <span className="text-3xl">{flag}</span>
      </motion.button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70" />

      <AnimatePresence mode="wait">
        {showLanding && !hasSkipped && (
          <motion.div
            key="welcome-landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 w-full max-w-4xl mx-auto p-4"
          >
            {/* Floating cards in background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {cardImages.map((img, index) => (
                <motion.div
                  key={`card-${index}`}
                  className="absolute opacity-30"
                  style={{
                    top: `${10 + Math.random() * 80}%`,
                    left: `${Math.random() * 80}%`,
                    zIndex: -1,
                  }}
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, Math.random() * 10 - 5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5 + Math.random() * 2,
                    delay: Math.random() * 2,
                  }}
                >
                  <div
                    className="w-24 h-32 rounded-lg shadow-xl"
                    style={{
                      background: img
                        ? `url(${img})`
                        : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      backgroundSize: "cover",
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Main content card */}
            <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl border-2 border-green-500 shadow-2xl overflow-hidden">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-yellow-400 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-yellow-400 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-yellow-400 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-yellow-400 rounded-br-lg" />

              {/* Header with title, skip button, and language button */}
              <div className="bg-gradient-to-r from-green-900 to-blue-900 p-4 md:p-6 flex justify-between items-center">
                <motion.h1
                  className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-200"
                  animate={{
                    textShadow: [
                      "0 0 8px rgba(34, 197, 94, 0.7)",
                      "0 0 12px rgba(34, 197, 94, 0.9)",
                      "0 0 8px rgba(34, 197, 94, 0.7)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  {t("info.welcome.title")}
                </motion.h1>
                <div className="flex items-center space-x-4">
                  <motion.button
                    onClick={() => setShowLanguageModal(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-300 hover:text-white"
                  >
                    <FaGlobe className="text-2xl" />
                  </motion.button>
                  <button
                    onClick={handleSkip}
                    className="text-gray-300 hover:text-white text-sm md:text-base flex items-center"
                  >
                    {t("info.welcome.skip")} <FaTimes className="ml-1" />
                  </button>
                </div>
              </div>

              {/* Steps indicator */}
              <div className="flex justify-center pt-6">
                {gameFeatures.map((_, index) => (
                  <motion.div
                    key={`step-${index}`}
                    className={`h-2 mx-1 rounded-full ${
                      index === currentStep
                        ? "w-8 bg-green-500"
                        : "w-2 bg-gray-600"
                    }`}
                    initial={false}
                    animate={{ width: index === currentStep ? 32 : 8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                ))}
              </div>

              {/* Main content with feature explanation */}
              <div className="p-4 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`step-content-${currentStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10"
                  >
                    {/* Icon and feature visualization */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-24 h-24 md:w-32 md:h-32 rounded-full ${gameFeatures[currentStep].bg} ${gameFeatures[currentStep].border} border-2 flex items-center justify-center shadow-lg`}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        >
                          {gameFeatures[currentStep].icon}
                        </motion.div>
                      </div>
                    </div>

                    {/* Text content */}
                    <div className="flex-1 text-center md:text-left">
                      <h2
                        className={`text-xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r ${gameFeatures[currentStep].color}`}
                      >
                        {gameFeatures[currentStep].title}
                      </h2>
                      <p className="text-gray-300 text-sm md:text-lg mb-8 max-w-2xl">
                        {gameFeatures[currentStep].description}
                      </p>

                      {/* Feature-specific visualization */}
                      <div className="min-h-[100px] flex items-center justify-center md:justify-start">
                        {/* Card Pack Opening Animation */}
                        {currentStep === 0 && (
                          <div className="flex items-center space-x-4">
                            <motion.div
                              className="w-16 h-24 md:w-20 md:h-28 rounded-lg bg-gradient-to-b from-purple-600 to-purple-900 border border-purple-400 flex items-center justify-center shadow-lg"
                              animate={{
                                rotateY: [0, 180],
                                scale: [1, 1.1, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                              }}
                            >
                              <GiCardRandom className="text-2xl text-white" />
                            </motion.div>
                            <motion.div
                              animate={{
                                opacity: [0, 1, 1, 0],
                                x: [0, 30],
                                scale: [0.8, 1.2, 1],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                              }}
                            >
                              <GiSoccerBall className="text-2xl text-white" />
                            </motion.div>
                            <div className="flex space-x-2">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={`card-reveal-${i}`}
                                  className="w-12 h-20 md:w-16 md:h-24 rounded-lg bg-gradient-to-b from-gold-600 to-gold-900 border border-yellow-400 flex items-center justify-center shadow-lg"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{
                                    opacity: 1,
                                    x: 0,
                                    y: [0, -5, 0],
                                  }}
                                  transition={{
                                    delay: i * 0.3 + 1,
                                    y: {
                                      delay: i * 0.3 + 1.5,
                                      duration: 2,
                                      repeat: Infinity,
                                      repeatType: "reverse",
                                    },
                                  }}
                                >
                                  <span className="text-xs font-bold text-white">
                                    {i === 0
                                      ? "NORMAL"
                                      : i === 1
                                      ? "LUXURY"
                                      : "+LUXURY"}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Duel Animation */}
                        {currentStep === 1 && (
                          <div className="flex items-center space-x-6">
                            <motion.div
                              className="w-16 h-24 md:w-20 md:h-28 rounded-lg bg-gradient-to-b from-blue-600 to-blue-900 border border-blue-400 flex items-center justify-center shadow-lg"
                              animate={{
                                x: [-10, 10, -10],
                                rotate: [-5, 5, -5],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                              }}
                            >
                              <span className="text-xs font-bold text-white">
                                {t("info.skills.s1")}
                              </span>
                            </motion.div>
                            <motion.div
                              animate={{
                                scale: [1, 1.5, 1],
                                color: ["#ff0000", "#ffff00", "#ff0000"],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                              }}
                            >
                              <FaExchangeAlt className="text-2xl text-red-500" />
                            </motion.div>
                            <motion.div
                              className="w-16 h-24 md:w-20 md:h-28 rounded-lg bg-gradient-to-b from-red-600 to-red-900 border border-red-400 flex items-center justify-center shadow-lg"
                              animate={{
                                x: [10, -10, 10],
                                rotate: [5, -5, 5],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                              }}
                            >
                              <span className="text-xs font-bold text-white">
                                {t("info.skills.s2")}
                              </span>
                            </motion.div>
                          </div>
                        )}
                        {/* Marketplace Animation */}
                        {currentStep === 2 && (
                          <div className="flex items-center space-x-8">
                            <motion.div
                              className="w-12 h-16 md:w-16 md:h-20 rounded-lg bg-green-800/50 border border-green-500 flex items-center justify-center"
                              animate={{
                                x: [0, 20, 0],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <GiCardPlay className="text-2xl text-green-300" />
                            </motion.div>
                            <motion.div
                              className="flex flex-col items-center"
                              animate={{
                                scale: [1, 1.1, 1],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <MdOutlineShoppingCart className="text-3xl text-yellow-400 mb-2" />
                              <div className="text-sm text-green-400 font-bold">
                                {t("info.welcome.market")}
                              </div>
                            </motion.div>
                            <motion.div
                              className="w-12 h-16 md:w-16 md:h-20 rounded-lg bg-green-800/50 border border-green-500 flex items-center justify-center"
                              animate={{
                                x: [0, -20, 0],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <GiCardPlay className="text-2xl text-green-300" />
                            </motion.div>
                          </div>
                        )}
                        {/* Dream Team Animation */}
                        {currentStep === 3 && (
                          <div className="flex items-center space-x-4">
                            <motion.div
                              className="w-48 h-36 md:w-64 md:h-48 bg-blue-800/50 border border-blue-500 rounded-lg flex items-center justify-center"
                              animate={{
                                boxShadow: [
                                  "0 0 5px rgba(59, 130, 246, 0.5)",
                                  "0 0 15px rgba(59, 130, 246, 0.8)",
                                  "0 0 5px rgba(59, 130, 246, 0.5)",
                                ],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                              }}
                            >
                              <div className="grid grid-cols-4 gap-1 w-full h-full p-2">
                                <motion.div className="col-span-4 flex justify-center">
                                  <motion.div
                                    className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center"
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{
                                      duration: 1.5,
                                      delay: 0,
                                      repeat: Infinity,
                                    }}
                                  >
                                    <span className="text-xs font-bold text-blue-800">
                                      GK
                                    </span>
                                  </motion.div>
                                </motion.div>
                                <div className="col-span-4 flex justify-around">
                                  {[2, 3, 4, 5].map((pos) => (
                                    <motion.div
                                      key={`defender-${pos}`}
                                      className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center"
                                      animate={{ y: [0, 3, 0] }}
                                      transition={{
                                        duration: 1.5,
                                        delay: pos * 0.1,
                                        repeat: Infinity,
                                      }}
                                    >
                                      <span className="text-xs font-bold text-blue-800">
                                        D{pos - 1}
                                      </span>
                                    </motion.div>
                                  ))}
                                </div>
                                <div className="col-span-4 flex justify-around">
                                  {[6, 7, 8, 9].map((pos) => (
                                    <motion.div
                                      key={`midfielder-${pos}`}
                                      className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center"
                                      animate={{ y: [0, -3, 0] }}
                                      transition={{
                                        duration: 1.5,
                                        delay: pos * 0.1,
                                        repeat: Infinity,
                                      }}
                                    >
                                      <span className="text-xs font-bold text-blue-800">
                                        M{pos - 5}
                                      </span>
                                    </motion.div>
                                  ))}
                                </div>
                                <div className="col-span-4 flex justify-around">
                                  {[10, 11, 12].map((pos) => (
                                    <motion.div
                                      key={`attacker-${pos}`}
                                      className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center"
                                      animate={{ y: [0, 3, 0] }}
                                      transition={{
                                        duration: 1.5,
                                        delay: pos * 0.1,
                                        repeat: Infinity,
                                      }}
                                    >
                                      <span className="text-xs font-bold text-blue-800">
                                        A{pos - 9}
                                      </span>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        )}
                        {/* How To Play Animation */}
                        {currentStep === 4 && (
                          <div className="flex flex-col items-center space-y-4">
                            <div className="flex items-center space-x-8 mb-4">
                              <motion.div
                                className="w-12 h-16 md:w-16 md:h-20 rounded-lg bg-yellow-800/50 border border-yellow-500 flex flex-col items-center justify-center p-1"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <GiCardPickup className="text-xl text-yellow-300 mb-1" />
                                <span className="text-xs text-yellow-300">
                                  {t("info.features.howToPlay.pick")}
                                </span>
                              </motion.div>
                              <motion.div
                                animate={{
                                  rotate: [0, 0, 360],
                                  scale: [1, 1.2, 1],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                              >
                                <FaGamepad className="text-2xl text-blue-400" />
                              </motion.div>
                              <motion.div
                                className="w-12 h-16 md:w-16 md:h-20 rounded-lg bg-yellow-800/50 border border-yellow-500 flex flex-col items-center justify-center p-1"
                                animate={{ y: [0, 5, 0] }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: 1,
                                }}
                              >
                                <GiSoccerBall className="text-xl text-yellow-300 mb-1" />
                                <span className="text-xs text-yellow-300">
                                  {t("info.features.howToPlay.play")}
                                </span>
                              </motion.div>
                            </div>
                            <motion.div
                              className="flex items-center justify-center space-x-2 bg-yellow-900/20 rounded-lg px-4 py-2"
                              animate={{
                                boxShadow: [
                                  "0 0 5px rgba(234, 179, 8, 0.3)",
                                  "0 0 10px rgba(234, 179, 8, 0.6)",
                                  "0 0 5px rgba(234, 179, 8, 0.3)",
                                ],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <FaCheck className="text-green-400" />
                              <span className="text-sm text-yellow-300">
                                {t("info.features.howToPlay.info")}
                              </span>
                            </motion.div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action buttons */}
              <div className="p-6 flex justify-between">
                <div className="text-sm text-gray-400">
                  {currentStep === gameFeatures.length - 1
                    ? t("info.welcome.finalStepMessage")
                    : t("info.welcome.stepIndicator", {
                        current: currentStep + 1,
                        total: gameFeatures.length,
                      })}
                </div>
                <motion.button
                  onClick={handleContinue}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-lg flex items-center space-x-2 font-bold text-white
                    ${
                      currentStep === gameFeatures.length - 1
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-900/30"
                        : "bg-gradient-to-r from-blue-600 to-green-600 shadow-lg shadow-blue-900/30"
                    }`}
                >
                  <span>{getButtonText()}</span>
                  <FaArrowRight />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-gray-900 border-2 border-purple-500 p-8 rounded-xl w-full max-w-sm shadow-2xl relative"
            >
              {/* Decorative elements */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-purple-500 rounded-full" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-purple-500 rounded-full" />

              {/* Close Button */}
              <motion.button
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
                onClick={() => setShowLanguageModal(false)}
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes className="text-2xl" />
              </motion.button>

              <div className="text-center mb-6">
                <motion.h2
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-2xl font-bold"
                  animate={{
                    textShadow: "0 0 8px rgba(216, 180, 254, 0.6)",
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.5,
                  }}
                >
                  {t("settings.language.title")}
                </motion.h2>
              </div>

              <div className="flex justify-center space-x-6">
                {renderLanguageButton("es", t("settings.language.es"), "🇪🇸")}
                {renderLanguageButton("en", t("settings.language.en"), "🇬🇧")}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
