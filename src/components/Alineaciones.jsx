import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/layout/game/BackButton";
import background from "../assets/background.png";
import AlineacionMenu from "../components/layout/game/AlineacionMenu";
import FondoAlineacion from "../assets/backgroundAlineacion.png";
import { 
  obtenerPlantillas, 
  crearPlantilla, 
  eliminarPlantilla, 
  activarPartida 
} from "../services/api/alineacionesApi";
import { getToken } from "../services/api/authApi";
import { AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";

// Componente de Alerta personalizado
const CustomAlert = ({ isOpen, type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Auto-cerrar después de 3 segundos
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Dar tiempo para la animación de salida
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const alertStyles = {
    success: "border-green-500 bg-green-100 text-green-800",
    error: "border-red-500 bg-red-100 text-red-800",
    warning: "border-yellow-500 bg-yellow-100 text-yellow-800",
    info: "border-blue-500 bg-blue-100 text-blue-800"
  };

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={`
          ${alertStyles[type]} border-l-4 p-4 rounded-md shadow-md flex items-start
          transform transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
        style={{ minWidth: "280px", maxWidth: "400px" }}
      >
        <div className="mr-3 flex-shrink-0">
          {iconMap[type]}
        </div>
        <div className="flex-grow">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-2">
          <button 
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Alineaciones() {
  const token = getToken();
  const navigate = useNavigate();
  const [alineaciones, setAlineaciones] = useState([]);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAlineacionNombre, setNewAlineacionNombre] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [plantillaToDelete, setPlantillaToDelete] = useState(null);
  const [plantillaActivaId, setPlantillaActivaId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [screenSize, setScreenSize] = useState('lg');
  
  // Estado para el sistema de alertas
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    message: ''
  });

  // Función para mostrar una alerta
  const showAlert = (type, message) => {
    setAlert({ isOpen: true, type, message });
  };

  // Función para cerrar la alerta
  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  // Detectar tamaño de pantalla para ajustar el grid
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('sm');
      } else if (width < 1024) {
        setScreenSize('md');
      } else {
        setScreenSize('lg');
      }
    };

    // Inicializar
    handleResize();
    
    // Añadir evento de resize
    window.addEventListener('resize', handleResize);
    
    // Limpiar el evento
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Obtener las alineaciones del usuario al cargar el componente
  const fetchAlineaciones = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const data = await obtenerPlantillas(token);
      setAlineaciones(data?.data || []);
      
      // Obtener la plantilla activa del usuario
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData && userData.plantilla_activa_id) {
        setPlantillaActivaId(userData.plantilla_activa_id);
      }
    } catch (error) {
      setError(error.message || "Error al obtener las alineaciones");
      showAlert('error', "Error al cargar las alineaciones");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchAlineaciones();
  }, [token, navigate]);

  const handleBackClick = () => {
    navigate("/home");
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setNewAlineacionNombre("");
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewAlineacionNombre("");
  };

  const handleAddAlineacion = async () => {
    // Validar longitud mínima de 4 caracteres
    if (!newAlineacionNombre || newAlineacionNombre.trim().length < 4) {
      showAlert('error', "El nombre debe tener al menos 4 caracteres");
      return;
    }

    const nombreRepetido = alineaciones.some(
      (alineacion) => alineacion.nombre.toLowerCase() === newAlineacionNombre.toLowerCase()
    );

    if (nombreRepetido) {
      showAlert('error', "Ya existe una alineación con ese nombre");
      return;
    }

    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      await crearPlantilla(newAlineacionNombre, token);
      
      handleCloseAddModal();
      showAlert('success', `Alineación "${newAlineacionNombre}" creada correctamente`);
      
      // Refrescar la página para actualizar la lista de alineaciones
      await fetchAlineaciones();
      
    } catch (error) {
      console.error("Error al crear la alineación:", error);
      showAlert('error', "Hubo un error al crear la alineación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDeleteModal = (plantillaId) => {
    // Verificar si la plantilla es la activa
    const isActive = plantillaId === plantillaActivaId;
    if (isActive) {
      showAlert('warning', "No se puede eliminar la plantilla activa");
      return;
    }

    const plantilla = alineaciones.find(a => a.id === plantillaId);
    setPlantillaToDelete(plantilla);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setPlantillaToDelete(null);
  };

  // Añadir un manejador para clics fuera del modal
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseDeleteModal();
    }
  };

  const handleDeletePlantilla = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      await eliminarPlantilla(plantillaToDelete.id, token);
      
      // Guarda el nombre de la alineación antes de eliminarla del estado
      const deletedName = plantillaToDelete.nombre;
      
      // Si la plantilla eliminada era la activa, limpiar el estado
      if (plantillaActivaId === plantillaToDelete.id) {
        setPlantillaActivaId(null);
        
        // Actualizar el localStorage
        const userData = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem("user", JSON.stringify({
          ...userData,
          plantilla_activa_id: null
        }));
      }
      
      setAlineaciones((prevAlineaciones) =>
        prevAlineaciones.filter((alineacion) => alineacion.id !== plantillaToDelete.id)
      );
      
      handleCloseDeleteModal();
      showAlert('success', `Alineación "${deletedName}" eliminada correctamente`);
    } catch (error) {
      console.error("Error al eliminar la alineación:", error);
      showAlert('error', "Hubo un error al eliminar la alineación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivarPlantilla = async (plantillaId) => {
    try {
      setIsLoading(true);
      const token = getToken();
      await activarPartida(plantillaId, token);
      setPlantillaActivaId(plantillaId);
      
      // Actualizar el localStorage con la nueva plantilla activa
      const userData = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem("user", JSON.stringify({
        ...userData,
        plantilla_activa_id: plantillaId
      }));
      
      // Encontrar el nombre de la plantilla activada
      const plantillaActivada = alineaciones.find(a => a.id === plantillaId);
      showAlert('success', `Alineación "${plantillaActivada.nombre}" activada correctamente`);
    } catch (error) {
      console.error("Error al activar la plantilla:", error);
      showAlert('error', "Hubo un error al activar la plantilla");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-cover bg-center" 
           style={{ backgroundImage: `url(${background})` }}>
        <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg text-center animate-bounce">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-xl font-bold mb-2">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => navigate("/home")} 
            className="mt-4 bg-white text-red-500 px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Definir número de columnas según tamaño de pantalla
  const getGridColumns = () => {
    switch(screenSize) {
      case 'sm': return 'grid-cols-1';
      case 'md': return 'grid-cols-2';
      default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col justify-start items-center bg-cover bg-center overflow-y-auto"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Componente de alerta personalizado */}
      <CustomAlert 
        isOpen={alert.isOpen}
        type={alert.type}
        message={alert.message}
        onClose={closeAlert}
      />

      {/* Header con botón de retroceso y título */}
      <div className="w-full flex justify-between items-center p-4 sm:p-5 lg:p-6">
        <div className="relative z-10">
          <BackButton onClick={handleBackClick} />
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center flex-grow">
          Mis alineaciones
        </h1>
        <div className="w-10"></div> {/* Espacio para balancear el layout */}
      </div>

      {/* Contenedor de las alineaciones - ahora responsive */}
      <div className={`w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8 pb-24`}>
        <div className={`w-full grid ${getGridColumns()} gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-items-center`}>
          {isLoading && alineaciones.length === 0 ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-white flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Cargando alineaciones...</p>
              </div>
            </div>
          ) : (
            <>
              {alineaciones.map((alineacion) => (
                <div 
                  key={alineacion.id} 
                  className="w-full transition-all duration-300 hover:scale-105 animate-fadeIn"
                  style={{ animationDelay: `${alineacion.id * 0.05}s` }}
                >
                  <AlineacionMenu
                    nombre={alineacion.nombre}
                    favorito={alineacion.favorita}
                    id={alineacion.id}
                    esActiva={alineacion.id === plantillaActivaId}
                    onDelete={() => handleOpenDeleteModal(alineacion.id)}
                    onActivar={handleActivarPlantilla}
                    screenSize={screenSize}
                  />
                </div>
              ))}

              {/* Botón para añadir nueva alineación - Actualizado con el mismo estilo de AlineacionMenu */}
              <div className="w-full flex justify-center animate-fadeIn" style={{ animationDelay: `${alineaciones.length * 0.05 + 0.1}s` }}>
                <button
                  className="w-full max-w-xs bg-gradient-to-br from-white to-gray-100
                        dark:from-gray-800 dark:to-gray-900 rounded-xl 
                        shadow-md hover:shadow-xl transition-all duration-300
                        p-3 sm:p-4 flex flex-col h-auto
                        border-2 border-dashed border-gray-300 dark:border-gray-600
                        hover:border-green-500 dark:hover:border-green-400
                        group"
                  onClick={handleOpenAddModal}
                  disabled={isLoading}
                >
                  <div className="flex justify-center items-center mb-2">
                    <h3 className="text-black dark:text-white font-semibold text-sm sm:text-base md:text-lg">
                      Añadir nueva alineación
                    </h3>
                  </div>
                  
                  <div className="relative overflow-hidden rounded-lg flex-grow mb-2 group-hover:ring-2 group-hover:ring-green-500">
                    <img
                      src={FondoAlineacion}
                      alt="Fondo para nueva alineación"
                      className="w-full h-16 sm:h-20 md:h-24 object-cover transition-transform duration-300 
                                group-hover:scale-105 filter brightness-90"
                    />
                    <div className="absolute inset-0 flex justify-center items-center">
                      <div className="bg-black bg-opacity-40 rounded-full p-2 sm:p-3 transform transition-transform duration-300
                                    group-hover:scale-110 group-hover:bg-green-500 group-hover:bg-opacity-70">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                            className="w-6 h-6 sm:w-8 sm:h-8 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center items-center mt-auto">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 group-hover:text-green-500">
                      Crea una nueva alineación personalizada
                    </span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal para añadir nueva alineación - mejorado con animaciones */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-20 p-4 animate-fadeIn backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseAddModal();
            }
          }}
        >
          <div 
            className="bg-gradient-to-br from-gray-900 to-black p-5 sm:p-6 rounded-xl shadow-lg shadow-green-500/10 
                      text-center text-white w-full max-w-xs sm:max-w-sm animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                  className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            
            <h3 className="mb-4 text-lg sm:text-xl font-bold">Nueva alineación</h3>
            
            <div className="relative mb-4">
              <input
                type="text"
                value={newAlineacionNombre}
                onChange={(e) => setNewAlineacionNombre(e.target.value)}
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 
                          focus:border-green-500 focus:ring focus:ring-green-500/20 transition-all
                          pr-10"
                placeholder="Nombre de la alineación"
                disabled={isLoading}
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                    className={`w-5 h-5 ${newAlineacionNombre.length >= 4 ? 'text-green-500' : 'text-gray-500'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d={newAlineacionNombre.length >= 4 ? "M5 13l4 4L19 7" : "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                </svg>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mb-5 text-left">
              El nombre debe tener al menos 4 caracteres y ser único
            </p>
            
            <div className="flex justify-center gap-3 sm:gap-4">
              <button
                className="px-4 py-2 sm:px-5 rounded-lg text-white bg-gray-700 hover:bg-gray-600 
                          disabled:opacity-50 transition-all flex-grow"
                onClick={handleCloseAddModal}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                className={`px-4 py-2 sm:px-5 rounded-lg text-white 
                          ${newAlineacionNombre.length >= 4 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                            : 'bg-gray-600 cursor-not-allowed'}
                          disabled:opacity-50 transition-all flex-grow flex items-center justify-center`}
                onClick={handleAddAlineacion}
                disabled={isLoading || newAlineacionNombre.length < 4}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    <span>Creando...</span>
                  </>
                ) : "Crear alineación"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal único para confirmar eliminación - mejorado con animaciones */}
      {showDeleteModal && plantillaToDelete && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-20 p-4 animate-fadeIn backdrop-blur-sm"
          onClick={handleOutsideClick}
        >
          <div 
            className="bg-gradient-to-br from-gray-900 to-black p-5 sm:p-6 rounded-xl shadow-lg shadow-red-500/10 
                       text-center text-white w-full max-w-xs sm:max-w-sm animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold mb-2">Eliminar alineación</h3>
            
            <p className="mb-5 text-sm sm:text-base text-gray-300">
              ¿Estás seguro de que quieres eliminar la alineación <strong className="break-words text-white">{plantillaToDelete.nombre}</strong>?
              <br />
              <span className="text-xs text-gray-400 mt-1 block">Esta acción no se puede deshacer</span>
            </p>
            
            <div className="flex justify-center gap-3 sm:gap-4">
              <button
                className="px-4 py-2 sm:px-5 rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 
                          hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all flex-grow 
                          flex items-center justify-center"
                onClick={handleDeletePlantilla}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    <span>Eliminando...</span>
                  </>
                ) : "Eliminar"}
              </button>
              <button
                className="px-4 py-2 sm:px-5 rounded-lg text-white bg-gray-700 hover:bg-gray-600 
                          disabled:opacity-50 transition-all flex-grow"
                onClick={handleCloseDeleteModal}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos globales para animaciones */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(68, 254, 35, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(68, 254, 35, 0); }
          100% { box-shadow: 0 0 0 0 rgba(68, 254, 35, 0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
        
        .animate-pulseGlow {
          animation: pulseGlow 1.5s infinite;
        }
      `}</style>
    </div>
  );
}