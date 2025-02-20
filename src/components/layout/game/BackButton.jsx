// src/components/layout/game/BackButton.jsx
import { FaArrowLeft } from "react-icons/fa";

export default function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="bg-black/50 p-4 rounded-lg hover:bg-black transition">
      <FaArrowLeft className="text-white text-2xl" />
    </button>
  );
}
