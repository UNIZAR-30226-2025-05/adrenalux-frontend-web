import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/layout/game/BackButton";
import background from "../assets/background.png";
import AlineacionMenu from "../components/layout/game/AlineacionMenu";
import FondoAlineacion from "../assets/backgroundAlineacion.png";
import { obtenerPlantillas, crearPlantilla, eliminarPlantilla } from "../services/api/alineacionesApi";
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

  // Obtener las alineaciones del usuario al cargar el componente
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchAlineaciones = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error("No se encontró el token de autenticación.");
        }

        const data = await obtenerPlantillas(token);
        setAlineaciones(data?.data || []);
      } catch (error) {
        setError(error.message || "Error al obtener las alineaciones");
        console.error("Error:", error);
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
      (alineacion) => alineacion.nombre === newAlineacionNombre
    );

    if (nombreRepetido) {
      alert("El nombre de la alineación ya existe. Elige otro nombre.");
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const nuevaAlineacion = await crearPlantilla(newAlineacionNombre, token);
      setAlineaciones([...alineaciones, nuevaAlineacion]);
      handleCloseAddModal();
    } catch (error) {
      console.error("Error al crear la alineación:", error);
      alert("Hubo un error al crear la alineación.");
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
      const token = getToken();
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      await eliminarPlantilla(plantillaToDelete.id, token);
      setAlineaciones((prevAlineaciones) =>
        prevAlineaciones.filter((alineacion) => alineacion.id !== plantillaToDelete.id)
      );
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error al eliminar la alineación:", error);
      alert("Hubo un error al eliminar la alineación.");
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
        {alineaciones.map((alineacion) => (
          <AlineacionMenu
            key={alineacion.id}
            nombre={alineacion.nombre}
            favorito={alineacion.favorita}
            id={alineacion.id}
            onDelete={() => handleOpenDeleteModal(alineacion.id)}
          />
        ))}

        {/* Botón para añadir nueva alineación */}
        <button
          className="w-64 h-32 bg-white dark:bg-black rounded-lg opacity-80 flex justify-between p-4"
          onClick={handleOpenAddModal}
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
            />
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#F62C2C] hover:opacity-90"
                onClick={handleCloseAddModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#44FE23] hover:opacity-90"
                onClick={handleAddAlineacion}
              >
                Crear
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
                className="px-4 py-2 rounded-lg text-white bg-[#F62C2C] hover:opacity-90"
                onClick={handleDeletePlantilla}
              >
                Sí
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#44FE23] hover:opacity-90"
                onClick={handleCloseDeleteModal}
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