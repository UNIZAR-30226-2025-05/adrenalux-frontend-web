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
  responsive = true // Nueva prop para activar responsive automático
}) {
  const {
    alias,
    equipo,
    escudo,
    photo,
    tipo_carta,
  } = jugador;
  
  // Estado para manejar el tamaño de pantalla
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  
  // Efecto para actualizar el ancho de ventana
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Valores por defecto que se pueden anular con props explícitas
  const cardWidth = width || (responsive ? "clamp(3rem, 8vw, 6.5rem)" : "5rem");
  const cardHeight = height || (responsive ? "clamp(4rem, 12vw, 9rem)" : "7rem");
  
  // Determinar si debe mostrarse como pequeño basado en:
  // 1. La prop 'small' explícita
  // 2. El tamaño de pantalla si 'responsive' está activo
  const useSmallLayout = small || (responsive && windowWidth < 640);

  // Tamaños de fuente responsivos con grosor más pequeño y tamaños reducidos
  const textStyles = useSmallLayout ? {
    alias: "text-[0.4rem] sm:text-[0.45rem] md:text-[0.55rem] lg:text-[0.65rem] font-normal",
    stats: "text-[0.35rem] sm:text-[0.4rem] md:text-[0.45rem] lg:text-[0.55rem] font-light",
    media: "text-[0.45rem] sm:text-[0.5rem] md:text-[0.6rem] lg:text-[0.7rem] font-normal"
  } : {
    alias: "text-[0.55rem] sm:text-[0.6rem] md:text-[0.7rem] lg:text-[0.8rem] font-normal",
    stats: "text-[0.4rem] sm:text-[0.5rem] md:text-[0.6rem] lg:text-[0.7rem] font-light",
    media: "text-[0.6rem] sm:text-[0.7rem] md:text-[0.8rem] lg:text-[0.9rem] font-normal"
  };

  // Determinar grosor de fuente basado en el tamaño (dinámico)
  const getFontWeight = () => {
    if (windowWidth < 480) return "font-light"; // Extra pequeño
    if (windowWidth < 768) return "font-normal"; // Pequeño/medio
    return "font-normal"; // Normal para pantallas más grandes (reducido de medium)
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
      className={`relative rounded-lg overflow-hidden shadow-md transition-all duration-300 ${className}`}
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
          bottom: useSmallLayout ? "46%" : "45%",
          left: "50%",
          transform: "translateX(-50%)",
          width: useSmallLayout ? "45%" : "50%",
          height: useSmallLayout ? "35%" : "40%",
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
          top: useSmallLayout ? "8%" : "8%",
          right: useSmallLayout ? "15%" : "15%",
          width: useSmallLayout ? "18%" : "20%",
          height: "auto",
        }}
      />

      {/* Alias del jugador - con grosor dinámico y tamaño reducido */}
      <div
        className={`absolute text-white transition-all duration-300 ${textStyles.alias} ${getFontWeight()}`}
        style={{
          bottom: useSmallLayout ? "33%" : "33%",
          left: useSmallLayout ? "12%" : "15%",
          width: "70%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          letterSpacing: windowWidth < 640 ? "-0.02em" : "-0.01em", // Espaciado de letras más compacto
          opacity: windowWidth < 480 ? 0.95 : 1 // Ligera transparencia en móviles para suavizar
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