import io from "socket.io-client";
import { getProfile } from "../api/profileApi";

/*class SocketService {
  constructor() {
    this.socket = null;
    this.onOpponentCardSelected = null; 
    this.onConfirmationsUpdated = null;
    this.navigate = null;
    this.onRoundStart = null;
    this.onOpponentSelection = null;
    this.onRoundResult = null;
    this.onMatchEnd = null;
  }*/

class SocketService {
  /* ------------- propiedades ------------ */
  constructor() {
    this.socket = null;
    this.navigate = null;

    /* callbacks que el componente React le inyecta */
    this.onOpponentCardSelected = null;
    this.onConfirmationsUpdated = null;
    this.onRoundStart = null;
    this.onOpponentSelection = null;
    this.onRoundResult = null;
    this.onMatchEnd = null;
  }

  /* ------------- patron singleton ------------ */
  static getInstance() {
    if (!SocketService.instance) SocketService.instance = new SocketService();
    return SocketService.instance;
  }

  /* ------------- init / conexión ------------ */
  initialize(token, username, navigate) {
    this.navigate = navigate;
    this.connect(token, username);
  }

  async connect(token, username) {
    if (this.socket) return; // ya conectado

    this.socket = io("wss://adrenalux.duckdns.org", {
      path: "/socket.io",
      transports: ["websocket"],
      query: { username },
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      secure: true,
      withCredentials: true,
    });

    /* on-connect */
    this.socket.on("connect", () => {
      console.log("Socket conectado");
      this.setupExchangeListeners();
      this.setupMatchListeners();
    });

    /* errores genéricos */
    this.socket.on("notification", (d) => this.handleNotification(d));
    this.socket.on("connect_error", (e) => console.error("Socket error:", e));
    this.socket.on("connect_timeout", () => console.warn("Socket timeout"));
  }
  /* --------------------------------------------------------- *
   *  MATCH ENDED - ahora enviamos la info al componente React
   * --------------------------------------------------------- */
  async handleMatchEnd(data) {
    try {
      const profile = await getProfile();
      const myId = String(profile?.data?.id);
      if (!myId) return;

      const payload = this.normalizaDatosFinal(
        data.scores,
        data.puntosChange,
        myId
      );

      // Esperamos a que el callback exista (máx 2 s)
      await this.waitForFunction(
        () => typeof this.onMatchEnd === "function",
        2000
      );
      this.onMatchEnd(payload);
    } catch (err) {
      console.error("Error procesando match_ended:", err);
    }
  }

  /* ------------- setters para los callbacks ------------- */
  setOnMatchEnd(callback) {
    this.onMatchEnd = callback;
  }

