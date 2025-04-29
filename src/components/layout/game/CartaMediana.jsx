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
  responsive = true
}) {
  const {
    alias,
    equipo,
    escudo,
    photo,
    tipo_carta,
  } = jugador;

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
          bottom: (useSmallLayout || isMobile) ? "45%" : "46%",
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? "40%" : (useSmallLayout ? "55%" : "45%"),
          height: isMobile ? "35%" : (useSmallLayout ? "45%" : "35%"),
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
          bottom: "33%",
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
  responsive: PropTypes.bool
};

CartaMediana.defaultProps = {
  className: "",
  small: false,
  responsive: true
};

export default CartaMediana;
