import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/api/authApi"; // Importar la función logout
import NavBarGame from './layout/game/NavbarGame';
import BackButton from './layout/game/BackButton';
import background from '../assets/background.png';

const Ajustes = () => {
  const navigate = useNavigate();
  const [generalVolume, setGeneralVolume] = useState(80);
  const [sfxVolume, setSfxVolume] = useState(40);
  const [showAboutUs, setShowAboutUs] = useState(false);

  const handleBackClick = () => {
    navigate("/home");
  };

  const getSliderStyle = (value) => ({
    background: `linear-gradient(to right, #4299e1 0%, #4299e1 ${value}%, #4a5568 ${value}%, #4a5568 100%)`,
  });

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      const success = await logout(); // Llamar a la función de cierre de sesión

      if (success) {
        navigate("/login"); // Redirigir al login tras cerrar sesión
      } else {
        throw new Error("Error al cerrar sesión en el servidor");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Hubo un problema al cerrar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <NavBarGame />
      <div className="relative h-screen w-full flex items-center px-64">
        <div className="absolute left-10 top-10 mt-16">
          <BackButton onClick={handleBackClick} />
        </div>

        <div className="mx-auto bg-gray-900 bg-opacity-90 p-8 rounded-lg w-11/12 max-w-4xl mt-16">
          <h1 className="text-white text-4xl font-bold mb-8 text-center">Ajustes</h1>

          {/* Ajustes de sonido */}
          <div className="mb-8">
            <h2 className="text-white text-2xl font-semibold mb-4">Ajustes de sonido</h2>
            <div className="space-y-4">
              <div>
                <label className="text-white">General</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={generalVolume}
                  onChange={(e) => setGeneralVolume(e.target.value)}
                  style={getSliderStyle(generalVolume)}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                />
                <p className="text-white text-sm mt-2">Volumen: {generalVolume}%</p>
              </div>

              <div>
                <label className="text-white">SFX</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(e.target.value)}
                  style={getSliderStyle(sfxVolume)}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                />
                <p className="text-white text-sm mt-2">Volumen: {sfxVolume}%</p>
              </div>
            </div>
          </div>

          {/* Cambiar idioma */}
          <div className="mb-8">
            <h2 className="text-white text-2xl font-semibold mb-4">Cambiar idioma</h2>
            <select className="block w-full bg-gray-700 border border-gray-600 text-white py-3 px-4 rounded">
              <option>Español</option>
              <option>Inglés</option>
              <option>Francés</option>
            </select>
          </div>

          {/* Cerrar sesión y Acerca de nosotros */}
          <div className="flex justify-between">
            <button className="text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded" onClick={handleLogout}>
              Cerrar Sesión
            </button>
            <button className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded" onClick={() => setShowAboutUs(true)}>
              Acerca de nosotros
            </button>
          </div>
        </div>
      </div>

      {/* Modal "Acerca de nosotros" */}
      {showAboutUs && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-center text-white text-2xl font-bold mb-4">Acerca de nosotros</h2>
            <p className="text-white mb-6">Información sobre la aplicación y el equipo de desarrollo.</p>
            <div className="flex justify-center">
              <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded" onClick={() => setShowAboutUs(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ajustes;