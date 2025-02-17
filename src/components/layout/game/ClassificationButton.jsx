import React from "react";
import { FaChartBar } from "react-icons/fa";

export default function ClassificationButton() {
  return (
    <button className="flex flex-col items-center text-white bg-black/80 p-6 rounded-lg w-40 h-40
                       shadow-lg hover:shadow-xl transition-transform transform hover:scale-105
                       focus:outline-none focus:ring-2 focus:ring-green-500">
      <FaChartBar className="text-5xl mb-2" />
      <span className="font-semibold">Clasificación</span>
    </button>
  );
}
