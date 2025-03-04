import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/layout/game/BackButton";
import background from "../assets/background.png";
import Card from "./layout/game/Card";

export default function ShopCollection({
  searchQuery = "",
  selectedTeam = "",
  selectedPosition = "",
  onBack,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();

  const cardsPerPage = 8;

  // Filtrado de cartas según criterios
  const filteredCards = useMemo(() => {
    return cardData.filter((card) => {
      const matchName = card.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchTeam =
        !selectedTeam ||
        selectedTeam === "Equipo" ||
        card.team.toLowerCase() === selectedTeam.toLowerCase();
      const matchPosition =
        !selectedPosition ||
        selectedPosition === "Posición" ||
        card.position.toLowerCase() === selectedPosition.toLowerCase();

      return matchName && matchTeam && matchPosition;
    });
  }, [searchQuery, selectedTeam, selectedPosition]);

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const startIndex = (currentPage - 1) * cardsPerPage;
  const visibleCards = filteredCards.slice(
    startIndex,
    startIndex + cardsPerPage
  );

  // Al hacer clic en una carta, se muestra un diálogo (modal) de confirmación
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowDialog(true);
  };

  const handleConfirm = () => {
    console.log(`Compra confirmada de ${selectedCard?.name}`);
    setShowDialog(false);
    setSelectedCard(null);
  };

  const handleCancel = () => {
    console.log("Compra cancelada");
    setShowDialog(false);
    setSelectedCard(null);
  };

  const handleBackClick = () => {
    navigate("/shop");
  };

  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center text-white flex flex-col items-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Botón Volver */}
      <div className="absolute top-5 left-5">
        <BackButton onClick={handleBackClick} /> 
      </div>

      {/* Grid de cartas */}
      <div className="flex-grow grid grid-cols-4 gap-4 place-items-center px-10 mt-16">
        {visibleCards.length > 0 ? (
          visibleCards.map((card) => (
            <Card key={card.id} card={card} onClick={handleCardClick} />
          ))
        ) : (
          <p className="text-xl font-semibold col-span-4">
            No se encontraron resultados
          </p>
        )}
      </div>

      {/* Controles de paginación */}
      {visibleCards.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center my-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-black/50 rounded disabled:opacity-50 hover:bg-black transition mr-6"
          >
            &lt;
          </button>
          <span className="text-lg">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-black/50 rounded disabled:opacity-50 hover:bg-black transition ml-6"
          >
            &gt;
          </button>
        </div>
      )}

      {/* Diálogo  */}
      {showDialog && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto">
            <p className="text-lg mb-6">
              ¿Quieres comprar la carta de <b>{selectedCard.name}</b>?
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={handleConfirm}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
              >
                Sí
              </button>
              <button
                onClick={handleCancel}
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
