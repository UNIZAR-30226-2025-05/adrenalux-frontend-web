import { FaChartBar } from "react-icons/fa";

export default function ClassificationButton() {
  return (
    <button className="flex flex-col items-center text-white bg-transparent p-4 w-32 h-32 
                        hover:scale-105 transition-transform focus:outline-none">
      <FaChartBar className="text-6xl mb-3" />
      <span className="bg-black/80 px-3 py-1 text-sm rounded-sm">Clasificación</span>
    </button>
  );
}
