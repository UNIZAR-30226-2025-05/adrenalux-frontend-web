/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { FaLock } from "react-icons/fa";
import FondoCartaNormal from "../../../assets/cartaNormal.png";
import FondoCartaLuxury from "../../../assets/card_luxury.png";
import FondoCartaLuxuryXI from "../../../assets/card_luxuryxi.png";
import FondoCartaMegaLuxury from "../../../assets/card_megaluxury.png";

function CartaNoDisponible({ jugador, className }) {
  const { alias, equipo, escudo, tipo_carta } = jugador;

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
      className={`relative w-40 h-[200px] bg-cover rounded-lg overflow-hidden ${className}`}
      style={{ backgroundImage: `url(${getFondo()})`, backgroundSize: "cover" }}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <FaLock className="text-white text-4xl" />
      </div>

      <div className="absolute bottom-4 left-2 right-2 flex items-center justify-between">
        <p className="text-xs font-semibold">{alias}</p>
        <img src={escudo} alt={equipo} className="w-8 h-8" />
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
};

export default CartaNoDisponible;
