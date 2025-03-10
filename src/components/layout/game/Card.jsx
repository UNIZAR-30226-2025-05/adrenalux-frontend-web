import React from "react";

function getPositionAbbrev(position) {
  const pos = position.toLowerCase();
  if (pos === "delantero") return "ST";
  if (pos === "mediocampista") return "CM";
  if (pos === "defensa") return "CB";
  if (pos === "portero") return "GK";
  return position.slice(0, 2).toUpperCase();
}

const Card = ({ card, onClick, flip = false }) => {
  const posAbbrev = getPositionAbbrev(card.position);

  if (flip) {
    return (
      <div className="flex flex-col items-center">
        <div
          onClick={() => onClick(card)}
          className="group relative w-44 h-64 cursor-pointer"
          style={{ perspective: "1000px" }}
        >
          <div className="flip-card-inner relative w-full h-full transition-transform duration-700">
            <div className="flip-card-front absolute inset-0 z-10">
              <img
                src={card.image}
                alt={card.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
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

            <div className="flip-card-back absolute inset-0">
              <img
                src={card.image}
                alt={card.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <p className="mt-2 text-yellow-300 font-bold text-lg">
          {new Intl.NumberFormat("en-US").format(card.price)}
        </p>
      </div>
    );
  } else {
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
