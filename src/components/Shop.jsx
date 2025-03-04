import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchTab from "./layout/game/SearchTab";
import { FaPlusCircle } from "react-icons/fa";
import BackButton from "../components/layout/game/BackButton";
import background from "../assets/background.png";
import ShopCollection from "./ShopCollection";
import finalCard from "../assets/CartaNormal.png";
import { FaCoins } from "react-icons/fa";
import MarqueeText from "./layout/MarqueesText";
import Card3D from "./layout/game/Card3D";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import RotatingModel from "./layout/game/RotatingModel";

export default function Shop() {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("Equipo");
  const [selectedPosition, setSelectedPosition] = useState("Posición");

  const [showCollection, setShowCollection] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const luxurisCards = [
    {
      id: 101,
      name: "Cristiano",
      rating: 91,
      team: "Manchester United",
      position: "Delantero",
      price: 500000,
      image: finalCard,
    },
    {
      id: 102,
      name: "Messi",
      rating: 93,
      team: "Barcelona",
      position: "Delantero",
      price: 500000,
      image: finalCard,
    },
    {
      id: 103,
      name: "Modric",
      rating: 88,
      team: "Real Madrid",
      position: "Mediocampista",
      price: 500000,
      image: finalCard,
    },
  ];

  // Carga el modelo 3D una sola vez
  const gltf = useGLTF("/models/card_3d.glb");

  // Handles click on a Luxuris card
  const handleLuxurisCardClick = (card) => {
    console.log(`Clicked card: ${card.name}`);
    setSelectedCard(card);
    setShowDialog(true);
  };

  // Called when Enter is pressed in the SearchTab
  const handleSearchEnter = () => {
    setShowCollection(true);
  };

  // Function to return from ShopCollection
  const handleBackFromCollection = () => {
    setShowCollection(false);
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  // Render shop view
  const renderShopView = () => {
    return (
      <div
        className="relative h-screen w-screen bg-cover bg-center text-white flex flex-col items-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        {/* Back Button */}
        <div className="absolute top-5 left-5">
          <BackButton onClick={handleBackClick} />
        </div>

        {/* Coins */}
        <div className="absolute top-5 right-5 flex items-center bg-black px-6 py-3 rounded-lg shadow-md">
          <span className="text-2xl font-semibold mr-2">5,000</span>
          <FaCoins className="text-yellow-400 text-2xl" />
          <FaPlusCircle className="text-green-500 ml-3 text-2xl cursor-pointer hover:text-green-400 transition" />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold mt-28">Tienda</h1>

        {/* Luxuris del día section */}
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
            <MarqueeText text="Luxuris  del  día" />
          </div>

          {/* Render multiple 3D cards in a single Canvas */}
          <div className="flex justify-center space-x-16">
            {luxurisCards.map((card) => (
              <Card3D
                key={card.id}
                card={card}
                onClick={handleLuxurisCardClick}
              />
            ))}
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="mt-12 flex justify-center">
          <SearchTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
            onSearchEnter={handleSearchEnter}
          />
        </div>

        {/* Modal for Luxuris */}
        {showDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-black p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto">
              <p className="text-lg mb-6">
                ¿Quieres comprar a <b>{selectedCard.name}</b> luxury?
              </p>
              <div className="flex justify-center space-x-6">
                <button
                  onClick={() => {
                    console.log("Compra confirmada");
                    setShowDialog(false);
                  }}
                  className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
                >
                  Sí
                </button>
                <button
                  onClick={() => {
                    console.log("Compra cancelada");
                    setShowDialog(false);
                  }}
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
  };

  // Show ShopCollection if showCollection is true; otherwise show Shop view.
  return showCollection ? (
    <ShopCollection
      searchQuery={searchQuery}
      selectedTeam={selectedTeam}
      selectedPosition={selectedPosition}
      onBack={handleBackFromCollection}
    />
  ) : (
    renderShopView()
  );
}
