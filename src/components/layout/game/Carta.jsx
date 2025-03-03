/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import FondoCarta from "../../../assets/finalCard.png";

function Carta({ jugador, className }) {
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
    posicion
  } = jugador;

  // Calcular la media de las estadísticas
  const media = Math.round((ataque + control + defensa) / 3);

  return (
    <div
      className={`relative w-80 h-[500px] bg-cover rounded-lg overflow-hidden ${className}`}
      style={{ backgroundImage: `url(${FondoCarta})`, backgroundSize: "cover" }}
    >
      {/* Imagen del jugador - Pegada al borde de la franja negra */}
      <div className="absolute left-[170px] transform -translate-x-1/2 bottom-[46%]">
        <img
          src={photo}
          alt={alias}
          className="w-58 h-58 object-cover"
        />
      </div>

      {/* Escudo del equipo en la esquina superior derecha */}
      <img
        src={escudo}
        alt={equipo}
        className="absolute top-11 right-6 w-16 h-16"
      />

      {/* Nombre del jugador pegado a la izquierda, justo en la franja negra */}
      <div className="absolute bottom-[39%] left-[60px] text-white font-semibold">
        <p className="text-lg">{alias}</p>
      </div>

      {/* Estadísticas de ataque, control, defensa centradas en la parte baja */}
      <div className="absolute bottom-[135px] left-[170px] transform -translate-x-1/2 flex gap-4">
        <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white font-semibold">
          {ataque}
        </div>
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
          {control}
        </div>
        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-semibold">
          {defensa}
        </div>
      </div>

      {/* Media de las estadísticas, centrada debajo */}
      <div className="absolute bottom-[70px] left-[170px] transform -translate-x-1/2 flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-lg">
        <p className="text-white font-semibold">{media}</p>
      </div>
    </div>
  );
}

// Definición de los props con PropTypes
Carta.propTypes = {
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

export default Carta;
