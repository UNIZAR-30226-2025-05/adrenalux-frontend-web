import PropTypes from "prop-types";
import FondoCartaNormal from "../../../assets/cartaNormal.png";
import FondoCartaLuxury from "../../../assets/card_luxury.png";
import FondoCartaLuxuryXI from "../../../assets/card_luxuryxi.png";
import FondoCartaMegaLuxury from "../../../assets/card_megaluxury.png";

function CartaGrande({
  jugador,
  className = "",
  responsive = true,
  hideStats = false,
  container = null,
}) {
  const { alias, ataque, control, defensa, equipo, escudo, photo, tipo_carta } =
    jugador;

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

  const media = Math.round((ataque + control + defensa) / 3);

  // Función para truncar texto largo
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  };

  // Configurar longitud máxima según el container
  const getMaxAliasLength = () => {
    switch (container) {
      case "modal":
        return 18;
      case "marketplace":
        return 12;
      case "inventory":
        return 8;
      default:
        return responsive ? 12 : 16;
    }
  };

  // Truncar el alias según la longitud máxima
  const truncatedAlias = truncateText(alias, getMaxAliasLength());

  // Determinar las clases basadas en el container específico o usar las clases responsive por defecto
  let containerClasses = "";
  let imageClasses = "";
  let escudoClasses = "";
  let aliasClasses = "";
  let statsBoxClasses = "";
  let mediaBoxClasses = "";
  let mediaTextClasses = "";
  // Variables para posicionamiento personalizado
  let imagePosition = "";
  let escudoPosition = "";
  let aliasPosition = "";
  let statsPosition = "";
  let mediaPosition = "";

  // Si se especifica un container, usar clases específicas para ese container
  if (container) {
    switch (container) {
      case "modal":
        // Clases optimizadas para el modal
        containerClasses = "w-32 h-44 sm:w-40 sm:h-56 md:w-44 md:h-60";
        imageClasses = "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover";
        escudoClasses = "absolute w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7";
        aliasClasses = "text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[100px] md:max-w-[120px] text-center";
        statsBoxClasses = "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center text-white font-semibold text-xs";
        mediaBoxClasses = "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center";
        mediaTextClasses = "text-white font-semibold text-xs";
        // Posicionamiento personalizado para modal
        imagePosition = "bottom-[44%]"; // Movido ligeramente hacia arriba
        escudoPosition = "top-4 right-5 sm:top-5 sm:right-5 md:top-6 md:right-7"; // Movido a la izquierda
        aliasPosition = "bottom-[36%] left-1/2 transform -translate-x-1/2"; // Centrado horizontalmente
        statsPosition = "bottom-[40px] xs:bottom-[70px] sm:bottom-[90px] md:bottom-[55px] gap-0.5 xs:gap-1 sm:gap-1.5"; // Más abajo y más juntas
        mediaPosition = "bottom-[20px] xs:bottom-[35px] sm:bottom-[45px] md:bottom-[20px]"; // Más abajo
        break;
      case "marketplace":
        // Ejemplo para un marketplace
        containerClasses = "w-[140px] h-[220px] sm:w-[180px] sm:h-[280px]";
        imageClasses = "w-24 h-24 sm:w-32 sm:h-32 object-cover";
        escudoClasses = "absolute w-6 h-6 sm:w-8 sm:h-8";
        aliasClasses = "text-xs sm:text-sm truncate max-w-[90px] sm:max-w-[120px] text-center";
        statsBoxClasses = "w-5 h-5 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-white font-semibold text-xs";
        mediaBoxClasses = "w-5 h-5 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center";
        mediaTextClasses = "text-white font-semibold text-xs";
        // Posiciones para marketplace
        escudoPosition = "top-4 right-2 sm:top-6 sm:right-3";
        aliasPosition = "bottom-[39%] left-1/2 transform -translate-x-1/2";
        break;
      case "inventory":
        // Ejemplo para un inventario
        containerClasses = "w-[120px] h-[190px] sm:w-[150px] sm:h-[240px]";
        imageClasses = "w-20 h-20 sm:w-28 sm:h-28 object-cover";
        escudoClasses = "absolute w-5 h-5 sm:w-6 sm:h-6";
        aliasClasses = "text-xs truncate max-w-[70px] sm:max-w-[90px] text-center";
        statsBoxClasses = "w-4 h-4 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center text-white font-semibold text-[10px] sm:text-xs";
        mediaBoxClasses = "w-4 h-4 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center";
        mediaTextClasses = "text-white font-semibold text-[10px] sm:text-xs";
        // Posiciones para inventory
        escudoPosition = "top-3 right-2 sm:top-4 sm:right-2";
        aliasPosition = "bottom-[39%] left-1/2 transform -translate-x-1/2";
        break;
      // Puedes añadir más casos según necesites
      default:
        // Usar las clases responsive predeterminadas si el container no coincide
        containerClasses = responsive
          ? "w-[160px] h-[250px] xs:w-[180px] xs:h-[280px] sm:w-[220px] sm:h-[340px] md:w-[260px] md:h-[400px] lg:w-[300px] lg:h-[470px]"
          : "w-[300px] h-[470px]";
        imageClasses = "w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover";
        escudoClasses = "absolute top-5 right-3 w-6 h-6 xs:top-6 xs:right-3 xs:w-8 xs:h-8 sm:top-7 sm:right-4 sm:w-10 sm:h-10 md:top-8 md:right-5 md:w-12 md:h-12 lg:top-9 lg:right-5 lg:w-14 lg:h-14";
        aliasClasses = "text-xs xs:text-sm sm:text-base md:text-base lg:text-lg truncate max-w-[100px] xs:max-w-[120px] sm:max-w-[150px] md:max-w-[170px] lg:max-w-[190px] text-center";
        statsBoxClasses = "w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-lg flex items-center justify-center text-white font-semibold text-xs xs:text-xs sm:text-sm";
        mediaBoxClasses = "w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-lg flex items-center justify-center";
        mediaTextClasses = "text-white font-semibold text-xs xs:text-xs sm:text-sm";
    }
  } else {
    // Usar las clases responsive predeterminadas si no se especifica container
    containerClasses = responsive
      ? "w-[160px] h-[250px] xs:w-[180px] xs:h-[280px] sm:w-[220px] sm:h-[340px] md:w-[260px] md:h-[400px] lg:w-[300px] lg:h-[470px]"
      : "w-[300px] h-[470px]";
    imageClasses = "w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover";
    escudoClasses = "absolute top-5 right-3 w-6 h-6 xs:top-6 xs:right-3 xs:w-8 xs:h-8 sm:top-7 sm:right-4 sm:w-10 sm:h-10 md:top-8 md:right-5 md:w-12 md:h-12 lg:top-9 lg:right-5 lg:w-14 lg:h-14";
    aliasClasses = "text-xs xs:text-sm sm:text-base md:text-base lg:text-lg truncate max-w-[100px] xs:max-w-[120px] sm:max-w-[150px] md:max-w-[170px] lg:max-w-[190px] text-center";
    statsBoxClasses = "w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-lg flex items-center justify-center text-white font-semibold text-xs xs:text-xs sm:text-sm";
    mediaBoxClasses = "w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-lg flex items-center justify-center";
    mediaTextClasses = "text-white font-semibold text-xs xs:text-xs sm:text-sm";
  }

  return (
    <div
      className={`relative bg-cover rounded-lg overflow-hidden transition-all duration-300 ${containerClasses} ${className}`}
      style={{ backgroundImage: `url(${getFondo()})` }}
    >
      {/* Solo renderizamos foto y escudo si no estamos ocultando stats */}
      {!hideStats && (
        <>
          <div className={`absolute left-1/2 transform -translate-x-1/2 ${imagePosition || "bottom-[46%]"}`}>
            <img
              src={photo}
              alt={alias}
              className={imageClasses}
            />
          </div>
          <img
            src={escudo}
            alt={equipo}
            className={`${escudoClasses} ${escudoPosition || "absolute top-5 right-3 w-6 h-6 xs:top-6 xs:right-3 xs:w-8 xs:h-8 sm:top-7 sm:right-4 sm:w-10 sm:h-10 md:top-8 md:right-5 md:w-12 md:h-12 lg:top-9 lg:right-5 lg:w-14 lg:h-14"}`}
          />
        </>
      )}

      {/* Si hideStats es false, renderizo alias y stats */}
      {!hideStats && (
        <>
          <div className={`absolute text-white font-semibold ${aliasPosition || "bottom-[39%] left-1/2 transform -translate-x-1/2"}`}>
            <p className={aliasClasses} title={alias}>
              {truncatedAlias}
            </p>
          </div>
          <div className={`absolute left-1/2 transform -translate-x-1/2 flex ${statsPosition || "bottom-[70px] xs:bottom-[80px] sm:bottom-[100px] md:bottom-[120px] lg:bottom-[130px] gap-1 xs:gap-2 sm:gap-3 md:gap-4"}`}>
            {/* Ataque con gradiente de rojo */}
            <div 
              className={`${statsBoxClasses} shadow-md`}
              style={{ 
                background: 'linear-gradient(135deg, #ff0000, #990000)'
              }}
            >
              {ataque}
            </div>
            {/* Control con gradiente de azul */}
            <div 
              className={`${statsBoxClasses} shadow-md`}
              style={{ 
                background: 'linear-gradient(135deg, #0066ff, #003399)'
              }}
            >
              {control}
            </div>
            {/* Defensa con gradiente de verde */}
            <div 
              className={`${statsBoxClasses} shadow-md`}
              style={{ 
                background: 'linear-gradient(135deg, #00cc00, #006600)'
              }}
            >
              {defensa}
            </div>
          </div>
          <div className={`absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center ${mediaPosition || "bottom-[40px] xs:bottom-[45px] sm:bottom-[55px] md:bottom-[60px] lg:bottom-[65px]"}`}>
            {/* Media con gradiente amarillo/dorado */}
            <div 
              className={`${mediaBoxClasses} shadow-md`}
              style={{ 
                background: 'linear-gradient(135deg, #ffcc00, #cc9900)'
              }}
            >
              <p className={mediaTextClasses}>
                {media}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

CartaGrande.propTypes = {
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
  responsive: PropTypes.bool,
  hideStats: PropTypes.bool,
  container: PropTypes.string, // Para el tipo de contenedor
};

CartaGrande.defaultProps = {
  className: "",
  responsive: true,
  hideStats: false,
  container: null,
};

export default CartaGrande;