/* eslint-disable react/no-unknown-property */
/* eslint-disable no-case-declarations */
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation  } from "react-router-dom";
import { socketService } from "../services/websocket/socketService";
import background from "../assets/backgroundAlineacion.png";
import { getProfile } from "../services/api/profileApi";
import {
  obtenerPlantillas,
  obtenerCartasDePlantilla,
} from "../services/api/alineacionesApi";
import { getToken } from "../services/api/authApi";
import { jwtDecode } from "jwt-decode";
import Formacion433 from "../components/layout/game/Formacion_4_3_3";
import CartaGrande from "../components/layout/game/CartaGrande";
import CartaMediana from "../components/layout/game/CartaMediana";

import { motion } from "framer-motion";
import ModalWrapper from "../components/layout/game/ModalWrapper";

import { FaPause, FaPlay, FaFlag, FaHome, FaCog } from "react-icons/fa";
import {
  GiSwordman,
  GiSwordsPower,
  GiSwordWound,
  GiSwordwoman,
} from "react-icons/gi";

document.body.style.overflow = "auto"; 

const Partida = () => {
  const nextRoundStartRef = useRef(null);

  const waitingNextRoundRef = useRef(false);
  const { matchId } = useParams();
  const navigate = useNavigate();
  const token = getToken();
  const { id: jugadorId } = jwtDecode(token);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showMenu, setShowMenu] = useState(false);
  const isDesktop = windowWidth >= 1024;
  
  const selectedCardRef = useRef(null);
  const opponentCardsRef = useRef([]);

  const location = useLocation();
  const isTournamentMatch = location.state?.tournamentMatch || false;

  const [showPausedMenu, setShowPausedMenu] = useState(false);
  const [pausedMatches, setPausedMatches] = useState([]);
  const [loadingPaused, setLoadingPaused] = useState(false);
  const handleShowPausedMenu = async () => {
    setLoadingPaused(true);
    setShowPausedMenu(true);
    try {
      const matches = await getPartidasPausadas(token);
      setPausedMatches(matches);
    } catch (err) {
      setAlertMessage("Error cargando partidas pausadas");
      setShowAlert(true);
    }
    setLoadingPaused(false);
  };

  const [currentOpponentCard, setCurrentOpponentCard] = useState(null);
  console.log(currentOpponentCard);
  const [highlightedPosition, setHighlightedPosition] = useState(null);
  const handlePause = () => {
    console.log("Pausa solicitada");
    socketService.pause(matchId);
    setShowMenu(false);
  };
  const handleResume = () => {
    socketService.resumeMatch(matchId);
    setShowMenu(false);
  };

  // 1) CALLBACKS DE PAUSA / REANUDAR
  useEffect(() => {
    socketService.setOnMatchPaused(() => {
      setGameState((prev) => ({ ...prev, phase: "paused" }));
    });

    socketService.setOnMatchResumed(() => {
      setGameState((prev) => ({ ...prev, phase: "selection" }));
    });

    socketService.setOnMatchEnd((payload) => {
      setGameState((prev) => ({
        ...prev,
        phase: "ended",
        scores: payload.scores,
        winner: payload.winner,
        puntosDelta: payload.puntosDelta,
      }));
    });
  }, []);

  const [gameState, setGameState] = useState({
    phase: "waiting",
    roundNumber: 1,
    isPlayerTurn: false,
    scores: { player: 0, opponent: 0 },
    playerCards: [],
    availablePlayerCards: [],
    opponentCards: [],
    selectedCard: null,
    selectedSkill: null,
    opponentSelectedCard: null,
    opponentSelectedSkill: null,
    matchInfo: null,
    winner: null,
  });
  useEffect(() => setShowMenu(false), [gameState.phase]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    socketService.setOnMatchEnd((payload) => {
      setGameState((prev) => ({
        ...prev,
        phase: "ended",
        scores: payload.scores,
        winner: payload.winner,
        puntosDelta: payload.puntosDelta,
      }));
    });
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

        const jugadores_plantilla = await obtenerCartasDePlantilla(
          plantilla_activa.id,
          token
        );

        // Mapear las cartas al formato compatible
        const playerCards = Array.isArray(jugadores_plantilla?.data)
          ? (() => {
              const counters = {
                forward: 0,
                midfielder: 0,
                defender: 0,
                goalkeeper: 0,
              };

              return jugadores_plantilla.data.map((jugador) => {
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
                  tipo_carta: jugador.tipo_carta,
                };
              });
            })()
          : [];

        setGameState((prev) => ({
          ...prev,
          playerCards,
          availablePlayerCards: [...playerCards],
          matchInfo: { perfil, plantillas },
        }));
      } catch (error) {
        console.error("Error cargando perfil o plantillas:", error);
        setGameState((prev) => ({
          ...prev,
          playerCards: [],
          availablePlayerCards: [],
          matchInfo: null,
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
    if (!gameState.isPlayerTurn || gameState.phase !== "selection") {
      setAlertMessage("¡No es tu turno!");
      setShowAlert(true);

      // Ocultar la alerta después de 3 segundos
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return;
    }

    // Verificar si necesitamos validar la posición
    if (
      highlightedPosition &&
      data.jugador.posicionType.toLowerCase() !==
        highlightedPosition.toLowerCase()
    ) {
      setAlertMessage(
        `Debes seleccionar una carta de posición: ${highlightedPosition}`
      );
      setShowAlert(true);

      // Ocultar la alerta después de 3 segundos
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return;
    }

    setGameState((prev) => ({
      ...prev,
      selectedCard: data.jugador,
      selectedSkill: null, // Resetear habilidad al seleccionar nueva carta
    }));
  };

  const handleSkillSelect = (skill) => {
    if (!gameState.selectedCard) return;

    setGameState((prev) => ({
      ...prev,
      selectedSkill: skill,
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
    selectedCardRef.current = { ...gameState.selectedCard };

    // Verificar que la posición coincida con la del oponente
    if (
      highlightedPosition &&
      gameState.selectedCard.posicionType.toLowerCase() !==
        highlightedPosition.toLowerCase()
    ) {
      setAlertMessage(
        `Debes elegir una carta de posición ${highlightedPosition}`
      );
      setShowAlert(true);

      // Ocultar la alerta después de 3 segundos
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return; // No continuar si la posición no coincide
    }

    const updatedAvailableCards = gameState.availablePlayerCards.filter(
      (card) => card.id !== gameState.selectedCard.id
    );

    if (gameState.opponentSelection == null) {
      socketService.selectCardMatch({
        cartaId: gameState.selectedCard.id,
        skill: gameState.selectedSkill,
      });
    } else {
      socketService.selectResponse({
        cartaId: gameState.selectedCard.id,
        skill: gameState.selectedSkill,
      });
    }

    // Guarda la selección actual en el estado y en el ref
    setGameState((prev) => ({
      ...prev,
      phase: "response",
      availablePlayerCards: updatedAvailableCards,
      mySelection: { ...gameState.selectedCard }, //
    }));
    selectedCardRef.current = { ...gameState.selectedCard };

    // Limpiar la posición destacada después de enviar la selección
    setHighlightedPosition(null);
  };

  // Función para asignar posiciones específicas a las cartas del oponente
  const getPositionForOpponentCard = (carta, existingCards) => {
    const posicionLower = carta.posicion.toLowerCase();
    const existingPositions = existingCards
      ? existingCards.map((card) => card.posicion)
      : [];

    // Contadores para cada tipo de posición
    const counters = {
      forward: 0,
      midfielder: 0,
      defender: 0,
      goalkeeper: 0,
    };

    // Contar las posiciones ya asignadas
    existingPositions.forEach((pos) => {
      if (pos.startsWith("forward")) counters.forward++;
      else if (pos.startsWith("midfielder")) counters.midfielder++;
      else if (pos.startsWith("defender")) counters.defender++;
      else if (pos.startsWith("goalkeeper")) counters.goalkeeper++;
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

  const [showTurnBanner, setShowTurnBanner] = useState(false);

  /*const handleRoundStart = (data) => {
    // Si seguimos en “result” bloqueamos este evento
    if (waitingNextRoundRef.current) return;

    // Limpiar cualquier carta u posición pendiente
    setCurrentOpponentCard(null);
    setHighlightedPosition(null);

    // Pasar a selección y resetear mySelection
    setGameState((prev) => ({
      ...prev,
      phase: dataConTurno.isPlayerTurn ? "selection" : "waiting",
      roundNumber: data.dataConTurno.roundNumber,
      isPlayerTurn: data.dataConTurno.isPlayerTurn,
      timer: 30,
      selectedSkill: null,
      opponentSelection: null,
      opponentCards:
        prev.opponentCards.length > 0
          ? prev.opponentCards
          : opponentCardsRef.current,
      mySelection: null, // ← borramos la selección anterior
    }));

    // Mostrar banner brevemente
    setShowTurnBanner(true);
    setTimeout(() => setShowTurnBanner(false), 1500);
  };*/

  /*const handleRoundStart = ({ dataConTurno } = {}) => {
    // si no viene o seguimos en “result”, no hacemos nada
    if (!dataConTurno || waitingNextRoundRef.current) return;

    // limpiar cualquier carta u posición pendiente
    setCurrentOpponentCard(null);
    setHighlightedPosition(null);

    // bloquear para que no procese un nuevo start hasta que hagas “Continuar”
    waitingNextRoundRef.current = false;

    // pasamos a selección solamente si es tu turno, si no, a waiting
    setGameState((prev) => ({
      ...prev,
      phase: dataConTurno.isPlayerTurn ? "selection" : "waiting",
      roundNumber: dataConTurno.roundNumber,
      isPlayerTurn: dataConTurno.isPlayerTurn,
      timer: 30,
      selectedSkill: null,
      opponentSelection: null,
      // si nunca ha llegado carta de oponente, recupera del ref
      opponentCards:
        prev.opponentCards.length > 0
          ? prev.opponentCards
          : opponentCardsRef.current,
      mySelection: null, // limpiamos selección anterior
    }));

    // banner de turno
    setShowTurnBanner(true);
    setTimeout(() => setShowTurnBanner(false), 1500);
  };*/

  /*const handleRoundStart = (payload) => {
    const turno = payload.dataConTurno;
    if (!turno) return;

    // Si estoy mostrando el resultado, encolo y salgo
    if (gameState.phase === "result") {
      nextRoundStartRef.current = payload;
      return;
    }

    // Si no, borro cualquier start pendiente y proceso normalmente
    nextRoundStartRef.current = null;

    setCurrentOpponentCard(null);
    setHighlightedPosition(null);

    setGameState((prev) => ({
      ...prev,
      phase: turno.isPlayerTurn ? "selection" : "waiting",
      roundNumber: turno.roundNumber,
      isPlayerTurn: turno.isPlayerTurn,
      timer: 30,
      selectedSkill: null,
      opponentSelection: null,
      mySelection: null,
      opponentCards: prev.opponentCards.length
        ? prev.opponentCards
        : opponentCardsRef.current,
    }));

    setShowTurnBanner(true);
    setTimeout(() => setShowTurnBanner(false), 1500);
  };*/

  const handleRoundStart = useCallback((payload) => {
    const turno = payload?.dataConTurno;
    if (!turno) return;

    // Si ya estamos bloqueados esperando al "Continuar", encolamos
    if (waitingNextRoundRef.current) {
      nextRoundStartRef.current = payload;
      return;
    }

    // Procesamos inmediatamente
    waitingNextRoundRef.current = false;
    nextRoundStartRef.current = null;

    setCurrentOpponentCard(null);
    setHighlightedPosition(null);
    setGameState((prev) => ({
      ...prev,
      phase: turno.isPlayerTurn ? "selection" : "waiting",
      roundNumber: turno.roundNumber,
      isPlayerTurn: turno.isPlayerTurn,
      timer: 30,
      selectedSkill: null,
      opponentSelection: null,
      mySelection: null,
      opponentCards: prev.opponentCards.length
        ? prev.opponentCards
        : opponentCardsRef.current,
    }));

    setShowTurnBanner(true);
    setTimeout(() => setShowTurnBanner(false), 1500);
  }, []);

  // Arreglo para handleOpponentSelection: Guardamos la información de la carta seleccionada
  const handleOpponentSelection = (data) => {
    // Verificar el valor de la referencia
    console.log("Carta seleccionada previa (ref):", selectedCardRef.current);
    console.log("Carta seleccionada previa (estado):", gameState.mySelection);

    // Obtener las cartas actuales del oponente desde el ref para mayor seguridad
    const currentOpponentCards =
      opponentCardsRef.current.length > 0
        ? [...opponentCardsRef.current]
        : [...gameState.opponentCards];

    // Crear un nuevo objeto de carta correctamente formateado
    const opponentCard = {
      id: data.data.carta.id.toString(),
      nombre: data.data.carta.nombre,
      alias: data.data.carta.alias || "",
      posicion: getPositionForOpponentCard(
        data.data.carta,
        currentOpponentCards
      ),
      posicionType: data.data.carta.posicion.toLowerCase(),
      photo: data.data.carta.photo,
      ataque: data.data.carta.ataque,
      defensa: data.data.carta.defensa,
      control: data.data.carta.control,
      equipo: data.data.carta.equipo,
      escudo: data.data.carta.escudo,
      pais: data.data.carta.pais,
      tipo_carta: data.data.carta.tipo_carta,
    };

    // Guardar la carta en la variable temporal
    setCurrentOpponentCard(opponentCard);

    // Guardar la posición requerida para la respuesta
    setHighlightedPosition(data.data.carta.posicion);

    // Verificar si esta carta ya existe en las cartas del oponente
    const opponentCardExists = currentOpponentCards.some(
      (card) => card.id === opponentCard.id
    );

    let updatedOpponentCards = currentOpponentCards;

    // Solo añadimos la carta a la lista si no existe ya
    if (!opponentCardExists) {
      updatedOpponentCards = [...currentOpponentCards, opponentCard];
    }

    // Actualizar también el ref de las cartas del oponente
    opponentCardsRef.current = updatedOpponentCards;

    // Modificar el mensaje para indicar que debe elegir la misma posición
    setAlertMessage(
      `Oponente ha elegido: ${data.data.carta.posicion} - Debes elegir una carta de la misma posición`
    );
    setShowAlert(true);

    // Ocultar la alerta después de 5 segundos
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    setGameState((prev) => ({
      ...prev,
      isPlayerTurn: true,
      opponentSelection: data,
      // Añadir esta carta del oponente al estado
      opponentSelectedCard: opponentCard,
      opponentSelectedSkill: data.data.skill,
      phase: "selection",
    }));
  };
  const handleRoundResult = (data) => {
    const { carta_j1, carta_j2, habilidad_j1, habilidad_j2 } =
      data.data.detalles;

    const myCardRef = selectedCardRef.current;
    if (!myCardRef) {
      console.error("ERROR: selectedCardRef es null en el resultado de ronda");
      return;
    }

    const myCardId = myCardRef.id.toString();
    const isPlayerJ1 = carta_j1.id.toString() === myCardId;

    const myFinalCard = isPlayerJ1 ? carta_j1 : carta_j2;
    const mySkill = isPlayerJ1 ? habilidad_j1 : habilidad_j2;
    const opponentCard = isPlayerJ1 ? carta_j2 : carta_j1;
    const opponentSkill = isPlayerJ1 ? habilidad_j2 : habilidad_j1;

    let roundResult;
    
    if (data.data.ganador === null) {
      roundResult = "empate";
    } else {
      roundResult = data.data.ganador.toString() === jugadorId.toString()
        ? "ganado" 
        : "perdido";
    }
    console.log("Ganador de la ronda:", data.data.ganador.toString(), "Token ID:", jugadorId.toString(), "Resultado:", roundResult);

    setGameState((prev) => ({
      ...prev,
      phase: "result",
      scores: data.data.scores,
      roundResult: roundResult,
      selectedSkill: mySkill,
      selectedCard: { ...myCardRef },
      opponentSelectedCard: {
        id: opponentCard.id.toString(),
        nombre: opponentCard.nombre,
        alias: opponentCard.alias,
        photo: opponentCard.photo,
        ataque: opponentCard.ataque,
        defensa: opponentCard.defensa,
        control: opponentCard.control,
        equipo: opponentCard.equipo,
        escudo: opponentCard.escudo,
        pais: opponentCard.pais,
        tipo_carta: opponentCard.tipo_carta,
        posicion: opponentCard.posicion,
      },
      opponentSelectedSkill: opponentSkill,
    }));

    waitingNextRoundRef.current = true;
    // ya listo para procesar el próximo onRoundStart
  };

  const handleMatchEnd = (data) => {
    setCurrentOpponentCard(null);
    setHighlightedPosition(null);
    console.log("Partida terminada:", data);
    setGameState((prev) => ({
      ...prev,
      phase: "ended",
      scores: data.scores,
      winner: data.winner,
      puntosChange: data.puntosChange,
      isDraw: data.isDraw,
    }));
  };

  const handleSurrender = () => {
    socketService.surrender(matchId);

    setGameState(prev => ({
      ...prev,
      phase: "ended",
      winner: null, 
      isDraw: false
    }));

    setShowMenu(false);
  };

  const optionsButtonStyle = {
    position: "fixed",
    bottom: "2vh",
    left: "2vw",
    width: "48px",
    height: "48px",
    fontSize: "24px",
    backgroundColor: "#374151", 
    color: "white",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    zIndex: 110,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    transition: "all 0.25s ease",
  };

  const containerStyle = {
    background: `url(${background}) fixed center/cover`, 
    minHeight: "100vh",
    width: "100vw", 
    overflowY: "auto",
    padding: "1rem",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  };
  
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    color: "white",
  };
  const contentStyle = {
    flex: 1,
    display: "grid",
    gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
    gap: "1rem",
  };
  const fixedCenter = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  };

  const formationsContainerStyle = {
    display: "grid",
    gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
    columnGap: "2rem",
    alignItems: "start",
    width: "100%",
    flexGrow: 1,
    padding: "1rem",
  };

  const formationStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: windowWidth < 768 ? "1rem" : "0",
  };

  const playerNameStyle = {
    color: "white",
    fontSize: "clamp(1rem, 2vw, 1.5rem)",
    marginBottom: "0.5rem",
    textAlign: "center",
    fontWeight: "bold",
  };

  const skillsContainerStyle = {
    display: "flex",
    flexDirection: windowWidth < 500 ? "column" : "row",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "0.5rem",
    flexWrap: "wrap",
  };

  const skillButtonStyle = {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#3b82f6",
    color: "white",
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
    width: windowWidth < 500 ? "100%" : "auto",
    transition: "all 0.2s ease",
  };

  const confirmButtonStyle = {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#10b981",
    color: "white",
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
    marginTop: "1.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    transition: "all 0.2s ease",
    width: "100%", 
    margin: "1rem 0",
  };

  const selectedCardContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(31, 41, 55, 0.95)",
    padding: "1rem",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    position: "fixed",
    top: "20px",         
    bottom: "20px",      
    left: "50%",
    transform: "translateX(-50%)", 
    zIndex: 50,
    width: isDesktop ? "min(40vw, 500px)" : "90%",
    maxHeight: "calc(100vh - 40px)", 
    overflowY: "auto",
    boxSizing: "border-box",
    minHeight: 0,       
  };

  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    width: windowWidth < 768 ? "90%" : "80%",
    maxWidth: "800px",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: "2rem",
    borderRadius: "15px",
    color: "white",
    zIndex: 100,
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
  };

  const surrenderButtonStyle = {
    position: "fixed",
    bottom: "2vh",
    right: "2vw",
    padding: "0.75rem 1.5rem",
    fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
    backgroundColor: "#ef4444",
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    zIndex: 100,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    transition: "all 0.2s ease",
  };
  const centeredModalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
    maxWidth: "450px",
    width: "90%",
    backgroundColor: "rgba(0,0,0,0.85)",
    padding: "2rem",
    borderRadius: "15px",
    color: "white",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  };
  const alertStyle = {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    color: "white",
    padding: "15px 20px",
    borderRadius: "5px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    animation: "fadeInOut 4s ease-in-out",
    fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
    maxWidth: "90%",
    textAlign: "center",
  };

  const backButtonStyle = {
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#3b82f6",
    color: "white",
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
    marginTop: "1.5rem",
    width: windowWidth < 500 ? "100%" : "auto",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    transition: "all 0.2s ease",
  };

  const contentContainerStyle = {
    flexGrow: 1,
    display: "flex",
    width: "100%",
    minHeight: "calc(100vh - 100px)", 
    maxWidth: isDesktop ? "1400px" : "100%",
    margin: "0 auto",
    position: "relative",
  };

  const waitingModalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: "2rem",
    borderRadius: "15px",
    textAlign: "center",
    color: "white",
    width: "90%",
    maxWidth: "450px",
    zIndex: 1000,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  };

  const menuStyle = {
    position: "fixed",
    bottom: "calc(2vh + 64px)",
    left: "2vw",
    background: "rgba(15, 23, 42, 0.95)",
    border: "1px solid rgba(124, 58, 237, 0.5)",
    borderRadius: "12px",
    minWidth: "180px",
    zIndex: 120,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    overflow: "hidden",
    backdropFilter: "blur(8px)",
  };

  const menuItemStyle = {
    padding: "0.8rem 1.2rem",
    color: "white",
    textAlign: "left",
    width: "100%",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    transition: "all 0.2s ease",
  };

  const renderPhase = () => {
    switch (gameState.phase) {
      case "waiting":
        return (
          <ModalWrapper style={centeredModalStyle}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="relative mb-6">
                <GiSwordman className="text-5xl text-purple-400 mx-auto" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-purple-500 opacity-20"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />
              </div>

              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                Esperando al oponente...
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Ronda {gameState.roundNumber}/11
              </p>

              <div className="flex justify-center">
                <motion.div
                  className="h-2 bg-purple-900 rounded-full overflow-hidden w-3/4"
                  initial={{ width: "0%" }}
                  animate={{ width: "75%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </ModalWrapper>
        );
      //----------
      case "selection":
        if (!gameState.isPlayerTurn) {
          return (
            <ModalWrapper style={centeredModalStyle}>
              <h2>Turno del rival…</h2>
            </ModalWrapper>
          );
        }
        return (
          <>
            {showTurnBanner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "fixed",
                  top: "40%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(90deg, #06d6a0, #118ab2)",
                  color: "white",
                  padding: "1.2rem 2.5rem",
                  borderRadius: "10px",
                  fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                  fontWeight: "bold",
                  textShadow: "0px 2px 8px rgba(0,0,0,0.5)",
                  zIndex: 9999,
                }}
              ></motion.div>
            )}

            {/* ——— Indicador de turno ——— */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: "20%",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "1rem 2rem",
                background: gameState.isPlayerTurn
                  ? "linear-gradient(90deg,#06d6a0,#118ab2)"
                  : "linear-gradient(90deg,#ef4444,#f97316)",
                color: "#fff",
                borderRadius: "8px",
                zIndex: 999,
                textAlign: "center",
                fontWeight: "900",
                fontSize: "clamp(1.5rem,4vw,2rem)",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            ></motion.div>
            {/* ——— Fin indicador ——— */}

            {/* ——— Grid de selección ——— */}
            <div style={formationsContainerStyle}>
              {/* Formación del jugador */}
              <div style={formationStyle}>
                <h3 style={playerNameStyle}>Tu equipo</h3>
                <Formacion433
                  jugadores={gameState.availablePlayerCards}
                  onJugadorClick={handleCardSelect}
                />
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

            {/* ——— Selección flotante ——— */}
            {gameState.selectedCard && (
              <motion.div
                style={{
                  ...selectedCardContainerStyle,
                  boxShadow:
                    "0 8px 36px rgba(6,214,160,0.2), 0 1px 20px rgba(14,165,233,0.2)",
                  border: "2px solid #fff",
                  background: "rgba(34,34,58,0.9)",
                }}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <CartaGrande jugador={gameState.selectedCard} />

                <div style={{ ...skillsContainerStyle, marginTop: "1.2rem", flexShrink: 0 }}>
                  {["ataque", "control", "defensa"].map((skill) => (
                    <motion.button
                      key={skill}
                      style={{
                        ...skillButtonStyle,
                        background:
                          gameState.selectedSkill === skill
                            ? "linear-gradient(90deg,#22d3ee,#a7f3d0)"
                            : "#3b82f6",
                        boxShadow:
                          gameState.selectedSkill === skill
                            ? "0 0 12px #06d6a0"
                            : "none",
                        fontSize: "1rem",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSkillSelect(skill)}
                    >
                      {skill[0].toUpperCase() + skill.slice(1)}
                    </motion.button>
                  ))}
                </div>

                {gameState.selectedSkill && (
                  <motion.button
                    style={{
                      ...confirmButtonStyle,
                      flexShrink: 0,
                      background: "linear-gradient(90deg,#06d6a0,#22d3ee)",
                      color: "#1e293b",
                      fontWeight: "900",
                      marginTop: "1.5rem",
                    }}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmSelection}
                  >
                    Confirmar {gameState.selectedSkill}
                  </motion.button>
                )}
              </motion.div>
            )}
          </>
        );

      case "response":
        return (
          <ModalWrapper style={centeredModalStyle}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2
                style={{
                  fontSize: "clamp(20px,5vw,28px)",
                  color: "#38bdf8",
                  marginBottom: "1rem",
                }}
              >
                Esperando respuesta...
              </h2>

              <motion.div
                style={{
                  border: "5px solid rgba(255,255,255,0.2)",
                  borderTop: "5px solid #38bdf8",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  margin: "20px auto",
                  animation: "spin 1s linear infinite",
                }}
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
              ></motion.div>

              <p
                style={{
                  marginTop: "1rem",
                  fontSize: "clamp(16px,3vw,20px)",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                El rival está eligiendo su carta...
              </p>
            </motion.div>
          </ModalWrapper>
        );
      //Paused
      case "paused":
        return (
          <ModalWrapper style={centeredModalStyle}>
            <h2 className="text-2xl mb-4">Partida pausada</h2>
            <button
              onClick={() => navigate("/home")}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
            >
              Volver al inicio
            </button>
          </ModalWrapper>
        );

      case "result": {
        const playerWon = gameState.roundResult === "ganado";
        const tie = gameState.roundResult === "empate";
        const stat = gameState.selectedSkill;
        const playerVal = gameState.selectedCard[stat];
        const rivalVal = gameState.opponentSelectedCard[stat];

        return (
          <ModalWrapper style={centeredModalStyle}>
            {/* Título */}
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: "clamp(1.8rem,4vw,2.4rem)",
                fontWeight: 900,
                color: tie ? "#eab308" : playerWon ? "#06d6a0" : "#ef4444",
                marginBottom: "1rem",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              {tie
                ? "¡EMPATE!"
                : playerWon
                ? "¡GANASTE LA RONDA!"
                : "PERDISTE LA RONDA"}
            </motion.h2>

            {/* Cartas comparadas */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "2rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <CartaMediana jugador={gameState.selectedCard} />
                <div style={{ marginTop: 6, fontWeight: 700 }}>Tú</div>
              </div>

              <div style={{ fontSize: "2rem", fontWeight: 700 }}>VS</div>

              <div style={{ textAlign: "center" }}>
                <CartaMediana jugador={gameState.opponentSelectedCard} />
                <div style={{ marginTop: 6, fontWeight: 700 }}>Rival</div>
              </div>
            </div>

            {/* Valores de la estadística */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
                marginBottom: "1.5rem",
                fontSize: "1.1rem",
              }}
            >
              <div>
                <strong>{playerVal}</strong>
                <div>{stat}</div>
              </div>
              <div>
                <strong>{rivalVal}</strong>
                <div>{stat}</div>
              </div>
            </div>

            {/* Botón continuar */}
            <motion.button
              onClick={() => {
                // 1) levantamos el bloqueo para que el próximo onRoundStart se procese
                waitingNextRoundRef.current = false;

                // 2) si ya hemos acabado la ronda 11, vamos a "ended"
                if (gameState.roundNumber >= 11) {
                  setGameState((prev) => ({
                    ...prev,
                    phase: "ended",
                    // aquí puedes setear winner o scores finales si hiciera falta
                  }));
                  return;
                }

                // 3) pasamos a "waiting" a la espera del servidor
                setGameState((prev) => ({
                  ...prev,
                  phase: "waiting",
                  selectedCard: null,
                  selectedSkill: null,
                }));
                if (nextRoundStartRef.current) {
                  handleRoundStart(nextRoundStartRef.current);
                  nextRoundStartRef.current = null;
                }
              }}
            >
              Continuar
            </motion.button>
          </ModalWrapper>
        );
      }

      case "ended":
        const currentPlayerId = jugadorId.toString();

        const isWinner = gameState.winner?.toString() === currentPlayerId;
        const isDraw = gameState.isDraw;
        console.log("isWinner:", gameState.winner?.toString(), "isDraw:", isDraw);
        console.log("gameState:", gameState);
        return (
          <ModalWrapper
            style={{
              ...centeredModalStyle,
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
              padding: "2.5rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Título grande */}
              <motion.h1
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 4rem)",
                  marginBottom: "1rem",
                  fontWeight: 900,
                  background: isDraw
                  ? "linear-gradient(90deg,#facc15,#eab308)"
                  : isWinner 
                  ? "linear-gradient(90deg,#06d6a0,#3b82f6)"
                  : "linear-gradient(90deg,#ef4444,#b91c1c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 12px rgba(255,255,255,0.2)",
                }}
                initial={{ y: -30 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                {isDraw ? "¡EMPATE!" : isWinner ? "🏆 VICTORIA" : "😞 DERROTA"}
              </motion.h1>

              {/* Puntuaciones */}
              <motion.div
              style={{
                fontSize: "clamp(1.8rem,5vw,2.5rem)",
                fontWeight: "bold",
                marginBottom: "1.5rem",
                color: "white",
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              >
              {gameState.scores[jugadorId.toString()]} -{" "}
              {Object.entries(gameState.scores)
                .filter(([key]) => key !== jugadorId.toString())
                .map(([value]) => value)}
              </motion.div>

              {/* Cambio de puntos */}
              <motion.div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "2rem",
                  color:
                    gameState.puntosChange?.["2"] >= 0 ? "#4ade80" : "#f87171",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                {gameState.puntosChange?.["2"] >= 0 ? "+" : ""}
                {gameState.puntosChange?.["2"]} puntos
              </motion.div>

              {/* Botón de volver */}
              <motion.button
                onClick={() => navigate("/home")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "1rem 2.5rem",
                  borderRadius: "12px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#fff",
                  background: isDraw
                    ? "linear-gradient(90deg, #facc15, #fbbf24)"
                    : isWinner
                    ? "linear-gradient(90deg, #06d6a0, #22d3ee)"
                    : "linear-gradient(90deg, #ef4444, #f87171)",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
                }}
              >
                Volver al menú
              </motion.button>
            </motion.div>
          </ModalWrapper>
        );

      default:
        return (
          <div
            style={{
              color: "white",
              textAlign: "center",
              fontSize: "clamp(14px, 3vw, 18px)",
              padding: "2rem",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Cargando partida...
          </div>
        );
    }
  };

  return (
    <>
      {/* —— Fondo y contenido de partida —— */}
      <div style={containerStyle}>
        {/* Header y marcador */}
        <div style={headerStyle}>
          <div style={{ width: "30%", minWidth: "80px" }}>
            <motion.h2
              style={{
                fontSize: "clamp(14px, 3vw, 20px)",
                color: "white",
                textAlign: "left",
                margin: "0",
                padding: "5px 10px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "5px",
                display: "inline-block",
              }}
              animate={{
                backgroundColor:
                  gameState.scores.player > gameState.scores.opponent
                    ? "rgba(16, 185, 129, 0.7)"
                    : "rgba(0, 0, 0, 0.5)",
              }}
              transition={{ duration: 0.3 }}
            >
              Tú: {gameState.scores.player}
            </motion.h2>
          </div>
          <div style={{ width: "40%", textAlign: "center" }}>
            <motion.h1
              style={{
                fontSize: "clamp(16px, 3.5vw, 22px)",
                color: "white",
                fontWeight: "bold",
                margin: "0",
                padding: "5px 15px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "8px",
                display: "inline-block",
              }}
            >
              Ronda {gameState.roundNumber}/11
            </motion.h1>
          </div>
          <div style={{ width: "30%", textAlign: "right", minWidth: "80px" }}>
            <motion.h2
              style={{
                fontSize: "clamp(14px, 3vw, 20px)",
                color: "white",
                margin: "0",
                padding: "5px 10px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "5px",
                display: "inline-block",
              }}
              animate={{
                backgroundColor:
                  gameState.scores.opponent > gameState.scores.player
                    ? "rgba(239, 68, 68, 0.7)"
                    : "rgba(0, 0, 0, 0.5)",
              }}
              transition={{ duration: 0.3 }}
            >
              Rival: {gameState.scores.opponent}
            </motion.h2>
          </div>
        </div>

        <div style={contentContainerStyle}>
          {gameState.phase === "selection" && renderPhase()}
        </div>

        {/* Botón opciones */}
        <motion.button
          onClick={() => setShowMenu((prev) => !prev)}
          style={optionsButtonStyle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          &#x22EE;
        </motion.button>
      </div>
      {/* —— Overlays flotantes, fuera del fondo —— */}
      {showMenu && (
        <motion.div
          style={menuStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {!isTournamentMatch && (
            gameState.phase === "paused" ? (
              <button 
                onClick={handleResume} 
                style={menuItemStyle}
                className="hover:bg-emerald-600/50"
              >
                <FaPlay /> Reanudar
              </button>
            ) : (
              <button 
                onClick={handlePause} 
                style={menuItemStyle}
                className="hover:bg-yellow-600/50"
              >
                <FaPause /> Pausar
              </button>
            )
          )}
          <button 
            onClick={handleSurrender} 
            style={menuItemStyle}
            className="hover:bg-red-600/50"
          >
            <FaFlag /> Rendirse
          </button>
        </motion.div>
      )}
      {/* —— MODALES flotantes, SIEMPRE FUERA del container —— */}
      {["waiting", "paused", "response", "result", "ended"].includes(
        gameState.phase
      ) && renderPhase()}
      {/* —— ALERTA flotante —— */}
      {showAlert && (
        <ModalWrapper style={{ top: "20px", transform: "translateX(-50%)" }}>
          <div style={alertStyle}>{alertMessage}</div>
        </ModalWrapper>
      )}
    </>
  );
};

export default Partida;
