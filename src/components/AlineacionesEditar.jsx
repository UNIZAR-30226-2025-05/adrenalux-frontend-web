import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import background from "../assets/backgroundAlineacion.png";
import BackButton from "../components/layout/game/BackButton";
import Formacion433 from "../components/layout/game/Formacion_4_3_3";
import Formacion442 from "../components/layout/game/Formacion_4_4_2";  
import Formacion451 from "../components/layout/game/Formacion_4_5_1";  // Añadido 4-5-1
import Formacion343 from "../components/layout/game/Formacion_3_4_3";  // Añadido 3-4-3

export default function AlineacionEditar({ nombre = "", formacion = "", jugadores = [] }) {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [nombreState, setNombreState] = useState(nombre);
  const [formacionState, setFormacionState] = useState(formacion);
  const [jugadoresState, setJugadoresState] = useState(jugadores);

  const handleBackClick = () => {
    setShowAlert(true); // Muestra la alerta al pulsar el botón de Back
  };

  const handleConfirm = () => {
    // Aquí puedes agregar la lógica para guardar los cambios si es necesario
    console.log("Cambios guardados:", { nombreState, formacionState, jugadoresState });
    setShowAlert(false);
    navigate("/alineaciones");
  };

  const handleCancel = () => {
    setShowAlert(false); // Cierra la alerta sin hacer nada
  };

  const handleDiscard = () => {
    console.log("Cambios descartados.");
    setShowAlert(false);
    navigate("/alineaciones");
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === "nombre") {
      setNombreState(value);
    } else if (field === "formacion") {
      setFormacionState(value);
    }
  };

  // Función para renderizar la alineación basada en la selección
  const renderFormacion = () => {
    switch (formacionState) {
      case "4-3-3":
        return <Formacion433 jugadores={jugadoresState} />;
      case "4-4-2":
        return <Formacion442 jugadores={jugadoresState} />;
      case "4-5-1":
        return <Formacion451 jugadores={jugadoresState} />; // Renderiza 4-5-1
      case "3-4-3":
        return <Formacion343 jugadores={jugadoresState} />; // Renderiza 3-4-3
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      <div className="absolute top-5 left-5">
        <BackButton onClick={handleBackClick} />
      </div>

      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-4 py-2 rounded-lg shadow-lg">
        <form className="flex justify-between items-center">
          <div className="flex items-center">
            <label htmlFor="nombre" className="block text-white mr-2">Nombre:</label>
            <input
              type="text"
              id="nombre"
              value={nombreState}
              onChange={(e) => handleInputChange(e, "nombre")}
              className="px-4 py-2 w-40 rounded-lg"
              placeholder="Alineacion"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="formacion" className="block text-white mr-2">Formación:</label>
            <select
              id="formacion"
              value={formacionState}
              onChange={(e) => handleInputChange(e, "formacion")}
              className="px-4 py-2 w-40 rounded-lg"
            >
              <option value="4-4-2">4-4-2</option>
              <option value="3-4-3">3-4-3</option>
              <option value="4-5-1">4-5-1</option>
              <option value="4-3-3">4-3-3</option>
            </select>
          </div>
        </form>
      </div>

      {/* Renderización de la formación seleccionada en el centro */}
      <div className="absolute top-[100px] left-1/2 transform -translate-x-1/2 text-white">
        {renderFormacion()}
      </div>

      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-[#1C1A1A] p-6 rounded-lg shadow-lg text-center text-white">
            <p className="mb-4 text-lg">¿Quieres guardar los cambios antes de salir?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#44FE23] hover:opacity-90"
                onClick={handleConfirm}
              >
                Sí
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-[#F62C2C] hover:opacity-90"
                onClick={handleDiscard}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-gray-500 hover:opacity-90"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

AlineacionEditar.propTypes = {
  nombre: PropTypes.string,
  formacion: PropTypes.string,
  jugadores: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      posicion: PropTypes.oneOf([ 
        "ed", "el", "dc", "mc", "mco", "mcd", "mi", "md", "ld", "li", "dfc", "por"
      ]).isRequired
    })
  )
};

AlineacionEditar.defaultProps = {
  nombre: "",
  formacion: "",
  jugadores: []
};
