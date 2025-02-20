import { FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StoreButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/shop");
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center text-white bg-transparent p-4 w-32 h-32 
                hover:scale-105 transition-transform focus:outline-none"
    >
      <FaStore className="text-6xl mb-3" />
      <span className="bg-black/80 px-3 py-1 text-sm rounded-sm">Tienda</span>
    </button>
  );
};

export default StoreButton;
