import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import CartaMediana from "../../../components/layout/game/CartaMediana";

const Formacion433 = ({ jugadores = [], onJugadorClick }) => {
  // Estado para controlar el tamaño de la pantalla
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  // Efecto para detectar el tamaño de la pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
      setIsMediumScreen(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    // Verificar tamaño inicial
    checkScreenSize();

    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', checkScreenSize);

    // Limpiar
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    // Si jugadores no existe o está vacío, devolver null
    if (!jugadores || jugadores.length === 0) {
      return null;
    }
    
    const jugador = jugadores.find(j => j && j.posicion === posicionId);
    return jugador || null;
  };

  const handleClick = (posicion) => {
    if (onJugadorClick) {
      const jugador = getJugadorEnPosicion(posicion.id);
      onJugadorClick({
        posicionId: posicion.id,
        posicion: posicion.type,
        jugador: jugador || null
      });
    }
  };

  // Tamaños de carta responsivos basados en el tamaño de pantalla
  const getCardDimensions = () => {
    if (isSmallScreen) {
      return {
        width: "clamp(3rem, 10vw, 4rem)",
        height: "clamp(4rem, 13vw, 5.5rem)"
      };
    } else if (isMediumScreen) {
      return {
        width: "clamp(4rem, 8vw, 5.5rem)",
        height: "clamp(5.5rem, 11vw, 7.5rem)"
      };
    } else {
      return {
        width: "clamp(5rem, 6vw, 6.5rem)",
        height: "clamp(7rem, 8vw, 9rem)"
      };
    }
  };

  // Tamaños de los espacios vacíos
  const getEmptyDimensions = () => {
    if (isSmallScreen) {
      return {
        width: "clamp(3rem, 10vw, 4rem)",
        height: "clamp(4rem, 13vw, 5.5rem)"
      };
    } else if (isMediumScreen) {
      return {
        width: "clamp(4rem, 8vw, 5rem)",
        height: "clamp(5.5rem, 11vw, 7rem)"
      };
    } else {
      return {
        width: "clamp(4.5rem, 6vw, 6rem)",
        height: "clamp(6.5rem, 8vw, 8.5rem)"
      };
    }
  };

  // Espaciado dinámico basado en tamaño de pantalla
  const spacing = {
    delanteros: `space-y-2 ${isSmallScreen ? 'gap-x-1' : 'md:space-y-3 gap-x-2 md:gap-x-8 lg:gap-x-14'}`,
    mediocampistas: `gap-1 ${isSmallScreen ? '' : 'md:gap-2 lg:gap-4'}`,
    defensas: `gap-1 ${isSmallScreen ? '' : 'sm:gap-2 md:gap-3 lg:gap-4'}`
  };

  // Dimensiones actuales
  const cardSize = getCardDimensions();
  const emptySize = getEmptyDimensions();

  return (
    <div className="formacion-4-3-3 w-full max-w-4xl mx-auto space-y-2 md:space-y-4 lg:space-y-8 px-1 transition-all duration-300">
      {/* Campo de fútbol como fondo - opcional */}
      <div className="absolute inset-0 bg-green-800 opacity-20 rounded-xl z-0"></div>
      
      {/* Delanteros */}
      <div className={`relative z-10 flex justify-center ${spacing.delanteros}`}>
        {posiciones.slice(0, 3).map((pos) => {
          const jugador = getJugadorEnPosicion(pos.id);
          return (
            <button
              key={pos.id}
              className={`relative ${jugador ? "opacity-100" : "opacity-70"} bg-transparent border-none p-0 cursor-pointer transition-all duration-300 hover:scale-105`}
              onClick={() => handleClick(pos)}
            >
              {jugador ? (
                <CartaMediana 
                  jugador={jugador} 
                  width={cardSize.width}
                  height={cardSize.height}
                  small={isSmallScreen}
                  responsive={true}
                />
              ) : (
                <div 
                  className="bg-gray-700 rounded-md flex items-center justify-center transition-all duration-300"
                  style={{ width: emptySize.width, height: emptySize.height }}
                >
                  <span className={`text-white ${isSmallScreen ? 'text-xxs' : 'text-xs'}`}>Vacío</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mediocampistas */}
      <div className={`relative z-10 flex justify-center ${spacing.mediocampistas}`}>
        {posiciones.slice(3, 6).map((pos, index) => {
          const jugador = getJugadorEnPosicion(pos.id);
          return (
            <button
              key={pos.id}
              className={`relative ${jugador ? "opacity-100" : "opacity-70"} bg-transparent border-none p-0 cursor-pointer transition-all duration-300 hover:scale-105 ${
                index === 1 ? `${isSmallScreen ? 'mx-1' : 'mx-2 md:mx-4 lg:mx-6'}` : ""
              }`}
              onClick={() => handleClick(pos)}
            >
              {jugador ? (
                <CartaMediana 
                  jugador={jugador} 
                  width={cardSize.width}
                  height={cardSize.height}
                  small={isSmallScreen}
                  responsive={true}
                />
              ) : (
                <div 
                  className="bg-gray-700 rounded-md flex items-center justify-center transition-all duration-300"
                  style={{ width: emptySize.width, height: emptySize.height }}
                >
                  <span className={`text-white ${isSmallScreen ? 'text-xxs' : 'text-xs'}`}>Vacío</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Defensas */}
      <div className={`relative z-10 flex justify-center ${spacing.defensas}`}>
        {posiciones.slice(6, 10).map((pos) => {
          const jugador = getJugadorEnPosicion(pos.id);
          return (
            <button
              key={pos.id}
              className={`relative ${jugador ? "opacity-100" : "opacity-70"} bg-transparent border-none p-0 cursor-pointer transition-all duration-300 hover:scale-105`}
              onClick={() => handleClick(pos)}
            >
              {jugador ? (
                <CartaMediana 
                  jugador={jugador} 
                  width={cardSize.width}
                  height={cardSize.height}
                  small={isSmallScreen}
                  responsive={true}
                />
              ) : (
                <div 
                  className="bg-gray-700 rounded-md flex items-center justify-center transition-all duration-300"
                  style={{ width: emptySize.width, height: emptySize.height }}
                >
                  <span className={`text-white ${isSmallScreen ? 'text-xxs' : 'text-xs'}`}>Vacío</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Portero */}
      <div className="relative z-10 flex justify-center mt-1">
        <button
          className={`relative ${getJugadorEnPosicion(posiciones[10].id) ? "opacity-100" : "opacity-70"} bg-transparent border-none p-0 cursor-pointer transition-all duration-300 hover:scale-105`}
          onClick={() => handleClick(posiciones[10])}
        >
          {getJugadorEnPosicion(posiciones[10].id) ? (
            <CartaMediana 
              jugador={getJugadorEnPosicion(posiciones[10].id)} 
              width={cardSize.width}
              height={cardSize.height}
              small={isSmallScreen}
              responsive={true}
            />
          ) : (
            <div 
              className="bg-gray-700 rounded-md flex items-center justify-center transition-all duration-300"
              style={{ width: emptySize.width, height: emptySize.height }}
            >
              <span className={`text-white ${isSmallScreen ? 'text-xxs' : 'text-xs'}`}>Vacío</span>
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
  ),
  onJugadorClick: PropTypes.func.isRequired,
};

export default Formacion433;