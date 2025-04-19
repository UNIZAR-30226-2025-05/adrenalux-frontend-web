/* eslint-disable react/no-unknown-property */
/* eslint-disable no-case-declarations */
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socketService } from '../services/websocket/socketService';
import background from "../assets/backgroundAlineacion.png";
import { getProfile } from "../services/api/profileApi"
import { obtenerPlantillas, obtenerCartasDePlantilla } from "../services/api/alineacionesApi"
import { getToken } from '../services/api/authApi';
import Formacion433 from '../components/layout/game/Formacion_4_3_3';
import CartaGrande from '../components/layout/game/CartaGrande'
import { motion } from "framer-motion";

const Partida = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const token = getToken();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const selectedCardRef = useRef(null);
  const opponentCardsRef = useRef([]);
  
  const [currentOpponentCard, setCurrentOpponentCard] = useState(null);
  console.log(currentOpponentCard);
  const [highlightedPosition, setHighlightedPosition] = useState(null);
  
  const [gameState, setGameState] = useState({
    phase: 'waiting',
    roundNumber: 1,
    isPlayerTurn: false,
    opponentSelection: null,
    mySelection: null,
    scores: { player: 0, opponent: 0 },
    playerCards: [],
    availablePlayerCards: [],
    opponentCards: [],
    selectedCard: null,
    selectedSkill: null,
    timer: 30,
    matchInfo: null
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Añadir este useEffect para monitorear cambios en las cartas del oponente
  useEffect(() => {
    console.log("Cartas del oponente actualizadas:", gameState.opponentCards);
    // Actualizar también el ref cuando cambia el estado
    opponentCardsRef.current = gameState.opponentCards;
  }, [gameState.opponentCards]);

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
    
    // Verificar si necesitamos validar la posición
    if (highlightedPosition && data.jugador.posicionType.toLowerCase() !== highlightedPosition.toLowerCase()) {
      setAlertMessage(`Debes seleccionar una carta de posición: ${highlightedPosition}`);
      setShowAlert(true);
      
      // Ocultar la alerta después de 3 segundos
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      
      return;
    }
  
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

  const isSkillDisabled = () => {
    return false;
  };

  // Modificada la función handleConfirmSelection para guardar la referencia
  const handleConfirmSelection = () => {
    if (!gameState.selectedCard || !gameState.selectedSkill) return;
    
    console.log("Confirmando selección:", gameState.selectedCard);
    
    // Guardar la referencia a la carta seleccionada - IMPORTANTE
    selectedCardRef.current = {...gameState.selectedCard};
    
    // Verificar que la posición coincida con la del oponente
    if (highlightedPosition && 
        gameState.selectedCard.posicionType.toLowerCase() !== highlightedPosition.toLowerCase()) {
      
      setAlertMessage(`Debes elegir una carta de posición ${highlightedPosition}`);
      setShowAlert(true);
      
      // Ocultar la alerta después de 3 segundos
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      
      return; // No continuar si la posición no coincide
    }
    
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
    
    // Guarda la selección actual en el estado y en el ref
    setGameState(prev => ({
      ...prev,
      phase: 'response',
      availablePlayerCards: updatedAvailableCards,
      mySelection: gameState.selectedCard
    }));
    
    // Limpiar la posición destacada después de enviar la selección
    setHighlightedPosition(null);
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
    // Limpiar variables temporales al inicio de cada ronda
    setCurrentOpponentCard(null);
    setHighlightedPosition(null);
    
    // Usar directamente la referencia para un valor más confiable
    console.log("Carta seleccionada previa (ref):", selectedCardRef.current);
    console.log("Carta seleccionada previa (estado):", gameState.mySelection);
    console.log("Cartas del oponente actuales (ref):", opponentCardsRef.current);
    
    setGameState(prev => ({
      ...prev,
      phase: 'selection',
      roundNumber: data.dataConTurno.roundNumber,
      isPlayerTurn: data.dataConTurno.isPlayerTurn,
      timer: 30,
      selectedSkill: null,
      opponentSelection: null,
      // IMPORTANTE: Preservar explícitamente las cartas del oponente entre rondas
      // usando tanto el estado previo como el ref para mayor seguridad
      opponentCards: prev.opponentCards.length > 0 ? prev.opponentCards : opponentCardsRef.current
    }));
  };

  // Arreglo para handleOpponentSelection: Guardamos la información de la carta seleccionada
const handleOpponentSelection = (data) => {
  // Verificar el valor de la referencia
  console.log("Carta seleccionada previa (ref):", selectedCardRef.current);
  console.log("Carta seleccionada previa (estado):", gameState.mySelection);
  
  // Obtener las cartas actuales del oponente desde el ref para mayor seguridad
  const currentOpponentCards = opponentCardsRef.current.length > 0 
    ? [...opponentCardsRef.current] 
    : [...gameState.opponentCards];
  
  // Crear un nuevo objeto de carta correctamente formateado
  const opponentCard = {
    id: data.data.carta.id.toString(),
    nombre: data.data.carta.nombre,
    alias: data.data.carta.alias || '',
    posicion: getPositionForOpponentCard(data.data.carta, currentOpponentCards),
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
  
  // Guardar la carta en la variable temporal
  setCurrentOpponentCard(opponentCard);
  
  // Guardar la posición requerida para la respuesta
  setHighlightedPosition(data.data.carta.posicion);
  
  // Verificar si esta carta ya existe en las cartas del oponente
  const opponentCardExists = currentOpponentCards.some(
    card => card.id === opponentCard.id
  );
  
  let updatedOpponentCards = currentOpponentCards;
  
  // Solo añadimos la carta a la lista si no existe ya
  if (!opponentCardExists) {
    updatedOpponentCards = [...currentOpponentCards, opponentCard];
  }
  
  // Actualizar también el ref de las cartas del oponente
  opponentCardsRef.current = updatedOpponentCards;
  
  // Modificar el mensaje para indicar que debe elegir la misma posición
  setAlertMessage(`Oponente ha elegido: ${data.data.carta.posicion} - Debes elegir una carta de la misma posición`);
  setShowAlert(true);
  
  // Ocultar la alerta después de 5 segundos
  setTimeout(() => {
    setShowAlert(false);
  }, 5000);
  
  setGameState(prev => ({
    ...prev,
    isPlayerTurn: true,
    opponentSelection: data,
    // Añadir esta carta del oponente al estado
    opponentSelectedCard: opponentCard,
    opponentSelectedSkill: data.data.skill
  }));
};

const handleRoundResult = (data) => {
  const { carta_j1, carta_j2, habilidad_j1, habilidad_j2 } = data.data.detalles;
  
  // Limpiar la carta temporal y la posición destacada cuando se muestra el resultado
  setCurrentOpponentCard(null);
  setHighlightedPosition(null);
  
  // IMPORTANTE: Usar la referencia guardada para identificar la carta jugada
  const myCard = selectedCardRef.current;
  console.log("Carta seleccionada desde ref:", myCard);
  
  // Si tenemos la carta en la referencia, la usamos para identificar
  let opponentCard, opponentSkill, mySkill;
  
  if (myCard) {
    const myCardId = myCard.id.toString();
    
    if (carta_j1.id.toString() === myCardId) {
      opponentCard = carta_j2;
      mySkill = habilidad_j1;
      opponentSkill = habilidad_j2;
    } else {
      opponentCard = carta_j1;
      mySkill = habilidad_j2;
      opponentSkill = habilidad_j1;
    }
  } else {
    // Fallback: si no tenemos selectedCard en ref, intentamos con el estado
    console.warn("selectedCardRef es null, usando gameState.selectedCard como fallback");
    
    if (gameState.selectedCard) {
      const myStateCardId = gameState.selectedCard.id.toString();
      
      if (carta_j1.id.toString() === myStateCardId) {
        opponentCard = carta_j2;
        mySkill = habilidad_j1;
        opponentSkill = habilidad_j2;
      } else {
        opponentCard = carta_j1;
        mySkill = habilidad_j2;
        opponentSkill = habilidad_j1;
      }
    } else {
      // Último recurso: verificar si alguna de nuestras cartas coincide
      console.warn("Usando fallback de verificación de IDs");
      const playerCardIds = gameState.playerCards.map(card => card.id);
      
      if (playerCardIds.includes(carta_j1.id.toString())) {
        opponentCard = carta_j2;
        mySkill = habilidad_j1;
        opponentSkill = habilidad_j2;
      } else {
        opponentCard = carta_j1;
        mySkill = habilidad_j2;
        opponentSkill = habilidad_j1;
      }
    }
  }

  console.log("Opponent card elegida:", opponentCard);
  
  // IMPORTANTE: Obtener una copia actualizada del estado actual usando el ref para mayor seguridad
  const currentOpponentCards = opponentCardsRef.current.length > 0 
    ? [...opponentCardsRef.current] 
    : [...gameState.opponentCards];
  
  // Verificamos si la carta del oponente ya está en nuestra lista de cartas
  const opponentCardExists = currentOpponentCards.some(
    card => card.id === opponentCard.id.toString()
  );
  
  let updatedOpponentCards = currentOpponentCards;
  
  if (!opponentCardExists) {
    // Formatear la carta del oponente correctamente
    const formattedOpponentCard = {
      id: opponentCard.id.toString(),
      nombre: opponentCard.nombre,
      alias: opponentCard.alias || '',
      posicion: getPositionForOpponentCard(opponentCard, currentOpponentCards),
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
    console.log("Lista actual de cartas del oponente:", currentOpponentCards);
    
    // Crear un nuevo array para las cartas del oponente
    updatedOpponentCards = [...currentOpponentCards, formattedOpponentCard];
  }

  // Actualizar también el ref de las cartas del oponente
  opponentCardsRef.current = updatedOpponentCards;
  
  // Registrar el estado de las cartas para debug
  console.log("Cartas del oponente actualizadas:", updatedOpponentCards);

  // Formatear la carta del oponente para mostrarla en el resultado
  const formattedOpponentCardForResult = {
    id: opponentCard.id.toString(),
    nombre: opponentCard.nombre,
    alias: opponentCard.alias || '',
    posicion: getPositionForOpponentCard(opponentCard, currentOpponentCards),
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

  setGameState(prev => ({
    ...prev,
    phase: 'result',
    scores: data.data.scores,
    roundResult: data.data.ganador,
    opponentSelection: null,
    selectedSkill: mySkill || prev.selectedSkill,
    // Guardar la información para mostrar el resultado
    opponentSelectedCard: formattedOpponentCardForResult,
    opponentSelectedSkill: opponentSkill,
    // IMPORTANTE: Asegurarnos de usar la lista actualizada de cartas del oponente
    opponentCards: updatedOpponentCards
  }));
  
  // Programar el cambio a la fase de selección después de mostrar el resultado
  setTimeout(() => {
    // SOLO limpiar la carta seleccionada, pero MANTENER las cartas del oponente
    selectedCardRef.current = null;
    
    setGameState(prev => ({
      ...prev,
      phase: 'selection',
      selectedCard: null,
      selectedSkill: null,
      // IMPORTANTE: Preservar explícitamente las cartas del oponente
      opponentCards: updatedOpponentCards 
    }));
  }, 3000); // Mostrar el resultado durante 3 segundos
};

  const handleMatchEnd = (data) => {
    // Limpiar variables temporales al finalizar el partido
    setCurrentOpponentCard(null);
    setHighlightedPosition(null);
    
    setGameState(prev => ({
      ...prev,
      phase: 'ended',
      scores: data.scores,
      winner: data.winner,
      // IMPORTANTE: Preservar las cartas del oponente incluso al final del partido
      opponentCards: prev.opponentCards
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
    textAlign: 'center',
    fontWeight: 'bold'
  };

  const skillsContainerStyle = {
    display: 'flex',
    flexDirection: windowWidth < 500 ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '1rem',
    width: '100%'
  };

  const skillButtonStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
    width: windowWidth < 500 ? '100%' : 'auto',
    transition: 'all 0.2s ease'
  };

  const confirmButtonStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#10b981',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
    marginTop: '1.5rem',
    width: windowWidth < 500 ? '100%' : 'auto',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.2s ease'
  };

  const selectedCardContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    padding: '1rem',
    borderRadius: '10px',
    marginTop: '1rem',
    width: windowWidth < 768 ? '95%' : '90%',
    maxWidth: '600px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
  };
  
  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    width: windowWidth < 768 ? '90%' : '80%',
    maxWidth: '800px',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: '2rem',
    borderRadius: '15px',
    color: 'white',
    zIndex: 100,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)'
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
    zIndex: 100,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.2s ease'
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
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
    marginTop: '1.5rem',
    width: windowWidth < 500 ? '100%' : 'auto',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.2s ease'
  };

  const contentContainerStyle = {
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
    width: '100%',
    height: '100%'
  };

  const renderPhase = () => {
    switch (gameState.phase) {
      case 'waiting':
        return (
          <motion.div 
            style={modalStyle}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              color: 'white',
              marginBottom: '2vh'
            }}>Esperando al oponente...</h2>
            <p style={{
              fontSize: 'clamp(16px, 3vw, 22px)',
              color: 'rgba(255,255,255,0.9)'
            }}>Ronda {gameState.roundNumber}</p>
            <div style={{ marginTop: '2rem' }}>
              <div className="loader" style={{
                border: '5px solid rgba(255,255,255,0.2)',
                borderTop: '5px solid #3b82f6',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
            </div>
          </motion.div>
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
                  <motion.div 
                    style={selectedCardContainerStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CartaGrande jugador={gameState.selectedCard} />
                    
                    <div style={skillsContainerStyle}>
                      <button 
                        style={{
                          ...skillButtonStyle,
                          backgroundColor: gameState.selectedSkill === 'ataque' ? '#0d6efd' : '#3b82f6',
                          opacity: isSkillDisabled('ataque') ? 0.5 : 1,
                          cursor: isSkillDisabled('ataque') ? 'not-allowed' : 'pointer',
                          transform: gameState.selectedSkill === 'ataque' ? 'scale(1.05)' : 'scale(1)'
                        }}
                        onClick={() => handleSkillSelect('ataque')}
                        disabled={isSkillDisabled('ataque')}
                      >
                        Ataque
                      </button>
                      <button 
                        style={{
                          ...skillButtonStyle,
                          backgroundColor: gameState.selectedSkill === 'control' ? '#0d6efd' : '#3b82f6',
                          opacity: isSkillDisabled('control') ? 0.5 : 1,
                          cursor: isSkillDisabled('control') ? 'not-allowed' : 'pointer',
                          transform: gameState.selectedSkill === 'control' ? 'scale(1.05)' : 'scale(1)'
                        }}
                        onClick={() => handleSkillSelect('control')}
                        disabled={isSkillDisabled('control')}
                      >
                        Control
                      </button>
                      <button 
                        style={{
                          ...skillButtonStyle,
                          backgroundColor: gameState.selectedSkill === 'defensa' ? '#0d6efd' : '#3b82f6',
                          opacity: isSkillDisabled('defensa') ? 0.5 : 1,
                          cursor: isSkillDisabled('defensa') ? 'not-allowed' : 'pointer',
                          transform: gameState.selectedSkill === 'defensa' ? 'scale(1.05)' : 'scale(1)'
                        }}
                        onClick={() => handleSkillSelect('defensa')}
                        disabled={isSkillDisabled('defensa')}
                      >
                        Defensa
                      </button>
                    </div>
                    
                    {gameState.selectedSkill && (
                      <motion.button 
                        style={confirmButtonStyle}
                        onClick={handleConfirmSelection}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Confirmar {gameState.selectedSkill}
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </div>
              
              {/* Formación del oponente */}
              <div style={formationStyle}>
                <h3 style={playerNameStyle}>Oponente</h3>
                <Formacion433 
                  jugadores={gameState.opponentCards} 
                  onJugadorClick={() => {}}
                  highlightPositionType={highlightedPosition}
                />
                
              </div>
            </div>
          </>
        );
      
        case 'response':
          return (
            <motion.div 
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                textAlign: 'center',
                color: 'white',
                width: '90%',
                maxWidth: '450px',
                zIndex: 1000
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 style={{
                fontSize: 'clamp(18px, 4vw, 26px)',
                marginBottom: '1.5rem'
              }}>Esperando respuesta del oponente...</h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{
                  fontSize: 'clamp(16px, 3vw, 20px)',
                }}>Has seleccionado:</p>
                
                <div style={{ 
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <div style={{ maxWidth: '250px' }}>
                    <CartaGrande jugador={gameState.selectedCard} />
                    <div style={{ 
                      marginTop: '0.5rem',
                      fontWeight: 'bold',
                      backgroundColor: '#0d6efd',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      display: 'inline-block'
                    }}>
                      {gameState.selectedSkill.charAt(0).toUpperCase() + gameState.selectedSkill.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <div className="loader" style={{
                  border: '5px solid rgba(255,255,255,0.2)',
                  borderTop: '5px solid #3b82f6',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }}></div>
                <style jsx>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            </motion.div>
          );
      
        case 'result':
          // Verificaciones seguras de los datos
          // eslint-disable-next-line no-case-declarations
          const playerWon = gameState.roundResult?.includes("ganado") || false;
          // eslint-disable-next-line no-case-declarations
          const tie = gameState.roundResult?.includes("empate") || false;
          // eslint-disable-next-line no-case-declarations
          const playerScore = gameState.scores?.player || 0;
          console.log(playerScore);
          const opponentScore = gameState.scores?.opponent || 0;
          console.log(opponentScore);
          
          // Datos de la carta del jugador con valores por defecto
          const playerCard = gameState.selectedCard || {
            alias: "Carta no disponible",
            ataque: 0,
            defensa: 0,
            control: 0,
            photo: "",
            escudo: "",
            equipo: "",
            tipo_carta: "Normal"
          };
          
          const playerSkill = gameState.selectedSkill || "none";
          const playerSkillValue = playerCard[playerSkill] || 0;
          console.log(playerSkillValue);
          
          // Datos de la carta del oponente con valores por defecto
          const opponentCard = gameState.opponentSelectedCard || {
            alias: "Carta oponente no disponible",
            ataque: 0,
            defensa: 0,
            control: 0,
            photo: "",
            escudo: "",
            equipo: "",
            tipo_carta: "Normal"
          };
          
          const opponentSkill = gameState.opponentSelectedSkill || "none";
          const opponentSkillValue = opponentCard[opponentSkill] || 0;
          console.log(opponentSkillValue);

          return (
            <motion.div 
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: windowWidth < 768 ? '95%' : '85%',
                maxWidth: '800px',
                backgroundColor: 'rgba(31, 41, 55, 0.95)',
                padding: '2rem',
                borderRadius: '15px',
                color: 'white',
                zIndex: 100,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Contenido del modal */}
              <h2 style={{
                fontSize: 'clamp(18px, 4vw, 26px)',
                marginBottom: '1.5rem',
                color: 'white',
                width: '100%'
              }}>
                Resultado de la ronda {gameState.roundNumber}
              </h2>
              
              {/* Contenedor de cartas */}
              <div style={{
                display: 'flex',
                flexDirection: windowWidth < 768 ? 'column' : 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2rem',
                width: '100%',
                margin: '1rem 0'
              }}>
                {/* Tu carta */}
                <div style={{ 
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  {/* ... (mantén el contenido de tu carta) */}
                </div>
                
                {/* VS (solo en desktop) */}
                {windowWidth >= 768 && (
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    VS
                  </div>
                )}
                
                {/* Carta oponente */}
                <div style={{ 
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  {/* ... (mantén el contenido de la carta oponente) */}
                </div>
              </div>
              
              {/* Resultado */}
              <motion.div 
                style={{ 
                  marginTop: '1rem',
                  padding: '1rem',
                  width: '100%',
                  backgroundColor: tie ? '#f59e0b' : (playerWon ? '#10b981' : '#ef4444'),
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {/* ... (mantén el texto de resultado) */}
              </motion.div>
              
              {/* Marcador */}
              <div style={{ 
                marginTop: '1.5rem',
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
                maxWidth: '300px'
              }}>
                {/* ... (mantén el marcador) */}
              </div>
              
              {/* Botón siguiente */}
              <motion.button 
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                  marginTop: '2rem',
                  width: 'auto',
                  minWidth: '200px'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Siguiente ronda
              </motion.button>
            </motion.div>
          );
      
      case 'ended':
        const finalWin = gameState.winner === 'player';
        
        return (
          <motion.div 
            style={{
              ...modalStyle,
              backgroundColor: finalWin ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              style={{
                fontSize: 'clamp(22px, 5vw, 32px)',
                marginBottom: '1.5rem',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {finalWin ? '¡Victoria!' : 'Derrota'}
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p style={{
                fontSize: 'clamp(16px, 3vw, 22px)',
                marginBottom: '1.5rem',
                fontWeight: 'bold'
              }}>
                {finalWin ? '¡Has ganado la partida!' : 'Has perdido la partida'}
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2rem',
                margin: '2rem 0',
                padding: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '10px'
              }}>
                <div style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  fontWeight: 'bold'
                }}>
                  {gameState.scores.player}
                </div>
                <div style={{
                  fontSize: 'clamp(16px, 3vw, 22px)',
                }}>
                  -
                </div>
                <div style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  fontWeight: 'bold'
                }}>
                  {gameState.scores.opponent}
                </div>
              </div>
            </motion.div>
            
            <motion.button 
              onClick={() => navigate('/home')}
              style={{
                ...backButtonStyle,
                backgroundColor: 'white',
                color: finalWin ? '#10b981' : '#ef4444',
                fontWeight: 'bold',
                padding: '0.75rem 2rem'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Volver al inicio
            </motion.button>
          </motion.div>
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
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Header con información de la partida */}
      <div style={headerStyle}>
        <div style={{ 
          width: '30%',
          minWidth: '80px' 
        }}>
          <motion.h2 
            style={{
              fontSize: 'clamp(14px, 3vw, 20px)',
              color: 'white',
              textAlign: 'left',
              margin: '0',
              padding: '5px 10px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '5px',
              display: 'inline-block'
            }}
            animate={{ 
              backgroundColor: gameState.scores.player > gameState.scores.opponent ? 
                'rgba(16, 185, 129, 0.7)' : 'rgba(0, 0, 0, 0.5)' 
            }}
            transition={{ duration: 0.3 }}
          >
            Tú: {gameState.scores.player}
          </motion.h2>
        </div>
        
        <div style={{ 
          width: '40%', 
          textAlign: 'center' 
        }}>
          <motion.h1 
            style={{
              fontSize: 'clamp(16px, 3.5vw, 22px)',
              color: 'white',
              fontWeight: 'bold',
              margin: '0',
              padding: '5px 15px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '8px',
              display: 'inline-block'
            }}
          >
            Ronda {gameState.roundNumber}/11
          </motion.h1>
        </div>
        
        <div style={{ 
          width: '30%', 
          textAlign: 'right',
          minWidth: '80px'
        }}>
          <motion.h2 
            style={{
              fontSize: 'clamp(14px, 3vw, 20px)',
              color: 'white',
              margin: '0',
              padding: '5px 10px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '5px',
              display: 'inline-block'
            }}
            animate={{ 
              backgroundColor: gameState.scores.opponent > gameState.scores.player ? 
                'rgba(239, 68, 68, 0.7)' : 'rgba(0, 0, 0, 0.5)' 
            }}
            transition={{ duration: 0.3 }}
          >
            Rival: {gameState.scores.opponent}
          </motion.h2>
        </div>
      </div>

      {/* Contenido principal de la partida */}
      <div style={contentContainerStyle}>
        {renderPhase()}
      </div>

      {/* Botón de rendirse */}
      <motion.button 
        onClick={handleSurrender}
        style={surrenderButtonStyle}
        whileHover={{ scale: 1.05, backgroundColor: '#e11d48' }}
        whileTap={{ scale: 0.95 }}
      >
        Rendirse
      </motion.button>

      {showAlert && (
        <div style={alertStyle}>
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default Partida;