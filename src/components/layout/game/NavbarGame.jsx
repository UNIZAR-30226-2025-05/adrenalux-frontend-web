import logo from "../../../assets/logo.png";
import {
  FaUsers,
  FaCog,
  FaShieldAlt,
  FaPlusCircle
} from "react-icons/fa";

export default function NavbarGame() {
  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-[#0E2415] to-[#656D68] shadow-md z-50 flex items-center">
      
      {/* Logo */}
      <div className="flex items-center justify-center mr-4 bg-gradient-to-b from-[#EFF6EF] to-[#4F5A4F]  h-full w-[150px]">
        <img src={logo} alt="Logo" className=" h-full w-auto object-contain " />
      </div>

      <div className="flex items-center justify-between w-full">
        {/* Nombre de Usuario e Icono */}
        <div className="flex items-center bg-[#1E1E1E] text-white px-2 py-1 mr-4 border-4 border-black">
          <FaShieldAlt className="mr-5" />
          <span>Nombre_Usuario</span>
        </div>

        {/* Nivel y Barra de Progreso */}
        <div className="flex items-center">
          <span className="text-blue-400 mr-2">LVL99</span>
          <div className="relative w-32 h-2 bg-gray-700 rounded">
            <div className="absolute top-0 left-0 h-2 bg-blue-400 rounded" style={{ width: "75%" }}></div>
          </div>
        </div>

        {/* Monedas e Icono de Suma */}
        <div className="flex items-center bg-black text-white rounded px-2 py-1 mr-4">
          <span className="mr-2">5,000</span>
          <span className="text-yellow-400">🪙</span>
          <FaPlusCircle className="text-green-500 ml-2" />
        </div>
      </div>


      {/* Iconos de Amigos y Configuración */}
      <div className="flex items-center space-x-7 ml-7 mr-[30px]">
  <div className="flex items-center">
    {/* Botón para el ícono de usuarios */}
    <button className="bg-[#1E1E1E] border-2 border-black w-12 h-10 aspect-square justify-center items-center">
  <FaUsers className="text-white text-2xl" />
</button>


    {/* Botón para el ícono de configuración */}
    <button className="flex items-center justify-center bg-[#1E1E1E] text-white border-4 border-black w-10 h-10 rounded-md hover:bg-gray-700 transition duration-200 ml-4">
      <FaCog className="text-white cursor-pointer text-2xl" />
    </button>
  </div>
</div>


    </div>
  );
}
