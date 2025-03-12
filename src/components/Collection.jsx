import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.png";
import Carta from "./layout/game/CartaMediana"; // Carta cuando el usuario la tiene y no está en venta
import Carta2 from "./layout/game/CartaGrande"; // Carta en el modal (vista ampliada)
import Carta3 from "./layout/game/CartaNoDisponible"; // Carta cuando no la tiene/disponible (en venta)
import { getCollection } from "../services/api/collectionApi";
import { publicarCarta, retirarCarta } from "../services/api/shopApi";
import BackButton from "../components/layout/game/BackButton";

export default function Collection({ onBack }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCard, setSelectedCard] = useState(null);
  const [price, setPrice] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 18;

  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBack) onBack();
    else navigate("/home");
  };

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      try {
        const data = await getCollection();
        const mappedData = data.map((card) => ({
          alias: card.nombreCompleto || card.nombre || "Sin nombre",
          ataque: card.ataque ?? 0,
          control: card.control ?? 0,
          medio: card.medio ?? 0,
          defensa: card.defensa ?? 0,
          equipo: card.club || "Sin club",
          escudo: card.escudo || "default_escudo.png",
          photo: card.photo || "default.png",
          tipo_carta: card.tipo_carta || "Normal",
          id: card.id,
          nombre: card.nombreCompleto || card.nombre || "Sin nombre",
          pais: card.nacionalidad || "Desconocido",
          posicion: card.posicion || "N/A",
          disponible: card.disponible,
          enVenta: card.enVenta || false,
          cantidad: card.cantidad,
          mercadoCartaId: card.mercadoCartaId || null,
        }));
        setCards(mappedData);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error al cargar la colección:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, []);

  const totalPages = Math.ceil(cards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const visibleCards = cards.slice(startIndex, startIndex + cardsPerPage);

  const leftRangeStart = startIndex + 1;
  const leftRangeEnd = leftRangeStart + 8;
  const rightRangeStart = leftRangeEnd + 1;
  const rightRangeEnd = rightRangeStart + 8;

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setPrice("");
    setShowModal(true);
  };

  const handleConfirmSale = async () => {
    if (!price || isNaN(price) || price <= 0) {
      alert("Por favor, ingresa un precio válido.");
      return;
    }
    try {
      const response = await publicarCarta(selectedCard.id, price);
      const mercadoCartaId = selectedCard.id;

      const updatedCard = {
        ...selectedCard,

        enVenta: true,
        precio: price,
        mercadoCartaId,
      };
      setCards((prevCards) =>
        prevCards.map((c) => (c.id === selectedCard.id ? updatedCard : c))
      );
      setSelectedCard(updatedCard);
      alert(
        `Carta ${updatedCard.nombre} puesta en venta por ${price} monedas.`
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error al poner la carta en venta:", error);
      alert("Hubo un error al poner la carta en venta.");
    }
  };

  const handleRetirarCarta = async () => {
    try {
      await retirarCarta(selectedCard.id);
      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === selectedCard.id
            ? { ...c, disponible: true, enVenta: false, precio: null }
            : c
        )
      );
      alert(`Carta ${selectedCard.nombre} retirada del mercado.`);
      setShowModal(false);
    } catch (error) {
      console.error("Error al retirar la carta:", error);
      alert("Hubo un error al retirar la carta.");
    }
  };

  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center text-white flex flex-col items-center pt-10"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="fixed top-10 left-10 z-50 bg-black/60 p-3 rounded-full">
        <BackButton onClick={handleBackClick} />
      </div>

      <h1 className="text-4xl font-bold mb-6">Colección</h1>

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
                onClick={
                  card.disponible ? () => handleCardClick(card) : undefined
                }
                className={
                  card.disponible
                    ? "cursor-pointer bg-black/40 rounded p-2 flex flex-col items-center justify-center hover:bg-black/70 transition"
                    : "cursor-not-allowed bg-black/40 rounded p-2 flex flex-col items-center justify-center opacity-70"
                }
              >
                {card.disponible ? (
                  <Carta jugador={card} />
                ) : (
                  <Carta3 jugador={card} />
                )}
                <div className="mt-1 text-center text-xs">
                  <p>{card.tipo_carta}</p>
                  <p>{card.posicion}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 grid-rows-3 gap-2 w-1/2 pl-2">
            {visibleCards.slice(9, 18).map((card) => (
              <div
                key={card.id}
                onClick={
                  card.disponible ? () => handleCardClick(card) : undefined
                }
                className={
                  card.disponible
                    ? "cursor-pointer bg-black/40 rounded p-2 flex flex-col items-center justify-center hover:bg-black/70 transition"
                    : "cursor-not-allowed bg-black/40 rounded p-2 flex flex-col items-center justify-center opacity-70"
                }
              >
                {card.disponible ? (
                  <Carta jugador={card} />
                ) : (
                  <Carta3 jugador={card} />
                )}
                <div className="mt-1 text-center text-xs">
                  <p>{card.tipo_carta}</p>
                  <p>{card.posicion}</p>
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

      {showModal && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <div className="flex justify-center mb-4">
              <Carta2 jugador={selectedCard} />
            </div>
            {selectedCard.enVenta ? (
              <>
                <p className="text-lg mb-4">
                  Esta carta ya está en venta. ¿Deseas retirarla del mercado?
                </p>
                <div className="flex justify-center space-x-6 mt-4">
                  <button
                    onClick={handleRetirarCarta}
                    className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-500 transition"
                  >
                    Retirar
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg mb-4">
                  ¿Cuánto quieres pedir por <b>{selectedCard.nombre}</b>?
                </p>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded bg-gray-800 text-white"
                  placeholder="Introduce el precio"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <div className="flex justify-center space-x-6 mt-4">
                  <button
                    onClick={handleConfirmSale}
                    className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
                  >
                    Vender
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
          <p className="text-white text-lg">Cargando colección...</p>
        </div>
      )}
    </div>
  );
}
