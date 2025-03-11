import React, { useState } from "react";
import NavBarGame from './layout/game/NavbarGame';
import BackButton from './layout/game/BackButton';
import background from '../assets/background.png';

const Ajustes = () => {
  // Estados para manejar los valores del volumen
  const [generalVolume, setGeneralVolume] = useState(80); // Volumen general (valor inicial: 80%)
  const [sfxVolume, setSfxVolume] = useState(40); // Volumen de efectos de sonido (valor inicial: 40%)

  // Función para calcular el color de fondo del slider
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
      {/* Barra de navegación */}
      <NavBarGame />

      {/* Contenedor principal */}
      <div className="relative h-screen w-full flex items-center px-64">
        {/* Botón de volver */}
        <div className="absolute left-10 top-10 mt-16">
          <BackButton />
        </div>

        {/* Contenedor de ajustes */}
        <div className="mx-auto bg-gray-900 bg-opacity-90 p-8 rounded-lg w-11/12 max-w-4xl mt-16">
          {/* Título de la pantalla (centrado) */}
          <h1 className="text-white text-4xl font-bold mb-8 text-center">Ajustes</h1>

          {/* Ajustes de sonido */}
          <div className="mb-8">
            <h2 className="text-white text-2xl font-semibold mb-4">Ajustes de sonido</h2>
            <div className="space-y-4">
              {/* Barra de volumen general */}
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

              {/* Barra de efectos de sonido (SFX) */}
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
            <button className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded">
              Acerca de nosotros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ajustes;