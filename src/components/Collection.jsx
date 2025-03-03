import React, { useState, useMemo } from "react";
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import background from "../assets/background.png";
import finalCard from "../assets/finalCard.png";
import teamImage from "../assets/manchester_united.png";
import countryImage from "../assets/portugal.png";
import cristiano from "../assets/cristiano.png";

import Card from "./layout/game/Card";
import SearchTab from "./layout/game/SearchTab";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/layout/game/BackButton"; // Importar BackButton

// Example data from backend
const cardData = [
  {
    id: 1,
    name: "Cristiano",
    rating: 91,
    rarity: "Épica",
    team: "Manchester United",
    position: "Delantero",
    price: 62000000,
    image: finalCard,
    image3: teamImage,
    image5: countryImage,
    face: cristiano,
  },
  {
    id: 2,
    name: "Messi",
    rating: 93,
    rarity: "Épica",
    team: "Barcelona",
    position: "Delantero",
    price: 63000000,
    image: finalCard,
  },
  {
    id: 3,
    name: "Modric",
    rating: 88,
    rarity: "Rara",
    team: "Real Madrid",
    position: "Mediocampista",
    price: 35000000,
    image: finalCard,
  },
  {
    id: 4,
    name: "Pedri",
    rating: 85,
    rarity: "Rara",
    team: "Barcelona",
    position: "Mediocampista",
    price: 40000000,
    image: finalCard,
  },
  {
    id: 5,
    name: "Lewandowski",
    rating: 92,
    rarity: "Épica",
    team: "Barcelona",
    position: "Delantero",
    price: 38000000,
    image: finalCard,
  },
  {
    id: 6,
    name: "Benzema",
    rating: 91,
    rarity: "Épica",
    team: "Real Madrid",
    position: "Delantero",
    price: 39000000,
    image: finalCard,
  },
  {
    id: 7,
    name: "Kroos",
    rating: 87,
    rarity: "Rara",
    team: "Real Madrid",
    position: "Mediocampista",
    price: 34000000,
    image: finalCard,
  },
  {
    id: 8,
    name: "Vinicius",
    rating: 86,
    rarity: "Rara",
    team: "Real Madrid",
    position: "Delantero",
    price: 43000000,
    image: finalCard,
  },
  {
    id: 9,
    name: "Casemiro",
    rating: 89,
    rarity: "Rara",
    team: "Real Madrid",
    position: "Mediocampista",
    price: 33000000,
    image: finalCard,
  },
];

export default function Collection({ onBack }) {
  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("Rareza");
  const [selectedTeam, setSelectedTeam] = useState("Equipo");
  const [selectedPosition, setSelectedPosition] = useState("Posición");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8; // 8 => 4 columns × 2 rows

  // Filter logic
  const filteredCards = useMemo(() => {
    return cardData.filter((card) => {
      const matchName = card.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchRarity =
        selectedRarity === "Rareza" ||
        (card.rarity &&
          card.rarity.toLowerCase() === selectedRarity.toLowerCase());
      const matchTeam =
        selectedTeam === "Equipo" ||
        card.team.toLowerCase() === selectedTeam.toLowerCase();
      const matchPosition =
        selectedPosition === "Posición" ||
        card.position.toLowerCase() === selectedPosition.toLowerCase();

      return matchName && matchRarity && matchTeam && matchPosition;
    });
  }, [searchQuery, selectedRarity, selectedTeam, selectedPosition]);

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const visibleCards = filteredCards.slice(
    startIndex,
    startIndex + cardsPerPage
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // On card click, show big card in a modal with extra info
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate("/home");
  };
  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center text-white flex flex-col items-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <h1 className="text-5xl font-bold mt-13">Coleccion</h1>

      {/* Back Button */}
      {/* Back button */}
      <div className="absolute top-5 left-5">
        <BackButton onClick={handleBackClick} /> {/* Botón de regreso */}
      </div>

      {/* Search & Filters Bar */}
      <div className="mt-12 flex justify-center">
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

      {/* Cards Grid (4 columns => 2 rows => 8 per page) */}
      <div className="flex-grow grid grid-cols-4 gap-4 place-items-center px-10 mt-8">
        {visibleCards.length > 0 ? (
          visibleCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={handleCardClick}
              flip={false}
            />
          ))
        ) : (
          <p className="text-xl font-semibold col-span-4">
            No se encontraron resultados
          </p>
        )}
      </div>

      {/* Pagination */}
      {visibleCards.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center mb-6">
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
      )}

      {/* Modal: show bigger card + extra info */}
      {showModal && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal content */}
          <div className="bg-black p-6 rounded-lg shadow-lg text-white max-w-2xl mx-auto flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            {/* Left side: bigger card */}
            <div className="relative w-[250px] h-[350px]">
              <img
                src={selectedCard.image}
                alt={selectedCard.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Optionally re-show rating, position, face, etc. */}
              {selectedCard.face && (
                <img
                  src={selectedCard.face}
                  alt="Player Face"
                  className="absolute top-[40%] right-2 transform -translate-x-1/3 -translate-y-1/3 w-16 h-16 object-cover"
                />
              )}
            </div>

            {/* Right side: additional info */}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-2">{selectedCard.name}</h2>
              <p className="mb-1">Rareza: {selectedCard.rarity}</p>
              <p className="mb-1">Equipo: {selectedCard.team}</p>
              <p className="mb-1">Posición: {selectedCard.position}</p>
              <p className="mb-1">
                Valor: {selectedCard.price.toLocaleString()} coins
              </p>
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="bg-red-600 px-4 py-2 rounded mt-4 hover:bg-red-500 transition"
              >
                Vender
              </button>
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="bg-red-600 px-4 py-2 rounded mt-4 hover:bg-red-500 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
