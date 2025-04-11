import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socketService } from '../services/websocket/socketService';
import background from "../assets/backgroundAlineacion.png";
import { getProfile } from "../services/api/profileApi"
import { obtenerPlantillas, obtenerCartasDePlantilla } from "../services/api/alineacionesApi"
import { getToken } from '../services/api/authApi';
import Formacion433 from '../components/layout/game/Formacion_4_3_3';

const Partida = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const token = getToken();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const [gameState, setGameState] = useState({
    phase: 'waiting',
    roundNumber: 1,
    isPlayerTurn: false,
    opponentSelection: null,
    mySelection: null, // Variable para rastrear nuestra selección entre rondas
    scores: { player: 0, opponent: 0 },
    playerCards: [],
    availablePlayerCards: [],
    opponentCards: [],
    selectedCard: null,
    selectedSkill: null,
    timer: 30,
    matchInfo: null
  });

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    socketService.setOnRoundStart(handleRoundStart);
    socketService.setOnOpponentSelection(handleOpponentSelection);
    socketService.setOnRoundResult(handleRoundResult);
    socketService.setOnMatchEnd(handleMatchEnd);
  
    const fetchData = async () => {
      try {
        const perfil = await getProfile(token);
        const plantilla_id_activa = perfil.data.plantilla_activa_id;
        const plantillas = await obtenerPlantillas(token);
        const plantilla_activa = plantillas.data.find(
          (plantilla) => plantilla.id === plantilla_id_activa
        );
  
        const jugadores_plantilla = await obtenerCartasDePlantilla(plantilla_activa.id, token);
        
        // Mapear las cartas al formato compatible
        const playerCards = Array.isArray(jugadores_plantilla?.data) 
          ? (() => {
              const counters = {
                forward: 0,
                midfielder: 0,
                defender: 0,
                goalkeeper: 0
              };
  
              return jugadores_plantilla.data.map(jugador => {
                let posicionEspecifica;
                const posicionLower = jugador.posicion.toLowerCase();
                
                switch (posicionLower) {
                  case "forward":
                  case "delantero":
                    counters.forward++;
                    posicionEspecifica = `forward${counters.forward}`;
                    break;
                  case "midfielder":
                  case "centrocampista":
                    counters.midfielder++;
                    posicionEspecifica = `midfielder${counters.midfielder}`;
                    break;
                  case "defender":
                  case "defensa":
                    counters.defender++;
                    posicionEspecifica = `defender${counters.defender}`;
                    break;
                  case "goalkeeper":
                  case "portero":
                    counters.goalkeeper++;
                    posicionEspecifica = "goalkeeper1";
                    break;
                  default:
                    // Por defecto considerar como defensa si no coincide
                    counters.defender++;
                    posicionEspecifica = `defender${counters.defender}`;
                }
  
                return {
                  id: jugador.id.toString(),
                  nombre: jugador.nombre,
                  alias: jugador.alias,
                  posicion: posicionEspecifica,
                  posicionType: posicionLower,
                  photo: jugador.photo, // Usar photo si existe
                  ataque: jugador.ataque,
                  defensa: jugador.defensa,
                  control: jugador.control,
                  equipo: jugador.equipo,
                  escudo: jugador.escudo,
                  pais: jugador.pais,
                  tipo_carta: jugador.tipo_carta
                };
              });
            })()
          : [];
  
        console.log("PlayerCards mapeadas:", playerCards);
  
        setGameState(prev => ({
          ...prev,
          playerCards,
          availablePlayerCards: [...playerCards],
          matchInfo: { perfil, plantillas }
        }));
      } catch (error) {
        console.error("Error cargando perfil o plantillas:", error);
        setGameState(prev => ({
          ...prev,
          playerCards: [],
          availablePlayerCards: [],
          matchInfo: null
        }));
      }
    };
  
    fetchData();
  
    return () => {
      socketService.setOnRoundStart(null);
      socketService.setOnOpponentSelection(null);
      socketService.setOnRoundResult(null);
      socketService.setOnMatchEnd(null);
    };
  }, [token]);

  const handleCardSelect = (data) => {
    if (!gameState.isPlayerTurn || gameState.phase !== 'selection') {
      setAlertMessage("¡No es tu turno!");
      setShowAlert(true);
      
      // Ocultar la alerta después de 3 segundos
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      
      return;
    }
  
    console.log(data);
  
    setGameState(prev => ({
      ...prev,
      selectedCard: data.jugador,
      selectedSkill: null // Resetear habilidad al seleccionar nueva carta
    }));
  };
  
  const handleSkillSelect = (skill) => {
    if (!gameState.selectedCard) return;
    
    // Verificar que el jugador seleccione la misma skill que el oponente
    if (gameState.opponentSelection && skill !== gameState.opponentSelection.data.skill) {
      setAlertMessage(`¡La skill que tienes que seleccionar es: ${gameState.opponentSelection.data.skill}!`);
      setShowAlert(true);
      
      // Ocultar la alerta después de 3 segundos
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      
      return;
    }
    
    console.log(skill);
    
    setGameState(prev => ({
      ...prev,
      selectedSkill: skill
    }));
  };

