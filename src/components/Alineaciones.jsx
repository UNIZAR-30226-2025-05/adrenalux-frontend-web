import { useNavigate } from "react-router-dom";
import BackButton from "../components/layout/game/BackButton"; // Ajusta la ruta si es necesario
import background from "../assets/background.png"; // Fondo de la pantalla

export default function Alineaciones() {
  const navigate = useNavigate();

  // Función para manejar el click del botón de retroceso
  const handleBackClick = () => {
    navigate("/home"); // Redirige a la página de inicio
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      {/* Botón de retroceso */}
      <div className="absolute top-5 left-5">
        <BackButton onClick={handleBackClick} /> {/* Pasa la función handleBackClick */}
      </div>

      {/* Aquí puedes agregar el contenido de la pantalla de Alineaciones */}
      <div className="flex justify-center items-center h-full">
        <h1 className="text-4xl font-bold text-white">Pantalla de Alineaciones</h1>
      </div>
    </div>
  );
}
