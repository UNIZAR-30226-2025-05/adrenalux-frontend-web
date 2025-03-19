/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import FondoCartaNormal from "../../../assets/cartaNormal.png";
import FondoCartaLuxury from "../../../assets/card_luxury.png";
import FondoCartaLuxuryXI from "../../../assets/card_luxuryxi.png";
import FondoCartaMegaLuxury from "../../../assets/card_megaluxury.png";

function CartaMediana({ jugador, className, width = "10rem", height = "12.5rem" }) {
  const {
    alias,
    ataque,
    control,
    defensa,
    equipo,
    escudo,
    photo,
    tipo_carta,
    id,
    nombre,
    pais,
    posicion,
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
        return null;
    }
  };

  const media = Math.round((ataque + control + defensa) / 3);

  return (
    <div
      className={`relative rounded-lg overflow-hidden ${className}`}
      style={{
        width: width,
        height: height,
        backgroundImage: `url(${getFondo()})`,
        backgroundSize: "cover", // Ajusta el fondo para cubrir el contenedor
        backgroundPosition: "center", // Centra el fondo
        backgroundRepeat: "no-repeat", // Evita que el fondo se repita
      }}
    >
      {/* Foto del jugador */}
      <div className="absolute left-[48%] transform -translate-x-1/2 bottom-[46%]">
        <img
          src={photo}
          alt={alias}
          className="w-[100%] h-auto object-cover" // Tamaño relativo al contenedor
        />
      </div>

      {/* Escudo del equipo */}
      <img
        src={escudo}
        alt={equipo}
        className="absolute top-[10%] right-[12%] w-[20%] h-auto" // Tamaño relativo al contenedor
      />

      {/* Alias del jugador */}
      <div className="absolute bottom-[35%] left-[15%] text-white font-semibold">
        <p className="text-[0.8em]">{alias}</p> {/* Tamaño de texto relativo */}
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
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    pais: PropTypes.string.isRequired,
    posicion: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  width: PropTypes.string, // Ancho personalizable
  height: PropTypes.string, // Alto personalizable
};

export default CartaMediana;
