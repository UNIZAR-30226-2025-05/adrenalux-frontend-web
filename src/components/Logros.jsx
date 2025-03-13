import NavBarGame from "./layout/game/NavbarGame";
import background from "../assets/background.png";
import BackButton from "./layout/game/BackButton";
import AchievementList from "./layout/game/AchievementList";

const Logros = () => {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <NavBarGame />

      <div className="relative h-screen w-full flex items-center px-64">
        {/* Botón de volver */}
        <div className="absolute left-10 top-10 mt-16">
          <BackButton />
        </div>

        {/* Lista de logros */}
        <div className="mx-auto">
          <AchievementList />
        </div>
      </div>
    </div>
  );
};

export default Logros;
