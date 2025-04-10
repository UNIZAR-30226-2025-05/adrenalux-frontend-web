import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import FondoAlineacion from "../../../assets/backgroundAlineacion.png";
import { FaTrash, FaHeart } from "react-icons/fa";
import { activarPartida } from "../../../services/api/alineacionesApi";
import { getToken } from "../../../services/api/authApi";

export default function AlineacionMenu({ nombre, favorito, onDelete, id, esActiva, onActivar, screenSize = 'lg' }) {
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

  // Estilos responsivos para el contenedor de la tarjeta
  const getCardStyles = () => {
    const baseStyles = "bg-white dark:bg-black rounded-lg opacity-80 flex justify-between p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:opacity-90";
    
    // Altura responsive
    const heightStyle = "h-24 sm:h-28 md:h-32"; 
    
    // Ancho responsive - ajustado a layout grid en el componente padre
    const widthStyle = "w-full max-w-xs"; 
    
    return `${baseStyles} ${heightStyle} ${widthStyle}`;
  };

  // Tamaño de iconos responsive
  const getIconSize = () => {
    switch(screenSize) {
      case 'sm': return 'text-lg';
      case 'md': return 'text-lg';
      default: return 'text-xl';
    }
  };

  return (
    <div className="w-full flex justify-center">
      {/* Alineación Menu */}
      <div className={`${getCardStyles()} ${esActiva ? 'ring-2 ring-green-500' : ''}`}>
        <div className="flex flex-col justify-start w-full">
          <p className="text-black dark:text-white font-medium text-sm sm:text-base truncate pr-2">{nombre}</p>

          <button
            onClick={handleEdit}
            className="w-full mt-2 rounded-lg overflow-hidden bg-transparent border-none focus:outline-none transition-transform duration-300 hover:scale-105 outline-none"
          >
            <img
              src={FondoAlineacion}
              alt="Fondo"
              className="w-full h-12 sm:h-14 md:h-16 object-cover"
            />
          </button>
        </div>

        <div className="flex flex-col justify-end items-end space-y-2 space-x-1 sm:space-x-2">
          {/* Botón Favorito */}
          <button
            onClick={handleActivar}
            disabled={isLoading}
            className={`${esActiva ? "text-green-500" : favorito === 1 ? "text-yellow-500 hover:text-white" : "text-white hover:text-yellow-500"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""} ${getIconSize()} transition-colors duration-300`}
            aria-label={esActiva ? "Alineación activa" : "Activar alineación"}
          >
            <FaHeart />
          </button>

          {/* Botón Eliminar */}
          <button
            className={`${esActiva ? "text-gray-400 cursor-not-allowed" : "text-red-500 hover:text-red-700"} ${getIconSize()} transition-colors duration-300`}
            onClick={handleDeleteClick}
            aria-label="Eliminar alineación"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Alerta de Confirmación para Eliminar */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 p-4">
          <div className="bg-white dark:bg-[#1C1A1A] p-4 sm:p-6 rounded-lg shadow-lg text-center text-white w-full max-w-xs sm:max-w-sm">
            <p className="text-black dark:text-white mb-4 text-base sm:text-lg">
              ¿Quieres eliminar la alineación <strong className="break-words">{nombre}</strong>?
            </p>
            <div className="flex justify-center gap-3 sm:gap-4">
              <button
                className="px-3 py-2 sm:px-4 rounded-lg text-white bg-[#F62C2C] hover:opacity-90 transition-opacity"
                onClick={handleConfirm}
              >
                Sí
              </button>
              <button
                className="px-3 py-2 sm:px-4 rounded-lg text-white bg-[#44FE23] hover:opacity-90 transition-opacity"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 p-4">
          <div className="bg-white dark:bg-[#1C1A1A] p-4 sm:p-6 rounded-lg shadow-lg text-center text-white w-full max-w-xs sm:max-w-sm">
            <p className="text-black dark:text-white mb-4 text-base sm:text-lg">
              No se puede eliminar la plantilla activa
            </p>
            <button
              className="px-3 py-2 sm:px-4 rounded-lg text-white bg-blue-500 hover:opacity-90 transition-opacity"
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
  screenSize: PropTypes.string
};

AlineacionMenu.defaultProps = {
  screenSize: 'lg'
};