// 2. Mejora el manejo de confirmación de selección
const handleConfirmSelection = () => {
  if (!gameState.selectedCard || !gameState.selectedSkill) return;
  
  console.log("Confirmando selección:", gameState.selectedCard);
  
  // Verificar nuevamente que la skill seleccionada coincida con la del oponente
  if (gameState.opponentSelection && gameState.selectedSkill !== gameState.opponentSelection.data.skill) {
    setAlertMessage(`¡La skill que tienes que seleccionar es: ${gameState.opponentSelection.data.skill}!`);
    setShowAlert(true);
    
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    
    return;
  }
  
  // Eliminar la carta seleccionada de las cartas disponibles
  const updatedAvailableCards = gameState.availablePlayerCards.filter(
    card => card.id !== gameState.selectedCard.id
  );
  
  if(gameState.opponentSelection == null){
    socketService.selectCardMatch({
      cartaId: gameState.selectedCard.id,
      skill: gameState.selectedSkill
    });
  } else {
    socketService.selectResponse({
      cartaId: gameState.selectedCard.id,
      skill: gameState.selectedSkill
    });
  }
  
  // Guarda la selección actual para referencia futura
  setGameState(prev => ({
    ...prev,
    phase: 'response',
    availablePlayerCards: updatedAvailableCards,
    mySelection: gameState.selectedCard // Importante: guarda tu selección actual
  }));
};

  // Función para asignar posiciones específicas a las cartas del oponente
  const getPositionForOpponentCard = (carta, existingCards) => {
    const posicionLower = carta.posicion.toLowerCase();
    const existingPositions = existingCards ? existingCards.map(card => card.posicion) : [];
    
    // Contadores para cada tipo de posición
    const counters = {
      forward: 0,
      midfielder: 0,
      defender: 0,
      goalkeeper: 0
    };
    
    // Contar las posiciones ya asignadas
    existingPositions.forEach(pos => {
      if (pos.startsWith('forward')) counters.forward++;
      else if (pos.startsWith('midfielder')) counters.midfielder++;
      else if (pos.startsWith('defender')) counters.defender++; 
      else if (pos.startsWith('goalkeeper')) counters.goalkeeper++;
    });
    
    // Asignar la posición específica
    let posicionEspecifica;
    
    switch (posicionLower) {
      case "forward":
      case "delantero":
        counters.forward++;
        posicionEspecifica = `forward${counters.forward}`;
        break;
      case "midfielder":
      case "centrocampista":
        counters.midfielder++;
        posicionEspecifica = `midfielder${counters.midfielder}`;
        break;
      case "defender":
      case "defensa":
        counters.defender++;
        posicionEspecifica = `defender${counters.defender}`;
        break;
      case "goalkeeper":
      case "portero":
        counters.goalkeeper++;
        posicionEspecifica = "goalkeeper1";
        break;
      default:
        // Por defecto considerar como defensa
        counters.defender++;
        posicionEspecifica = `defender${counters.defender}`;
    }
    
    return posicionEspecifica;
  };

  const handleRoundStart = (data) => {
    console.log(data.dataConTurno);
    setGameState(prev => ({
      ...prev,
      phase: 'selection',
      roundNumber: data.dataConTurno.roundNumber,
      isPlayerTurn: data.dataConTurno.isPlayerTurn,
      timer: 30,
      selectedSkill: null,
      opponentSelection: null,
      // Solo resetear selectedCard si venimos de otra fase que no sea 'result'
      selectedCard: prev.phase === 'result' ? prev.selectedCard : null,
    }));
  };

  const handleOpponentSelection = (data) => {
    console.log("Oponente selección:", data);
    
    // Crear un nuevo objeto de carta correctamente formateado
    const opponentCard = {
      id: data.data.carta.id.toString(),
      nombre: data.data.carta.nombre,
      alias: data.data.carta.alias || '',
      posicion: getPositionForOpponentCard(data.data.carta, gameState.opponentCards),
      posicionType: data.data.carta.posicion.toLowerCase(),
      photo: data.data.carta.photo,
      ataque: data.data.carta.ataque,
      defensa: data.data.carta.defensa,
      control: data.data.carta.control,
      equipo: data.data.carta.equipo,
      escudo: data.data.carta.escudo,
      pais: data.data.carta.pais,
      tipo_carta: data.data.carta.tipo_carta
    };
    
    // Mostrar alerta con la selección del oponente y la skill que debe usar
    setAlertMessage(`Oponente ha elegido: (${opponentCard.posicionType}) del ${opponentCard.equipo} - Skill: ${data.data.skill}. Debes usar la misma skill: ${data.data.skill}`);
    setShowAlert(true);
    
    // Ocultar la alerta después de 5 segundos
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
    
    setGameState(prev => ({
      ...prev,
      isPlayerTurn: true,
      opponentSelection: data,
      opponentCards: [...(prev.opponentCards || []), opponentCard]
    }));
  };

  const handleRoundResult = (data) => {
    console.log("Datos completos recibidos:", data);
    const { carta_j1, carta_j2 } = data.data.detalles;
    
    // IMPORTANTE: Guardar una referencia a la carta seleccionada antes de cualquier 
    // actualización de estado que podría borrarla
    const currentSelectedCard = gameState.selectedCard; 
    console.log("Carta seleccionada actual:", currentSelectedCard);
    
    // Si tenemos la carta seleccionada, la usamos para identificar
    let opponentCard;
    if (currentSelectedCard) {
      const myCardId = currentSelectedCard.id.toString();
      
      if (carta_j1.id.toString() === myCardId) {
        opponentCard = carta_j2;
        console.log("Nuestra carta es J1, oponente es J2");
      } else {
        opponentCard = carta_j1;
        console.log("Nuestra carta es J2, oponente es J1");
      }
    } else {
      // Fallback: si no tenemos selectedCard, intentamos adivinar
      console.warn("selectedCard es null, usando fallback");
      
      // Verificar si alguna de nuestras cartas coincide con carta_j1 o carta_j2
      const playerCardIds = gameState.playerCards.map(card => card.id);
      
      if (playerCardIds.includes(carta_j1.id.toString())) {
        opponentCard = carta_j2;
      } else {
        opponentCard = carta_j1;
      }
    }
    
    console.log("Carta J1:", carta_j1.id, carta_j1.nombre);
    console.log("Carta J2:", carta_j2.id, carta_j2.nombre);
    console.log("Opponent card elegida:", opponentCard);
    
    // Verificamos si la carta del oponente ya está en nuestra lista de cartas
    const opponentCardExists = gameState.opponentCards.some(
      card => card.id === opponentCard.id.toString()
    );
    
    if (opponentCardExists) {
      console.log("Esta carta del oponente ya existe en nuestra lista. No la añadimos de nuevo.");
      setGameState(prev => ({
        ...prev,
        phase: 'result',
        scores: data.data.scores,
        roundResult: data.data.ganador,
        opponentSelection: null,
        // No resetear selectedCard aquí
        selectedSkill: null,
      }));
    } else {
      // Formatear la carta del oponente correctamente
      const formattedOpponentCard = {
        id: opponentCard.id.toString(),
        nombre: opponentCard.nombre,
        alias: opponentCard.alias || '',
        posicion: getPositionForOpponentCard(opponentCard, gameState.opponentCards),
        posicionType: opponentCard.posicion.toLowerCase(),
        photo: opponentCard.photo,
        ataque: opponentCard.ataque,
        defensa: opponentCard.defensa,
        control: opponentCard.control,
        equipo: opponentCard.equipo,
        escudo: opponentCard.escudo,
        pais: opponentCard.pais,
        tipo_carta: opponentCard.tipo_carta
      };
  
      console.log("Añadiendo nueva carta del oponente:", formattedOpponentCard);
  
      setGameState(prev => ({
        ...prev,
        phase: 'result',
        scores: data.data.scores,
        roundResult: data.data.ganador,
        opponentSelection: null,
        // No resetear selectedCard aquí
        selectedSkill: null,
        opponentCards: [...(prev.opponentCards || []), formattedOpponentCard]
      }));
    }
    
    // Programar el cambio a la fase de selección después de mostrar el resultado
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        phase: 'selection',
        selectedCard: null,  // AHORA sí limpiamos selectedCard para la nueva ronda
        selectedSkill: null
      }));
    }, 3000); // Mostrar el resultado durante 3 segundos
  };

  const handleMatchEnd = (data) => {
    setGameState(prev => ({
      ...prev,
      phase: 'ended',
      scores: data.scores,
      winner: data.winner
    }));
  };

  const handleSurrender = () => { 
    socketService.surrender(matchId);
    navigate("/home");
  };

  // Estilos responsivos actualizados
  const containerStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    height: '100%',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    padding: '2%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '2vh'
  };

  const formationsContainerStyle = {
    display: 'flex',
    flexDirection: windowWidth < 768 ? 'column' : 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexGrow: 1,
    gap: '1rem',
    padding: '0.5rem'
  };

  const formationStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: windowWidth < 768 ? '1rem' : '0'
  };

  const playerNameStyle = {
    color: 'white',
    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
    marginBottom: '0.5rem',
    textAlign: 'center'
  };

  const skillsContainerStyle = {
    display: 'flex',
    flexDirection: windowWidth < 500 ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
    width: '100%'
  };

  const skillButtonStyle = {
    padding: '0.5rem',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
    width: windowWidth < 500 ? '100%' : 'auto'
  };

  const confirmButtonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#10b981',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
    marginTop: '1rem',
    width: windowWidth < 500 ? '100%' : 'auto'
  };

  const selectedCardStyle = {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    padding: '0.75rem',
    borderRadius: '8px',
    marginTop: '0.75rem',
    textAlign: 'center',
    color: 'white',
    width: windowWidth < 768 ? '90%' : '80%',
    maxWidth: '500px'
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    width: windowWidth < 768 ? '90%' : '80%',
    maxWidth: '500px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '1.5rem',
    borderRadius: '10px',
    color: 'white'
  };

  const surrenderButtonStyle = {
    position: 'fixed',
    bottom: '2vh',
    right: '2vw',
    padding: '0.75rem 1.5rem',
    fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
    backgroundColor: '#ef4444',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    zIndex: 100
  };

  const alertStyle = {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    color: 'white',
    padding: '15px 20px',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    animation: 'fadeInOut 4s ease-in-out',
    fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
    maxWidth: '90%',
    textAlign: 'center'
  };

  const backButtonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
    marginTop: '1rem',
    width: windowWidth < 500 ? '100%' : 'auto'
  };

  const contentContainerStyle = {
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
    width: '100%',
    height: '100%'
  };

  // Determinar si un botón de skill debe estar deshabilitado
  const isSkillDisabled = (skill) => {
    return gameState.opponentSelection && skill !== gameState.opponentSelection.data.skill;
  };

  const renderPhase = () => {
    switch (gameState.phase) {
      case 'waiting':
        return (
          <div style={modalStyle}>
            <h2 style={{
              fontSize: 'clamp(16px, 4vw, 24px)',
              color: 'white',
              marginBottom: '2vh'
            }}>Esperando al oponente...</h2>
            <p style={{
              fontSize: 'clamp(14px, 3vw, 20px)',
              color: 'rgba(255,255,255,0.8)'
            }}>Ronda {gameState.roundNumber}</p>
          </div>
        );
      
      case 'selection':
        return (
          <>
            <div style={formationsContainerStyle}>
              {/* Formación del jugador */}
              <div style={formationStyle}>
                <h3 style={playerNameStyle}>Tu equipo</h3>
                <Formacion433 
                  jugadores={gameState.availablePlayerCards} 
                  onJugadorClick={handleCardSelect}
                />
                
                {gameState.selectedCard && (
                  <div style={selectedCardStyle}>
                    <h4 style={{
                      fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)',
                      margin: '0.5rem 0'
                    }}>
                      Seleccionado: {gameState.selectedCard.nombre}
                    </h4>
                    <p style={{
                      fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
                      margin: '0.5rem 0'
                    }}>
                      Posición: {gameState.selectedCard.posicionType}
                    </p>
                    
                    <div style={skillsContainerStyle}>
                      <button 
                        style={{
                          ...skillButtonStyle,
                          backgroundColor: gameState.selectedSkill === 'ataque' ? '#0d6efd' : '#3b82f6',
                          opacity: isSkillDisabled('ataque') ? 0.5 : 1,
                          cursor: isSkillDisabled('ataque') ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => handleSkillSelect('ataque')}
                        disabled={isSkillDisabled('ataque')}
                      >
                        Ataque: {gameState.selectedCard.ataque}
                      </button>
                      <button 
                        style={{
                          ...skillButtonStyle,
                          backgroundColor: gameState.selectedSkill === 'defensa' ? '#0d6efd' : '#3b82f6',
                          opacity: isSkillDisabled('defensa') ? 0.5 : 1,
                          cursor: isSkillDisabled('defensa') ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => handleSkillSelect('defensa')}
                        disabled={isSkillDisabled('defensa')}
                      >
                        Defensa: {gameState.selectedCard.defensa}
                      </button>
                      <button 
                        style={{
                          ...skillButtonStyle,
                          backgroundColor: gameState.selectedSkill === 'control' ? '#0d6efd' : '#3b82f6',
                          opacity: isSkillDisabled('control') ? 0.5 : 1,
                          cursor: isSkillDisabled('control') ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => handleSkillSelect('control')}
                        disabled={isSkillDisabled('control')}
                      >
                        Control: {gameState.selectedCard.control}
                      </button>
                    </div>
                    
                    {gameState.selectedSkill && (
                      <button 
                        style={confirmButtonStyle}
                        onClick={handleConfirmSelection}
                      >
                        Confirmar {gameState.selectedSkill}
                      </button>
                    )}
                    
                    {gameState.opponentSelection && (
                      <p style={{
                        fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
                        margin: '1rem 0 0 0',
                        color: '#10b981',
                        fontWeight: 'bold'
                      }}>
                        Debes seleccionar: {gameState.opponentSelection.data.skill}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Formación del oponente */}
              <div style={formationStyle}>
                <h3 style={playerNameStyle}>Oponente</h3>
                <Formacion433 
                  jugadores={gameState.opponentCards} 
                  onJugadorClick={() => {}}
                />
                
                {gameState.opponentSelection && (
                  <div style={{
                    ...selectedCardStyle,
                    backgroundColor: 'rgba(185, 28, 28, 0.8)'
                  }}>
                    <h4 style={{
                      fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)',
                      margin: '0.5rem 0'
                    }}>
                      Oponente seleccionó: {gameState.opponentSelection.data.carta.nombre}
                    </h4>
                    <p style={{
                      fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
                      margin: '0.5rem 0',
                      fontWeight: 'bold'
                    }}>
                      Skill utilizada: {gameState.opponentSelection.data.skill}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        );
      
      case 'response':
        return (
          <div style={modalStyle}>
            <h2 style={{
              fontSize: 'clamp(16px, 4vw, 24px)',
              marginBottom: '1rem'
            }}>Esperando respuesta del oponente...</h2>
            <p style={{
              fontSize: 'clamp(14px, 3vw, 18px)',
            }}>Has seleccionado: {gameState.selectedCard.nombre} - {gameState.selectedSkill}</p>
          </div>
        );
      
      case 'result':
        return (
          <div style={modalStyle}>
            <h2 style={{
              fontSize: 'clamp(16px, 4vw, 24px)',
              marginBottom: '1rem'
            }}>Resultado de la ronda {gameState.roundNumber}</h2>
            <p style={{
              fontSize: 'clamp(14px, 3vw, 18px)',
              marginBottom: '0.5rem'
            }}>{gameState.roundResult}</p>
            <p style={{
              fontSize: 'clamp(14px, 3vw, 18px)',
              marginBottom: '0.5rem'
            }}>Tu puntuación: {gameState.scores.player}</p>
            <p style={{
              fontSize: 'clamp(14px, 3vw, 18px)',
            }}>Puntuación del oponente: {gameState.scores.opponent}</p>
          </div>
        );
      
      case 'ended':
        return (
          <div style={modalStyle}>
            <h2 style={{
              fontSize: 'clamp(16px, 4vw, 24px)',
              marginBottom: '1rem'
            }}>Partida terminada!</h2>
            <p style={{
              fontSize: 'clamp(14px, 3vw, 18px)',
              marginBottom: '0.5rem'
            }}>Ganador: {gameState.winner === 'player' ? '¡Has ganado!' : 'Has perdido'}</p>
            <p style={{
              fontSize: 'clamp(14px, 3vw, 18px)',
              marginBottom: '1rem'
            }}>Resultado final: {gameState.scores.player} - {gameState.scores.opponent}</p>
            <button 
              onClick={() => navigate('/home')}
              style={backButtonStyle}
            >
              Volver al inicio
            </button>
          </div>
        );
      
      default:
        return (
          <div style={{ 
            color: 'white',
            textAlign: 'center',
            fontSize: 'clamp(14px, 3vw, 18px)',
            padding: '2rem'
          }}>
            Cargando partida...
          </div>
        );
    }
  };

  return (
    <div style={containerStyle}>
      {/* Estilos globales para asegurar que el fondo ocupe toda la pantalla */}
      <style>
        {`
          html, body, #root {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
          }

          @keyframes fadeInOut {
            0% { opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>

      {/* Header con información de la partida */}
      <div style={headerStyle}>
        <div style={{ 
          width: '30%',
          minWidth: '80px' 
        }}>
          <h2 style={{
            fontSize: 'clamp(14px, 3vw, 20px)',
            color: 'white',
            textAlign: 'left',
            margin: '0'
          }}>Tú: {gameState.scores.player}</h2>
        </div>
        
        <div style={{ 
          width: '40%', 
          textAlign: 'center' 
        }}>
          <h1 style={{
            fontSize: 'clamp(16px, 3.5vw, 22px)',
            color: 'white',
            fontWeight: 'bold',
            margin: '0'
          }}>Ronda {gameState.roundNumber}/11</h1>
        </div>
        
        <div style={{ 
          width: '30%', 
          textAlign: 'right',
          minWidth: '80px'
        }}>
          <h2 style={{
            fontSize: 'clamp(14px, 3vw, 20px)',
            color: 'white',
            margin: '0'
          }}>Rival: {gameState.scores.opponent}</h2>
        </div>
      </div>

      {/* Contenido principal de la partida */}
      <div style={contentContainerStyle}>
        {renderPhase()}
      </div>

      {/* Botón de rendirse */}
      <button 
        onClick={handleSurrender}
        style={surrenderButtonStyle}
      >
        Rendirse
      </button>

      {showAlert && (
        <div style={alertStyle}>
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default Partida;