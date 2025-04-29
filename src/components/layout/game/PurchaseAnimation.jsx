/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react";
import { FaCoins, FaCheckCircle } from "react-icons/fa";

const PurchaseAnimation = () => {
  const [stage, setStage] = useState("initial");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Start animation sequence
    const sequence = async () => {
      // Initial delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setStage("processing");
      
      // Processing animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStage("success");
      setShowConfetti(true);
      
      // Show success for a moment
      await new Promise(resolve => setTimeout(resolve, 3000));
      setShowConfetti(false);
      await new Promise(resolve => setTimeout(resolve, 500));
      setStage("initial");
    };
    
    sequence();
    
    const interval = setInterval(() => {
      sequence();
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);

  // Generate confetti pieces
  const renderConfetti = () => {
    const confettiPieces = [];
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-400', 'bg-green-400', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];
    const shapes = ['rounded-full', 'rounded-sm', 'rounded'];
    
    for (let i = 0; i < 60; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.floor(Math.random() * 10) + 5; // 5-15px
      const left = Math.floor(Math.random() * 100);
      const animationDelay = Math.random() * 0.5;
      const animationDuration = 1 + Math.random() * 2;
      
      confettiPieces.push(
        <div 
          key={i}
          className={`absolute ${color} ${shape} confetti-piece`}
          style={{
            width: `${size}px`,
            height: `${size / 2}px`,
            left: `${left}%`,
            top: '-20px',
            animationDelay: `${animationDelay}s`,
            animationDuration: `${animationDuration}s`
          }}
        />
      );
    }
    return confettiPieces;
  };

  return (
    <div className="relative h-96 w-full flex items-center justify-center bg-gray-900/50 rounded-xl overflow-hidden">
      {/* Background glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stage === "success" ? "from-green-500/20 to-blue-500/20" : "from-blue-600/20 to-indigo-600/20"} transition-all duration-1000`}></div>
      
      {/* Card silhouette in background */}
      <div className="absolute opacity-10 w-48 h-64 rounded-xl border-4 border-white"></div>
      
      {/* Confetti container */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden z-10">
          {renderConfetti()}
        </div>
      )}
      
      {/* Processing animation */}
      {stage === "processing" && (
        <div className="flex flex-col items-center z-20">
          <div className="relative flex items-center justify-center">
            {/* Spinning circles */}
            <div className="absolute w-24 h-24 border-t-4 border-blue-400 rounded-full animate-spin"></div>
            <div className="absolute w-16 h-16 border-r-4 border-blue-300 rounded-full animate-spin-slow"></div>
            
            {/* Coins animation */}
            <div className="relative z-10">
              <FaCoins className="text-yellow-400 text-5xl animate-pulse" />
            </div>
          </div>
          <p className="mt-8 text-white text-xl font-semibold animate-pulse">Procesando compra...</p>
        </div>
      )}
      
      {/* Success animation */}
      {stage === "success" && (
        <div className="flex flex-col items-center scale-in z-20">
          {/* Success checkmark with rays */}
          <div className="relative">
            {/* Rays around checkmark */}
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full blur-md animate-pulse"></div>
            
            {/* Card glow behind */}
            <div className="absolute -top-4 -left-8 w-40 h-56 rounded-xl bg-white/10 transform rotate-6 scale-75 animate-float-slow"></div>
            <div className="absolute -bottom-4 -right-8 w-40 h-56 rounded-xl bg-white/10 transform -rotate-6 scale-75 animate-float-reverse"></div>
            
            {/* Checkmark */}
            <div className="relative z-10 shadow-lg">
              <FaCheckCircle className="text-green-400 text-6xl animate-success" />
            </div>
            
            {/* Floating particles */}
            <span className="absolute -top-8 -left-8 w-3 h-3 bg-green-400 rounded-full animate-float"></span>
            <span className="absolute top-0 -right-8 w-2 h-2 bg-yellow-400 rounded-full animate-float-delay"></span>
            <span className="absolute -bottom-6 left-0 w-4 h-4 bg-blue-400 rounded-full animate-float-slow"></span>
          </div>
          
          {/* Success text */}
          <div className="mt-8 flex flex-col items-center slide-up-fade">
            <h3 className="text-green-400 text-2xl font-bold mb-1">¡Compra Exitosa!</h3>
            <p className="text-white text-lg">Carta añadida a tu colección</p>
          </div>
        </div>
      )}
      
      {/* Static state (initial) */}
      {stage === "initial" && (
        <div className="flex flex-col items-center z-20">
          <p className="text-white text-lg font-medium">Haz clic en Comprar para adquirir esta carta</p>
          <div className="mt-4 w-40 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center shadow-lg cursor-pointer hover:from-green-500 hover:to-green-400 transition-all">
            <span className="text-white font-semibold">Comprar</span>
          </div>
        </div>
      )}
      
      {/* Add custom keyframes for animations using style tag */}
      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0) rotate(6deg); }
          50% { transform: translateY(-5px) translateX(8px) rotate(8deg); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0) translateX(0) rotate(-6deg); }
          50% { transform: translateY(5px) translateX(-8px) rotate(-8deg); }
        }
        
        @keyframes float-delay {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slide-up-fade {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes success {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes confetti-fall {
          0% { 
            transform: translateY(-10px) rotate(0deg); 
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% { 
            transform: translateY(500px) rotate(360deg); 
            opacity: 0;
          }
        }
        
        @keyframes confetti-sway {
          0%, 100% {
            transform: translateX(-10px);
          }
          50% {
            transform: translateX(10px);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 3.5s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 2.5s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        
        .scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        
        .slide-up-fade {
          animation: slide-up-fade 0.7s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .animate-success {
          animation: success 0.5s ease-out forwards;
        }
        
        .confetti-piece {
          position: absolute;
          animation: confetti-fall 3s ease-in-out forwards, confetti-sway 2s ease-in-out infinite;
          transform-origin: center center;
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default PurchaseAnimation;