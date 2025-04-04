import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import FondoAlineacion from "../../../assets/backgroundAlineacion.png";
import { FaTrash, FaHeart } from "react-icons/fa";
import { activarPartida } from "../../../services/api/alineacionesApi";
import { getToken } from "../../../services/api/authApi";

export default function AlineacionMenu({ nombre, favorito, onDelete, id, esActiva, onActivar }) {
  const [showAlert, setShowAlert] = useState(false);
  const [showActiveAlert, setShowActiveAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleActivar = async () => {
    if (esActiva) return;
    
    setIsLoading(true);
    try {
      const token = getToken();
      await activarPartida(id, token);
      onActivar(id);
    } catch (error) {
      console.error("Error al activar la plantilla:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    if (esActiva) {
      setShowActiveAlert(true);
    } else {
      setShowAlert(true);
    }
  };

  return (
    <div>
      {/* Alineación Menu */}
      <div className={`w-64 h-32 bg-white dark:bg-black rounded-lg opacity-80 flex justify-between p-4`}>
        <div className="flex flex-col justify-start w-full">
          <p className="text-black dark:text-white">{nombre}</p>

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
            onClick={handleActivar}
            disabled={isLoading}
            className={`${esActiva ? "text-green-500" : favorito === 1 ? "text-yellow-500 hover:text-white" : "text-white hover:text-yellow-500"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <FaHeart />
          </button>

          {/* Botón Eliminar */}
          <button
            className={`${esActiva ? "text-gray-400 cursor-not-allowed" : "text-red-500 hover:text-red-700"}`}
            onClick={handleDeleteClick}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Alerta de Confirmación para Eliminar */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white dark:bg-[#1C1A1A] p-6 rounded-lg shadow-lg text-center text-white">
            <p className="text-black dark:text-white mb-4 text-lg">
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

      {/* Alerta de Plantilla Activa */}
      {showActiveAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white dark:bg-[#1C1A1A] p-6 rounded-lg shadow-lg text-center text-white">
            <p className="text-black dark:text-white mb-4 text-lg">
              No se puede eliminar la plantilla activa
            </p>
            <button
              className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:opacity-90"
              onClick={() => setShowActiveAlert(false)}
            >
              Aceptar
            </button>
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
  esActiva: PropTypes.bool.isRequired,
  onActivar: PropTypes.func.isRequired,
};