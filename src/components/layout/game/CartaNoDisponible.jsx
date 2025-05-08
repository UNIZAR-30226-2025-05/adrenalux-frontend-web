import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaLock } from "react-icons/fa";
import FondoCartaNormal from "../../../assets/cartaNormal.png";
import FondoCartaLuxury from "../../../assets/card_luxury.png";
import FondoCartaLuxuryXI from "../../../assets/card_luxuryxi.png";
import FondoCartaMegaLuxury from "../../../assets/card_megaluxury.png";

function CartaNoDisponible({ 
  jugador, 
  className,
  width,
  height,
  small,
  responsive = true
}) {
  const { alias, equipo, escudo, tipo_carta } = jugador;

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
        ? "clamp(4rem, 15vw, 8rem)"
        : (small ? "clamp(6rem, 16vw, 13rem)" : "clamp(3rem, 8vw, 6.5rem)"))
    : (isMobile 
        ? "6rem"
        : (small ? "10rem" : "5rem")));

  const cardHeight = height || (responsive 
    ? (isMobile 
        ? "clamp(6rem, 22vw, 12rem)"
        : (small ? "clamp(8rem, 24vw, 18rem)" : "clamp(4rem, 12vw, 9rem)"))
    : (isMobile 
        ? "9rem"
        : (small ? "14rem" : "7rem")));

  const useSmallLayout = isMobile || small || (responsive && windowWidth < 640);

  const textStyles = isMobile ? {
    alias: "text-xs font-normal",
  } : useSmallLayout ? {
    alias: "text-sm sm:text-base md:text-lg lg:text-xl font-normal",
  } : {
    alias: "text-xs sm:text-xs md:text-sm lg:text-sm font-normal",
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
      {/* Overlay con ícono de candado */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <FaLock 
          className="text-white transition-all duration-300" 
          style={{ 
            fontSize: isMobile ? "1.5rem" : (useSmallLayout ? "2rem" : "1rem") 
          }}
        />
      </div>

      {/* Escudo del equipo */}
      <img
        src={escudo}
        alt={equipo}
        className="absolute object-contain transition-all duration-300"
        style={{
          bottom: "10%",
          right: "15%",
          width: isMobile ? "16%" : (useSmallLayout ? "20%" : "18%"),
          height: "auto",
        }}
      />

      {/* Alias del jugador */}
      <div
        className={`absolute text-white transition-all duration-300 ${textStyles.alias} ${getFontWeight()}`}
        style={{
          bottom: "10%",
          left: "15%",
          width: "50%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          letterSpacing: (useSmallLayout || isMobile) ? "0" : "-0.02em",
          opacity: isMobile ? 1 : ((useSmallLayout) ? 1 : (windowWidth < 480 ? 0.95 : 1))
        }}
      >
        {alias}
      </div>
    </div>
  );
}

CartaNoDisponible.propTypes = {
  jugador: PropTypes.shape({
    alias: PropTypes.string.isRequired,
    equipo: PropTypes.string.isRequired,
    escudo: PropTypes.string.isRequired,
    tipo_carta: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  small: PropTypes.bool,
  responsive: PropTypes.bool
};

CartaNoDisponible.defaultProps = {
  className: "",
  small: false,
  responsive: true
};

export default CartaNoDisponible;