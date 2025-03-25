import React from "react";
import { useNavigate } from "react-router-dom";
import NavBarGame from "./layout/game/NavbarGame"; // Asegúrate de importar correctamente los componentes
import background from "../assets/background.png";
import BackButton from "./layout/game/BackButton";
import AchievementList from "./layout/game/AchievementList"; // Importamos AchievementList

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

      <div className="relative h-screen w-full flex items-center px-64">
        {/* Botón de volver */}
        <div className="absolute left-10 top-10 mt-16">
          <BackButton onClick={handleBackClick}/>
        </div>

        {/* Lista de logros */}
        <div className="mx-auto">
          <AchievementList /> {/* Aquí se muestra la lista de logros */}
        </div>
      </div>
    </div>
  );
};

export default Logros;
