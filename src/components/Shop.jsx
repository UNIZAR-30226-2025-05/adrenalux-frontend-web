import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle, FaCoins } from "react-icons/fa";
import SearchTab from "./layout/game/SearchTab";
import BackButton from "../components/layout/game/BackButton";
import background from "../assets/background.png";
import ShopCollection from "./ShopCollection";
import finalCard from "../assets/cartaNormal.png";
import MarqueeText from "./layout/MarqueesText";
import Card3D from "./layout/game/Card3D";
import { obtenerCartasEnVenta, filterCards } from "../services/api/shopApi";
import Carta from "./layout/game/CartaMediana"; //Miraaarrrr!!!

export default function Shop() {
  const [showDialog, setShowDialog] = useState(false);
  const [luxurisCards, setLuxurisCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("Equipo");
  const [selectedPosition, setSelectedPosition] = useState("Posición");
  const [showCollection, setShowCollection] = useState(false);
  const [cards, setCards] = useState([]);

  const navigate = useNavigate();

  // Obtener cartas del mercado
  useEffect(() => {
    const fetchShopCards = async () => {
      try {
        let data;
        if (
          searchQuery ||
          selectedTeam !== "Equipo" ||
          selectedPosition !== "Posición"
        ) {
          const params = {};
          if (searchQuery) params.nombre = searchQuery;
          if (selectedTeam !== "Equipo") params.equipo = selectedTeam;
          if (selectedPosition !== "Posición")
            params.posicion = selectedPosition;

          data = await filterCards(params);
        } else {
          data = await obtenerCartasEnVenta();
        }

        console.log("📥 Cartas en venta recibidas:", data);

        const mappedData = data.map((card) => ({
          alias: card.nombre || "Sin nombre",
          ataque: card.ataque ?? 0,
          control: card.control ?? 0,
          medio: card.medio ?? 0,
          defensa: card.defensa ?? 0,
          equipo: card.club || "Sin club",
          escudo: card.escudo || "default_escudo.png",
          photo: card.photo || "default.png",
          tipo_carta: card.rareza || "Común",
          id: card.id,
          nombre: card.nombre || "Sin nombre",
          pais: card.nacionalidad || "Desconocido",
          posicion: card.posicion || "N/A",
          disponible: true,
          cantidad: 1,
          precio: card.precio || 0,
        }));

        setCards(mappedData);
      } catch (error) {
        console.error("Error al obtener cartas del mercado:", error);
      }
    };

    fetchShopCards();
  }, [searchQuery, selectedTeam, selectedPosition]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowDialog(true);
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center text-white flex flex-col items-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute top-5 left-5">
        <BackButton onClick={handleBackClick} />
      </div>
      <div className="absolute top-5 right-5 flex items-center bg-black px-6 py-3 rounded-lg shadow-md">
        <span className="text-2xl font-semibold mr-2">5,000</span>
        <FaCoins className="text-yellow-400 text-2xl" />
        <FaPlusCircle className="text-green-500 ml-3 text-2xl cursor-pointer hover:text-green-400 transition" />
      </div>
      <h1 className="text-5xl font-bold mt-28">Tienda</h1>
      <div className="bg-[#2B5C94] text-center py-8 px-10 mt-16 w-[800px] rounded-lg shadow-lg flex flex-col items-center">
        <div
          className="relative overflow-hidden w-full h-12 flex items-center justify-center mb-8"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
          }}
        >
          <MarqueeText text="Luxuris del día" />
        </div>
        <div className="flex justify-center space-x-16">
          {luxurisCards.map((card) => (
            <Card3D
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="mt-12 flex justify-center">
        <SearchTab
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
        />
      </div>

      {/* Cartas en venta */}
      <div className="grid grid-cols-4 gap-4 place-items-center px-10 mt-8">
        {cards.length > 0 ? (
          cards.map((card) => (
            <div
              key={card.id}
              className="cursor-pointer"
              onClick={() => handleCardClick(card)}
            >
              <Carta jugador={card} />
              <div className="text-center mt-2 text-lg font-semibold">
                Precio: {card.precio} monedas
              </div>
            </div>
          ))
        ) : (
          <p className="text-xl font-semibold col-span-4">
            No se encontraron resultados
          </p>
        )}
      </div>

      {/* Diálogo de compra */}
      {showDialog && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto">
            <p className="text-lg mb-6">
              ¿Quieres comprar a <b>{selectedCard.name}</b>?
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => setShowDialog(false)}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
              >
                Sí
              </button>
              <button
                onClick={() => setShowDialog(false)}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
