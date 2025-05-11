import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaTimes, FaCheck, FaPen, FaTrophy, FaUserAlt, FaChartLine } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { getProfile, updateProfile } from "../services/api/profileApi";
import { getToken } from "../services/api/authApi";
import background from "../assets/background.png";
import PropTypes from "prop-types";

// Componente para efectos de partículas
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
        
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

// Componente para el botón de retroceso
const BackButton = ({ onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors"
    onClick={onClick}
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </motion.button>
);

// Componente de tarjeta para los matches
const MatchCard = ({ partida, t }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
    className={`flex justify-between items-center rounded-md px-4 py-3 ${
      partida.isWin ? "bg-green-900/30" : "bg-red-900/30"
    } border-l-4 ${
      partida.isWin ? "border-green-400" : "border-red-400"
    } hover:bg-opacity-70 transition-all duration-200 transform hover:scale-102`}
  >
    <div className="flex items-center space-x-2">
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        {partida.isWin ? (
          <FaCheck className="text-green-400 text-xl" />
        ) : (
          <FaTimes className="text-red-400 text-xl" />
        )}
      </motion.div>
      <span
        className={`font-bold ${
          partida.isWin ? "text-green-400" : "text-red-400"
        }`}
      >
        {partida.result ||
          (partida.isWin
            ? t("profile.victory")
            : t("profile.defeat"))}
      </span>
      <span className="text-sm">
        {partida.username || t("profile.player")} vs{" "}
        {partida.rival || t("profile.rival")}
      </span>
    </div>
    <span className="font-semibold">{partida.score}</span>
  </motion.div>
);

MatchCard.propTypes = {
  partida: PropTypes.shape({
    isWin: PropTypes.bool.isRequired,
    result: PropTypes.string,
    username: PropTypes.string,
    rival: PropTypes.string,
    score: PropTypes.string.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
};

// Componente principal del perfil
const Profile = () => {
  const token = getToken();
  const [infoUser, setInfoUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [activeTab, setActiveTab] = useState("partidas");
  const [animateXp, setAnimateXp] = useState(false);
  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        console.log("Perfil obtenido:", data);
        setInfoUser(data);
        setNewUsername(data.data.username);
        setSelectedAvatar(data.data.avatar);
        
        // Iniciar animación de XP después de cargar los datos
        setTimeout(() => {
          setAnimateXp(true);
        }, 500);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const avatar = infoUser?.data?.avatar || "";
  const username = infoUser?.data?.username || "Cargando...";
  const level = infoUser?.data?.level || 1;
  const experiencia = infoUser?.data?.experience || 0;
  const xpMax = infoUser?.data?.xpMax ? Math.floor(infoUser.data.xpMax) : 1;
  const friendCode = infoUser?.data?.friend_code || "";
  const progress = experiencia / xpMax;
  const degrees = progress * 360;
  const partidas = infoUser?.data?.partidas || [];

  const winCount = partidas.filter((p) => p.isWin).length;
  const lossCount = partidas.filter((p) => !p.isWin).length;
  const winRate = partidas.length > 0 ? Math.round((winCount / partidas.length) * 100) : 0;

  const avatars = Array.from(
    { length: 8 },
    (_, i) => `/assets/profile_${i + 1}.png`
  );

  const handleEditClick = () => {
    setNewUsername(username);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile({ username: newUsername });
      const data = await getProfile();
      setInfoUser(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewUsername(username);
  };

  const handleAvatarClick = () => {
    setIsEditingAvatar(true);
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleSaveAvatar = async () => {
    try {
      await updateProfile({ avatar: selectedAvatar });
      const data = await getProfile();
      setInfoUser(data);
      setIsEditingAvatar(false);
    } catch (error) {
      console.error("Error al actualizar el avatar:", error);
    }
  };

  const handleCancelAvatar = () => {
    setIsEditingAvatar(false);
    setSelectedAvatar(avatar);
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  const handleLogrosClick = () => {
    navigate("/logros");
  };

  // Configuración para la animación del círculo de XP
  const progressAnimation = {
    start: { pathLength: 0, opacity: 0 },
    end: {
      pathLength: progress,
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center text-white overflow-auto"
      style={{ backgroundImage: `url(${background})` }}
    >
      <ParticleBackground />
      
      <div className="relative z-10 flex flex-col items-center pt-5 px-4 pb-16">
        <div className="self-start mb-4">
          <BackButton onClick={handleBackClick} />
        </div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-32"
          >
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg">{t("profile.loading")}</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative w-36 h-36 flex items-center justify-center mb-2"
            >
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial="start"
                  animate={animateXp ? "end" : "start"}
                  variants={progressAnimation}
                  transform="rotate(-90 50 50)"
                  strokeDasharray="282.7"
                  strokeDashoffset="0"
                />
              </svg>
              <div
                className="absolute inset-[8px] rounded-full overflow-hidden bg-black flex items-center justify-center cursor-pointer shadow-lg shadow-blue-500/30"
                onClick={handleAvatarClick}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full h-full"
                >
                  <img
                    src={avatar}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-center"
            >
              <motion.p 
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ 
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                {t("profile.level")} {level}
              </motion.p>
              <p className="text-sm text-gray-200">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {experiencia} / {xpMax} XP
                </motion.span>
              </p>
            </motion.div>
          </>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex flex-col items-center bg-black/70 backdrop-blur-md rounded-2xl px-10 py-4 shadow-xl shadow-blue-500/10 border border-blue-500/20"
        >
          <div className="flex items-center space-x-2">
            <motion.span 
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
              whileHover={{ scale: 1.05 }}
            >
              {username}
            </motion.span>
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer"
            >
              <FaPen
                className="hover:text-blue-400 transition"
                onClick={handleEditClick}
              />
            </motion.div>
          </div>

          <div className="flex items-center space-x-2 mt-3">
            <span className="text-sm text-blue-300">{t("profile.id")}</span>
            <span className="text-xs font-light">{friendCode}</span>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="text-lg text-blue-400 hover:text-blue-300 transition"
              onClick={() => {
                navigator.clipboard.writeText(friendCode);
              }}
            >
              <FiCopy />
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
          className="flex items-center justify-center space-x-6 mt-6"
        >
          <motion.div 
            className="flex flex-col items-center p-4 bg-green-900/30 rounded-xl border border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-2xl font-bold text-green-400">{winCount}</div>
            <div className="flex items-center space-x-1 mt-1">
              <FaCheck className="text-green-400" />
              <span className="text-sm text-green-200">
                {t("profile.wins", { count: winCount })}
              </span>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center p-4 bg-blue-900/30 rounded-xl border border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-2xl font-bold text-blue-400">{winRate}%</div>
            <div className="flex items-center space-x-1 mt-1">
              <FaChartLine className="text-blue-400" />
              <span className="text-sm text-blue-200">
                {t("profile.winRate")}
              </span>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center p-4 bg-red-900/30 rounded-xl border border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-2xl font-bold text-red-400">{lossCount}</div>
            <div className="flex items-center space-x-1 mt-1">
              <FaTimes className="text-red-400" />
              <span className="text-sm text-red-200">
                {t("profile.losses", { count: lossCount })}
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 w-full max-w-xl bg-black/80 backdrop-blur-md rounded-xl p-5 shadow-xl shadow-blue-900/20 border border-blue-900/20"
        >
          <div className="flex items-center justify-center mb-5 space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-lg flex items-center space-x-2 transition duration-300 ${
                activeTab === "partidas" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("partidas")}
            >
              <FaUserAlt />
              <span>{t("profile.matches")}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-lg flex items-center space-x-2 transition duration-300 ${
                activeTab === "estadisticas" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("estadisticas")}
            >
              <FaChartLine />
              <span>{t("profile.stats")}</span>
            </motion.button>
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === "partidas" && (
              <motion.div
                key="partidas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-center text-xl font-semibold mb-4 text-blue-100 flex items-center justify-center">
                  <FaUserAlt className="mr-2" />
                  {t("profile.lastMatches")}
                </h2>
                {partidas.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-800">
                    <AnimatePresence>
                      {partidas.map((partida, index) => (
                        <MatchCard key={index} partida={partida} t={t} />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.p 
                    className="text-center py-10 text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  >
                    {t("profile.noMatches")}
                  </motion.p>
                )}
              </motion.div>
            )}
            
            {activeTab === "estadisticas" && (
              <motion.div
                key="estadisticas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-center text-xl font-semibold mb-6 text-blue-100 flex items-center justify-center">
                  <FaChartLine className="mr-2" />
                  {t("profile.stats")}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-300">{t("profile.winRate")}</span>
                      <span className="text-sm font-bold text-blue-200">{winRate}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <motion.div 
                        className="bg-blue-600 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${winRate}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      ></motion.div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-green-300">{t("profile.xpProgress")}</span>
                      <span className="text-sm font-bold text-green-200">{Math.round(progress * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <motion.div 
                        className="bg-green-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress * 100}%` }}
                        transition={{ duration: 1, delay: 0.4 }}
                      ></motion.div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium text-gray-200 mb-3">{t("profile.matchStats")}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900/70 p-3 rounded-lg">
                        <p className="text-sm text-gray-400">{t("profile.totalMatches")}</p>
                        <p className="text-xl font-bold text-white">{partidas.length}</p>
                      </div>
                      <div className="bg-gray-900/70 p-3 rounded-lg">
                        <p className="text-sm text-gray-400">{t("profile.winStreak")}</p>
                        <p className="text-xl font-bold text-white">
                          {(() => {
                            let currentStreak = 0;
                            let maxStreak = 0;
                            for (let i = 0; i < partidas.length; i++) {
                              if (partidas[i].isWin) {
                                currentStreak++;
                                maxStreak = Math.max(maxStreak, currentStreak);
                              } else {
                                currentStreak = 0;
                              }
                            }
                            return maxStreak;
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-10 w-full max-w-xl"
        >
          <motion.button
            initial={{ scale: 1 }}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: "0 10px 25px -5px rgba(147, 51, 234, 0.5)" 
            }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogrosClick}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg transition-all shadow-lg font-medium transform flex items-center justify-center space-x-2 group"
          >
            <FaTrophy className="text-yellow-300 group-hover:rotate-12 transition-transform" />
            <span>{t("profile.achievements")}</span>
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-xl p-6 w-80 shadow-2xl border border-blue-500/30"
            >
              <h2 className="text-xl font-semibold mb-4 text-center text-blue-100">
                {t("profile.editing.title")}
              </h2>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 border border-blue-500/20"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <div className="flex justify-around">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition shadow-md shadow-blue-500/30"
                  onClick={handleSave}
                >
                  {t("profile.save")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition shadow-md shadow-red-500/30"
                  onClick={handleCancel}
                >
                  {t("profile.cancel")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditingAvatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-xl p-6 w-96 shadow-2xl border border-blue-500/30"
            >
              <h2 className="text-xl font-semibold mb-4 text-center text-blue-100">
                {t("profile.avatar.select")}
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {avatars.map((avatarSrc, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`cursor-pointer p-2 rounded-lg ${
                      selectedAvatar === avatarSrc
                        ? "border-2 border-blue-500 bg-blue-500/20"
                        : "border-2 border-transparent"
                    } hover:bg-gray-700 transition-all`}
                    onClick={() => handleAvatarSelect(avatarSrc)}
                  >
                    <img
                      src={avatarSrc}
                      alt={`Avatar ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg transition-all duration-300"
                    />
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-around mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition shadow-md shadow-blue-500/30"
                  onClick={handleSaveAvatar}
                >
                  {t("profile.avatar.save")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition shadow-md shadow-red-500/30"
                  onClick={handleCancelAvatar}
                >
                  {t("profile.avatar.cancel")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;