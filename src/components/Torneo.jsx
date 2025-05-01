import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaSearch, FaPlus, FaUserFriends, FaTrophy, 
  FaUsers, FaCalendarAlt, FaCoins, FaSignOutAlt, 
  FaLock, FaSpinner, FaTimes, FaArrowLeft 
} from "react-icons/fa";
import { tournamentApi } from "../services/api/tournamentApi";
import { getToken, logout } from "../services/api/authApi";
import { jwtDecode } from "jwt-decode";
import NavBarGame from "./layout/game/NavbarGame";
import BackButton from "./layout/game/BackButton";
import background from "../assets/background.png";

const Torneo = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    torneos: [],
    torneoSeleccionado: null,
    loading: { global: true, action: false },
    error: null,
    filtros: { busqueda: "", soloDisponibles: true },
    modal: { password: false, crear: false },
    form: {
      nombre: "",
      descripcion: "",
      premio: "",
      contrasena: "",
      esPrivado: false
    },
    torneoParaUnirse: null,
    passwordInput: "",
    initialCheckDone: false
  });

  // Obtener usuario del token
  const user = useMemo(() => {
    const token = getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decodificando token:", error);
      return null;
    }
  }, []);

  // Cargar torneos al montar el componente
  useEffect(() => {
    const cargarTorneos = async () => {
      try {
        setState(prev => ({ ...prev, loading: { ...prev.loading, global: true }, error: null }));
        const data = await tournamentApi.obtenerTorneosActivos();
        setState(prev => ({ ...prev, torneos: data, loading: { ...prev.loading, global: false } }));
      } catch (err) {
        setState(prev => ({ 
          ...prev, 
          error: err.message, 
          loading: { ...prev.loading, global: false } 
        }));
      }
    };
    cargarTorneos();
  }, []);

  useEffect(() => {
    const checkUserTorneos = async () => {
      if (user && !state.initialCheckDone) {
        try {
          const jugados = await tournamentApi.obtenerTorneosJugador();
          console.log("Jugados:", JSON.stringify(jugados, null, 2));
          if (Array.isArray(jugados) && jugados.length > 0) {
            verDetalles(jugados[0].id);
          }
        } catch (err) {
          console.error("Error al obtener torneos jugados:", err);
        } finally {
          setState(prev => ({ ...prev, initialCheckDone: true }));
        }
      }
    };
    if (!state.loading.global) checkUserTorneos();
  }, [state.loading.global, user]);

  // Manejar cambios en formularios
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  // Filtrado de torneos
  const torneosFiltrados = state.torneos.filter(torneo => {
    const coincideBusqueda = torneo.nombre.toLowerCase().includes(state.filtros.busqueda.toLowerCase());
    const estaDisponible = !state.filtros.soloDisponibles || 
      (torneo.participantes < torneo.maxParticipantes && torneo.estado === "pendiente");
    return coincideBusqueda && estaDisponible;
  });

  // Verificar si el usuario está en un torneo
  const isUserInTournament = (torneo) => {
    if (!user || !torneo.participantes) return false;
    return torneo.participantes.some(p => p.id === user.id);
  };

  // Acciones principales
  const manejarUnion = async (torneo) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (torneo.requiereContraseña) {
      setState(prev => ({ 
        ...prev, 
        torneoParaUnirse: torneo, 
        modal: { ...prev.modal, password: true },
        passwordInput: ""
      }));
      return;
    }
    await confirmarUnion(torneo.id);
  };

  const confirmarUnion = async (torneoId, contrasena) => {
    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, action: true } }));
      
      await tournamentApi.unirseATorneo(
        torneoId, 
        contrasena && contrasena.trim() !== "" ? contrasena : undefined
      );
      
      const actualizados = await tournamentApi.obtenerTorneosActivos();
      setState(prev => ({ 
        ...prev, 
        torneos: actualizados,
        modal: { ...prev.modal, password: false },
        loading: { ...prev.loading, action: false },
        passwordInput: "",
        error: null
      }));
      verDetalles(torneoId);
    } catch (error) {
      console.error("Error al unirse al torneo:", error);
      setState(prev => ({ 
        ...prev, 
        error: error.response?.data?.message || error.message || "Error al unirse al torneo",
        loading: { ...prev.loading, action: false }
      }));
    }
  };

  const manejarAbandono = async (torneoId) => {
    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, action: true } }));
      await tournamentApi.abandonarTorneo(torneoId);
      
      const actualizados = await tournamentApi.obtenerTorneosActivos();
      setState(prev => ({ 
        ...prev, 
        torneos: actualizados,
        torneoSeleccionado: null,
        loading: { ...prev.loading, action: false },
        error: null
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.response?.data?.message || error.message || "Error al abandonar torneo",
        loading: { ...prev.loading, action: false }
      }));
    }
  };

  const manejarCreacion = async () => {
    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, action: true } }));
      
      const nuevoTorneo = await tournamentApi.crearTorneo({
        nombre: state.form.nombre,
        descripcion: state.form.descripcion,
        premio: state.form.premio,
        contrasena: state.form.esPrivado ? state.form.contrasena : undefined
      });
      
      setState(prev => ({
        ...prev,
        torneos: [nuevoTorneo, ...prev.torneos],
        modal: { ...prev.modal, crear: false },
        form: {
          nombre: "",
          descripcion: "",
          premio: "",
          contrasena: "",
          esPrivado: false
        },
        loading: { ...prev.loading, action: false },
        error: null
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.response?.data?.message || error.message || "Error al crear torneo",
        loading: { ...prev.loading, action: false }
      }));
    }
  };

  const verDetalles = async (torneoId) => {
    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, action: true } }));
      const detalles = await tournamentApi.obtenerDetallesTorneo(torneoId);
      setState(prev => ({ 
        ...prev, 
        torneoSeleccionado: {
          ...detalles,
          participanteActual: isUserInTournament(detalles)
        },
        error: null
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.response?.data?.message || error.message || "Error al cargar detalles"
      }));
    } finally {
      setState(prev => ({ ...prev, loading: { ...prev.loading, action: false } }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setState(prev => ({ ...prev, error: "Error al cerrar sesión" }));
    }
  };

  // Componente de tarjeta de torneo
  const CardTorneo = ({ torneo }) => {
    const esParticipante = isUserInTournament(torneo);
    const estaLleno = torneo.participantes >= torneo.maxParticipantes;
    const enCurso = torneo.estado === "en_curso";
    
    return (
      <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-yellow-400 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{torneo.nombre}</h3>
          {torneo.requiereContraseña && <FaLock className="text-red-400" />}
        </div>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{torneo.descripcion}</p>
        
        <div className="flex justify-between text-sm mb-3">
          <span className="text-yellow-400">
            <FaUsers className="inline mr-1" />
            {torneo.participantes}/{torneo.maxParticipantes}
          </span>
          <span className="text-yellow-400">
            <FaCoins className="inline mr-1" />
            {torneo.premio}
          </span>
          <span className={enCurso ? "text-red-400" : "text-green-400"}>
            {enCurso ? "En curso" : "Pendiente"}
          </span>
        </div>
        
        <button
          onClick={() => esParticipante ? verDetalles(torneo.id) : manejarUnion(torneo)}
          className={`w-full py-1 rounded text-sm font-medium ${
            esParticipante 
              ? "bg-blue-500 hover:bg-blue-600" 
              : estaLleno || enCurso
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
          } text-white`}
          disabled={state.loading.action || estaLleno || enCurso}
        >
          {state.loading.action ? (
            <FaSpinner className="animate-spin mx-auto" />
          ) : esParticipante ? (
            "Ver Detalles"
          ) : estaLleno ? (
            "Lleno"
          ) : enCurso ? (
            "En curso"
          ) : (
            "Unirse"
          )}
        </button>
      </div>
    );
  };

  // Estados de carga y error
  if (state.loading.global) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{backgroundImage: `url(${background})`}}>
        <FaSpinner className="animate-spin text-4xl text-white" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{backgroundImage: `url(${background})`}}>
        <div className="text-center bg-gray-800 bg-opacity-90 p-6 rounded-lg">
          <h3 className="text-xl text-red-400 mb-4">Error</h3>
          <p className="text-gray-300 mb-6">{state.error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate("/home")}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
            >
              Volver
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-cover bg-center overflow-auto" style={{backgroundImage: `url(${background})`}}>
      <NavBarGame />
      
      <div className="container mx-auto px-4 py-20 max-w-6xl">
      <BackButton 
        onClick={() => navigate("/home")}
        className="absolute left-4 top-20"
      />
        
        <div className="bg-gray-800 bg-opacity-90 rounded-xl p-6 border border-gray-700 shadow-lg">
          {/* Header y filtros */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FaTrophy className="text-yellow-400 mr-2" /> 
              {state.torneoSeleccionado ? state.torneoSeleccionado.nombre : "Torneos Disponibles"}
            </h1>
            
            {!state.torneoSeleccionado && (
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-grow">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar torneos..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-yellow-400"
                    value={state.filtros.busqueda}
                    onChange={(e) => setState(prev => ({ 
                      ...prev, 
                      filtros: { ...prev.filtros, busqueda: e.target.value } 
                    }))}
                  />
                </div>
                
                {user && (
                  <button 
                    onClick={() => setState(prev => ({ ...prev, modal: { ...prev.modal, crear: true } }))}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium"
                    disabled={state.loading.action}
                  >
                    {state.loading.action ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <>
                        <FaPlus /> Crear
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Mostrar error general */}
          {state.error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-400 text-red-200 rounded-lg">
              {state.error}
            </div>
          )}
          
          {/* Contenido principal */}
          {state.torneoSeleccionado ? (
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-600 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-3 flex items-center">
                    <FaCalendarAlt className="mr-2 text-yellow-400" /> Detalles
                  </h3>
                  <div className="text-gray-200 space-y-2">
                    <p><span className="font-medium">Descripción:</span> {state.torneoSeleccionado.descripcion}</p>
                    <p><span className="font-medium">Estado:</span> {state.torneoSeleccionado.estado === "en_curso" ? "En curso" : "Pendiente"}</p>
                    <p><span className="font-medium">Premio:</span> {state.torneoSeleccionado.premio}</p>
                    <p><span className="font-medium">Participantes:</span> {state.torneoSeleccionado.participantes?.length || 0}/{state.torneoSeleccionado.maxParticipantes}</p>
                    {state.torneoSeleccionado.fechaInicio && (
                      <p><span className="font-medium">Inicio:</span> {new Date(state.torneoSeleccionado.fechaInicio).toLocaleString()}</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-600 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-3 flex items-center">
                    <FaUsers className="mr-2 text-yellow-400" /> Jugadores
                  </h3>
                  <div className="max-h-60 overflow-y-auto">
                    {state.torneoSeleccionado.participantes?.length > 0 ? (
                      state.torneoSeleccionado.participantes.map(jugador => (
                        <div key={jugador.id} className="flex items-center gap-3 py-2 border-b border-gray-500 last:border-0">
                          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center overflow-hidden">
                            {jugador.avatar ? (
                              <img src={jugador.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-medium">{jugador.nombre?.charAt(0) || "?"}</span>
                            )}
                          </div>
                          <span className={jugador.id === user?.id ? "text-green-400 font-medium" : "text-gray-200"}>
                            {jugador.nombre || "Jugador anónimo"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No hay participantes aún</p>
                    )}
                  </div>
                </div>
              </div>
              
              {state.torneoSeleccionado.participanteActual && (
                <button
                  onClick={() => manejarAbandono(state.torneoSeleccionado.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium mx-auto"
                  disabled={state.loading.action}
                >
                  {state.loading.action ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <>
                      <FaSignOutAlt /> Abandonar Torneo
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {torneosFiltrados.length > 0 ? (
                torneosFiltrados.map(torneo => (
                  <CardTorneo key={torneo.id} torneo={torneo} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400 mb-2">No se encontraron torneos</p>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, filtros: { ...prev.filtros, busqueda: "" } }))}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de contraseña */}
      {state.modal.password && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-700 p-6 rounded-lg max-w-md w-full border border-gray-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Torneo Privado</h3>
              <button 
                onClick={() => setState(prev => ({ 
                  ...prev, 
                  modal: { ...prev.modal, password: false },
                  passwordInput: ""
                }))}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            
            <p className="text-gray-300 mb-4">Ingresa la contraseña para unirte al torneo:</p>
            
            <input
              type="password"
              className="w-full px-4 py-2 bg-gray-600 text-white rounded mb-4 border border-gray-500 focus:ring-2 focus:ring-yellow-400"
              placeholder="Contraseña del torneo"
              value={state.passwordInput}
              onChange={(e) => setState(prev => ({ ...prev, passwordInput: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && state.passwordInput && confirmarUnion(state.torneoParaUnirse.id, state.passwordInput)}
            />
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setState(prev => ({ 
                  ...prev, 
                  modal: { ...prev.modal, password: false },
                  passwordInput: ""
                }))}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-400 rounded text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmarUnion(state.torneoParaUnirse.id, state.passwordInput)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white"
                disabled={state.loading.action || !state.passwordInput}
              >
                {state.loading.action ? <FaSpinner className="animate-spin" /> : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de creación */}
      {state.modal.crear && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-700 p-6 rounded-lg max-w-md w-full border border-gray-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Nuevo Torneo</h3>
              <button 
                onClick={() => setState(prev => ({ 
                  ...prev, 
                  modal: { ...prev.modal, crear: false },
                  form: {
                    nombre: "",
                    descripcion: "",
                    premio: "",
                    contrasena: "",
                    esPrivado: false
                  }
                }))}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Nombre*</label>
                <input
                  type="text"
                  name="nombre"
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded border border-gray-500"
                  value={state.form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded border border-gray-500"
                  rows="3"
                  value={state.form.descripcion}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Premio*</label>
                <input
                  type="text"
                  name="premio"
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded border border-gray-500"
                  value={state.form.premio}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="esPrivado"
                  name="esPrivado"
                  checked={state.form.esPrivado}
                  onChange={handleChange}
                />
                <label htmlFor="esPrivado" className="text-gray-300">Torneo privado</label>
              </div>
              
              {state.form.esPrivado && (
                <div>
                  <label className="block text-gray-300 mb-1">Contraseña*</label>
                  <input
                    type="password"
                    name="contrasena"
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded border border-gray-500"
                    value={state.form.contrasena}
                    onChange={handleChange}
                    required={state.form.esPrivado}
                  />
                </div>
              )}
              
              <button
                onClick={manejarCreacion}
                className="w-full py-2 bg-green-500 hover:bg-green-600 rounded text-white font-medium mt-4"
                disabled={state.loading.action || !state.form.nombre || !state.form.premio || (state.form.esPrivado && !state.form.contrasena)}
              >
                {state.loading.action ? (
                  <FaSpinner className="animate-spin mx-auto" />
                ) : (
                  "Crear Torneo"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Torneo;