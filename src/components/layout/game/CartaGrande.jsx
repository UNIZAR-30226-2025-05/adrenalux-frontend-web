/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import FondoCartaNormal from "../../../assets/cartaNormal.png";
import FondoCartaLuxury from "../../../assets/card_luxury.png";
import FondoCartaLuxuryXI from "../../../assets/card_luxuryxi.png";
import FondoCartaMegaLuxury from "../../../assets/card_megaluxury.png";

function CartaGrande({ 
  jugador, 
  className = "",
  responsive = true
}) {
  const {
    alias,
    ataque,
    control,
    defensa,
    equipo,
    escudo,
    photo,
    tipo_carta,
  } = jugador;

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

  return (
    <div
      className={`
        relative bg-cover rounded-lg overflow-hidden transition-all duration-300
        ${responsive ? 
          "w-[180px] h-[290px] xs:w-[200px] xs:h-[320px] sm:w-[250px] sm:h-[400px] md:w-[280px] md:h-[450px] lg:w-[320px] lg:h-[500px]" : 
          "w-[320px] h-[500px]"
        }
        ${className}
      `}
      style={{ 
        backgroundImage: `url(${getFondo()})`,
      }}
    >
      {/* Foto del jugador - responsive con Tailwind */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[46%]">
        <img 
          src={photo} 
          alt={alias} 
          className="w-32 h-32 xs:w-36 xs:h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-52 lg:h-52 object-cover" 
        />
      </div>

      {/* Escudo del equipo - responsive con Tailwind */}
      <img
        src={escudo}
        alt={equipo}
        className="absolute top-6 right-4 w-8 h-8 xs:top-7 xs:right-4 xs:w-10 xs:h-10 sm:top-8 sm:right-5 sm:w-12 sm:h-12 md:top-9 md:right-6 md:w-14 md:h-14 lg:top-10 lg:right-6 lg:w-16 lg:h-16"
      />

      {/* Nombre del jugador - responsive con Tailwind */}
      <div className="absolute bottom-[39%] left-[30px] xs:left-[35px] sm:left-[40px] md:left-[45px] lg:left-[50px] text-white font-semibold">
        <p className="text-xs xs:text-sm sm:text-base md:text-base lg:text-lg">{alias}</p>
      </div>

      {/* Estadísticas - responsive con Tailwind */}
      <div className="absolute bottom-[80px] xs:bottom-[100px] sm:bottom-[120px] md:bottom-[130px] lg:bottom-[135px] left-1/2 transform -translate-x-1/2 flex gap-2 xs:gap-3 sm:gap-3 md:gap-4">
        <div className="w-7 h-7 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center text-white font-semibold text-xs xs:text-sm sm:text-sm bg-red-600">
          {ataque}
        </div>
        <div className="w-7 h-7 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center text-white font-semibold text-xs xs:text-sm sm:text-sm bg-blue-600">
          {control}
        </div>
        <div className="w-7 h-7 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center text-white font-semibold text-xs xs:text-sm sm:text-sm bg-green-600">
          {defensa}
        </div>
      </div>

      {/* Media - responsive con Tailwind */}
      <div className="absolute bottom-[45px] xs:bottom-[55px] sm:bottom-[60px] md:bottom-[65px] lg:bottom-[70px] left-1/2 transform -translate-x-1/2 flex items-center justify-center">
        <div className="w-7 h-7 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
          <p className="text-white font-semibold text-xs xs:text-sm sm:text-sm">{media}</p>
        </div>
      </div>
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
  responsive: PropTypes.bool
};

CartaGrande.defaultProps = {
  className: "",
  responsive: true
};

export default CartaGrande;