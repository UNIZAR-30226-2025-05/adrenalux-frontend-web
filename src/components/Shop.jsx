import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaCoins } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.png";
import SearchTab from "./layout/game/SearchTab";
import BackButton from "../components/layout/game/BackButton";
import MarqueeText from "./layout/MarqueesText";
import Card3D from "./layout/game/Card3D";
import {
  obtenerCartasEnVenta,
  obtenerCartasDiarias,
  filterCards,
  comprarCarta,
  comprarCartaDiaria,
} from "../services/api/shopApi";
import { getProfile } from "../services/api/profileApi";
import Carta from "./layout/game/CartaMediana";
import Carta2 from "./layout/game/CartaGrande";

export default function Shop() {
  const [showDialog, setShowDialog] = useState(false);
  const [luxurisCards, setLuxurisCards] = useState([]); // Cartas diarias
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("Equipo");
  const [selectedPosition, setSelectedPosition] = useState("Posición");
  const [cards, setCards] = useState([]); // Cartas generales
  const [infoUser, setInfoUser] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerInfo = async () => {
      try {
        const data = await getProfile();
        setInfoUser(data);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };
    obtenerInfo();
  }, []);

  const adrenacoins = infoUser?.data?.adrenacoins || 0;

  // Obtener cartas generales del mercado
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
        console.log("📥 Cartas en venta recibidas (generales):", data);
        const mappedData = data.map((card) => ({
          alias: card.nombre || "Sin nombre",
          ataque: card.ataque ?? 0,
          control: card.control ?? 0,
          medio: card.medio ?? 0,
          defensa: card.defensa ?? 0,
          equipo: card.club || "Sin club",
          escudo: card.escudo || "default_escudo.png",
          photo: card.photo || "default.png",
          tipo_carta: card.tipo_carta || "Normal",
          id: card.id,
          nombre: card.nombre || "Sin nombre",
          pais: card.nacionalidad || "Desconocido",
          posicion: card.posicion || "N/A",
          precio: card.precio || 0,
          mercadoCartaId: null,
          isDaily: false,
        }));
        setCards(mappedData);
      } catch (error) {
        console.error("Error al obtener cartas del mercado:", error);
      }
    };
    fetchShopCards();
  }, [searchQuery, selectedTeam, selectedPosition]);

  // Obtener cartas diarias
  useEffect(() => {
    const fetchDailyCards = async () => {
      try {
        const data = await obtenerCartasDiarias();
        console.log("📥 Cartas diarias recibidas:", data);
        const mappedDaily = data.map((card) => ({
          alias: card.nombre || "Sin nombre",
          ataque: card.ataque ?? 0,
          control: card.control ?? 0,
          medio: card.medio ?? 0,
          defensa: card.defensa ?? 0,
          equipo: card.club || "Sin club",
          escudo: card.escudo || "default_escudo.png",
          photo: card.photo || "default.png",
          tipo_carta: card.tipo_carta || "Normal",
          id: card.id,
          nombre: card.nombre || "Sin nombre",
          pais: card.nacionalidad || "Desconocido",
          posicion: card.posicion || "N/A",
          precio: card.precio || 0,
          mercadoCartaId: card.mercadoCartaId,
          isDaily: true,
        }));
        setLuxurisCards(mappedDaily);
      } catch (error) {
        console.error("Error al obtener cartas diarias:", error);
      }
    };

    fetchDailyCards();
  }, []);

  // Función para manejar el click en una carta (diferencia diaria vs general)
  const handleCardClick = (card, isDaily = false) => {
    setSelectedCard({ ...card, isDaily });
    setShowDialog(true);
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  const handleBuyCard = async () => {
    try {
      if (selectedCard.isDaily) {
        // Para cartas diarias
        const response = await comprarCartaDiaria(selectedCard.id);
        alert(`Carta ${selectedCard.nombre} (diaria) comprada exitosamente.`);
      } else {
        // Para cartas generales
        const response = await comprarCarta(selectedCard.mercadoCartaId);
        alert(`Carta ${selectedCard.nombre} comprada exitosamente.`);
      }
      // Actualizar perfil para nuevo saldo
      const data = await getProfile();
      setInfoUser(data);
      setShowDialog(false);
      setCards((prevCards) =>
        prevCards.filter((c) => c.id !== selectedCard.id)
      );
    } catch (error) {
      console.error("Error al comprar la carta:", error);
      alert("Hubo un error al comprar la carta.");
    }
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
        <span className="text-2xl font-semibold mr-2">{adrenacoins}</span>
        <FaCoins className="text-yellow-400 text-2xl" />
        <FaPlusCircle className="text-green-500 ml-3 text-2xl cursor-pointer hover:text-green-400 transition" />
      </div>
      <h1 className="text-5xl font-bold mt-28">Tienda</h1>
      {/* Sección de "Luxuris del día" */}
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
              onClick={() => handleCardClick(card, true)}
            />
          ))}
        </div>
      </div>
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
      <div className="grid grid-cols-4 gap-4 place-items-center px-10 mt-8">
        {cards.length > 0 ? (
          cards.slice(0, visibleCount).map((card) => (
            <div
              key={card.id}
              className="cursor-pointer"
              onClick={() => handleCardClick(card, false)}
            >
              <Carta jugador={card} />
              <div className="flex items-center justify-center mt-2 text-lg font-semibold">
                <span>{card.precio}</span>
                <FaCoins className="ml-1 text-yellow-400" />
              </div>
            </div>
          ))
        ) : (
          <p className="text-xl font-semibold col-span-4">
            No se encontraron resultados
          </p>
        )}
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/cards-for-sale")}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
        >
          Ver más cartas en venta
        </button>
      </div>

      {showDialog && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto">
            {/* Mostrar la carta en vista ampliada */}
            <div className="flex justify-center mb-4">
              <Carta2 jugador={selectedCard} />
            </div>
            {/* Mostrar información adicional */}
            <div className="mb-4">
              <p className="text-xl font-semibold">{selectedCard.nombre}</p>
              <p className="text-lg">{selectedCard.tipo_carta}</p>
              <p className="text-lg">{selectedCard.posicion}</p>
            </div>
            <p className="text-lg my-4">
              ¿Deseas comprar esta carta{" "}
              {selectedCard.isDaily ? "(Diaria)" : ""}?
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={handleBuyCard}
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
