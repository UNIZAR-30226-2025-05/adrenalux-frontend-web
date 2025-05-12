import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import background from '../assets/background.png';
import Carta from './layout/game/CartaMediana';
import Carta2 from './layout/game/CartaGrande';

const GridOpenedCards = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { openedCards } = location.state || {};

  // Animation control states
  const [pageEntered, setPageEntered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [showCardDetail, setShowCardDetail] = useState(false);

  // Page entrance animation trigger
  useEffect(() => {
    // Short delay before starting entrance animation
    setTimeout(() => {
      setPageEntered(true);
    }, 100);
    
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Dynamic sizing based on viewport and device
  const getCardSize = () => {
    return {
      width: "clamp(5rem, 8vw, 9rem)",
      height: "clamp(7rem, 10vw, 11rem)"
    };
  };

  const emptySize = getCardSize();

  const handleCardClick = (index) => {
    setSelectedCardIndex(index);
    setShowCardDetail(true);
  };

  const closeCardDetail = () => {
    setShowCardDetail(false);
    // Reset selected card after animation completes
    setTimeout(() => setSelectedCardIndex(null), 500);
  };

  const handleContinue = () => {
    // Animate exit before navigating
    setPageEntered(false);
    
    setTimeout(() => {
      navigate("/home");
    }, 500);
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.8 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }),
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: openedCards ? openedCards.length * 0.05 + 0.3 : 0.3
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 0px 10px rgba(131, 2, 206, 0.7)",
      transition: { duration: 0.2 }
    }
  };

  const titleVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.5
      }
    }
  };

  const containerVariants = {
    initial: { opacity: 0, backdropFilter: "blur(0px)" },
    animate: { 
      opacity: 1, 
      backdropFilter: "blur(8px)",
      transition: {
        duration: 0.4
      }
    }
  };

  // Aura animation variants for Luxury XI cards
  const luxuryXIAuraVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.05, 1],
      filter: [
        "drop-shadow(0px 0px 10px rgba(255, 215, 0, 0.5))",
        "drop-shadow(0px 0px 20px rgba(255, 215, 0, 0.8))",
        "drop-shadow(0px 0px 10px rgba(255, 215, 0, 0.5))"
      ]
    },
    transition: {
      repeat: Infinity,
      duration: 3,
      repeatType: "mirror"
    }
  };

  // Generate confetti particles
  const generateConfetti = () => {
    return Array.from({ length: 50 }).map((_, i) => {
      const size = Math.random() * 8 + 4;
      const colors = ["#8302CE", "#490174", "#C853FF", "#FFD700", "#FF5733"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return (
        <motion.div
          key={i}
          className="fixed rounded-md"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            top: "-5%",
            left: Math.random() * 100 + "%",
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight,
            x: (Math.random() - 0.5) * 200,
            rotate: Math.random() * 360,
            opacity: [1, 1, 0.8, 0]
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            ease: "easeOut",
            delay: Math.random() * 0.5
          }}
        />
      );
    });
  };

  return (
    <motion.div
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center p-4" 
      style={{ backgroundImage: `url(${background})` }}
      variants={pageVariants}
      initial="initial"
      animate={pageEntered ? "animate" : "initial"}
      exit="exit"
      transition={{ duration: 0.6 }}
    >
      {/* Confetti effect */}
      {showConfetti && pageEntered && generateConfetti()}
      
      <motion.div 
        className="bg-black bg-opacity-50 p-4 sm:p-6 md:p-8 rounded-lg text-center w-full max-w-4xl backdrop-blur-md"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-white bg-gradient-to-r from-[#8302CE] to-[#C853FF] bg-clip-text text-transparent"
          variants={titleVariants}
          initial="initial"
          animate="animate"
        >
          ¡Cartas Obtenidas!
        </motion.h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 mx-auto">
          {openedCards?.map((card, index) => (
            <motion.div
              key={index}
              className="relative flex justify-center items-center bg-black bg-opacity-70 rounded-lg shadow-lg mx-auto overflow-hidden border border-purple-900/30 cursor-pointer"
              variants={cardVariants}
              custom={index}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleCardClick(index)}
            >
              <Carta 
                jugador={card}
                width={emptySize.width}
                height={emptySize.height}
              />
              
              {/* Card glow effect */}
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: ["Megaluxury", "Luxury XI"].includes(card?.tipo_carta) ? [0.3, 0.6, 0.3] : 0,
                  boxShadow: ["Megaluxury", "Luxury XI"].includes(card?.tipo_carta) 
                    ? "0px 0px 8px 2px rgba(195, 93, 255, 0.6), inset 0px 0px 8px 2px rgba(195, 93, 255, 0.6)" 
                    : "none"
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  repeatType: "mirror"
                }}
              />
            </motion.div>
          ))}
        </div>
        
        <motion.button
          className="px-6 py-3 bg-gradient-to-r from-[#8302CE] to-[#490174] text-white text-base sm:text-lg rounded-lg shadow-lg transition mx-auto flex items-center justify-center gap-2"
          onClick={handleContinue}
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap={{ scale: 0.95 }}
        >
          <span>Continuar</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Card detail modal */}
      <AnimatePresence>
        {showCardDetail && selectedCardIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCardDetail}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Special aura effect for Luxury XI cards */}
              {openedCards?.[selectedCardIndex]?.tipo_carta === "Luxury XI" && (
                <motion.div 
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    repeatType: "mirror"
                  }}
                  style={{
                    background: "radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 70%)",
                    transform: "scale(1.2)",
                    filter: "blur(8px) drop-shadow(0px 0px 10px rgba(255, 215, 0, 0.8))"
                  }}
                />
              )}
              
              {/* Additional golden rays for Luxury XI */}
              {openedCards?.[selectedCardIndex]?.tipo_carta === "Luxury XI" && (
                <>
                  {/* Rotating outer ring */}
                  <motion.div 
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ 
                      opacity: 0.6,
                      rotate: 360,
                      scale: 1.4,
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 20,
                      ease: "linear"
                    }}
                    style={{
                      background: "conic-gradient(from 0deg, rgba(255,215,0,0) 0%, rgba(255,215,0,0.2) 20%, rgba(255,215,0,0.3) 40%, rgba(255,215,0,0.2) 60%, rgba(255,215,0,0) 80%)",
                      filter: "blur(5px)"
                    }}
                  />
                  
                  {/* Sun ray effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1.2, 1.3, 1.2],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 4,
                      repeatType: "mirror"
                    }}
                    style={{
                      background: "radial-gradient(ellipse at center, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 70%)",
                      boxShadow: "0 0 40px 20px rgba(255,215,0,0.2)",
                      filter: "blur(10px)"
                    }}
                  />
                </>
              )}
              
              <Carta2 
                jugador={openedCards?.[selectedCardIndex]}
                width="clamp(12rem, 25vw, 18rem)"
                height="clamp(18rem, 35vw, 26rem)"
              />
              
              {/* Pulsating border effect for Luxury XI */}
              {openedCards?.[selectedCardIndex]?.tipo_carta === "Luxury XI" && (
                <motion.div 
                  className="absolute inset-0 rounded-lg pointer-events-none border-2"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0.4, 0.8, 0.4],
                    boxShadow: [
                      "0 0 10px 3px rgba(255,215,0,0.5), inset 0 0 5px 2px rgba(255,215,0,0.5)",
                      "0 0 20px 5px rgba(255,215,0,0.8), inset 0 0 10px 4px rgba(255,215,0,0.8)",
                      "0 0 10px 3px rgba(255,215,0,0.5), inset 0 0 5px 2px rgba(255,215,0,0.5)"
                    ]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    repeatType: "mirror"
                  }}
                  style={{
                    borderColor: "rgba(255,215,0,0.8)",
                  }}
                />
              )}
              
              <motion.button
                className="absolute -top-4 -right-4 bg-white rounded-full p-1 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeCardDetail}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GridOpenedCards;