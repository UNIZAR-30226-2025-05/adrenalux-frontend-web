import PropTypes from "prop-types";
import CartaMediana from "../../../components/layout/game/CartaMediana";

const Formacion433 = ({ jugadores, onJugadorClick }) => {
  // Definición de posiciones con ID específico y tipo genérico
  const posiciones = [
    { id: "forward1", type: "forward" },
    { id: "forward2", type: "forward" },
    { id: "forward3", type: "forward" },
    { id: "midfielder1", type: "midfielder" },
    { id: "midfielder2", type: "midfielder" },
    { id: "midfielder3", type: "midfielder" },
    { id: "defender1", type: "defender" },
    { id: "defender2", type: "defender" },
    { id: "defender3", type: "defender" },
    { id: "defender4", type: "defender" },
    { id: "goalkeeper1", type: "goalkeeper" }
  ];

  const getJugadorEnPosicion = (posicionId) => {
    return jugadores.find(j => j.posicion === posicionId);
  };

  const handleClick = (posicion) => {
    if (onJugadorClick) {
      const jugador = getJugadorEnPosicion(posicion.id);
      onJugadorClick({
        posicionId: posicion.id,    // Ej: "forward1" (posición específica)
        posicion: posicion.type, // Ej: "forward" (tipo genérico)
        jugador: jugador || null
      });
    }
  };

  return (
    <div className="formacion-4-3-3 w-full max-w-md mx-auto space-y-14">
      {/* Delanteros */}
      <div className="flex justify-around">
        {posiciones.slice(0, 3).map((pos) => {
          const jugador = getJugadorEnPosicion(pos.id);
          return (
            <button
              key={pos.id}
              className={`relative ${jugador ? "opacity-100" : "opacity-50"} bg-transparent border-none p-0 cursor-pointer`}
              onClick={() => handleClick(pos)}
            >
              {jugador ? (
                <CartaMediana jugador={jugador} width="8rem" height="9rem"/>
              ) : (
                <div className="w-24 h-36 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">Vacío</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mediocampistas */}
      <div className="flex justify-center gap-4">
        {posiciones.slice(3, 6).map((pos, index) => {
          const jugador = getJugadorEnPosicion(pos.id);
          return (
            <button
              key={pos.id}
              className={`relative ${jugador ? "opacity-100" : "opacity-50"} bg-transparent border-none p-0 cursor-pointer ${
                index === 1 ? "mx-12" : ""
              }`}
              onClick={() => handleClick(pos)}
            >
              {jugador ? (
                <CartaMediana jugador={jugador} width="8rem" height="9rem"/>
              ) : (
                <div className="w-24 h-36 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">Vacío</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Defensas */}
      <div className="flex justify-center gap-10">
        {posiciones.slice(6, 10).map((pos) => {
          const jugador = getJugadorEnPosicion(pos.id);
          return (
            <button
              key={pos.id}
              className={`relative ${jugador ? "opacity-100" : "opacity-50"} bg-transparent border-none p-0 cursor-pointer`}
              onClick={() => handleClick(pos)}
            >
              {jugador ? (
                <CartaMediana jugador={jugador} width="8rem" height="9rem"/>
              ) : (
                <div className="w-24 h-36 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">Vacío</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Portero */}
      <div className="flex justify-center">
        <button
          className={`relative ${getJugadorEnPosicion(posiciones[10].id) ? "opacity-100" : "opacity-50"} bg-transparent border-none p-0 cursor-pointer`}
          onClick={() => handleClick(posiciones[10])}
        >
          {getJugadorEnPosicion(posiciones[10].id) ? (
            <CartaMediana 
              jugador={getJugadorEnPosicion(posiciones[10].id)} 
              width="8rem" height="9rem" 
            />
          ) : (
            <div className="w-24 h-36 bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">Vacío</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

Formacion433.propTypes = {
  jugadores: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      posicion: PropTypes.string.isRequired,
      posicionType: PropTypes.string,
      imagen: PropTypes.string,
    })
  ).isRequired,
  onJugadorClick: PropTypes.func.isRequired,
};

export default Formacion433;