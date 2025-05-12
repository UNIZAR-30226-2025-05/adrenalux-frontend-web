import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaSearch, FaPlus, FaUserFriends, FaTrophy, 
  FaUsers, FaCalendarAlt, FaCoins, FaSignOutAlt, 
  FaLock, FaSpinner, FaTimes, FaArrowLeft,
  FaPlay, FaExclamationTriangle
} from "react-icons/fa";
import { tournamentApi } from "../services/api/tournamentApi";
import { getToken } from "../services/api/authApi";
import { jwtDecode } from "jwt-decode";
import NavBarGame from "./layout/game/NavbarGame";
import BackButton from "./layout/game/BackButton";
import background from "../assets/background.png";

const initialState = {
  torneos: [],
  torneoSeleccionado: null,
  loading: { global: true, action: false, torneoId: null },
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
  formErrors: {
    nombre: "",
    descripcion: "",
    premio: "",
    contrasena: ""
  },
  torneoParaUnirse: null,
  passwordInput: "",
  initialCheckDone: false
};

const Torneo = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);

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
        setState(prev => ({ 
          ...prev, 
          torneos: data, 
          loading: { ...prev.loading, global: false } 
        }));
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

  // Verificar torneos del usuario
  useEffect(() => {
    const checkUserTorneos = async () => {
      if (user && !state.initialCheckDone && !state.loading.global) {
        try {
          const jugados = await tournamentApi.obtenerTorneosJugador();
          if (Array.isArray(jugados) && jugados.length > 0) {
          const pendiente = jugados.find(t => t.ganador_id == null);
            if (pendiente) {
              verDetalles(pendiente.id);
            }
          }
        } catch (err) {
          console.error("Error al obtener torneos jugados:", err);
        } finally {
          setState(prev => ({ ...prev, initialCheckDone: true }));
        }
      }
    };
    checkUserTorneos();
  }, [state.loading.global, user]);

  const validateForm = () => {
    let isValid = true;
    const errors = {
      nombre: "",
      descripcion: "",
      premio: "",
      contrasena: ""
    };

    // Validación del nombre (mínimo 4 caracteres)
    if (!state.form.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
      isValid = false;
    } else if (state.form.nombre.trim().length < 4) {
      errors.nombre = "El nombre debe tener al menos 4 caracteres";
      isValid = false;
    }

    // Validación de la descripción (no puede ser nulo)
    if (!state.form.descripcion.trim()) {
      errors.descripcion = "La descripción es obligatoria";
      isValid = false;
    }

    // Validación del premio (debe ser un número)
    if (!state.form.premio.trim()) {
      errors.premio = "El premio es obligatorio";
      isValid = false;
    } else if (isNaN(Number(state.form.premio))) {
      errors.premio = "El premio debe ser un número";
      isValid = false;
    }

    // Validación de la contraseña (si es torneo privado)
    if (state.form.esPrivado && !state.form.contrasena.trim()) {
      errors.contrasena = "La contraseña es obligatoria para torneos privados";
      isValid = false;
    }

    setState(prev => ({
      ...prev,
      formErrors: errors
    }));

    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        [name]: type === 'checkbox' ? checked : value
      },
      formErrors: {
        ...prev.formErrors,
        [name]: "" // Limpiar el error cuando el usuario modifica el campo
      }
    }));
  };

  const torneosFiltrados = state.torneos.filter(torneo => {
    const coincideBusqueda = torneo.nombre.toLowerCase().includes(state.filtros.busqueda.toLowerCase());
    const estaDisponible = !state.filtros.soloDisponibles || 
      (torneo.participantes < torneo.maxParticipantes && torneo.estado === "pendiente");
    return coincideBusqueda && estaDisponible && torneo.ganador_id == null;
  });

  const isUserInTournament = useCallback((torneo) => {
    if (!user || !torneo.participantes) return false;
    return torneo.participantes.some(p => p.id === user.id || p.user_id === user.id);
  }, [user]);

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
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, action: true, torneoId } 
      }));
      
      await tournamentApi.unirseATorneo(torneoId, contrasena);
      
      const actualizados = await tournamentApi.obtenerTorneosActivos();
      setState(prev => ({ 
        ...prev, 
        torneos: actualizados,
        modal: { ...prev.modal, password: false },
        loading: { ...prev.loading, action: false, torneoId: null },
        passwordInput: "",
        error: null
      }));
      verDetalles(torneoId);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message,
        loading: { ...prev.loading, action: false, torneoId: null }
      }));
    }
  };

  const manejarAbandono = async (torneoId) => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, action: true, torneoId } 
      }));
      await tournamentApi.abandonarTorneo(torneoId);
      
      const actualizados = await tournamentApi.obtenerTorneosActivos();
      setState(prev => ({ 
        ...prev, 
        torneos: actualizados,
        torneoSeleccionado: null,
        loading: { ...prev.loading, action: false, torneoId: null },
        error: null
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message,
        loading: { ...prev.loading, action: false, torneoId: null }
      }));
    }
  };

  const manejarInicio = async () => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, action: true } 
      }));
      
      await tournamentApi.iniciarTorneo(state.torneoSeleccionado.id);
      
      const [detalles, partidas] = await Promise.all([
        tournamentApi.obtenerDetallesTorneo(state.torneoSeleccionado.id),
        tournamentApi.obtenerPartidasTorneo(state.torneoSeleccionado.id)
      ]);

      setState(prev => ({ 
        ...prev, 
        torneoSeleccionado: {
          ...detalles,
          partidas: partidas,
          participanteActual: isUserInTournament(detalles)
        },
        loading: { ...prev.loading, action: false },
        error: null
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message,
        loading: { ...prev.loading, action: false }
      }));
    }
  };

  const manejarCreacion = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, action: true }, 
        error: null 
      }));
      
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
        formErrors: {
          nombre: "",
          descripcion: "",
          premio: "",
          contrasena: ""
        },
        loading: { ...prev.loading, action: false }
      }));

      verDetalles(nuevoTorneo.id);
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: { ...prev.loading, action: false }
      }));
    }
  };

  const verDetalles = async (torneoId) => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, action: true, torneoId } 
      }));
      const [detalles, partidas] = await Promise.all([
        tournamentApi.obtenerDetallesTorneo(torneoId),
        tournamentApi.obtenerPartidasTorneo(torneoId)
      ]);

      if (detalles.ganador_id) {
        setState(prev => ({
          ...prev,
          torneoSeleccionado: null,
          loading: { ...prev.loading, action: false, torneoId: null }
        }));
        return;
      }
      
      setState(prev => ({ 
        ...prev, 
        torneoSeleccionado: {
          ...detalles,
          partidas: partidas,
          participanteActual: isUserInTournament(detalles)
        },
        error: null
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message
      }));
    } finally {
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, action: false, torneoId: null } 
      }));
    }
  };

  const organizeMatchesIntoRounds = (partidas, participantCount) => {
    const sortedMatches = [...(partidas || [])].sort((a, b) => 
      new Date(a.fecha) - new Date(b.fecha));
    
    const rounds = { quarters: [], semis: [], final: [] };
    let remainingMatches = [...sortedMatches];
  
    if (participantCount >= 8) {
      rounds.quarters = remainingMatches.splice(0, 4);
    }
  
    if (participantCount >= 4) {
      const semiCount = participantCount >= 8 ? 2 : 2;
      rounds.semis = remainingMatches.splice(0, semiCount);
    }
  
    rounds.final = remainingMatches;
  
    return rounds;
  };

  const MatchesSection = ({ partidas, participantCount, participants }) => {
    const rounds = organizeMatchesIntoRounds(partidas, participantCount);

    if (!partidas || partidas.length === 0) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-600 rounded w-1/3"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <>
        {rounds.quarters.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-yellow-400 mb-2">
              Cuartos de Final
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rounds.quarters.map(match => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  participants={participants} 
                />
              ))}
            </div>
          </div>
        )}
        
        {rounds.semis.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-yellow-400 mb-2">
              Semifinales
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rounds.semis.map(match => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  participants={participants} 
                />
              ))}
            </div>
          </div>
        )}
        
        {rounds.final.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-yellow-400 mb-2">
              Final
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {rounds.final.map(match => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  participants={participants} 
                />
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const MatchCard = ({ match, participants }) => {
    const findParticipant = (id) => 
      participants?.find(p => p.id === id || p.user_id === id);
    
    const player1 = findParticipant(match.user1_id);
    const player2 = findParticipant(match.user2_id);
    const winner = findParticipant(match.ganador_id);
  
    const formatFecha = (fecha) => {
      if (!fecha) return 'Fecha no definida';
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
  
    return (
      <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-yellow-400 transition-colors">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">{formatFecha(match.fecha)}</span>
          {winner && (
            <span className="text-xs bg-green-800 text-green-200 px-2 py-1 rounded">
              Finalizada
            </span>
          )}
        </div>
        <div className="flex items-center justify-around">
          <div className={`text-center ${winner?.id === player1?.id ? 'text-green-400' : 'text-white'}`}>
            <p className="font-medium">{player1?.nombre || 'Por definir'}</p>
            {player1 && <span className="text-xs text-gray-400">Lv. {player1.nivel}</span>}
          </div>
          <span className="mx-2 text-yellow-400">vs</span>
          <div className={`text-center ${winner?.id === player2?.id ? 'text-green-400' : 'text-white'}`}>
            <p className="font-medium">{player2?.nombre || 'Por definir'}</p>
            {player2 && <span className="text-xs text-gray-400">Lv. {player2.nivel}</span>}
          </div>
        </div>
      </div>
    );
  };

  const CardTorneo = ({ torneo }) => {
    const esParticipante = isUserInTournament(torneo);
    const estaLleno = torneo.participantes >= torneo.maxParticipantes;
    const enCurso = torneo.estado === "en_curso";
    const isLoading = state.loading.action && state.loading.torneoId === torneo.id;
    
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
          disabled={isLoading || estaLleno || enCurso}
        >
          {isLoading ? (
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
          
          {state.error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-400 text-red-200 rounded-lg">
              {state.error}
            </div>
          )}
          
          {state.torneoSeleccionado && !state.torneoSeleccionado.ganador_id ? (
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
                          <span className={jugador.id === user?.id || jugador.user_id === user?.id ? "text-green-400 font-medium" : "text-gray-200"}>
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

              {state.torneoSeleccionado.estado == 'en_curso' && (  
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <FaTrophy className="mr-2 text-yellow-400" /> 
                    Partidas Planeadas
                  </h3>
                  
                  {state.torneoSeleccionado.partidas?.length > 0 ? (
                    <MatchesSection 
                      partidas={state.torneoSeleccionado.partidas}
                      participantCount={state.torneoSeleccionado.participantes?.length || 0}
                      participants={state.torneoSeleccionado.participantes || []}
                    />
                  ) : (
                    <p className="text-gray-400">No hay partidas programadas todavía.</p>
                  )}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              {state.torneoSeleccionado.estado !== 'en_curso' && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  {state.torneoSeleccionado?.participanteActual && (
                    <button
                      onClick={() => manejarAbandono(state.torneoSeleccionado.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium"
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

                  {user && 
                  state.torneoSeleccionado && 
                  (user.id === state.torneoSeleccionado.creadorId) && 
                  !state.torneoSeleccionado.torneo_en_curso && (
                    <button
                      onClick={manejarInicio}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium"
                      disabled={state.loading.action || state.torneoSeleccionado.participantes.length < 2}
                      title={state.torneoSeleccionado.participantes.length < 2 ? "Se necesitan al menos 2 participantes" : ""}
                    >
                      {state.loading.action ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          <FaPlay /> Iniciar Torneo
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
              </div>
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
                  },
                  formErrors: {
                    nombre: "",
                    descripcion: "",
                    premio: "",
                    contrasena: ""
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
                  className={`w-full px-4 py-2 bg-gray-600 text-white rounded border ${state.formErrors.nombre ? 'border-red-500' : 'border-gray-500'}`}
                  value={state.form.nombre}
                  onChange={handleChange}
                  required
                />
                {state.formErrors.nombre && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" /> {state.formErrors.nombre}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Descripción*</label>
                <textarea
                  name="descripcion"
                  className={`w-full px-4 py-2 bg-gray-600 text-white rounded border ${state.formErrors.descripcion ? 'border-red-500' : 'border-gray-500'}`}
                  rows="3"
                  value={state.form.descripcion}
                  onChange={handleChange}
                  required
                />
                {state.formErrors.descripcion && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" /> {state.formErrors.descripcion}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Premio* (número)</label>
                <input
                  type="text"
                  name="premio"
                  className={`w-full px-4 py-2 bg-gray-600 text-white rounded border ${state.formErrors.premio ? 'border-red-500' : 'border-gray-500'}`}
                  value={state.form.premio}
                  onChange={handleChange}
                  required
                />
                {state.formErrors.premio && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" /> {state.formErrors.premio}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="esPrivado"
                  name="esPrivado"
                  checked={state.form.esPrivado}
                  onChange={handleChange}
                  className="rounded text-yellow-400 focus:ring-yellow-400"
                />
                <label htmlFor="esPrivado" className="text-gray-300">Torneo privado</label>
              </div>
              
              {state.form.esPrivado && (
                <div>
                  <label className="block text-gray-300 mb-1">Contraseña*</label>
                  <input
                    type="password"
                    name="contrasena"
                    className={`w-full px-4 py-2 bg-gray-600 text-white rounded border ${state.formErrors.contrasena ? 'border-red-500' : 'border-gray-500'}`}
                    value={state.form.contrasena}
                    onChange={handleChange}
                    required={state.form.esPrivado}
                  />
                  {state.formErrors.contrasena && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" /> {state.formErrors.contrasena}
                    </p>
                  )}
                </div>
              )}
              
              <button
                onClick={manejarCreacion}
                className="w-full py-2 bg-green-500 hover:bg-green-600 rounded text-white font-medium mt-4"
                disabled={state.loading.action}
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