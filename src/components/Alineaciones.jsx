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
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

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
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlineaciones();
  }, [token, navigate]);

  const handleBackClick = () => {
    navigate("/home");
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewAlineacionNombre("");
  };

  const handleAddAlineacion = async () => {
    if (!newAlineacionNombre || newAlineacionNombre.trim() === "") {
      alert("El nombre no puede estar vacío.");
      return;
    }

    const nombreRepetido = alineaciones.some(
      (alineacion) => alineacion.nombre.toLowerCase() === newAlineacionNombre.toLowerCase()
    );

    if (nombreRepetido) {
      alert("El nombre de la alineación ya existe. Elige otro nombre.");
      return;
    }

    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const nuevaAlineacion = await crearPlantilla(newAlineacionNombre, token);
      setAlineaciones([...alineaciones, nuevaAlineacion]);
      
      // Si es la primera plantilla, activarla automáticamente
      if (alineaciones.length === 0) {
        await activarPartida(nuevaAlineacion.id, token);
        setPlantillaActivaId(nuevaAlineacion.id);
        
        // Actualizar el localStorage con la plantilla activa
        const userData = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem("user", JSON.stringify({
          ...userData,
          plantilla_activa_id: nuevaAlineacion.id
        }));
      }
      
      handleCloseAddModal();
    } catch (error) {
      console.error("Error al crear la alineación:", error);
      alert("Hubo un error al crear la alineación.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDeleteModal = (plantillaId) => {
    const plantilla = alineaciones.find(a => a.id === plantillaId);
    setPlantillaToDelete(plantilla);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setPlantillaToDelete(null);
  };

  const handleDeletePlantilla = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      await eliminarPlantilla(plantillaToDelete.id, token);
      
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
    } catch (error) {
      console.error("Error al eliminar la alineación:", error);
      alert("Hubo un error al eliminar la alineación.");
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
    } catch (error) {
      console.error("Error al activar la plantilla:", error);
      alert("Hubo un error al activar la plantilla.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-600 p-4 text-center">{error}</div>;
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
              <p className="text-white">Cargando alineaciones...</p>
            </div>
          ) : (
            <>
              {alineaciones.map((alineacion) => (
                <AlineacionMenu
                  key={alineacion.id}
                  nombre={alineacion.nombre}
                  favorito={alineacion.favorita}
                  id={alineacion.id}
                  esActiva={alineacion.id === plantillaActivaId}
                  onDelete={() => handleOpenDeleteModal(alineacion.id)}
                  onActivar={handleActivarPlantilla}
                  screenSize={screenSize}
                />
              ))}

              {/* Botón para añadir nueva alineación */}
              <button
                className="w-full max-w-xs sm:max-w-sm h-32 bg-white dark:bg-black rounded-lg opacity-80 flex justify-between p-4 hover:opacity-100 transition-opacity hover:shadow-lg"
                onClick={handleOpenAddModal}
                disabled={isLoading}
              >
                <div className="flex flex-col justify-start w-full">
                  <p className="text-black dark:text-white font-medium">Añadir nueva alineación</p>
                  <div className="w-full h-16 mt-2 rounded-lg overflow-hidden">
                    <img
                      src={FondoAlineacion}
                      alt="Fondo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal para añadir nueva alineación */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 p-4">
          <div className="bg-[#1C1A1A] p-4 sm:p-6 rounded-lg shadow-lg text-center text-white w-full max-w-xs sm:max-w-sm">
            <p className="mb-4 text-base sm:text-lg">Nombre de la nueva alineación</p>
            <input
              type="text"
              value={newAlineacionNombre}
              onChange={(e) => setNewAlineacionNombre(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
              placeholder="Introduce el nombre"
              disabled={isLoading}
            />
            <div className="flex justify-center gap-3 sm:gap-4">
              <button
                className="px-3 py-2 sm:px-4 rounded-lg text-white bg-[#F62C2C] hover:opacity-90 disabled:opacity-50"
                onClick={handleCloseAddModal}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-2 sm:px-4 rounded-lg text-white bg-[#44FE23] hover:opacity-90 disabled:opacity-50"
                onClick={handleAddAlineacion}
                disabled={isLoading}
              >
                {isLoading ? "Creando..." : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para confirmar eliminación */}
      {showDeleteModal && plantillaToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 p-4">
          <div className="bg-[#1C1A1A] p-4 sm:p-6 rounded-lg shadow-lg text-center text-white w-full max-w-xs sm:max-w-sm">
            <p className="mb-4 text-base sm:text-lg">
              ¿Quieres eliminar la alineación <strong className="break-words">{plantillaToDelete.nombre}</strong>?
            </p>
            <div className="flex justify-center gap-3 sm:gap-4">
              <button
                className="px-3 py-2 sm:px-4 rounded-lg text-white bg-[#F62C2C] hover:opacity-90 disabled:opacity-50"
                onClick={handleDeletePlantilla}
                disabled={isLoading}
              >
                {isLoading ? "Eliminando..." : "Sí"}
              </button>
              <button
                className="px-3 py-2 sm:px-4 rounded-lg text-white bg-[#44FE23] hover:opacity-90 disabled:opacity-50"
                onClick={handleCloseDeleteModal}
                disabled={isLoading}
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