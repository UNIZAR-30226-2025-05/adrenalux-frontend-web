import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { logout } from "../services/api/authApi"; // Importar la función logout
import NavBarGame from './layout/game/NavbarGame';
import BackButton from './layout/game/BackButton';
import background from '../assets/background.png';
import { getToken } from "../services/api/authApi";

import { loadSound, playMusic, changeMusicVolume } from '../utils/soundManager';

const Ajustes = () => {
  const navigate = useNavigate(); // Obtener la función de navegación
  const token = getToken();

  // Estados iniciales cargados desde localStorage o valores por defecto
  const [musicVolume, setMusicVolume] = useState(
    parseInt(localStorage.getItem("musicVolume")) || 50
  );
  const [language, setLanguage] = useState(localStorage.getItem("language") || "es");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [showAboutUs, setShowAboutUs] = useState(false);

  // Efecto para guardar en localStorage cuando los valores cambian
  useEffect(() => {
    localStorage.setItem("musicVolume", musicVolume);
    changeMusicVolume(musicVolume / 100);  // Actualiza el volumen de la música usando Howler.js
  }, [musicVolume]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark"; // Por defecto "dark"
    setTheme(savedTheme);
  
    // Aplicar el tema al body
    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Función para manejar el cambio de tema
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  
    // Aplicar el tema a la raíz (documento HTML)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Función para manejar el clic en el botón de volver
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
    <div className="fixed inset-0 overflow-y-auto bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      <NavBarGame />
      <div className="relative w-full min-h-screen flex flex-col items-center pt-24 pb-8 px-4">
        {/* Botón de retroceso */}
        <div className="absolute left-4 top-24 z-10">
          <BackButton onClick={handleBackClick} />
        </div>
  
        {/* Contenedor de ajustes - modificado para evitar desbordamiento */}
        <div className="w-full max-w-4xl bg-gray-300 dark:bg-gray-900 bg-opacity-90 p-6 rounded-lg shadow-lg overflow-hidden">
          <h1 className="text-black dark:text-white text-3xl font-bold mb-6 text-center">Ajustes</h1>
  
          {/* Sección de tema */}
          <div className="mb-6">
            <h2 className="text-black dark:text-white text-xl font-semibold mb-3">Cambiar tema</h2>
            <button
              onClick={toggleTheme}
              className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg flex justify-between items-center"
            >
              <span>{theme === "light" ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}</span>
              <span className="text-xl">{theme === "light" ? "🌞" : "🌙"}</span>
            </button>
          </div>
  
          {/* Ajustes de sonido */}
          <div className="mb-6">
            <h2 className="text-black dark:text-white text-xl font-semibold mb-3">Ajustes de sonido</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-black dark:text-white mb-1">Música</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(e.target.value)}
                  style={getSliderStyle(musicVolume)}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                />
                <p className="text-black dark:text-white text-sm mt-1">Volumen: {musicVolume}%</p>
              </div>
            </div>
          </div>
  
          {/* Cambiar idioma */}
          <div className="mb-6">
            <h2 className="text-black dark:text-white text-xl font-semibold mb-3">Cambiar idioma</h2>
            <div className="relative">
              <select 
                className="block w-full bg-gray-700 border border-gray-600 text-white py-3 px-4 pr-8 rounded-lg"
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option>Español</option>
                <option>Inglés</option>
                <option>Francés</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
  
          {/* Botones inferiores */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              onClick={() => setShowAboutUs(true)}
            >
              Acerca de nosotros
            </button>
          </div>
        </div>
      </div>
  
      {/* Modal "Acerca de nosotros" */}
      {showAboutUs && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-black dark:text-white text-2xl font-bold mb-4">Acerca de nosotros</h2>
            <p className="text-black dark:text-white mb-6">
              Información sobre la aplicación y el equipo de desarrollo.
            </p>
            <div className="flex justify-center">
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg"
                onClick={() => setShowAboutUs(false)}
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
