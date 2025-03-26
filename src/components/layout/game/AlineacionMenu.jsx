import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import FondoAlineacion from "../../../assets/backgroundAlineacion.png";
import { FaTrash, FaHeart } from "react-icons/fa";

export default function AlineacionMenu({ nombre, favorito, onDelete, id }) {
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = () => {
    onDelete(); 
    setShowAlert(false);
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleEdit = () => {
    navigate("/alineacionesEditar", { state: { id, nombre } });
  };

  return (
    <div>
      {/* Alineación Menu */}
      <div className="w-64 h-32 bg-black rounded-lg opacity-80 flex justify-between p-4">
        <div className="flex flex-col justify-start w-full">
          <p className="text-white">{nombre}</p>

          {/* Botón invisible que contiene la imagen */}
          <button
            onClick={handleEdit}
            className="w-full mt-2 rounded-lg overflow-hidden bg-transparent border-none focus:outline-none"
          >
            <img
              src={FondoAlineacion}
              alt="Fondo"
              className="w-full h-16 object-cover hover:opacity-80"
            />
          </button>
        </div>

        <div className="flex flex-col justify-end items-end space-y-2 space-x-4">
          {/* Botón Favorito */}
          <button
            className={`${
              favorito === 1
                ? "text-yellow-500 hover:text-white"
                : "text-white hover:text-yellow-500"
            }`}
          >
            <FaHeart />
          </button>

          {/* Botón Eliminar */}
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => setShowAlert(true)}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Alerta de Confirmación */}
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
  nombre: PropTypes.string.isRequired,
  favorito: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired, 
  id: PropTypes.number.isRequired,
};