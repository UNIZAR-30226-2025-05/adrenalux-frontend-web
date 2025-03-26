import React from "react";
import { useNavigate } from "react-router-dom";
import NavBarGame from "./layout/game/NavbarGame";
import background from "../assets/background.png";
import BackButton from "./layout/game/BackButton";
import AchievementList from "./layout/game/AchievementList"; 

const Logros = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/home");
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <NavBarGame />

      <div className="relative w-full flex items-center px-4 md:px-8 lg:px-16">
        {/* Botón de volver */}
        <div className="absolute left-10 top-10">
          <BackButton onClick={handleBackClick} />
        </div>

        {/* Lista de logros */}
        <div className="w-full max-w-screen-md mx-auto">
          <AchievementList /> {/* Aquí se muestra la lista de logros */}
        </div>
      </div>
    </div>
  );
};

export default Logros;
