import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaCoins } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.png";

import {
  obtenerCartasEnVenta,
  comprarCarta,
  comprarCartaDiaria,
} from "../services/api/shopApi";
import { getProfile } from "../services/api/profileApi";

import Carta from "./layout/game/CartaMediana";
import Carta2 from "./layout/game/CartaGrande";

export default function CardsForSaleAlbum() {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [infoUser, setInfoUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const cardsPerPage = 18;
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

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);

      try {
        const data = await obtenerCartasEnVenta();
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
          mercadoCartaId: card.mercadoCartaId,
          isDaily: false,
        }));
        setCards(mappedData);
      } catch (error) {
        console.error("Error al obtener cartas en venta:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  const totalPages = Math.ceil(cards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const visibleCards = cards.slice(startIndex, startIndex + cardsPerPage);

  const leftRangeStart = startIndex + 1;
  const leftRangeEnd = leftRangeStart + 8;
  const rightRangeStart = leftRangeEnd + 1;
  const rightRangeEnd = rightRangeStart + 8;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowDialog(true);
  };

  const handleBuyCard = async () => {
    if (!selectedCard) return;
    try {
      if (selectedCard.isDaily) {
        await comprarCartaDiaria(selectedCard.id);
        alert(`Carta ${selectedCard.nombre} (diaria) comprada exitosamente.`);
      } else {
        await comprarCarta(selectedCard.mercadoCartaId);
        alert(`Carta ${selectedCard.nombre} comprada exitosamente.`);
      }
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
      className="relative min-h-screen w-screen bg-cover bg-center text-white flex flex-col items-center pt-10"
      style={{ backgroundImage: `url(${background})` }}
    >
      <button
        onClick={() => navigate("/shop")}
        className="bg-red-600 px-4 py-2 rounded mb-6 hover:bg-red-500 transition absolute top-4 left-4"
      >
        Volver
      </button>

      <h1 className="text-4xl font-bold mb-6">Cartas en Venta</h1>

      <div className="flex justify-between items-center w-full max-w-5xl px-4 mb-2 text-lg font-semibold">
        <span>{`${leftRangeStart}-${leftRangeEnd}`}</span>
        <span>{`${rightRangeStart}-${rightRangeEnd}`}</span>
      </div>

      <div className="relative w-full max-w-5xl">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="absolute left-0 top-1/2 transform -translate-y-1/2
                     bg-black/50 hover:bg-black transition
                     p-3 rounded-full disabled:opacity-50 z-10"
        >
          <FaChevronLeft size={20} />
        </button>

        <div className="flex justify-between px-4">
          <div className="grid grid-cols-3 grid-rows-3 gap-2 w-1/2 pr-2">
            {visibleCards.slice(0, 9).map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="bg-black/40 rounded p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-black/70 transition"
              >
                <Carta jugador={card} />

                <div className="flex items-center justify-center mt-2 text-lg font-semibold">
                  <span>{card.precio}</span>
                  <FaCoins className="ml-1 text-yellow-400" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 grid-rows-3 gap-2 w-1/2 pl-2">
            {visibleCards.slice(9, 18).map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="bg-black/40 rounded p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-black/70 transition"
              >
                <Carta jugador={card} />
                <div className="mt-1 text-center text-xs">
                  <p>{card.tipo_carta}</p>
                  <p>{card.posicion}</p>
                </div>
                <div className="flex items-center justify-center mt-2 text-lg font-semibold">
                  <span>{card.precio}</span>
                  <FaCoins className="ml-1 text-yellow-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="absolute right-0 top-1/2 transform -translate-y-1/2
                     bg-black/50 hover:bg-black transition
                     p-3 rounded-full disabled:opacity-50 z-10"
        >
          <FaChevronRight size={20} />
        </button>
      </div>

      {showDialog && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto">
            <div className="flex justify-center mb-4">
              <Carta2 jugador={selectedCard} />
            </div>
            <div className="mb-4">
              <p className="text-xl font-semibold">{selectedCard.nombre}</p>
              <p className="text-lg">{selectedCard.tipo_carta}</p>
              <p className="text-lg">{selectedCard.posicion}</p>
            </div>
            <p className="text-lg my-4">
              ¿Deseas comprar esta carta
              {selectedCard.isDaily ? " (Diaria)" : ""}?
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
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
          <p className="text-white text-lg">Cargando todas las cartas...</p>
        </div>
      )}
    </div>
  );
}
