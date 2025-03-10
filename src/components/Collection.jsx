<<<<<<< Updated upstream
import React, { useState, useMemo } from "react";
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import background from "../assets/background.png";

import Card from "./layout/game/Card";
import SearchTab from "./layout/game/SearchTab";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/layout/game/BackButton"; // Importar BackButton

=======
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.png";
import Carta from "./layout/game/Carta";
import SearchTab from "./layout/game/SearchTab";
import { getCollection, filterCards } from "../services/api/collectionApi";
import { publicarCarta } from "../services/api/shopApi";
import BackButton from "../components/layout/game/BackButton";
>>>>>>> Stashed changes

export default function Collection({ onBack }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [price, setPrice] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("Rareza");
  const [selectedTeam, setSelectedTeam] = useState("Equipo");
  const [selectedPosition, setSelectedPosition] = useState("Posición");

  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBack) onBack();
    else navigate("/home");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedRarity !== "Rareza") params.rareza = selectedRarity;
        if (selectedTeam !== "Equipo") params.equipo = selectedTeam;
        if (selectedPosition !== "Posición") params.posicion = selectedPosition;

        let data =
          Object.keys(params).length > 0
            ? await filterCards(params)
            : await getCollection();

        const mappedData = data.map((card) => ({
          alias: card.nombreCompleto || card.nombre || "Sin nombre",
          ataque: card.ataque ?? 0,
          control: card.control ?? 0,
          medio: card.medio ?? 0,
          defensa: card.defensa ?? 0,
          equipo: card.club || "Sin club",
          escudo: card.escudo || "default_escudo.png",
          photo: card.photo || "default.png",
          tipo_carta: card.rareza || "Común",
          id: card.id,
          nombre: card.nombreCompleto || card.nombre || "Sin nombre",
          pais: card.nacionalidad || "Desconocido",
          posicion: card.posicion || "N/A",
          disponible: card.disponible,
          cantidad: card.cantidad,
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
  }, [selectedRarity, selectedTeam, selectedPosition]);

  const filteredCards = useMemo(() => {
    return cards.filter((card) =>
      (card.alias || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cards, searchQuery]);

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const visibleCards = filteredCards.slice(
    startIndex,
    startIndex + cardsPerPage
  );

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
      await publicarCarta(selectedCard.id, price);

      setCards((prevCards) =>
        prevCards.filter((card) => card.id !== selectedCard.id)
      );

      alert(
        `Carta ${selectedCard.nombre} puesta en venta por ${price} monedas.`
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error al poner la carta en venta:", error);
      alert("Hubo un error al poner la carta en venta.");
    }
  };

  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center text-white flex flex-col items-center pt-10"
      style={{ backgroundImage: `url(${background})` }}
    >
      <h1 className="text-5xl font-bold mb-8 mt-10">Colección</h1>

      <div className="grid grid-cols-4 gap-6 place-items-center px-6">
        <AnimatePresence>
          {visibleCards.map((card, index) => (
            <motion.div
              key={card.id}
              className="cursor-pointer transform scale-75 hover:scale-90 transition-transform duration-300"
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.1, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: index * 0.05,
              }}
              onClick={() => handleCardClick(card)}
            >
              <Carta jugador={card} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-10 flex justify-center w-full">
        <SearchTab
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedRarity={selectedRarity}
          setSelectedRarity={setSelectedRarity}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
        />
      </div>

      <div className="flex justify-center items-center my-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-black/50 rounded disabled:opacity-50 hover:bg-black transition mr-4"
        >
          <FaChevronLeft />
        </button>
        <span className="text-lg">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-black/50 rounded disabled:opacity-50 hover:bg-black transition ml-4"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className="fixed top-10 left-10 z-[50] bg-black/60 p-3 rounded-full">
        <BackButton onClick={handleBackClick} />
      </div>

      {showModal && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto">
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
          </div>
        </div>
      )}
    </div>
  );
}