  static getInstance() {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
      console.log("No estaba conectado");
    }
    return SocketService.instance;
  }

  // Función para inicializar el socket
  initialize(token, username, navigate) {
    this.navigate = navigate;
    this.connect(token, username);
  }

  async connect(token, username) {
    if (this.socket) {
      console.log("Socket ya está conectado.");
      return;
    }
    try {
      this.socket = io("wss://adrenalux.duckdns.org", {
        path: "/socket.io",
        transports: ["websocket"],
        query: { username },
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        secure: true,
        withCredentials: true,
      });

      this.socket.on("connect", () => {
        console.log("Conectado al socket");
        this.setupExchangeListeners();
        this.setupMatchListeners();
      });

      this.socket.on("notification", (data) => this.handleNotification(data));
      this.socket.on("connect_error", (error) =>
        console.log("Error de conexión:", error)
      );
      this.socket.on("connect_timeout", () =>
        console.log("Tiempo de conexión agotado")
      );
    } catch (error) {
      console.error("Error al conectar con el socket:", error);
    }
  }

  // Configuración de los listeners
  setupExchangeListeners() {
    this.socket.on("request_exchange_received", (data) =>
      this.handleIncomingRequest(data)
    );
    this.socket.on("exchange_accepted", (data) =>
      this.handleExchangeAccepted(data)
    );
    this.socket.on("exchange_declined", (data) =>
      this.handleExchangeRejected(data)
    );
    this.socket.on("error", (data) => this.handleExchangeError(data));
    this.socket.on("cards_selected", (data) => this.handleCardsSelected(data)); // Escuchar cards_selected
    this.socket.on("confirmation_updated", (data) =>
      this.handleConfirmationUpdate(data)
    );
    this.socket.on("exchange_completed", (data) =>
      this.handleExchangeCompleted(data)
    );
    this.socket.on("exchange_cancelled", (data) =>
      this.handleExchangeCancelled(data)
    );
  }

  // Función para manejar la selección de cartas del oponente
  handleCardsSelected(data) {
    console.log("Carta seleccionada por el oponente:", data);
    const { card, userId } = data; // Obtener la carta y el userId del que seleccionó la carta
    if (this.onOpponentCardSelected) {
      this.onOpponentCardSelected({ card, userId }); // Llamar al callback para notificar al componente
    }
  }

  // Función para registrar un callback cuando el oponente selecciona una carta
  setOnOpponentCardSelected(callback) {
    this.onOpponentCardSelected = callback;
  }

  setOnConfirmationUpdate(callback) {
    this.onConfirmationsUpdated = callback;
  }

  // Resto de las funciones de SocketService...
  handleExchangeCompleted(data) {
    console.log(data);
    this.navigate("/home");
  }

  handleExchangeCancelled(data) {
    console.log(data);
    this.navigate("/home");
  }

  handleConfirmationUpdate(data) {
    const confirmations = data["confirmations"];
    console.log(confirmations);
    if (this.onConfirmationsUpdated) {
      this.onConfirmationsUpdated({ confirmations });
    }
  }

  handleNotification(data) {
    console.log(data);
  }

  handleIncomingRequest(data) {
    const { solicitanteUsername, exchangeId } = data;
    const notificationDiv = document.createElement("div");
    notificationDiv.innerHTML = `
      <div id="exchange-notification" style="
        position: fixed; 
        top: 20px; 
        right: -300px; 
        width: 250px; 
        background:rgb(48, 43, 43); 
        padding: 15px; 
        border-radius: 10px; 
        box-shadow: 0 0 10px rgba(0,0,0,0.3); 
        z-index: 1000; 
        opacity: 0; 
        transition: right 0.5s ease-out, opacity 0.5s ease-out;
      ">
        <p style="margin-bottom: 15px; text-align: center;"><strong>${solicitanteUsername}</strong> quiere realizar un intercambio</p>
        <div style="display: flex; justify-content: center; gap: 10px;">
          <button id="accept-btn" style="padding: 5px 10px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer;">Aceptar</button>
          <button id="decline-btn" style="padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Rechazar</button>
        </div>
      </div>
    `;

    document.body.appendChild(notificationDiv);

    const notificationElement = document.getElementById(
      "exchange-notification"
    );
    setTimeout(() => {
      notificationElement.style.right = "20px";
      notificationElement.style.opacity = "1";
    }, 100);

    document.getElementById("accept-btn").addEventListener("click", () => {
      this.socket.emit("accept_exchange", exchangeId);
      console.log("Intercambio aceptado", exchangeId);
      this.navigate(`/intercambio/${encodeURIComponent(exchangeId)}`);
      document.body.removeChild(notificationDiv);
    });

    document.getElementById("decline-btn").addEventListener("click", () => {
      this.socket.emit("accept_exchange", { exchangeId });
      this.navigate("/home");
      document.body.removeChild(notificationDiv);
    });
  }

  handleExchangeAccepted(data) {
    console.log("Intercambio aceptado", data);
    this.navigate(`/intercambio/${encodeURIComponent(data.exchangeId)}`);
  }

  handleExchangeRejected(data) {
    console.log("Intercambio rechazado", data);
    this.navigate("/amigo");
  }

  handleExchangeError(error) {
    console.log(error);
  }

  confirmExchange(exchangeId) {
    this.socket.emit("confirm_exchange", exchangeId);
  }

  cancelConfirmation(exchangeId) {
    this.socket.emit("cancel_confirmation", exchangeId);
  }

  cancelExchange(exchangeId) {
    this.socket.emit("cancel_exchange", exchangeId);
  }

  selectCard(exchangeId, cardId) {
    console.log(cardId);
    if (this.socket == null) {
      console.log("Socket desconectado");
    }
    this.socket.emit("select_cards", { exchangeId, cardId });
  }

  sendExchangeRequest(receptorId, username) {
    this.socket.emit("request_exchange", {
      receptorId,
      solicitanteUsername: username,
    });
  }

  acceptExchangeRequest(exchangeId) {
    this.socket.emit("accept_exchange", exchangeId);
  }

  cancelExchangeRequest(exchangeId) {
    this.socket.emit("decline_exchange", exchangeId);
  }

  requestExchange(id, username) {
    this.socket.emit("request_exchange", { id, username });
  }

  joinMatchmaking() {
    if (!this.socket) {
      console.error("Socket no está conectado");
      return;
    }
    console.log("Buscando partida");
    this.socket.emit("join_matchmaking");
  }

  leaveMatchmaking() {
    if (!this.socket) {
      console.error("Socket no está conectado");
      return;
    }
    this.socket.emit("leave_matchmaking");
  }

  selectCardMatch({ cartaId, skill }) {
    if (!this.socket) {
      console.error("Socket no está conectado");
      return;
    }
    console.log(skill);
    console.log(cartaId);
    this.socket.emit("select_card", { cartaId, skill });
  }

  selectResponse({ cartaId, skill }) {
    if (!this.socket) {
      console.error("Socket no está conectado");
      return;
    }
    console.log(skill);
    console.log(cartaId);
    this.socket.emit("select_response", { cartaId, skill });
  }

  surrender(matchId) {
    if (!this.socket) {
      console.error("Socket no está conectado");
      return;
    }
    const matchIdInt = parseInt(matchId, 10);
    if (isNaN(matchIdInt)) {
      console.error("matchId no es un número válido");
      return;
    }
    this.socket.emit("surrender", { matchId: matchIdInt });
  }

  setupMatchListeners() {
    if (!this.socket) return;

    // Matchmaking
    this.socket.on("matchmaking_status", (data) =>
      this.handleMatchmakingStatus(data)
    );
    this.socket.on("match_found", (data) => this.handleMatchFound(data));

    // Eventos de partida
    this.socket.on("round_start", (data) => this.handleRoundStart(data));
    this.socket.on("opponent_selection", (data) =>
      this.handleOpponentSelection(data)
    );
    this.socket.on("round_result", (data) => this.handleRoundResult(data));
    this.socket.on("match_ended", (data) => this.handleMatchEnd(data));
    this.socket.on("match_error", (data) => this.handleMatchError(data));
  }

  handleMatchmakingStatus(data) {
    console.log("Estado del matchmaking:", data);
  }

  handleMatchFound(data) {
    console.log("Partida encontrada:", data);
    this.navigate(`/partida/${encodeURIComponent(data.matchId)}`);
  }

  async handleRoundStart(data) {
    console.log("Ronda iniciada:", data);

    try {
      const profile = await getProfile();
      console.log("Perfil obtenido:", profile);

      if (!profile || !profile.data) {
        console.error("Error: Perfil no disponible");
        return;
      }

      const isPlayerTurn = profile.data.id == data.starter;

      // Crear una nueva copia del objeto con la propiedad adicional
      const dataConTurno = {
        ...data,
        isPlayerTurn: isPlayerTurn,
      };

      await this.waitForFunction(
        () => typeof this.onRoundStart === "function",
        2000
      );

      this.showTurnNotification(
        isPlayerTurn ? "¡TU TURNO!" : "Turno del rival",
        isPlayerTurn
      );
      this.onRoundStart({ dataConTurno });
    } catch (error) {
      console.error("Error en handleRoundStart:", error);
      this.showTurnNotification("Error al obtener datos", false);
    }
  }

  waitForFunction(conditionFn, timeout = 2000, interval = 50) {
    return new Promise((resolve, reject) => {
      const start = Date.now();

      const check = () => {
        if (conditionFn()) {
          resolve();
        } else if (Date.now() - start > timeout) {
          reject(
            new Error("Tiempo de espera agotado: la función no se definió")
          );
        } else {
          setTimeout(check, interval);
        }
      };

      check();
    });
  }

  // Función auxiliar para mostrar notificaciones
  showTurnNotification(message, isPlayerTurn) {
    const notificationDiv = document.createElement("div");
    notificationDiv.style.position = "fixed";
    notificationDiv.style.top = "20px";
    notificationDiv.style.left = "0";
    notificationDiv.style.right = "0";
    notificationDiv.style.margin = "0 auto";
    notificationDiv.style.width = "fit-content";
    notificationDiv.style.padding = "15px 25px";
    notificationDiv.style.borderRadius = "8px";
    notificationDiv.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    notificationDiv.style.zIndex = "1000";
    notificationDiv.style.opacity = "0";
    notificationDiv.style.transform = "translateY(-20px)";
    notificationDiv.style.transition = "all 0.3s ease-out";
    notificationDiv.style.textAlign = "center";
    notificationDiv.style.fontWeight = "bold";
    notificationDiv.style.fontSize = "16px";
    notificationDiv.style.color = "white";
    notificationDiv.style.backgroundColor = isPlayerTurn
      ? "#4CAF50"
      : "#F44336";
    notificationDiv.textContent = message;

    document.body.appendChild(notificationDiv);

    // Animación de entrada
    setTimeout(() => {
      notificationDiv.style.opacity = "1";
      notificationDiv.style.transform = "translateY(0)";
    }, 10);

    // Ocultar después de 2 segundos
    setTimeout(() => {
      notificationDiv.style.opacity = "0";
      notificationDiv.style.transform = "translateY(-20px)";

      // Eliminar después de la animación
      setTimeout(() => {
        if (notificationDiv.parentNode) {
          notificationDiv.parentNode.removeChild(notificationDiv);
        }
      }, 300);
    }, 2000);
  }

  handleOpponentSelection(data) {
    this.onOpponentSelection({ data });
  }

  async handleRoundResult(data) {
    try {
      const profile = await getProfile();
      const myId = profile?.data?.id;

      if (!myId) {
        console.error("ID del perfil no disponible.");
        return;
      }

      const allPlayerIds = Object.keys(data.scores);

      // Reorganizar scores
      const [playerId, opponentId] =
        allPlayerIds[0] == myId
          ? [allPlayerIds[0], allPlayerIds[1]]
          : [allPlayerIds[1], allPlayerIds[0]];

      data.scores = {
        player: data.scores[playerId],
        opponent: data.scores[opponentId],
      };

      this.onRoundResult({ data });
      console.log("Resultado de ronda (ajustado):", data);
    } catch (error) {
      console.error("Error al procesar resultado de ronda:", error);
    }
  }

  handleMatchEnd(data) {
    console.log("Partida terminada:", data);
    if (this.onMatchEnd) this.onMatchEnd(data);
  }

  handleMatchError(data) {
    console.error("Error en partida:", data);
  }

  // Callbacks para actualizar la UI
  setOnMatchFound(callback) {
    this.onMatchFound = callback;
  }

  setOnRoundStart(callback) {
    this.onRoundStart = callback;
  }

  setOnOpponentSelection(callback) {
    this.onOpponentSelection = callback;
  }

  setOnRoundResult(callback) {
    this.onRoundResult = callback;
  }

  setOnMatchEnd(callback) {
    this.onMatchEnd = callback;
  }
}

// Usar la instancia única
export const socketService = SocketService.getInstance();
