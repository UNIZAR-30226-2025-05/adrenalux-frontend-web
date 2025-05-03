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

  // Clases más refinadas para una mejor experiencia responsive
  const containerClasses = responsive
    ? "w-[160px] h-[250px] xs:w-[180px] xs:h-[280px] sm:w-[220px] sm:h-[340px] md:w-[260px] md:h-[400px] lg:w-[300px] lg:h-[470px]"
    : "w-[300px] h-[470px]";

  const imageClasses = "w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover";
  const escudoClasses = "absolute top-5 right-3 w-6 h-6 xs:top-6 xs:right-3 xs:w-8 xs:h-8 sm:top-7 sm:right-4 sm:w-10 sm:h-10 md:top-8 md:right-5 md:w-12 md:h-12 lg:top-9 lg:right-5 lg:w-14 lg:h-14";
  const aliasClasses = "text-xs xs:text-sm sm:text-base md:text-base lg:text-lg";
  const statsBoxClasses = "w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-lg flex items-center justify-center text-white font-semibold text-xs xs:text-xs sm:text-sm";
  const mediaBoxClasses = "w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 bg-yellow-500 rounded-lg flex items-center justify-center";
  const mediaTextClasses = "text-white font-semibold text-xs xs:text-xs sm:text-sm";

  return (
    <div
      className={`relative bg-cover rounded-lg overflow-hidden transition-all duration-300 ${containerClasses} ${className}`}
      style={{ backgroundImage: `url(${getFondo()})` }}
    >
      {/* Solo renderizamos foto y escudo si no estamos ocultando stats */}
      {!hideStats && (
        <>
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[46%]">
            <img
              src={photo}
              alt={alias}
              className={imageClasses}
            />
          </div>
          <img
            src={escudo}
            alt={equipo}
            className={escudoClasses}
          />
        </>
      )}

      {/* Si hideStats es false, renderizo alias y stats */}
      {!hideStats && (
        <>
          <div className="absolute bottom-[39%] left-[25px] xs:left-[30px] sm:left-[35px] md:left-[40px] lg:left-[45px] text-white font-semibold">
            <p className={aliasClasses}>
              {alias}
            </p>
          </div>
          <div className="absolute bottom-[70px] xs:bottom-[80px] sm:bottom-[100px] md:bottom-[120px] lg:bottom-[130px] left-1/2 transform -translate-x-1/2 flex gap-1 xs:gap-2 sm:gap-3 md:gap-4">
            <div className={`${statsBoxClasses} bg-red-600`}>
              {ataque}
            </div>
            <div className={`${statsBoxClasses} bg-blue-600`}>
              {control}
            </div>
            <div className={`${statsBoxClasses} bg-green-600`}>
              {defensa}
            </div>
          </div>
          <div className="absolute bottom-[40px] xs:bottom-[45px] sm:bottom-[55px] md:bottom-[60px] lg:bottom-[65px] left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <div className={mediaBoxClasses}>
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
};

CartaGrande.defaultProps = {
  className: "",
  responsive: true,
  hideStats: false,
};

export default CartaGrande;