import { useState } from "react";
import BackButton from "../components/layout/game/BackButton";
import background from "../assets/background.png";
import Card from "../assets/cartaNormal.png";

const Intercambio = () => {
  const [showAlert, setShowAlert] = useState(false);

  const handleBackClick = () => {
    setShowAlert(true);
  };

  const handleConfirmExit = () => {
    setShowAlert(false);
    window.location.href = "/home"; // Redirige a Home
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      {/* Botón de volver */}
      <div className="absolute top-5 left-5">
        <BackButton onClick={handleBackClick} />
      </div>

      {/* Caja de intercambio */}
      <div className="relative w-[50%] max-w-xl h-[40vh] bg-black/70 rounded-2xl flex items-center justify-between p-6">
        {/* Carta izquierda */}
        <img src={Card} alt="Carta izquierda" className="w-[30%] max-w-[150px] shadow-lg" />



        {/* Carta derecha */}
        <img src={Card} alt="Carta derecha" className="w-[30%] max-w-[150px] shadow-lg" />
      </div>

      {/* Alerta de confirmación */}
      {showAlert && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg text-center shadow-lg">
            <p className="text-lg font-semibold">¿Deseas abandonar el intercambio?</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={handleConfirmExit}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sí
              </button>
              <button
                onClick={() => setShowAlert(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Intercambio;
