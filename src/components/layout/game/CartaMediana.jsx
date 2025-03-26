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
        width: width, // Ancho personalizable
        height: height, // Alto personalizable
        backgroundImage: `url(${getFondo()})`,
        backgroundSize: "cover", // Ajusta el fondo para cubrir el contenedor
        backgroundPosition: "center", // Centra el fondo
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Foto del jugador */}
      <div
        className="absolute"
        style={{
          bottom: "46%", // Posición desde la parte inferior
          left: "50%", // Centrado horizontalmente
          transform: "translateX(-50%)", // Ajuste fino para centrar
          width: "50%", // Ancho relativo al tamaño de la carta
          height: "40%", // Altura relativa al tamaño de la carta
        }}
      >
        <img
          src={photo}
          alt={alias}
          className="w-full h-full object-cover" // Escala la imagen proporcionalmente
          style={{
            maxWidth: "100%", // Asegura que no se desborde
            maxHeight: "100%", // Asegura que no se desborde
          }}
        />
      </div>

      {/* Escudo del equipo */}
      <img
        src={escudo}
        alt={equipo}
        className="absolute"
        style={{
          top: "10%", // Posición desde la parte superior
          right: "14%", // Posición desde la derecha
          width: "20%", // Ancho relativo al tamaño de la carta
          height: "auto", // Altura automática para mantener la relación de aspecto
        }}
      />

      {/* Alias del jugador */}
      <div
        className="absolute text-white font-semibold"
        style={{
          bottom: "35%", // Posición desde la parte inferior
          left: "14%", // Posición desde la izquierda
          fontSize: "clamp(0.7em, 0.6vw, 0.9em)"
 // Tamaño de texto responsive
        }}
      >
        <p>{alias}</p>
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