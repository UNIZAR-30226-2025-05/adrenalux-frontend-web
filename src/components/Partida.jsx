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
  
  const [gameState, setGameState] = useState({
    phase: 'waiting',
    roundNumber: 1,
    isPlayerTurn: false,
    opponentSelection: null,
    scores: { player: 0, opponent: 0 },
    playerCards: [],
    selectedCard: null,
    selectedSkill: null,
    timer: 30,
    matchInfo: null
  });

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
          matchInfo: { perfil, plantillas }
        }));
      } catch (error) {
        console.error("Error cargando perfil o plantillas:", error);
        setGameState(prev => ({
          ...prev,
          playerCards: [],
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
    
    setGameState(prev => ({
      ...prev,
      selectedSkill: skill
    }));
  };

  const handleConfirmSelection = () => {
    if (!gameState.selectedCard || !gameState.selectedSkill) return;
    
    // Enviar selección al servidor
    socketService.sendSelection({
      matchId,
      cardId: gameState.selectedCard.id,
      skill: gameState.selectedSkill
    });
    
    setGameState(prev => ({
      ...prev,
      phase: 'response'
    }));
  };

  const handleRoundStart = (data) => {
    console.log(data.dataConTurno)
    setGameState(prev => ({
      ...prev,
      phase: 'selection',
      roundNumber: data.dataConTurno.roundNumber,
      isPlayerTurn: data.dataConTurno.isPlayerTurn,
      timer: 30
    }));
  };

  const handleOpponentSelection = (data) => {
    setGameState(prev => ({
      ...prev,
      opponentSelection: data
    }));
  };

  const handleRoundResult = (data) => {
    setGameState(prev => ({
      ...prev,
      phase: 'result',
      scores: data.scores,
      roundResult: data.result
    }));
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

  const containerStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    width: '100vw',
    padding: '2%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '2vh'
  };

  const formationsContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    flexGrow: 1,
    gap: '2rem',
    padding: '1rem'
  };

  const formationStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const playerNameStyle = {
    color: 'white',
    fontSize: '1.5rem',
    marginBottom: '1rem',
    textAlign: 'center'
  };

  const skillsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem'
  };

  const skillButtonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: 'bold'
  };

  const confirmButtonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#10b981',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem',
    marginTop: '1rem'
  };

  const renderPhase = () => {
    switch (gameState.phase) {
      case 'waiting':
        return (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            width: '80%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '2rem',
            borderRadius: '10px'
          }}>
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
                  jugadores={gameState.playerCards} 
                  onJugadorClick={handleCardSelect}
                />
                
                {gameState.selectedCard && (
                  <div style={{ 
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginTop: '1rem',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <h4>Seleccionado: {gameState.selectedCard.nombre}</h4>
                    <p>Posición: {gameState.selectedCard.posicion}</p>
                    
                    <div style={skillsContainerStyle}>
                      <button 
                        style={skillButtonStyle}
                        onClick={() => handleSkillSelect('ataque')}
                      >
                        Ataque: {gameState.selectedCard.ataque}
                      </button>
                      <button 
                        style={skillButtonStyle}
                        onClick={() => handleSkillSelect('defensa')}
                      >
                        Defensa: {gameState.selectedCard.defensa}
                      </button>
                      <button 
                        style={skillButtonStyle}
                        onClick={() => handleSkillSelect('control')}
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
                  </div>
                )}
              </div>
              
              {/* Formación del oponente (vacía) */}
              <div style={formationStyle}>
                <h3 style={playerNameStyle}>Oponente</h3>
                <Formacion433 
                  jugadores={[]} 
                  onJugadorClick={() => {}}
                />
              </div>
            </div>
          </>
        );
      
      case 'response':
        return (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            width: '80%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '2rem',
            borderRadius: '10px',
            color: 'white'
          }}>
            <h2>Esperando respuesta del oponente...</h2>
            <p>Has seleccionado: {gameState.selectedCard.nombre} - {gameState.selectedSkill}</p>
          </div>
        );
      
      case 'result':
        return (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            width: '80%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '2rem',
            borderRadius: '10px',
            color: 'white'
          }}>
            <h2>Resultado de la ronda {gameState.roundNumber}</h2>
            <p>{gameState.roundResult}</p>
            <p>Tu puntuación: {gameState.scores.player}</p>
            <p>Puntuación del oponente: {gameState.scores.opponent}</p>
          </div>
        );
      
      case 'ended':
        return (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            width: '80%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '2rem',
            borderRadius: '10px',
            color: 'white'
          }}>
            <h2>Partida terminada!</h2>
            <p>Ganador: {gameState.winner === 'player' ? '¡Has ganado!' : 'Has perdido'}</p>
            <p>Resultado final: {gameState.scores.player} - {gameState.scores.opponent}</p>
            <button 
              onClick={() => navigate('/home')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                marginTop: '1rem'
              }}
            >
              Volver al inicio
            </button>
          </div>
        );
      
      default:
        return <div style={{ color: 'white' }}>Cargando partida...</div>;
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header con información de la partida */}
      <div style={headerStyle}>
        <div style={{ width: '30%' }}>
          <h2 style={{
            fontSize: 'clamp(14px, 3vw, 20px)',
            color: 'white',
            textAlign: 'left'
          }}>Tú: {gameState.scores.player}</h2>
        </div>
        
        <div style={{ width: '40%', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(16px, 3.5vw, 22px)',
            color: 'white',
            fontWeight: 'bold'
          }}>Ronda {gameState.roundNumber}/11</h1>
        </div>
        
        <div style={{ width: '30%', textAlign: 'right' }}>
          <h2 style={{
            fontSize: 'clamp(14px, 3vw, 20px)',
            color: 'white'
          }}>Rival: {gameState.scores.opponent}</h2>
        </div>
      </div>

      {/* Contenido principal de la partida */}
      <div style={{
        position: 'relative',
        flexGrow: 1
      }}>
        {renderPhase()}
      </div>

      {/* Botón de rendirse */}
      <button 
        onClick={handleSurrender}
        style={{
          position: 'fixed',
          bottom: '3vh',
          right: '3vw',
          padding: '1.5vh 3vw',
          fontSize: 'clamp(12px, 2vw, 16px)',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Rendirse
      </button>
      {showAlert && (
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        animation: 'fadeInOut 3s ease-in-out'
      }}>
        {alertMessage}
      </div>
      )}
      
    </div>
  );
};

export default Partida;