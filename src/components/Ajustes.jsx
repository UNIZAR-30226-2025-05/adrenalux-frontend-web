import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { logout } from "../services/api/authApi"; // Importar la función logout
import NavBarGame from './layout/game/NavbarGame';
import BackButton from './layout/game/BackButton';
import background from '../assets/background.png';
import { getToken } from "../services/api/authApi";

const Ajustes = () => {
  const navigate = useNavigate(); // Obtener la función de navegación
  const token = getToken();

  // Estados iniciales cargados desde localStorage o valores por defecto
  const [generalVolume, setGeneralVolume] = useState(
    parseInt(localStorage.getItem("generalVolume")) || 80
  );
  const [sfxVolume, setSfxVolume] = useState(
    parseInt(localStorage.getItem("sfxVolume")) || 40
  );
  const [language, setLanguage] = useState(localStorage.getItem("language") || "es");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [showAboutUs, setShowAboutUs] = useState(false);

  // Efecto para guardar en localStorage cuando los valores cambian
  useEffect(() => {
    localStorage.setItem("generalVolume", generalVolume);
  }, [generalVolume]);

  useEffect(() => {
    localStorage.setItem("sfxVolume", sfxVolume);
  }, [sfxVolume]);

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
    <div
      className="absolute inset-0 flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <NavBarGame />
      <div className="relative w-full h-screen mt-32">
        {/* Botón de retroceso ajustado a la esquina */}
        <div className="absolute left-4 top-4 z-10">
          <BackButton onClick={handleBackClick} />
        </div>

        {/* Contenedor de ajustes */}
        <div className="mx-auto bg-gray-300 dark:bg-gray-900 bg-opacity-90 p-8 rounded-lg w-11/12 max-w-4xl mt-16">
          <h1 className="text-black dark:text-black dark:text-white text-4xl font-bold mb-8 text-center">Ajustes</h1>

          {/* Cambiar tema */}
          <div className="mb-8">
            <h2 className="text-black dark:text-white text-2xl font-semibold mb-4">Cambiar tema</h2>
            <div className="relative">
              <button
                onClick={() => {
                  const newTheme = theme === "light" ? "dark" : "light";
                  setTheme(newTheme);
                  localStorage.setItem("theme", newTheme); // Guardar en localStorage

                  // Aplicar el tema al body
                  if (newTheme === "light") {
                    document.documentElement.classList.remove("dark");
                  } else {
                    document.documentElement.classList.add("dark");
                  }
                }}
                className="block w-full bg-gray-700 text-white py-3 px-4 rounded leading-tight focus:outline-none focus:bg-gray-600 focus:border-gray-500 flex justify-between items-center"
              >
                <span>{theme === "light" ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}</span>
                <div className="flex items-center">
                  <span className="ml-2 text-xl">
                    {theme === "light" ? "🌞" : "🌙"}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Ajustes de sonido */}
          <div className="mb-8">
            <h2 className="text-black dark:text-white text-2xl font-semibold mb-4">Ajustes de sonido</h2>
            <div className="space-y-4">
              <div>
                <label className="text-black dark:text-white">General</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={generalVolume}
                  onChange={(e) => setGeneralVolume(e.target.value)}
                  style={getSliderStyle(generalVolume)}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                />
                <p className="text-black dark:text-white text-sm mt-2">Volumen: {generalVolume}%</p>
              </div>

              <div>
                <label className="text-black dark:text-white">SFX</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(e.target.value)}
                  style={getSliderStyle(sfxVolume)}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                />
                <p className="text-black dark:text-white text-sm mt-2">Volumen: {sfxVolume}%</p>
              </div>
            </div>
          </div>

          {/* Cambiar idioma */}
          <div className="mb-8">
            <h2 className="text-black dark:text-white text-2xl font-semibold mb-4">Cambiar idioma</h2>
            <div className="relative">
              <select 
                className="block appearance-none w-full bg-gray-700 border border-gray-600 text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-600 focus:border-gray-500"
                onChange={(e) => setLanguage(e.target.value)}
              >
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
            <button
              className="text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
            <button
              className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
              onClick={() => setShowAboutUs(true)}
            >
              Acerca de nosotros
            </button>
          </div>
        </div>
      </div>

      {/* Modal "Acerca de nosotros" */}
      {showAboutUs && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-black dark:text-white text-2xl font-bold mb-4">Acerca de nosotros</h2>
            <p className="text-black dark:text-white mb-6">
              Información sobre la aplicación y el equipo de desarrollo.
            </p>
            <div className="flex justify-center">
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
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
