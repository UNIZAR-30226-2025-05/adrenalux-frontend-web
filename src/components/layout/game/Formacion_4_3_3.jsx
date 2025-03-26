import PropTypes from "prop-types";
import Card from "../../../assets/cartaNormal.png";

const Formacion4_3_3 = ({ jugadores, onJugadorClick, plantillaId }) => {
  const getOpacity = (posicion) => {
    const jugadorEnPosicion = jugadores.find((jugador) => jugador.posicion === posicion);
    return jugadorEnPosicion ? "opacity-100" : "opacity-50";
  };

  const handleClick = (posicion) => {
    if (onJugadorClick) {
      const jugador = jugadores.find((j) => j.posicion === posicion);
      onJugadorClick({
        plantillaId,
        posicion,
        jugadorId: jugador?.id || null,
        estaOcupado: !!jugador,
      });
    }
  };

  return (
    <div className="formacion-4-3-3 w-full max-w-md mx-auto space-y-2">
      {/* Fila 1: Forwards (3 jugadores) */}
      <div className="flex justify-around">
        {["forward", "forward", "forward"].map((pos, index) => (
          <button
            key={`${pos}-${index}`}
            className={`relative ${getOpacity(pos)} bg-transparent border-none p-0 cursor-pointer`}
            onClick={() => handleClick(pos)}
            aria-label={`Posición ${pos} ${index + 1}`}
          >
            <img src={Card} alt="" className="w-20 h-32" />
            <p className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
              {jugadores.find((j) => j.posicion === pos)?.nombre || "Vacío"}
            </p>
          </button>
        ))}
      </div>

      {/* Fila 2: Midfielders (3 jugadores) */}
      <div className="flex justify-center gap-4">
        {["midfielder", "midfielder", "midfielder"].map((pos, index) => (
          <button
            key={`${pos}-${index}`}
            className={`relative ${getOpacity(pos)} bg-transparent border-none p-0 cursor-pointer ${
              index === 1 ? "mx-12" : ""
            }`}
            onClick={() => handleClick(pos)}
            aria-label={`Posición ${pos} ${index + 1}`}
          >
            <img src={Card} alt="" className="w-20 h-32" />
            <p className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
              {jugadores.find((j) => j.posicion === pos)?.nombre || "Vacío"}
            </p>
          </button>
        ))}
      </div>

      {/* Fila 3: Defenders (4 jugadores) */}
      <div className="flex justify-evenly gap-8">
        {["defender", "defender", "defender", "defender"].map((pos, index) => (
          <button
            key={`${pos}-${index}`}
            className={`relative ${getOpacity(pos)} bg-transparent border-none p-0 cursor-pointer`}
            onClick={() => handleClick(pos)}
            aria-label={`Posición ${pos} ${index + 1}`}
          >
            <img src={Card} alt="" className="w-20 h-32" />
            <p className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
              {jugadores.find((j) => j.posicion === pos)?.nombre || "Vacío"}
            </p>
          </button>
        ))}
      </div>

      {/* Fila 4: Goalkeeper */}
      <div className="flex justify-center">
        <button
          className={`relative ${getOpacity("goalkeeper")} bg-transparent border-none p-0 cursor-pointer`}
          onClick={() => handleClick("goalkeeper")}
          aria-label="Goalkeeper"
        >
          <img src={Card} alt="" className="w-20 h-32" />
          <p className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
            {jugadores.find((j) => j.posicion === "goalkeeper")?.nombre || "Vacío"}
          </p>
        </button>
      </div>
    </div>
  );
};

Formacion4_3_3.propTypes = {
  jugadores: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      posicion: PropTypes.oneOf(["forward", "midfielder", "defender", "goalkeeper"]).isRequired,
    })
  ).isRequired,
  onJugadorClick: PropTypes.func.isRequired,
  plantillaId: PropTypes.string.isRequired,
};

export default Formacion4_3_3;
