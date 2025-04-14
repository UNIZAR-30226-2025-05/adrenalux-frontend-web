import { useNavigate } from "react-router-dom";
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
      className="fixed inset-0 bg-cover bg-center overflow-auto"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Botón fijo en esquina superior izquierda */}
      <div className="fixed left-6 top-6 z-50">
        <BackButton onClick={handleBackClick} />
      </div>

      {/* Contenido centrado con scroll */}
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="w-full max-w-screen-md mx-auto my-8">
          <AchievementList />
        </div>
      </div>
    </div>
  );
};

export default Logros;