import PropTypes from "prop-types";
import Card from "../../../assets/finalCard.png"; // Imagen de la carta

const Formacion4_3_3 = ({ jugadores }) => {
  // Función para verificar si una posición está libre
  const getOpacity = (posicion) => {
    const jugadorEnPosicion = jugadores.find((jugador) => jugador.posicion === posicion);
    return jugadorEnPosicion ? "opacity-100" : "opacity-50"; // 100 si hay jugador, 50 si está vacío
  };

  return (
    <div className="formacion-4-3-3 grid grid-rows-10 gap-1">
      {/* Fila 1: Delanteros */}
      <div className="flex justify-between mb-2">
        {["ed", "dc", "el"].map((pos, index) => (
          <div key={index} className={`relative ${getOpacity(pos)}`}>
            <img src={Card} alt="Carta Jugador" className="w-20 h-32" /> {/* Ajustado el tamaño de las cartas */}
            <p className="absolute inset-0 text-center text-white">
              {jugadores.find((jugador) => jugador.posicion === pos)?.nombre || "Vacío"}
            </p>
          </div>
        ))}
      </div>

      {/* Fila 2: Centrocampistas */}
      <div className="flex justify-between mb-1">
        {["mc", "mc", "mco"].map((pos, index) => (
          <div key={index} className={`relative ${getOpacity(pos)}`}>
            <img src={Card} alt="Carta Jugador" className="w-20 h-32" /> {/* Ajustado el tamaño de las cartas */}
            <p className="absolute inset-0 text-center text-white">
              {jugadores.find((jugador) => jugador.posicion === pos)?.nombre || "Vacío"}
            </p>
          </div>
        ))}
      </div>

      {/* Fila 3: Defensores laterales */}
      <div className="flex justify-between mb-1">
        {["ld", "dfc", "dfc", "li"].map((pos, index) => (
          <div key={index} className={`relative ${getOpacity(pos)}`}>
            <img src={Card} alt="Carta Jugador" className="w-20 h-32" /> {/* Ajustado el tamaño de las cartas */}
            <p className="absolute inset-0 text-center text-white">
              {jugadores.find((jugador) => jugador.posicion === pos)?.nombre || "Vacío"}
            </p>
          </div>
        ))}
      </div>

      {/* Fila 4: Portero */}
      <div className="flex justify-center mb-1">
        <div className={`relative ${getOpacity("por")}`}>
          <img src={Card} alt="Carta Jugador" className="w-20 h-32" /> {/* Ajustado el tamaño de las cartas */}
          <p className="absolute inset-0 text-center text-white">
            {jugadores.find((jugador) => jugador.posicion === "por")?.nombre || "Vacío"}
          </p>
        </div>
      </div>
    </div>
  );
};

Formacion4_3_3.propTypes = {
  jugadores: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      posicion: PropTypes.oneOf([
        "ed", "el", "dc", "mc", "mco", "mcd", "mi", "md", "ld", "li", "dfc", "por"
      ]).isRequired
    })
  ).isRequired
};

export default Formacion4_3_3;
