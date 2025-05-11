import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { socketService } from "../services/websocket/socketService";
import { getToken } from "../services/api/authApi";
import { getProfile } from "../services/api/profileApi";
import NavBarGame from "./layout/game/NavbarGame";
import background from "../assets/background.png";
import TournamentButton from "./layout/game/TournamentButton";
import ClassificationButton from "./layout/game/ClassificationButton";
import StoreButton from "./layout/game/StoreButton";
import CollectionButton from "./layout/game/CollectionButton";
import PlayButton from "./layout/game/PlayButton";
import CardsMenu from "./layout/game/CardsMenu";
import { InfoIcon } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    const initializeSocket = async () => {
      if (!socketService.socket) {
        const token = getToken();
        const profile = await getProfile();
        socketService.initialize(token, profile.data.username, navigate);
      }
    };

    if (!token) {
      navigate("/");
    }

    initializeSocket();
  }, [navigate, token]);

  const handleCardMenuTransition = (sobreData) => {
    // Use framer-motion's AnimatePresence for smooth exit
    navigate("/opening", {
      state: {
        openedCards: sobreData.openedCards,
        selectedCard: sobreData.selectedCard,
      },
    });
  };

  const navigateToInfo = () => {
    navigate("/info", { state: { fromHome: true } });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="h-screen w-full backdrop-blur-sm overflow-hidden"
        initial={{ backdropFilter: "blur(0px)" }}
        animate={{ backdropFilter: "blur(5px)" }}
        transition={{ duration: 0.8 }}
      >
        <NavBarGame />

        {/* Diseño para pantallas medianas y grandes - Layout centrado */}
        <div className="hidden md:flex flex-col h-[calc(100vh-80px)] p-4 md:p-8 relative">
          {/* Aumentado el espacio superior con mt-12 */}
          <div className="flex flex-col items-center justify-center h-full mt-32">
            {/* Área superior con botones y cartas */}
            <div className="grid grid-cols-3 mb-8 w-full">
              {/* Left Side - Menu Items en columna (dos filas) */}
              <div className="flex flex-col items-start justify-center gap-4 md:gap-6 pl-4 md:pl-12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ClassificationButton
                    className="glass-container hover:!bg-indigo-600/50 transition-all"
                    iconClassName="text-indigo-400 h-6 md:h-8 w-6 md:w-8"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <TournamentButton
                    className="glass-container hover:!bg-purple-600/50 transition-all"
                    iconClassName="text-purple-400 h-6 md:h-8 w-6 md:w-8"
                  />
                </motion.div>
              </div>

              {/* Center Area - Cards Menu con tamaño reducido y más espacio arriba */}
              <div className="flex flex-col items-center justify-center">
                <div className="transform scale-75 md:scale-80 lg:scale-85 mt-6">
                  <CardsMenu onOpenSobre={handleCardMenuTransition} />
                </div>
              </div>

              {/* Right Side - Menu Items en columna (dos filas) */}
              <div className="flex flex-col items-end justify-center gap-4 md:gap-6 pr-4 md:pr-12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <StoreButton
                    className="glass-container hover:!bg-emerald-600/50 transition-all"
                    iconClassName="text-emerald-400 h-6 md:h-8 w-6 md:w-8"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CollectionButton
                    className="glass-container hover:!bg-amber-600/50 transition-all"
                    iconClassName="text-amber-400 h-6 md:h-8 w-6 md:w-8"
                  />
                </motion.div>
              </div>
            </div>

            {/* Play Button - Más arriba y centrado */}
            <div className="flex justify-center mt-4">
              <PlayButton />
            </div>
          </div>
          {/* Info Button */}
          <motion.div
            className="absolute bottom-6 left-6 cursor-pointer"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.3,
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              },
            }}
            onClick={navigateToInfo}
          >
            <div
              className="glass-container p-3 md:p-4 rounded-full flex items-center justify-center
                  bg-gradient-to-br from-indigo-500/30 to-purple-600/30 
                  hover:from-indigo-500/50 hover:to-purple-600/50
                  border border-indigo-400/30 shadow-lg shadow-indigo-500/20
                  transition-all duration-300"
            >
              <div className="relative">
                {/* Tu SVG inline */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 md:h-6 md:w-6 text-indigo-200 drop-shadow-md"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="20" y1="9" x2="20" y2="9" />
                  <line x1="20" y1="15" x2="20" y2="15" />
                  <line x1="4" y1="9" x2="4" y2="9" />
                  <line x1="4" y1="15" x2="4" y2="15" />
                  <path d="M12 7v1" />
                  <path d="M12 16v1" />
                  <path d="M16 12h1" />
                  <path d="M7 12h1" />
                </svg>
                {/* Pulsing animation */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-indigo-400/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.4, 0.7] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
              </div>
            </div>
          </motion.div>{" "}
        </div>

        {/* Diseño para pantallas pequeñas - Vertical con Play Button debajo */}
        <div className="md:hidden flex flex-col items-center justify-center h-[calc(100vh)] p-4 relative">
          {/* Más espacio superior con mt-10 */}
          <div className="w-full mb-6 transform scale-85 mt-10">
            <CardsMenu onOpenSobre={handleCardMenuTransition} />
          </div>

          {/* Botones laterales en una sola fila */}
          <div className="w-full mb-6">
            <div className="flex justify-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ClassificationButton
                  className="glass-container hover:!bg-indigo-600/50 transition-all"
                  iconClassName="text-indigo-400 h-6 w-6"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TournamentButton
                  className="glass-container hover:!bg-purple-600/50 transition-all"
                  iconClassName="text-purple-400 h-6 w-6"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <StoreButton
                  className="glass-container hover:!bg-emerald-600/50 transition-all"
                  iconClassName="text-emerald-400 h-6 w-6"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CollectionButton
                  className="glass-container hover:!bg-amber-600/50 transition-all"
                  iconClassName="text-amber-400 h-6 w-6"
                />
              </motion.div>
            </div>
          </div>

          {/* Play Button subido más arriba */}
          <div className="w-full flex justify-center mt-4">
            <PlayButton />
          </div>

          {/* Info Button - Bottom Left Corner for small screens */}
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2
              bg-gradient-to-r from-indigo-600/80 to-purple-600/80
              backdrop-blur-md text-white text-xs md:text-sm font-medium
              px-3 py-1.5 rounded-lg pointer-events-none
              whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            Game Tutorial
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
