import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import FondoAlineacion from "../../../assets/backgroundAlineacion.png";
import { FaTrash, FaHeart, FaEdit } from "react-icons/fa";
import { activarPartida } from "../../../services/api/alineacionesApi";
import { getToken } from "../../../services/api/authApi";

export default function AlineacionMenu({ nombre, favorito, onDelete, id, esActiva, onActivar, screenSize = 'lg' }) {
  const [showActiveAlert, setShowActiveAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      onDelete();
    }
  };

  return (
    <div className="w-full flex justify-center">
      {/* Card Container */}
      <div 
        className={`
          w-full max-w-xs bg-gradient-to-br from-white to-gray-100
          dark:from-gray-800 dark:to-gray-900 rounded-xl 
          shadow-md hover:shadow-xl transition-all duration-300
          p-3 sm:p-4 flex flex-col h-auto
          ${esActiva ? 'ring-2 ring-green-500 dark:ring-green-400' : ''}
        `}
      >
        {/* Header con nombre y estado */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-black dark:text-white font-semibold text-sm sm:text-base md:text-lg 
                         truncate max-w-[80%]" title={nombre}>
            {nombre}
          </h3>
          {esActiva && (
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              Activa
            </span>
          )}
        </div>

        {/* Preview Container */}
        <div className="relative overflow-hidden rounded-lg flex-grow mb-2 group">
          <img
            src={FondoAlineacion}
            alt="Vista previa de alineación"
            className="w-full h-16 sm:h-20 md:h-24 object-cover transition-transform duration-300 
                       group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 
                          flex justify-center items-center transition-all duration-300 opacity-0 
                          group-hover:opacity-100">
            <button
              onClick={handleEdit}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full 
                         transition-all duration-300 transform scale-90 group-hover:scale-100"
              aria-label="Editar alineación"
            >
              <FaEdit className="text-xs sm:text-sm md:text-base" />
            </button>
          </div>
        </div>

        {/* Footer con acciones */}
        <div className="flex justify-between items-center mt-auto">
          <span className={`text-xs sm:text-sm ${favorito === 1 ? 'text-yellow-500' : 'text-gray-500'}`}>
            {favorito === 1 ? 'Favorita' : ''}
          </span>
          
          <div className="flex space-x-2 sm:space-x-3">
            {/* Botón Activar */}
            <button
              onClick={handleActivar}
              disabled={isLoading || esActiva}
              className={`
                p-1.5 sm:p-2 rounded-full transition-all duration-300
                ${esActiva 
                  ? "bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300 cursor-default" 
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300 hover:bg-yellow-100 hover:text-yellow-500"}
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
              `}
              aria-label={esActiva ? "Alineación activa" : "Activar alineación"}
            >
              <FaHeart className="text-xs sm:text-sm md:text-base" />
            </button>

            {/* Botón Eliminar */}
            <button
              onClick={handleDeleteClick}
              disabled={esActiva}
              className={`
                p-1.5 sm:p-2 rounded-full transition-all duration-300
                ${esActiva
                  ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300 hover:bg-red-100 hover:text-red-500"}
              `}
              aria-label="Eliminar alineación"
            >
              <FaTrash className="text-xs sm:text-sm md:text-base" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Alerta */}
      {showActiveAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 p-4"
             onClick={(e) => {
               if (e.target === e.currentTarget) {
                 setShowActiveAlert(false);
               }
             }}>
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-xl 
                          text-center w-full max-w-xs sm:max-w-sm animate-fade-in"
               onClick={(e) => e.stopPropagation()}>
            <div className="text-red-500 mb-3 flex justify-center">
              <FaTrash size={24} />
            </div>
            <h3 className="text-black dark:text-white font-medium mb-2 text-lg">
              Acción no permitida
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
              No se puede eliminar la plantilla activa. Activa otra plantilla primero.
            </p>
            <button
              className="w-full py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 
                         transition-colors font-medium text-sm sm:text-base"
              onClick={() => setShowActiveAlert(false)}
            >
              Entendido
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