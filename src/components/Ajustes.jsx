import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import NavBarGame from './layout/game/NavbarGame';
import BackButton from './layout/game/BackButton';
import background from '../assets/background.png';

const Ajustes = () => {
  const navigate = useNavigate(); // Obtener la función de navegación

  // Estados para manejar los valores del volumen
  const [generalVolume, setGeneralVolume] = useState(80);
  const [sfxVolume, setSfxVolume] = useState(40);

  // Estado para controlar la visibilidad del mensaje "Acerca de nosotros"
  const [showAboutUs, setShowAboutUs] = useState(false);

  // Función para manejar el clic en el botón de volver
  const handleBackClick = () => {
    navigate("/home"); // Redirigir a la pantalla de inicio
  };

  // Función para calcular el estilo de la barra del slider
  const getSliderStyle = (value) => {
    return {
      background: `linear-gradient(to right, #4299e1 0%, #4299e1 ${value}%, #4a5568 ${value}%, #4a5568 100%)`,
    };
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
          <BackButton onClick={handleBackClick} /> {/* Pasar la función de navegación */}
        </div>

        {/* Contenedor de ajustes */}
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
                  style={getSliderStyle(generalVolume)} // Aplicar estilo dinámico
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
                  style={getSliderStyle(sfxVolume)} // Aplicar estilo dinámico
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                />
                <p className="text-white text-sm mt-2">Volumen: {sfxVolume}%</p>
              </div>
            </div>
          </div>

          {/* Cambiar idioma */}
          <div className="mb-8">
            <h2 className="text-white text-2xl font-semibold mb-4">Cambiar idioma</h2>
            <div className="relative">
              <select className="block appearance-none w-full bg-gray-700 border border-gray-600 text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-600 focus:border-gray-500">
                <option>Español</option>
                <option>Inglés</option>
                <option>Francés</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Cerrar sesión y Acerca de nosotros */}
          <div className="flex justify-between">
            <button className="text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded">
              Cerrar Sesión
            </button>
            <button
              className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
              onClick={() => setShowAboutUs(true)} // Mostrar el mensaje al hacer clic
            >
              Acerca de nosotros
            </button>
          </div>
        </div>
      </div>

      {/* Modal o pestaña de "Acerca de nosotros" */}
      {showAboutUs && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-center text-white text-2xl font-bold mb-4">Acerca de nosotros</h2>
            <p className="text-white mb-6">
              Este es un texto de ejemplo para la sección "Acerca de nosotros". Puedes añadir
              aquí información sobre tu aplicación, equipo, o cualquier otro detalle relevante.
            </p>
            {/* Contenedor del botón centrado */}
            <div className="flex justify-center">
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                onClick={() => setShowAboutUs(false)} // Cerrar el mensaje
              >
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