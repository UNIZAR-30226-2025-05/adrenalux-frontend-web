import React, { useState } from "react";
import PropTypes from "prop-types";  // 1. Importamos PropTypes
import FondoAlineacion from "../../../assets/backgroundAlineacion.png";
import { FaTrash, FaHeart } from "react-icons/fa";

export default function AlineacionMenu({ nombre, favorito }) {
  const [showAlert, setShowAlert] = useState(false);

  // Funciones para manejar el "Sí" y "No" de la alerta
  const handleConfirm = () => {
    console.log(`Alineación ${nombre} eliminada.`);
    setShowAlert(false);
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  return (
    <div>
      {/* Alineación Menu */}
      <div className={`w-64 h-32 bg-black rounded-lg opacity-80 flex justify-between p-4`}>
        <div className="flex flex-col justify-start w-full">
          <p className="text-white">{nombre}</p>
          <img
            src={FondoAlineacion}
            alt="Fondo"
            className="w-full h-16 object-cover mt-2 rounded-lg"
          />
        </div>

        <div className="flex flex-col justify-end items-end space-y-2 space-x-4">
          <button
            className={`${favorito === 1 ? 'text-yellow-500 hover:text-white' : 'text-white hover:text-yellow-500'}`}
          >
            <FaHeart />
          </button>

          {/* Botón para mostrar la alerta */}
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => setShowAlert(true)} // Muestra la alerta
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Alerta de confirmación */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-[#1C1A1A] p-6 rounded-lg shadow-lg text-center text-white">
            <p className="mb-4 text-lg">
              ¿Quieres eliminar la alineación <strong>{nombre}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#F62C2C] hover:opacity-90"
                onClick={handleConfirm}
              >
                Sí
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#44FE23] hover:opacity-90"
                onClick={handleCancel}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

AlineacionMenu.propTypes = {
  nombre: PropTypes.string.isRequired,  // Validamos que 'nombre' sea una cadena y es obligatorio
  favorito: PropTypes.number.isRequired, // Validamos que 'favorito' sea un número y es obligatorio
};
