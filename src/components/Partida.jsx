/* eslint-disable react/no-unknown-property */
/* eslint-disable no-case-declarations */
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { socketService } from "../services/websocket/socketService";
import { getProfile } from "../services/api/profileApi";
import {
  obtenerPlantillas,
  obtenerCartasDePlantilla,
} from "../services/api/alineacionesApi";
import { getToken } from "../services/api/authApi";
import { jwtDecode } from "jwt-decode";
import Formacion433 from "../components/layout/game/Formacion_4_3_3";
import CartaGrande from "../components/layout/game/CartaMediana";
import CartaMediana from "../components/layout/game/CartaMediana";
import { motion, AnimatePresence } from "framer-motion";
import ModalWrapper from "../components/layout/game/ModalWrapper";
import { FaPause, FaPlay, FaFlag, FaHome, FaCog } from "react-icons/fa";
import {
  GiSwordman,
  GiSwordsPower,
  GiSwordWound,
  GiSwordwoman,
} from "react-icons/gi";
import { GiSoccerBall } from "react-icons/gi";
import { IoMdFootball } from "react-icons/io";

// Prevent body scrolling
document.body.style.overflow = "hidden";

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
  const [showTurnBanner, setShowTurnBanner] = useState(false);
  const [currentOpponentCard, setCurrentOpponentCard] = useState(null);
  const [highlightedPosition, setHighlightedPosition] = useState(null);
  const TOTAL_ROUNDS = 11;

  const matchEndedRef = useRef(false);
  console.log("[UI] 💡 mounting Partida – jugadorId =", jugadorId);
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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Socket event handlers
  useEffect(() => {
    socketService.setOnMatchPaused(() => {
      setGameState((prev) => ({ ...prev, phase: "paused" }));
    });

    socketService.setOnMatchResumed(() => {
      setGameState((prev) => ({ ...prev, phase: "selection" }));
    });

    socketService.setOnRoundStart(handleRoundStart);
    socketService.setOnOpponentSelection(handleOpponentSelection);
    socketService.setOnRoundResult(handleRoundResult);
    socketService.setOnMatchEnd((payload) => {
      console.log("[UI] 💥 match_ended → handleMatchEnd payload:", payload);
      handleMatchEnd(payload);
    });

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
                    counters.defender++;
                    posicionEspecifica = `defender${counters.defender}`;
                }

                return {
                  id: jugador.id.toString(),
                  nombre: jugador.nombre,
                  alias: jugador.alias,
                  posicion: posicionEspecifica,
                  posicionType: posicionLower,
                  photo: jugador.photo,
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
        console.error("Error loading profile or templates:", error);
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
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (
      highlightedPosition &&
      data.jugador.posicionType.toLowerCase() !==
        highlightedPosition.toLowerCase()
    ) {
      setAlertMessage(
        `Debes seleccionar una carta de posición: ${highlightedPosition}`
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    setGameState((prev) => ({
      ...prev,
      selectedCard: data.jugador,
      selectedSkill: null,
    }));
  };

  const handleSkillSelect = (skill) => {
    if (!gameState.selectedCard) return;
    setGameState((prev) => ({
      ...prev,
      selectedSkill: skill,
    }));
  };

  const handleConfirmSelection = () => {
    if (!gameState.selectedCard || !gameState.selectedSkill) return;

    selectedCardRef.current = { ...gameState.selectedCard };

    if (
      highlightedPosition &&
      gameState.selectedCard.posicionType.toLowerCase() !==
        highlightedPosition.toLowerCase()
    ) {
      setAlertMessage(
        `Debes elegir una carta de posición ${highlightedPosition}`
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
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

    setGameState((prev) => ({
      ...prev,
      phase: "response",
      availablePlayerCards: updatedAvailableCards,
      mySelection: { ...gameState.selectedCard },
    }));
    selectedCardRef.current = { ...gameState.selectedCard };
    setHighlightedPosition(null);
  };

  const getPositionForOpponentCard = (carta, existingCards) => {
    const posicionLower = carta.posicion.toLowerCase();
    const existingPositions = existingCards
      ? existingCards.map((card) => card.posicion)
      : [];

    const counters = {
      forward: 0,
      midfielder: 0,
      defender: 0,
      goalkeeper: 0,
    };

    existingPositions.forEach((pos) => {
      if (pos.startsWith("forward")) counters.forward++;
      else if (pos.startsWith("midfielder")) counters.midfielder++;
      else if (pos.startsWith("defender")) counters.defender++;
      else if (pos.startsWith("goalkeeper")) counters.goalkeeper++;
    });

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
        counters.defender++;
        posicionEspecifica = `defender${counters.defender}`;
    }

    return posicionEspecifica;
  };

  const handleRoundStart = useCallback((payload) => {
    const turno = payload?.dataConTurno;
    if (matchEndedRef.current) {
      console.log("[UI] 🛑 Ignoring round_start after match_end", payload);
      return;
    }
    console.log("[UI] ↪️ handleRoundStart()", {
      payload,
      waitingNextRound: waitingNextRoundRef.current,
    });

    if (!turno) return;

    if (waitingNextRoundRef.current) {
      nextRoundStartRef.current = payload;
      return;
    }

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

  const handleOpponentSelection = (data) => {
    const currentOpponentCards =
      opponentCardsRef.current.length > 0
        ? [...opponentCardsRef.current]
        : [...gameState.opponentCards];

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

    setCurrentOpponentCard(opponentCard);
    setHighlightedPosition(data.data.carta.posicion);

    const opponentCardExists = currentOpponentCards.some(
      (card) => card.id === opponentCard.id
    );

    let updatedOpponentCards = currentOpponentCards;

    if (!opponentCardExists) {
      updatedOpponentCards = [...currentOpponentCards, opponentCard];
    }

    opponentCardsRef.current = updatedOpponentCards;

    setAlertMessage(
      `Oponente ha elegido: ${data.data.carta.posicion} - Debes elegir una carta de la misma posición`
    );
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    setGameState((prev) => ({
      ...prev,
      isPlayerTurn: true,
      opponentSelection: data,
      opponentSelectedCard: opponentCard,
      opponentSelectedSkill: data.data.skill,
      phase: "selection",
    }));
  };

  const handleRoundResult = (data) => {
    if (matchEndedRef.current) {
      console.log("[UI] 🛑 Ignoring round_result after match_end", data);
      return;
    }
    const detalles = data.data.detalles;
    const { ganador, scores } = data.data;
    const myCardRef = selectedCardRef.current;
    if (!myCardRef) {
      console.error("ERROR: selectedCardRef es null en handleRoundResult");
      return;
    }

    const myCardId = myCardRef.id.toString();
    const isPlayerJ1 = detalles.carta_j1.id.toString() === myCardId;

    const mySkill = isPlayerJ1 ? detalles.habilidad_j1 : detalles.habilidad_j2;
    const opponentRaw = isPlayerJ1 ? detalles.carta_j2 : detalles.carta_j1;
    const opponentSkill = isPlayerJ1
      ? detalles.habilidad_j2
      : detalles.habilidad_j1;

    console.log("[UI] ↪️ handleRoundResult()", {
      data,
      waitingNextRound: waitingNextRoundRef.current,
      nextRoundStart: nextRoundStartRef.current,
    });

    const formattedOpponentCard = {
      id: opponentRaw.id.toString(),
      nombre: opponentRaw.nombre,
      alias: opponentRaw.alias || "",
      photo: opponentRaw.photo,
      ataque: opponentRaw.ataque,
      defensa: opponentRaw.defensa,
      control: opponentRaw.control,
      equipo: opponentRaw.equipo,
      escudo: opponentRaw.escudo,
      pais: opponentRaw.pais,
      tipo_carta: opponentRaw.tipo_carta,
      posicion: opponentRaw.posicion,
    };

    const roundResult =
      ganador === null
        ? "empate"
        : ganador.toString() === jugadorId.toString()
        ? "ganado"
        : "perdido";

    setGameState((prev) => ({
      ...prev,
      phase: "result",
      scores,
      roundResult,
      selectedSkill: mySkill,
      selectedCard: { ...myCardRef },
      opponentSelectedCard: formattedOpponentCard,
      opponentSelectedSkill: opponentSkill,
    }));

    waitingNextRoundRef.current = true;
  };

  const handleMatchEnd = (data) => {
    console.log("[UI] ↪️ handleMatchEnd()", data);
    matchEndedRef.current = true;
    setGameState((prev) => ({
      ...prev,
      phase: "ended",
      scores: data.scores,
      winner: data.winner,
      puntosChange: data.puntosChange,
      isDraw: data.isDraw,
    }));
  };

  const handlePause = () => {
    socketService.pause(matchId);
    setShowMenu(false);
  };

  const handleResume = () => {
    socketService.resumeMatch(matchId);
    setShowMenu(false);
  };

  const handleHome = () => navigate("/home");

  const handleSurrender = () => {
    socketService.surrender(matchId);
    setGameState((prev) => ({
      ...prev,
      phase: "ended",
      winner: null,
      isDraw: false,
    }));
    setShowMenu(false);
  };

  // Styles
  const containerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    background: `linear-gradient(135deg, rgba(0, 51, 102, 0.9), rgba(0, 102, 51, 0.9)), url('https://images.unsplash.com/photo-1598887144775-3b7a51a6e9f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') no-repeat center/cover`,
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Montserrat', sans-serif",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1rem",
    background: "rgba(15, 23, 42, 0.95)",
    borderRadius: "12px",
    margin: "0.5rem 1rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(59, 130, 246, 0.4)",
    backdropFilter: "blur(10px)",
    zIndex: 10,
  };

  const scoreStyle = {
    fontSize: "1.2rem",
    fontWeight: "700",
    padding: "0.5rem 1rem",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(5px)",
    color: "#fff",
  };

  const roundStyle = {
    fontSize: "1.2rem",
    fontWeight: "700",
    padding: "0.5rem 1rem",
    borderRadius: "10px",
    background: "rgba(30, 41, 59, 0.95)",
    color: "#fff",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(59, 130, 246, 0.4)",
    backdropFilter: "blur(5px)",
  };

  const contentContainerStyle = {
    flex: 1,
    display: "flex",
    width: "100%",
    maxWidth: isDesktop ? "1600px" : "100%",
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
  };

  const formationsContainerStyle = {
    display: "grid",
    gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
    gap: "1rem",
    alignItems: "center",
    width: "100%",
    padding: "0.5rem",
    height: "100%",
  };

  const formationStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "rgba(15, 23, 42, 0.85)",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    backdropFilter: "blur(8px)",
    height: "100%",
    overflow: "hidden",
  };

  const playerNameStyle = {
    color: "#fff",
    fontSize: "1.5rem",
    marginBottom: "1rem",
    textAlign: "center",
    fontWeight: "700",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
    background: "linear-gradient(90deg, #3b82f6, #10b981)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    padding: "0.3rem 0.8rem",
    borderRadius: "6px",
  };

  const selectedCardContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "rgba(15, 23, 42, 0.95)",
    padding: "1.5rem",
    borderRadius: "16px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 100,
    width: isDesktop ? "min(35vw, 450px)" : "85vw",
    maxHeight: "80vh",
    overflow: "hidden",
    border: "2px solid rgba(59, 130, 246, 0.5)",
    backdropFilter: "blur(12px)",
  };

  const skillButtonStyle = {
    padding: "0.6rem 1.2rem",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #3b82f6, #10b981)",
    color: "#fff",
    fontWeight: "600",
    fontSize: "0.95rem",
    transition: "all 0.2s ease",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
    minWidth: "100px",
  };

  const confirmButtonStyle = {
    padding: "0.8rem 1.5rem",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #10b981, #34d399)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "1rem",
    marginTop: "1rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
    transition: "all 0.2s ease",
    width: "100%",
  };

  const optionsButtonStyle = {
    position: "fixed",
    bottom: "1.5rem",
    left: "1.5rem",
    width: "50px",
    height: "50px",
    fontSize: "1.5rem",
    background: "linear-gradient(135deg, #3b82f6, #10b981)",
    color: "#fff",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    zIndex: 110,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
    transition: "all 0.2s ease",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const menuStyle = {
    position: "fixed",
    bottom: "calc(1.5rem + 60px)",
    left: "1.5rem",
    background: "rgba(15, 23, 42, 0.95)",
    border: "1px solid rgba(59, 130, 246, 0.4)",
    borderRadius: "12px",
    minWidth: "200px",
    zIndex: 120,
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  };

  const menuItemStyle = {
    padding: "0.8rem 1.2rem",
    color: "#fff",
    textAlign: "left",
    width: "100%",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    fontSize: "1rem",
    transition: "all 0.2s ease",
  };

  const alertStyle = {
    position: "fixed",
    top: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#fff",
    padding: "0.8rem 1.5rem",
    borderRadius: "10px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
    zIndex: 1000,
    fontSize: "1rem",
    fontWeight: "600",
    textAlign: "center",
    maxWidth: "80%",
    animation: "fadeInOut 4s ease-in-out",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(8px)",
  };

  const modalStyle = {
    background: "rgba(15, 23, 42, 0.95)",
    borderRadius: "16px",
    padding: "1.5rem",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
    border: "2px solid rgba(59, 130, 246, 0.4)",
    backdropFilter: "blur(12px)",
    maxWidth: isDesktop ? "600px" : "90vw",
    maxHeight: "80vh",
    overflow: "hidden",
    textAlign: "center",
  };

  const renderPhase = () => {
    switch (gameState.phase) {
      case "waiting":
        return (
          <ModalWrapper>
            <motion.div
              style={modalStyle}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  <IoMdFootball className="text-6xl text-yellow-400 mx-auto" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 blur-md"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Esperando al oponente...
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Ronda {gameState.roundNumber}/11
              </p>
              <div className="flex justify-center">
                <motion.div
                  className="h-3 bg-gray-800 rounded-full overflow-hidden w-2/3"
                  animate={{ width: "66%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-green-400"
                    animate={{ x: ["-100%", "100%"] }}
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

      case "selection":
        if (!gameState.isPlayerTurn) {
          return (
            <ModalWrapper>
              <motion.div
                style={modalStyle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="mb-6 relative">
                  <GiSwordman className="text-6xl text-red-400 mx-auto animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 blur-md" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Turno del rival
                </h2>
                <p className="text-lg text-gray-300">
                  Esperando a que elija su carta...
                </p>
              </motion.div>
            </ModalWrapper>
          );
        }

        return (
          <>
            <AnimatePresence>
              {showTurnBanner && (
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  style={{
                    position: "fixed",
                    top: "10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(90deg, #34d399, #3b82f6)",
                    color: "#fff",
                    padding: "1rem 2rem",
                    borderRadius: "12px",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    zIndex: 9999,
                    boxShadow: "0 6px 12px rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  ¡TU TURNO!
                </motion.div>
              )}
            </AnimatePresence>

            <div style={formationsContainerStyle}>
              <div style={formationStyle}>
                <h3 style={playerNameStyle}>Tu equipo</h3>
                <Formacion433
                  jugadores={gameState.availablePlayerCards}
                  onJugadorClick={handleCardSelect}
                />
              </div>

              <div style={formationStyle}>
                <h3 style={playerNameStyle}>Oponente</h3>
                <Formacion433
                  jugadores={gameState.opponentCards}
                  onJugadorClick={() => {}}
                  highlightPositionType={highlightedPosition}
                />
              </div>
            </div>

            {gameState.selectedCard && (
              <motion.div
                style={selectedCardContainerStyle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <CartaGrande jugador={gameState.selectedCard} />

                <div style={{ margin: "1rem 0", width: "100%" }}>
                  <h3 className="text-lg font-bold text-white mb-3 text-center">
                    Selecciona una habilidad:
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.8rem",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {["ataque", "control", "defensa"].map((skill) => (
                      <motion.button
                        key={skill}
                        style={{
                          ...skillButtonStyle,
                          background:
                            gameState.selectedSkill === skill
                              ? "linear-gradient(135deg, #34d399, #10b981)"
                              : skillButtonStyle.background,
                          boxShadow:
                            gameState.selectedSkill === skill
                              ? "0 0 12px rgba(16, 185, 129, 0.7)"
                              : "none",
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSkillSelect(skill)}
                      >
                        {skill[0].toUpperCase() + skill.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {gameState.selectedSkill && (
                  <motion.button
                    style={confirmButtonStyle}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmSelection}
                  >
                    CONFIRMAR {gameState.selectedSkill.toUpperCase()}
                  </motion.button>
                )}
              </motion.div>
            )}
          </>
        );

      case "response":
        return (
          <ModalWrapper>
            <motion.div
              style={modalStyle}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <GiSoccerBall className="text-5xl text-blue-400 mx-auto" />
                </motion.div>
                <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 blur-md" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Esperando respuesta...
              </h2>
              <p className="text-lg text-gray-300">
                El rival está eligiendo su carta...
              </p>
            </motion.div>
          </ModalWrapper>
        );

      case "paused":
        return (
          <ModalWrapper>
            <motion.div
              style={modalStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-6 relative">
                <FaPause className="text-5xl text-yellow-400 mx-auto" />
                <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 blur-md" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Partida pausada
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                La partida está actualmente en pausa
              </p>
              <motion.button
                onClick={handleHome}
                style={{
                  padding: "0.8rem 1.5rem",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #34d399, #10b981)",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "1rem",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Volver a Inicio
              </motion.button>
            </motion.div>
          </ModalWrapper>
        );

      case "result": {
        const playerWon = gameState.roundResult === "ganado";
        const tie = gameState.roundResult === "empate";
        const stat = gameState.selectedSkill;
        const playerVal = gameState.selectedCard[stat];
        const rivalVal = gameState.opponentSelectedCard[stat];

        return (
          <ModalWrapper>
            <motion.div
              style={modalStyle}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-4xl font-bold mb-6 ${
                  tie
                    ? "text-yellow-400"
                    : playerWon
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {tie
                  ? "¡EMPATE!"
                  : playerWon
                  ? "¡RONDA GANADA!"
                  : "RONDA PERDIDA"}
              </motion.h2>

              <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
                <div className="text-center">
                  <div className="relative">
                    <CartaMediana jugador={gameState.selectedCard} />
                    {playerWon && (
                      <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-lg font-bold text-white">Tú</div>
                  <div className="text-xl font-bold mt-1 bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text">
                    {playerVal} {stat}
                  </div>
                </div>

                <div className="text-3xl font-bold text-white my-3 md:my-0">
                  VS
                </div>

                <div className="text-center">
                  <div className="relative">
                    <CartaMediana jugador={gameState.opponentSelectedCard} />
                    {!playerWon && !tie && (
                      <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                        ✗
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-lg font-bold text-white">Rival</div>
                  <div className="text-xl font-bold mt-1 bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text">
                    {rivalVal} {stat}
                  </div>
                </div>
              </div>

              <div className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-green-400 px-4 py-2 rounded-lg shadow-md">
                Marcador: {gameState.scores.player} -{" "}
                {Object.values(gameState.scores).find(
                  (score) => score !== gameState.scores.player
                )}
              </div>

              <motion.button
                onClick={() => {
                  console.log(
                    "[UI] ▶️ Continue clicked — waitingNextRound:",
                    waitingNextRoundRef.current,
                    "nextRoundStart:",
                    nextRoundStartRef.current
                  );

                  waitingNextRoundRef.current = false;
                  setGameState((prev) => ({
                    ...prev,
                    phase: prev.isPlayerTurn ? "selection" : "waiting",
                    selectedCard: null,
                    selectedSkill: null,
                  }));
                  if (nextRoundStartRef.current) {
                    handleRoundStart(nextRoundStartRef.current);
                  }
                }}
                style={{
                  padding: "0.8rem 1.5rem",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #3b82f6, #34d399)",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "1rem",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continuar
              </motion.button>
            </motion.div>
          </ModalWrapper>
        );
      }

      case "ended":
        const currentPlayerId = jugadorId.toString();
        const isWinner = gameState.winner?.toString() === currentPlayerId;
        const isDraw = gameState.isDraw;
        const opponentScore =
          Object.entries(gameState.scores).find(
            ([key]) => key !== currentPlayerId
          )?.[1] || 0;

        return (
          <ModalWrapper>
            <motion.div
              style={modalStyle}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.h1
                className={`text-5xl font-bold mb-6 ${
                  isDraw
                    ? "text-yellow-400"
                    : isWinner
                    ? "text-green-400"
                    : "text-red-400"
                }`}
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                {isDraw ? "¡EMPATE!" : isWinner ? "🏆 VICTORIA" : "😞 DERROTA"}
              </motion.h1>

              <motion.div
                className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-green-400 px-6 py-3 rounded-lg shadow-md"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {gameState.scores[currentPlayerId]} - {opponentScore}
              </motion.div>

              {gameState.puntosChange && (
                <motion.div
                  className={`text-2xl font-bold mb-6 ${
                    gameState.puntosChange[currentPlayerId] >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {gameState.puntosChange[currentPlayerId] >= 0 ? "+" : ""}
                  {gameState.puntosChange[currentPlayerId]} puntos
                </motion.div>
              )}

              <motion.button
                onClick={() => navigate("/home")}
                style={{
                  padding: "0.8rem 1.5rem",
                  borderRadius: "10px",
                  background: isDraw
                    ? "linear-gradient(135deg, #facc15, #f59e0b)"
                    : isWinner
                    ? "linear-gradient(135deg, #34d399, #10b981)"
                    : "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "1rem",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Volver al menú
              </motion.button>
            </motion.div>
          </ModalWrapper>
        );

      default:
        return (
          <ModalWrapper>
            <motion.div
              style={modalStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-6 relative">
                <GiSoccerBall className="text-5xl text-blue-400 mx-auto animate-spin" />
                <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 blur-md" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Cargando partida...
              </h2>
            </motion.div>
          </ModalWrapper>
        );
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <motion.div
          style={{
            ...scoreStyle,
            background:
              gameState.scores.player > gameState.scores.opponent
                ? "linear-gradient(135deg, #34d399, #10b981)"
                : "linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))",
          }}
          transition={{ duration: 0.3 }}
        >
          Tú: {gameState.scores.player}
        </motion.div>

        <div style={roundStyle}>Ronda {gameState.roundNumber}/11</div>

        <motion.div
          style={{
            ...scoreStyle,
            background:
              gameState.scores.opponent > gameState.scores.player
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : "linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))",
          }}
          transition={{ duration: 0.3 }}
        >
          Rival:{" "}
          {Object.values(gameState.scores).find(
            (score) => score !== gameState.scores.player
          )}
        </motion.div>
      </div>

      <div style={contentContainerStyle}>
        {gameState.phase === "selection" && renderPhase()}
      </div>

      <motion.button
        onClick={() => setShowMenu((prev) => !prev)}
        style={optionsButtonStyle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaCog />
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            style={menuStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {!isTournamentMatch &&
              (gameState.phase === "paused" ? (
                <button
                  onClick={handleResume}
                  style={menuItemStyle}
                  className="hover:bg-green-600/50"
                >
                  <FaPlay className="text-green-400" /> Reanudar
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  style={menuItemStyle}
                  className="hover:bg-yellow-600/50"
                >
                  <FaPause className="text-yellow-400" /> Pausar
                </button>
              ))}
            <button
              onClick={handleSurrender}
              style={menuItemStyle}
              className="hover:bg-red-600/50"
            >
              <FaFlag className="text-red-400" /> Rendirse
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAlert && (
          <motion.div
            style={alertStyle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {["waiting", "paused", "response", "result", "ended"].includes(
        gameState.phase
      ) && renderPhase()}
    </div>
  );
};

export default Partida;
