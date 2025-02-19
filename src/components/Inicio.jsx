import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import pantallaPrincipal from '../assets/pantalla_principal.png';

const Inicio = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Establece el fondo blanco y quita márgenes
    document.body.style.backgroundColor = "white";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignUpClick = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Encabezado con logo y botones */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
        <div className="flex justify-between items-center px-8 py-4 w-full">
          <img src={logo} alt="Logo" className="max-w-[50px] ml-2" />
          <nav>
            <button 
              className="text-gray-600 bg-white border border-transparent rounded-md px-4 py-2 ml-4 transition duration-300 hover:text-blue-500 hover:bg-gray-100 hover:border-blue-500"
              onClick={handleLoginClick}>
              Iniciar sesión
            </button>
            <button 
              className="text-gray-600 bg-white border border-transparent rounded-md px-4 py-2 ml-4 transition duration-300 hover:text-blue-500 hover:bg-gray-100 hover:border-blue-500"
              onClick={handleSignUpClick}>
              Registrarse
            </button>
          </nav>
        </div>
      </header>

      {/* Sección principal */}
      <main className="flex justify-center items-center flex-1 w-full pt-24 overflow-x-hidden pl-5">
        <div className="flex flex-wrap items-center justify-between w-full px-8 gap-10">
          {/* Sección del texto a la izquierda */}
          <section className="flex-1 text-left flex flex-col justify-center gap-5 min-w-[300px]">
            <h2 className="text-3xl font-bold text-gray-800">¡Bienvenido a AdrenaLux!</h2>
            <p className="text-lg text-gray-600">Colecciona, juega y gana</p>
            <div className="w-full h-[1px] bg-black"></div>
            <p className="text-gray-600">Sumergete en este TCG de La Liga en el que podrás encontrar a tus jugadores favoritos.</p>
            <p className="text-gray-600">¿Serás capaz de completar la colección?</p>
            <a href="#" className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 opacity-80 w-fit min-w-[120px]">
              Descúbrelo
            </a>
          </section>

          {/* Sección de la imagen a la derecha */}
          <section className="flex-1 flex justify-center items-center overflow-hidden min-w-[300px]">
            <img src={pantallaPrincipal} alt="Imagen secundaria" className="max-w-full w-full h-auto object-contain" />
          </section>
        </div>
      </main>

      {/* Pie de página con botones */}
      <footer className="bg-gray-700 text-white py-4 text-center opacity-80 w-full">
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="#" className="hover:bg-blue-100 transition duration-300 py-2 px-4 rounded-md">Política de Privacidad</a>
          <a href="#" className="hover:bg-blue-100 transition duration-300 py-2 px-4 rounded-md">Términos de Uso</a>
          <a href="#" className="hover:bg-blue-100 transition duration-300 py-2 px-4 rounded-md">FAQ</a>
          <a href="#" className="hover:bg-blue-100 transition duration-300 py-2 px-4 rounded-md">Estado</a>
        </div>
      </footer>
    </div>
  );
};

export default Inicio;

