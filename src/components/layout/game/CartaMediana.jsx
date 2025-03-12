/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import FondoCartaNormal from "../../../assets/cartaNormal.png";
import FondoCartaLuxury from "../../../assets/card_luxury.png";
import FondoCartaLuxuryXI from "../../../assets/card_luxuryxi.png";
import FondoCartaMegaLuxury from "../../../assets/card_megaluxury.png";

function CartaMediana({ jugador, className }) {
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
      className={`relative w-40 h-[200px] bg-cover rounded-lg overflow-hidden ${className}`}
      style={{ backgroundImage: `url(${getFondo()})`, backgroundSize: "cover" }}
    >
      {/* Cambio de distancias a porcentajes */}
      <div className="absolute left-[55%] transform -translate-x-1/2 bottom-[46%]">
        <img src={photo} alt={alias} className="w-15 h-[70px] object-cover" />
      </div>

      <img
        src={escudo}
        alt={equipo}
        className="absolute top-[10%] right-[5%] w-8 h-8"
      />

      <div className="absolute bottom-[37%] left-[20%] text-white font-semibold">
        <p className="text-xs">{alias}</p>
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
};

export default CartaMediana;
