import { useNavigate } from "react-router-dom";
import BackButton from "../components/layout/game/BackButton"; // Ajusta la ruta si es necesario
import background from "../assets/background.png"; // Fondo de la pantalla
import AlineacionMenu from "../components/layout/game/alineacionMenu";
import FondoAlineacion from "../assets/backgroundAlineacion.png";

export default function Alineaciones() {
  const navigate = useNavigate();

  const alineacionData = [
    {
      id: 1,
      favorita: 1,
      nombre: "No more war",
    },
    {
      id: 2,
      favorita: 0,
      nombre: "Los Luxiris",
    },
    {
      id: 3,
      favorita: 0,
      nombre: "Los Luxiris",
    },
    {
      id: 4,
      favorita: 0,
      nombre: "Los Luxiris",
    },
    {
      id: 5,
      favorita: 0,
      nombre: "Los Luxiris",
    },
    {
      id: 6,
      favorita: 0,
      nombre: "Los Luxiris",
    },
    {
      id: 7,
      favorita: 0,
      nombre: "Los Luxiris",
    },
  ];

  const handleBackClick = () => {
    navigate("/home");
  };

  const handleAddAlineacion = () => {
    console.log("Añadir nueva alineación");
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-start bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute top-5 left-5">
        <BackButton onClick={handleBackClick} />
      </div>

      <div className="absolute top-10 w-full text-center">
        <h1 className="text-3xl font-bold text-white">Mis alineaciones</h1>
      </div>

      {/* Contenedor de las alineaciones */}
      <div className="w-full max-h-screen overflow-y-auto grid grid-cols-4 gap-6 mt-40 px-20">
        {alineacionData.map((alineacion) => (
          <AlineacionMenu
            key={alineacion.id}
            nombre={alineacion.nombre}
            favorito={alineacion.favorita}
          />
        ))}

        {/* Rectángulo al final de las alineaciones con el icono de suma */}
        <button
          className="w-64 h-32 bg-black rounded-lg opacity-80 flex justify-between p-4"
          onClick={handleAddAlineacion}
        >
          <div className="flex flex-col justify-start w-full">
            <p className="text-white">Añadir nueva alineación</p>
            <img
              src={FondoAlineacion}
              alt="Fondo"
              className="w-full h-16 object-cover mt-2 rounded-lg"
            />
          </div>
        </button>
      </div>
    </div>
  );
}
