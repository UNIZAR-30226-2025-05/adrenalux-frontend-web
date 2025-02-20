import { FaBolt, FaFutbol } from "react-icons/fa";

export default function PlayButton() {
  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center bg-gradient-to-r from-[#9FA383] to-[#464929] border-4 border-[#1E1E1E] rounded-full shadow-xl">
      {/* 1 vs 1 (no es un botón y texto vertical) */}
      <div className="flex flex-col w-[100px] items-center justify-center bg-transparent px-4 py-2 rounded-l-full hover:bg-[#7A7E68] transition">
        <FaBolt className="text-xl text-white" />
        <span className="text-sm text-white">1 vs 1</span>
      </div>

      {/* Main Jugar Button with custom shape */}
      <button
        className="flex items-center rounded-sm justify-center w-[150px] h-[78px] text-xl font-bold text-white bg-gradient-to-b from-[#777771] to-[#41401A] hover:bg-[#5C5F4A] transition"
        style={{
          clipPath: "polygon(0% 50%, 10% 0%, 100% 0%, 80% 100%, 10% 100%)"
        }}
      >
        Jugar
      </button>

      {/* Torneo Button */}
      <button className="flex flex-col items-center justify-center bg-transparent px-4 py-2 rounded-r-full hover:bg-[#7A7E68] transition">
        <FaFutbol className="text-xl text-white" />
        <span className="text-sm text-white">Alineaciones</span>
      </button>
    </div>
  );
}

