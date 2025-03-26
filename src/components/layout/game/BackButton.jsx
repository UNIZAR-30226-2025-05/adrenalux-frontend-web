// src/components/layout/game/BackButton.jsx
import { FaArrowLeft } from "react-icons/fa";

export default function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="bg-white dark:bg-black/50 p-4 rounded-lg">
      <FaArrowLeft className="text-black dark:text-white text-2xl" />
    </button>
  );
}
