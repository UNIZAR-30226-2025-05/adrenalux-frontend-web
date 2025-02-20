import React from "react";

// Función auxiliar para abreviar la posición.
function getPositionAbbrev(position) {
  const pos = position.toLowerCase();
  if (pos === "delantero") return "ST";
  if (pos === "mediocampista") return "CM";
  if (pos === "defensa") return "CB";
  if (pos === "portero") return "GK";
  return position.slice(0, 2).toUpperCase();
}

/**
 * Componente Card
 * @param {object} props.card - Objeto con la información de la carta.
 * @param {function} props.onClick - Función a ejecutar al hacer clic en la carta.
 */
const Card = ({ card, onClick }) => {
  const posAbbrev = getPositionAbbrev(card.position);

  return (
    <div className="flex flex-col items-center">
      {/* Contenedor de la carta */}
      <div
        onClick={() => onClick(card)}
        className="relative w-44 h-64 bg-white/20 rounded-lg shadow-md cursor-pointer
                   transition-transform transform hover:scale-105 hover:shadow-2xl overflow-hidden"
      >
        {/* Imagen de fondo que llena el contenedor */}
        <img
          src={card.image}
          alt={card.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Rating (arriba-izquierda) */}
        <p className="absolute top-5 left-5 text-white text-2xl font-bold">
          {card.rating}
        </p>

        {/* Posición (debajo del rating) */}
        <p className="absolute top-14 left-5 text-white text-sm font-semibold">
          {posAbbrev}
        </p>

        {/* Contenedor para equipo y país (apilados verticalmente) */}
        {(card.image3 || card.image5) && (
          <div className="absolute top-20 left-5 flex flex-col space-y-1 items-center">
            {card.image3 && (
              <img
                src={card.image3}
                alt="Team"
                className="w-8 h-8 object-contain"
              />
            )}
            {card.image5 && (
              <img
                src={card.image5}
                alt="Country"
                className="w-8 h-8 object-contain"
              />
            )}
          </div>
        )}

        {/* Cara del jugador (en la parte derecha sin recorte circular, algo más grande) */}
        {card.face && (
          <img
            src={card.face}
            alt="Player Face"
            className="absolute top-20 right-4 transform -translate-y-1/2 w-20 h-20 object-cover"
          />
        )}

        {/* Nombre del jugador (abajo, centrado dentro de la carta) */}
        <p className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold">
          {card.name}
        </p>
      </div>

      {/* Precio (fuera de la carta, debajo) */}
      <p className="mt-2 text-yellow-300 font-bold text-lg">
        {new Intl.NumberFormat("en-US").format(card.price)}
      </p>
    </div>
  );
};

export default Card;
