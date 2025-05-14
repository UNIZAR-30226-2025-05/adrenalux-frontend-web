import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FondoCartaNormal from "../../../assets/cartaNormal.png";
import FondoCartaLuxury from "../../../assets/card_luxury.png";
import FondoCartaLuxuryXI from "../../../assets/card_luxuryxi.png";
import FondoCartaMegaLuxury from "../../../assets/card_megaluxury.png";

function CartaMediana({ 
  jugador, 
  className,
  width,
  height,
  small,
  responsive = true,
  showStats = false
}) {
  const {
    alias,
    equipo,
    escudo,
    photo,
    tipo_carta,
    ataque,
    control,
    defensa
  } = jugador;

  // Calcular media
  const media = Math.round((ataque + control + defensa) / 3);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;

  const cardWidth = width || (responsive 
    ? (isMobile 
        ? showStats ? "clamp(5.5rem, 19vw, 10rem)" : "clamp(4rem, 15vw, 8rem)"
        : (small 
            ? showStats ? "clamp(8rem, 22vw, 16rem)" : "clamp(6rem, 16vw, 13rem)" 
            : showStats ? "clamp(4rem, 11vw, 8rem)" : "clamp(3rem, 8vw, 6.5rem)"))
    : (isMobile 
        ? showStats ? "8rem" : "6rem"
        : (small 
            ? showStats ? "13rem" : "10rem" 
            : showStats ? "6.5rem" : "5rem")));

  const cardHeight = height || (responsive 
    ? (isMobile 
        ? showStats ? "clamp(8rem, 30vw, 15rem)" : "clamp(6rem, 22vw, 12rem)"
        : (small 
            ? showStats ? "clamp(11rem, 32vw, 22rem)" : "clamp(8rem, 24vw, 18rem)" 
            : showStats ? "clamp(5.5rem, 16vw, 12rem)" : "clamp(4rem, 12vw, 9rem)"))
    : (isMobile 
        ? showStats ? "12rem" : "9rem"
        : (small 
            ? showStats ? "18rem" : "14rem" 
            : showStats ? "9rem" : "7rem")));

  const useSmallLayout = isMobile || small || (responsive && windowWidth < 640);

  const textStyles = isMobile ? {
    alias: "text-[0.6rem] sm:text-[0.75rem] font-normal",
    stats: "text-[0.5rem] sm:text-[0.6rem] font-light",
    media: "text-[0.6rem] sm:text-[0.7rem] font-normal"
  } : useSmallLayout ? {
    alias: "text-[1.2rem] sm:text-[1.4rem] md:text-[1.6rem] lg:text-[1.8rem] font-normal",
    stats: "text-[0.9rem] sm:text-[1.1rem] md:text-[1.3rem] lg:text-[1.5rem] font-light",
    media: "text-[1.3rem] sm:text-[1.5rem] md:text-[1.7rem] lg:text-[1.9rem] font-normal"
  } : {
    alias: "text-[0.4rem] sm:text-[0.45rem] md:text-[0.55rem] lg:text-[0.65rem] font-normal",
    stats: "text-[0.35rem] sm:text-[0.4rem] md:text-[0.45rem] lg:text-[0.55rem] font-light",
    media: "text-[0.45rem] sm:text-[0.5rem] md:text-[0.6rem] lg:text-[0.7rem] font-normal"
  };

  const getFontWeight = () => {
    if (isMobile) return "font-light";
    if (useSmallLayout) {
      if (windowWidth < 480) return "font-medium";
      if (windowWidth < 768) return "font-medium";
      return "font-medium";
    } else {
      if (windowWidth < 480) return "font-light";
      if (windowWidth < 768) return "font-normal";
      return "font-normal";
    }
  };

  const getFondo = () => {
    switch (tipo_carta) {
      case "Normal":
        return FondoCartaNormal;
      case "Luxury":
        return FondoCartaLuxury;
      case "Megaluxury":
        return FondoCartaMegaLuxury;
      case "Luxury XI":
        return FondoCartaLuxuryXI;
      default:
        return FondoCartaNormal;
    }
  };

  // Tamaños para las cajas de stats
  const getStatsBoxSize = () => {
    if (isMobile) return showStats ? "w-4 h-4" : "w-3 h-3";
    if (useSmallLayout) {
      if (windowWidth < 480) return showStats ? "w-5 h-5" : "w-4 h-4";
      if (windowWidth < 768) return showStats ? "w-6 h-6" : "w-5 h-5";
      return showStats ? "w-7 h-7" : "w-6 h-6";
    } else {
      if (windowWidth < 480) return showStats ? "w-3 h-3" : "w-2 h-2";
      if (windowWidth < 768) return showStats ? "w-4 h-4" : "w-3 h-3";
      return showStats ? "w-4 h-4" : "w-3 h-3";
    }
  };

  // Tamaños de fuente para los stats
  const getStatsFontSize = () => {
    if (isMobile) return showStats ? "text-[0.6rem]" : "text-[0.5rem]";
    if (useSmallLayout) {
      if (windowWidth < 480) return showStats ? "text-[0.85rem]" : "text-[0.7rem]";
      if (windowWidth < 768) return showStats ? "text-[1rem]" : "text-[0.9rem]";
      return showStats ? "text-[1.1rem]" : "text-[1rem]";
    } else {
      if (windowWidth < 480) return showStats ? "text-[0.35rem]" : "text-[0.25rem]";
      if (windowWidth < 768) return showStats ? "text-[0.4rem]" : "text-[0.3rem]";
      return showStats ? "text-[0.45rem]" : "text-[0.35rem]";
    }
  };

  const statsBoxSize = getStatsBoxSize();
  const statsFontSize = getStatsFontSize();

  return (
    <div
      className={`relative rounded-lg overflow-hidden ${useSmallLayout ? 'shadow-lg' : 'shadow-md'} transition-all duration-300 ${className}`}
      style={{
        width: cardWidth,
        height: cardHeight,
        backgroundImage: `url(${getFondo()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Foto del jugador */}
      <div
        className="absolute transition-all duration-300"
        style={{
                        bottom: (useSmallLayout || isMobile) ? (showStats ? "46%" : "52%") : (showStats ? "46%" : "46%"),
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? (showStats ? "45%" : "40%") : (useSmallLayout ? (showStats ? "60%" : "55%") : (showStats ? "50%" : "45%")),
          height: isMobile ? (showStats ? "40%" : "35%") : (useSmallLayout ? (showStats ? "50%" : "45%") : (showStats ? "40%" : "35%")),
        }}
      >
        <img
          src={photo}
          alt={alias}
          className="w-full h-full object-cover"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>

      {/* Escudo del equipo */}
      <img
        src={escudo}
        alt={equipo}
        className="absolute object-contain transition-all duration-300"
        style={{
          top: "8%",
          right: "15%",
          width: isMobile ? "16%" : (useSmallLayout ? "24%" : "18%"),
          height: "auto",
        }}
      />

      {/* Alias del jugador */}
      <div
        className={`absolute text-white transition-all duration-300 ${textStyles.alias} ${getFontWeight()}`}
        style={{
          bottom: showStats ? "37%" : "33%",
          left: (useSmallLayout || isMobile) ? "15%" : "12%",
          width: "70%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          letterSpacing: (useSmallLayout || isMobile) ? "0" : "-0.02em",
          opacity: isMobile ? 1 : ((useSmallLayout) ? 1 : (windowWidth < 480 ? 0.95 : 1))
        }}
      >
        {alias}
      </div>

      {/* Stats (solo si showStats es true) */}
      {showStats && (
        <>
          <div 
            className={`absolute left-1/2 transform -translate-x-1/2 flex gap-1`}
            style={{
              bottom: (useSmallLayout || isMobile) ? "32%" : "26%",
            }}
          >
            {/* Ataque con gradiente de rojo */}
            <div 
              className={`${statsBoxSize} rounded-lg flex items-center justify-center text-white font-semibold shadow-md ${statsFontSize}`}
              style={{ 
                background: 'linear-gradient(135deg, #ff0000, #990000)'
              }}
            >
              {ataque}
            </div>
            {/* Control con gradiente de azul */}
            <div 
              className={`${statsBoxSize} rounded-lg flex items-center justify-center text-white font-semibold shadow-md ${statsFontSize}`}
              style={{ 
                background: 'linear-gradient(135deg, #0066ff, #003399)'
              }}
            >
              {control}
            </div>
            {/* Defensa con gradiente de verde */}
            <div 
              className={`${statsBoxSize} rounded-lg flex items-center justify-center text-white font-semibold shadow-md ${statsFontSize}`}
              style={{ 
                background: 'linear-gradient(135deg, #00cc00, #006600)'
              }}
            >
              {defensa}
            </div>
          </div>

          {/* Media */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{
              bottom: (useSmallLayout || isMobile) ? "22%" : "16%",
            }}
          >
            {/* Media con gradiente amarillo/dorado */}
            <div 
              className={`${statsBoxSize} rounded-lg flex items-center justify-center text-white font-semibold shadow-md ${statsFontSize}`}
              style={{ 
                background: 'linear-gradient(135deg, #ffcc00, #cc9900)'
              }}
            >
              {media}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

CartaMediana.propTypes = {
  jugador: PropTypes.shape({
    alias: PropTypes.string.isRequired,
    ataque: PropTypes.number.isRequired,
    control: PropTypes.number.isRequired,
    defensa: PropTypes.number.isRequired,
    equipo: PropTypes.string.isRequired,
    escudo: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    tipo_carta: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
    pais: PropTypes.string.isRequired,
    posicion: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  small: PropTypes.bool,
  responsive: PropTypes.bool,
  showStats: PropTypes.bool
};

CartaMediana.defaultProps = {
  className: "",
  small: false,
  responsive: true,
  showStats: false
};

export default CartaMediana;