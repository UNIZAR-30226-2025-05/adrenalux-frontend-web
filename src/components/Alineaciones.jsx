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
        console.log(data)
        
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
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div
      className="fixed inset-0 flex justify-center items-start bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute top-5 left-5">
        <BackButton onClick={handleBackClick} />
      </div>

      <div className="absolute top-10 w-full text-center">
        <h1 className="text-3xl font-bold text-white">Mis alineaciones</h1>
      </div>

      {/* Contenedor de las alineaciones */}
      <div className="w-full max-h-screen overflow-y-auto grid grid-cols-4 gap-6 mt-40 px-20">
        {isLoading && alineaciones.length === 0 ? (
          <div className="col-span-4 flex justify-center items-center">
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
              />
            ))}

            {/* Botón para añadir nueva alineación */}
            <button
              className="w-64 h-32 bg-white dark:bg-black rounded-lg opacity-80 flex justify-between p-4 hover:opacity-100 transition-opacity"
              onClick={handleOpenAddModal}
              disabled={isLoading}
            >
              <div className="flex flex-col justify-start w-full">
                <p className="text-black dark:text-white">Añadir nueva alineación</p>
                <img
                  src={FondoAlineacion}
                  alt="Fondo"
                  className="w-full h-16 object-cover mt-2 rounded-lg"
                />
              </div>
            </button>
          </>
        )}
      </div>

      {/* Modal para añadir nueva alineación */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-[#1C1A1A] p-6 rounded-lg shadow-lg text-center text-white w-96">
            <p className="mb-4 text-lg">Nombre de la nueva alineación</p>
            <input
              type="text"
              value={newAlineacionNombre}
              onChange={(e) => setNewAlineacionNombre(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
              placeholder="Introduce el nombre"
              disabled={isLoading}
            />
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#F62C2C] hover:opacity-90 disabled:opacity-50"
                onClick={handleCloseAddModal}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#44FE23] hover:opacity-90 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-[#1C1A1A] p-6 rounded-lg shadow-lg text-center text-white">
            <p className="mb-4 text-lg">
              ¿Quieres eliminar la alineación <strong>{plantillaToDelete.nombre}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#F62C2C] hover:opacity-90 disabled:opacity-50"
                onClick={handleDeletePlantilla}
                disabled={isLoading}
              >
                {isLoading ? "Eliminando..." : "Sí"}
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#44FE23] hover:opacity-90 disabled:opacity-50"
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