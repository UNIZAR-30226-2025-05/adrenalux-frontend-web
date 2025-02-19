import NavBarGame from './layout/game/NavBarGame'; // Ruta correcta
import background from '../assets/background.png'; // Importa la imagen de fondo

const Home = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      {/* NavBarGame en la parte superior */}
      <NavBarGame />

      {/* Contenedor principal */}
      <div className="flex justify-center items-center flex-1 w-full px-4">
        <h1 className="text-4xl font-bold text-white text-center w-full mx-[530px]">Bienvenido</h1>
      </div>
    </div>
  );
};

export default Home;
