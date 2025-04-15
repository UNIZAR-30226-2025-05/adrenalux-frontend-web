import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarGame from "./layout/game/NavbarGame";
import BackButton from "./layout/game/BackButton";
import background from "../assets/background.png";
import { FaSearch, FaPlus, FaUserFriends, FaTrophy, FaUsers, FaCalendarAlt, FaCoins, FaSignOutAlt, FaLock, FaTimes, FaCheck } from "react-icons/fa";

const Torneo = () => {
  const navigate = useNavigate();
  const [torneos, setTorneos] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [torneoParaUnirse, setTorneoParaUnirse] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [nuevoTorneo, setNuevoTorneo] = useState({
    nombre: "",
    descripcion: "",
    premio: "1000 puntos",
    maxParticipantes: 8,
    esPublico: true,
    password: ""
  });

  // Datos mockeados
  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        setError(null);
        
        const mockTorneos = [
          {
            id: 1,
            nombre: "Torneo Relámpago",
            fechaInicio: "15/06/2023",
            participantes: 4,
            maxParticipantes: 8,
            premio: "1000 puntos",
            descripcion: "Torneo rápido de 1 vs 1, eliminatoria directa",
            esPublico: true,
            participantesInscritos: [
              { id: 1, nombre: "Jugador1", avatar: "" },
              { id: 2, nombre: "Jugador2", avatar: "" },
              { id: 3, nombre: "Jugador3", avatar: "" },
              { id: 4, nombre: "Tú", avatar: "" }
            ]
          },
          {
            id: 2,
            nombre: "Torneo Élite",
            fechaInicio: "20/06/2023",
            participantes: 2,
            maxParticipantes: 8,
            premio: "5000 puntos",
            descripcion: "Torneo para jugadores avanzados",
            esPublico: false,
            password: "elite123",
            participantesInscritos: [
              { id: 5, nombre: "ProPlayer", avatar: "" },
              { id: 6, nombre: "Tú", avatar: "" }
            ]
          },
          {
            id: 3,
            nombre: "Torneo Amistoso",
            fechaInicio: "18/06/2023",
            participantes: 6,
            maxParticipantes: 8,
            premio: "2000 puntos",
            descripcion: "Para jugar con amigos",
            esPublico: true,
            participantesInscritos: [
              { id: 7, nombre: "Amigo1", avatar: "" },
              { id: 8, nombre: "Amigo2", avatar: "" },
              { id: 9, nombre: "Amigo3", avatar: "" },
              { id: 10, nombre: "Amigo4", avatar: "" },
              { id: 11, nombre: "Amigo5", avatar: "" },
              { id: 12, nombre: "Tú", avatar: "" }
            ]
          }
        ];
        
        setTorneos(mockTorneos);
      } catch (err) {
        console.error("Error al cargar torneos:", err);
        setError("No se pudieron cargar los torneos disponibles");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleBackClick = () => navigate("/home");
  const handleRetry = () => window.location.reload();
  
  const handleUnirse = (torneo) => {
    if (!torneo.esPublico) {
      setTorneoParaUnirse(torneo);
      setShowPasswordModal(true);
      return;
    }
    confirmarUnion(torneo);
  };

  const confirmarUnion = (torneo) => {
    const torneosActualizados = torneos.map(t => {
      if (t.id === torneo.id) {
        const yaInscrito = t.participantesInscritos.some(p => p.nombre === "Tú");
        if (!yaInscrito && t.participantes < t.maxParticipantes) {
          return {
            ...t,
            participantes: t.participantes + 1,
            participantesInscritos: [...t.participantesInscritos, { id: 999, nombre: "Tú", avatar: "" }]
          };
        }
      }
      return t;
    });
    
    setTorneos(torneosActualizados);
    setShowPasswordModal(false);
    setPassword("");
  };

  const handleAbandonar = (torneoId) => {
    const torneosActualizados = torneos.map(t => {
      if (t.id === torneoId) {
        return {
          ...t,
          participantes: t.participantes - 1,
          participantesInscritos: t.participantesInscritos.filter(p => p.nombre !== "Tú")
        };
      }
      return t;
    });
    
    setTorneos(torneosActualizados);
    setTorneoSeleccionado(null);
  };

  const verificarPassword = () => {
    if (password === torneoParaUnirse.password) {
      confirmarUnion(torneoParaUnirse);
    } else {
      alert("Contraseña incorrecta");
      setPassword("");
    }
  };

  const handleCreateTorneo = () => {
    const nuevoId = Math.max(...torneos.map(t => t.id)) + 1;
    const torneoCreado = {
      ...nuevoTorneo,
      id: nuevoId,
      fechaInicio: new Date().toLocaleDateString(),
      participantes: 1,
      participantesInscritos: [{ id: 999, nombre: "Tú", avatar: "" }]
    };
    
    setTorneos([torneoCreado, ...torneos]);
    setShowCreateModal(false);
    setNuevoTorneo({
      nombre: "",
      descripcion: "",
      premio: "1000 puntos",
      maxParticipantes: 8,
      esPublico: true,
      password: ""
    });
  };

  const torneosFiltrados = torneos.filter(torneo =>
    torneo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
        <div className="text-white text-2xl">Cargando torneos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
        <div className="text-white text-center p-4">
          <p className="text-xl mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <button 
              onClick={handleBackClick}
              className="px-4 py-2 bg-gray-600 rounded-lg"
            >
              Volver
            </button>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 rounded-lg"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      <NavBarGame />
      <div className="relative w-full h-full mt-16 md:mt-32">
        <div className="absolute left-4 top-4 z-10">
          <BackButton onClick={handleBackClick} />
        </div>
        
        <div className="mx-auto bg-gray-800 bg-opacity-95 p-4 sm:p-6 md:p-8 rounded-lg w-[95%] max-w-6xl mt-4 md:mt-16 overflow-auto max-h-[80vh] border border-gray-600">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
            <FaTrophy className="inline mr-2 text-yellow-400" /> Torneos Disponibles
          </h1>
          
          {/* Barra de búsqueda y botones */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/2">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                placeholder="Buscar torneos..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-colors"
              >
                <FaPlus /> Crear Torneo
              </button>
              <button 
                onClick={() => navigate("/amigo")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
              >
                <FaUserFriends /> Mis Amigos
              </button>
            </div>
          </div>
          
          {/* Vista de lista o detalle */}
          {torneoSeleccionado ? (
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <button 
                onClick={() => setTorneoSeleccionado(null)}
                className="mb-4 text-blue-400 hover:text-blue-300 font-medium"
              >
                ← Volver a la lista
              </button>
              
              <h2 className="text-2xl font-bold mb-4 text-white">{torneoSeleccionado.nombre}</h2>
              <p className="text-gray-200 mb-6">{torneoSeleccionado.descripcion}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                  <h3 className="text-lg font-semibold mb-3 flex items-center text-white">
                    <FaCalendarAlt className="mr-2 text-yellow-400" /> Información del Torneo
                  </h3>
                  <div className="space-y-2 text-gray-200">
                    <p><span className="font-medium text-white">Fecha de inicio:</span> {torneoSeleccionado.fechaInicio}</p>
                    <p><span className="font-medium text-white">Participantes:</span> {torneoSeleccionado.participantes}/{torneoSeleccionado.maxParticipantes}</p>
                    <p className="flex items-center">
                      <FaCoins className="mr-2 text-yellow-400" /> 
                      <span className="font-medium text-white">Premio:</span> {torneoSeleccionado.premio}
                    </p>
                    <p>
                      <span className="font-medium text-white">Tipo:</span> {torneoSeleccionado.esPublico ? 
                        <span className="text-green-400"> Público</span> : 
                        <span className="text-red-400"> Privado <FaLock className="inline ml-1" /></span>}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                  <h3 className="text-lg font-semibold mb-3 flex items-center text-white">
                    <FaUsers className="mr-2 text-yellow-400" /> Participantes
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {torneoSeleccionado.participantesInscritos.map((participante, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-500 rounded transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-gray-800 font-medium">
                          {participante.avatar ? (
                            <img src={participante.avatar} alt="Avatar" className="w-full h-full rounded-full" />
                          ) : (
                            <span>{participante.nombre.charAt(0)}</span>
                          )}
                        </div>
                        <span className={participante.nombre === "Tú" ? "text-green-400 font-medium" : "text-gray-200"}>
                          {participante.nombre}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleAbandonar(torneoSeleccionado.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium mx-auto transition-colors"
              >
                <FaSignOutAlt /> Abandonar Torneo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {torneosFiltrados.length > 0 ? (
                torneosFiltrados.map((torneo) => (
                  <div key={torneo.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors border border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-white">{torneo.nombre}</h3>
                      {!torneo.esPublico && <FaLock className="text-red-400" />}
                    </div>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{torneo.descripcion}</p>
                    
                    <div className="flex justify-between items-center mb-3 text-sm">
                      <span className="flex items-center text-gray-200">
                        <FaUsers className="mr-1 text-yellow-400" />
                        {torneo.participantes}/{torneo.maxParticipantes}
                      </span>
                      <span className="flex items-center text-gray-200">
                        <FaCoins className="mr-1 text-yellow-400" />
                        {torneo.premio}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => {
                        const yaInscrito = torneo.participantesInscritos.some(p => p.nombre === "Tú");
                        yaInscrito 
                          ? setTorneoSeleccionado(torneo)
                          : handleUnirse(torneo);
                      }}
                      className={`w-full py-2 rounded text-sm font-medium transition-colors ${
                        torneo.participantesInscritos.some(p => p.nombre === "Tú")
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : torneo.participantes >= torneo.maxParticipantes
                            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                      disabled={torneo.participantes >= torneo.maxParticipantes && !torneo.participantesInscritos.some(p => p.nombre === "Tú")}
                    >
                      {torneo.participantesInscritos.some(p => p.nombre === "Tú")
                        ? "Ver Detalles"
                        : torneo.participantes >= torneo.maxParticipantes
                          ? "Completo"
                          : "Unirse"}
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400">No se encontraron torneos</p>
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal para contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-700 p-6 rounded-lg max-w-md w-full border border-gray-600">
            <h3 className="text-xl font-semibold mb-4 text-white">Torneo Privado</h3>
            <p className="mb-4 text-gray-200">Este torneo requiere contraseña para unirse:</p>
            
            <input
              type="password"
              placeholder="Ingresa la contraseña"
              className="w-full px-4 py-2 bg-gray-600 text-white rounded mb-4 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-400 rounded text-white font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={verificarPassword}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white font-medium transition-colors"
              >
                Unirse
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para crear torneo */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-700 p-6 rounded-lg max-w-md w-full border border-gray-600">
            <h3 className="text-xl font-semibold mb-4 text-white">Crear Nuevo Torneo</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-200 mb-1">Nombre del Torneo</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded border border-gray-500"
                  value={nuevoTorneo.nombre}
                  onChange={(e) => setNuevoTorneo({...nuevoTorneo, nombre: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-gray-200 mb-1">Descripción</label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded border border-gray-500"
                  rows="3"
                  value={nuevoTorneo.descripcion}
                  onChange={(e) => setNuevoTorneo({...nuevoTorneo, descripcion: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-gray-200 mb-1">Premio</label>
                <select
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded border border-gray-500"
                  value={nuevoTorneo.premio}
                  onChange={(e) => setNuevoTorneo({...nuevoTorneo, premio: e.target.value})}
                >
                  <option value="1000 puntos">1000 puntos</option>
                  <option value="2000 puntos">2000 puntos</option>
                  <option value="5000 puntos">5000 puntos</option>
                  <option value="10000 puntos">10000 puntos</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-200 mb-1">Máximo de participantes</label>
                <input
                  type="number"
                  min="2"
                  max="16"
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded border border-gray-500"
                  value={nuevoTorneo.maxParticipantes}
                  onChange={(e) => setNuevoTorneo({...nuevoTorneo, maxParticipantes: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="esPublico"
                  className="mr-2"
                  checked={nuevoTorneo.esPublico}
                  onChange={(e) => setNuevoTorneo({...nuevoTorneo, esPublico: e.target.checked})}
                />
                <label htmlFor="esPublico" className="text-gray-200">Torneo público</label>
              </div>
              
              {!nuevoTorneo.esPublico && (
                <div>
                  <label className="block text-gray-200 mb-1">Contraseña</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded border border-gray-500"
                    value={nuevoTorneo.password}
                    onChange={(e) => setNuevoTorneo({...nuevoTorneo, password: e.target.value})}
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-400 rounded text-white font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTorneo}
                disabled={!nuevoTorneo.nombre || (!nuevoTorneo.esPublico && !nuevoTorneo.password)}
                className={`px-4 py-2 rounded text-white font-medium transition-colors ${
                  !nuevoTorneo.nombre || (!nuevoTorneo.esPublico && !nuevoTorneo.password)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                Crear Torneo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Torneo;