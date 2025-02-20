import React from "react";

// Helper function to abbreviate the position.
function getPositionAbbrev(position) {
  const pos = position.toLowerCase();
  if (pos === "delantero") return "ST";
  if (pos === "mediocampista") return "CM";
  if (pos === "defensa") return "CB";
  if (pos === "portero") return "GK";
  return position.slice(0, 2).toUpperCase();
}

/**
 * Card Component
 * @param {object} props.card - Object containing the card information.
 * @param {function} props.onClick - Function to execute on card click.
 * @param {boolean} [props.flip=false] - If true, the card will flip on hover.
 */
const Card = ({ card, onClick, flip = false }) => {
  const posAbbrev = getPositionAbbrev(card.position);

  if (flip) {
    return (
      <div className="flex flex-col items-center">
        {/* Outer container with perspective and group for hover */}
        <div
          onClick={() => onClick(card)}
          className="group relative w-44 h-64 cursor-pointer"
          style={{ perspective: "1000px" }}
        >
          <div className="flip-card-inner relative w-full h-full transition-transform duration-700">
            {/* Front side: Shows all info */}
            <div className="flip-card-front absolute inset-0 z-10">
              <img
                src={card.image}
                alt={card.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
                            {/* Small black box (top-right) */}
                            <div className="absolute top-5 left-5 bg-black w-8 h-8"></div>
              {/* Rating (top-left) */}
              <p className="absolute top-5 left-5 text-white text-2xl font-bold">
                {card.rating}
              </p>

              {/* Position (below rating) */}
              <p className="absolute top-14 left-5 text-white text-sm font-semibold">
                {posAbbrev}
              </p>
              {/* Container for team and country logos */}
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
              {/* Player face on the right */}
              {card.face && (
                <img
                  src={card.face}
                  alt="Player Face"
                  className="absolute top-20 right-4 transform -translate-y-1/2 w-20 h-20 object-cover"
                />
              )}
              {/* Name (bottom, centered) */}
              <p className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold">
                {card.name}
              </p>
            </div>

            {/* Back side: Only finalCard.png, no overlay info */}
            <div className="flip-card-back absolute inset-0">
              <img
                src={card.image}
                alt={card.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        {/* Price below the card */}
        <p className="mt-2 text-yellow-300 font-bold text-lg">
          {new Intl.NumberFormat("en-US").format(card.price)}
        </p>
      </div>
    );
  } else {
    // Non-flip version (simple card)
    return (
      <div className="flex flex-col items-center">
        <div
          onClick={() => onClick(card)}
          className="relative w-44 h-64 bg-white/20 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl overflow-hidden"
        >
          <img
            src={card.image}
            alt={card.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
                    {/* Small black box (top-right) */}
                    <div className="absolute top-5 left-5 bg-black w-8 h-8"></div>
          <p className="absolute top-5 left-5 text-white text-2xl font-bold">
            {card.rating}
          </p>

          <p className="absolute top-14 left-5 text-white text-sm font-semibold">
            {posAbbrev}
          </p>
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
          {card.face && (
            <img
              src={card.face}
              alt="Player Face"
              className="absolute top-20 right-4 transform -translate-y-1/2 w-20 h-20 object-cover"
            />
          )}
          <p className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold">
            {card.name}
          </p>
        </div>
        <p className="mt-2 text-yellow-300 font-bold text-lg">
          {new Intl.NumberFormat("en-US").format(card.price)}
        </p>
      </div>
    );
  }
};

export default Card;
