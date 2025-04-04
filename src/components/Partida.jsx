import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socketService } from '../services/websocket/socketService';
import background from "../assets/backgroundAlineacion.png";

const Partida = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  
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

    const mockPlayerCards = [
      { id: 1, nombre: 'Carta 1', ataque: 80, defensa: 70, control: 60, posicion: 'Delantero' },
      { id: 2, nombre: 'Carta 2', ataque: 70, defensa: 80, control: 50, posicion: 'Medio' },
      { id: 3, nombre: 'Carta 3', ataque: 60, defensa: 90, control: 70, posicion: 'Defensa' },
      { id: 4, nombre: 'Carta 4', ataque: 90, defensa: 60, control: 80, posicion: 'Delantero' },
      { id: 5, nombre: 'Carta 5', ataque: 50, defensa: 70, control: 90, posicion: 'Medio' },
    ];

    setGameState(prev => ({
      ...prev,
      playerCards: mockPlayerCards
    }));

    return () => {
      socketService.setOnRoundStart(null);
      socketService.setOnOpponentSelection(null);
      socketService.setOnRoundResult(null);
      socketService.setOnMatchEnd(null);
    };
  }, []);

  // Handlers de eventos (mantener los mismos que en tu código original)
  const handleRoundStart = (data) => { /* ... */ };
  const handleOpponentSelection = (data) => { /* ... */ };
  const handleRoundResult = (data) => { /* ... */ };
  const handleMatchEnd = (data) => { /* ... */ };
  const handleCardSelect = (cardId, skill) => { /* ... */ };
  const handleConfirmSelection = () => { /* ... */ };
  
  const handleSurrender = () => { 
    socketService.surrender(matchId);
    navigate("/home");
  };

  // Estilos para el layout
  const containerStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    width: '100vw',
    padding: '2%',
    boxSizing: 'border-box'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '2vh'
  };

  const scoreStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: '3vh'
  };

  const surrenderButtonStyle = {
    position: 'fixed',
    bottom: '3vh',
    right: '3vw',
    padding: '1.5vh 3vw',
    fontSize: 'clamp(12px, 2vw, 16px)'
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
            width: '80%'
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
          <div style={{
            width: '100%',
            marginTop: '2vh'
          }}>
            <h2 style={{
              fontSize: 'clamp(16px, 3.5vw, 22px)',
              color: 'white',
              textAlign: 'center',
              marginBottom: '2vh'
            }}>Selecciona una carta y habilidad</h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '2vw',
              padding: '0 2vw'
            }}>
              {gameState.playerCards.map(card => (
                <div 
                  key={card.id}
                  onClick={() => handleCardSelect(card.id, 'ataque')}
                  style={{
                    border: '2px solid',
                    borderColor: gameState.selectedCard === card.id ? '#3b82f6' : '#6b7280',
                    borderRadius: '8px',
                    padding: '1.5vh',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    backgroundColor: gameState.selectedCard === card.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(31, 41, 55, 0.7)',
                    color: 'white'
                  }}
                >
                  <h3 style={{
                    fontWeight: 'bold',
                    fontSize: 'clamp(12px, 2.5vw, 16px)',
                    marginBottom: '1vh'
                  }}>{card.nombre}</h3>
                  <p style={{ fontSize: 'clamp(10px, 2vw, 14px)' }}>Posición: {card.posicion}</p>
                  <p style={{ fontSize: 'clamp(10px, 2vw, 14px)' }}>Ataque: {card.ataque}</p>
                  <p style={{ fontSize: 'clamp(10px, 2vw, 14px)' }}>Defensa: {card.defensa}</p>
                  <p style={{ fontSize: 'clamp(10px, 2vw, 14px)' }}>Control: {card.control}</p>
                </div>
              ))}
            </div>
            
            {/* Resto del código de selección... */}
          </div>
        );
      
      // Resto de los casos (response, result, ended)...
      
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
        height: '70vh',
        overflowY: 'auto',
        padding: '0 2vw'
      }}>
        {renderPhase()}
      </div>

      {/* Botón de rendirse */}
      <button 
        onClick={handleSurrender}
        style={{
          ...surrenderButtonStyle,
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Rendirse
      </button>
    </div>
  );
};

export default Partida;