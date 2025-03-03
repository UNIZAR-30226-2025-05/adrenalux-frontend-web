import PropTypes from "prop-types";
import Card from "../../../assets/cartaNormal.png"; // Imagen de la carta

const Formacion5_3_2 = ({ jugadores }) => {
  // Función para verificar si una posición está libre
  const getOpacity = (posicion) => {
    const jugadorEnPosicion = jugadores.find((jugador) => jugador.posicion === posicion);
    return jugadorEnPosicion ? "opacity-100" : "opacity-50"; // 100 si hay jugador, 50 si está vacío
  };

  return (
    <div className="formacion-5-3-2 grid grid-rows-6 gap-1">
      {/* Fila 1: Delanteros */}
      <div className="flex justify-between mb-1">
        {["dc", "dc"].map((pos, index) => (
          <div key={index} className={`relative ${getOpacity(pos)}`}>
            <img src={Card} alt="Carta Jugador" className="w-20 h-32" /> {/* Tamaño de carta ajustado */}
            <p className="absolute inset-0 text-center text-white">
              {jugadores.find((jugador) => jugador.posicion === pos)?.nombre || "Vacío"}
            </p>
          </div>
        ))}
      </div>

      {/* Fila 2: Centrocampistas */}
      <div className="flex justify-between mb-1">
        {["mc", "mc", "mc"].map((pos, index) => (
          <div key={index} className={`relative ${getOpacity(pos)}`}>
            <img src={Card} alt="Carta Jugador" className="w-20 h-32" /> {/* Tamaño de carta ajustado */}
            <p className="absolute inset-0 text-center text-white">
              {jugadores.find((jugador) => jugador.posicion === pos)?.nombre || "Vacío"}
            </p>
          </div>
        ))}
      </div>

      {/* Fila 3: Defensores */}
      <div className="flex justify-between mb-1">
        {["dfc", "dfc", "dfc", "dfc", "dfc"].map((pos, index) => (
          <div key={index} className={`relative ${getOpacity(pos)}`}>
            <img src={Card} alt="Carta Jugador" className="w-20 h-32" /> {/* Tamaño de carta ajustado */}
            <p className="absolute inset-0 text-center text-white">
              {jugadores.find((jugador) => jugador.posicion === pos)?.nombre || "Vacío"}
            </p>
          </div>
        ))}
      </div>

      {/* Fila 4: Portero */}
      <div className="flex justify-center mb-1">
        <div className={`relative ${getOpacity("por")}`}>
          <img src={Card} alt="Carta Jugador" className="w-20 h-32" /> {/* Tamaño de carta ajustado */}
          <p className="absolute inset-0 text-center text-white">
            {jugadores.find((jugador) => jugador.posicion === "por")?.nombre || "Vacío"}
          </p>
        </div>
      </div>
    </div>
  );
};

Formacion5_3_2.propTypes = {
  jugadores: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      posicion: PropTypes.oneOf([
        "dc", "mc", "dfc", "por"
      ]).isRequired
    })
  ).isRequired
};

export default Formacion5_3_2;
