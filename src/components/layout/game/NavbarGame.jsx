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
      
      <div className="flex items-center justify-center mr-4 bg-gradient-to-b from-[#EFF6EF] to-[#4F5A4F]  h-full w-[150px]">
        <img src={logo} alt="Logo" className=" h-full w-auto object-contain " />
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center bg-[#1E1E1E] text-white px-2 py-1 mr-4 border-4 border-black">
          <FaShieldAlt className="mr-5" />
          <span>Nombre_Usuario</span>
        </div>

        <div className="flex items-center">
          <span className="text-blue-400 mr-2">LVL99</span>
          <div className="relative w-32 h-2 bg-gray-700 rounded">
            <div className="absolute top-0 left-0 h-2 bg-blue-400 rounded" style={{ width: "75%" }}></div>
          </div>
        </div>

        <div className="flex items-center bg-black text-white rounded px-2 py-1 mr-4">
          <span className="mr-2">5,000</span>
          <span className="text-yellow-400">🪙</span>
          <FaPlusCircle className="text-green-500 ml-2" />
        </div>
      </div>

      <div className="flex items-center space-x-7 ml-7 mr-[30px]">
        <div className="flex items-center space-x-4">
          <button className="bg-[#1E1E1E] border-4 border-black w-18 h-14 flex justify-center items-center rounded-none">
            <FaUsers className="text-white text-4xl" />
          </button>
          <button className="bg-[#1E1E1E] border-4 border-black w-18 h-14 flex justify-center items-center rounded-none">
            <FaCog className="text-white text-4xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
