import { FaDice } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CollectionButton() {
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
      <FaDice className="text-6xl mb-3" />
      <span className="bg-black/80 px-3 py-1 text-sm rounded-sm">
        Coleccion
      </span>
    </button>
  );
}
