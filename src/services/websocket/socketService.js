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
      // ya tienes data.scores, data.puntosChange, data.winner…
      const payload = {
        scores: data.scores,
        puntosChange: data.puntosChange,
        winner: data.winner,
        isDraw: data.isDraw,
      };
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
    
    // Create a container for the notification
    const notificationDiv = document.createElement("div");
    notificationDiv.innerHTML = `
      <div id="exchange-notification" class="notification-container">
        <div class="notification-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 1l4 4-4 4"></path>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <path d="M7 23l-4-4 4-4"></path>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
          </svg>
        </div>
        <div class="notification-content">
          <h4>Solicitud de Intercambio</h4>
          <p><strong>${solicitanteUsername}</strong> quiere realizar un intercambio</p>
          <div class="notification-actions">
            <button id="accept-btn" class="btn accept">Aceptar</button>
            <button id="decline-btn" class="btn decline">Rechazar</button>
          </div>
        </div>
      </div>
    `;
  
    // Add styles to the document if they don't exist yet
    if (!document.getElementById('notification-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'notification-styles';
      styleSheet.innerHTML = `
        .notification-container {
          position: fixed;
          top: 20px;
          right: -350px;
          width: 300px;
          background: #2a2a2a;
          color: #fff;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          z-index: 1000;
          opacity: 0;
          transition: right 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55), 
                      opacity 0.6s ease-out,
                      transform 0.5s ease;
          display: flex;
          align-items: center;
          overflow: hidden;
          transform: translateY(10px);
        }
        
        .notification-container:hover {
          transform: translateY(0) scale(1.02);
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }
        
        .notification-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          background: linear-gradient(to bottom, #4caf50, #2196F3);
        }
        
        .notification-icon {
          margin-right: 15px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          padding: 10px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-content h4 {
          margin: 0 0 5px 0;
          font-weight: 600;
          color: #fff;
          font-size: 16px;
        }
        
        .notification-content p {
          margin: 0 0 15px 0;
          font-size: 14px;
          opacity: 0.9;
        }
        
        .notification-actions {
          display: flex;
          gap: 10px;
        }
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }
        
        .btn:active {
          transform: scale(0.95);
        }
        
        .accept {
          background: #4caf50;
          color: white;
        }
        
        .accept:hover {
          background: #3d9140;
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
        }
        
        .decline {
          background: #f44336;
          color: white;
        }
        
        .decline:hover {
          background: #d32f2f;
          box-shadow: 0 2px 8px rgba(244, 67, 54, 0.4);
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .notification-entry {
          animation: pulse 2s infinite;
        }
      `;
      document.head.appendChild(styleSheet);
    }
  
    document.body.appendChild(notificationDiv);
  
    // Get the notification element and add animation
    const notificationElement = notificationDiv.firstElementChild;
    
    // Show notification with animation
    setTimeout(() => {
      // Calculate position based on screen size
      const screenWidth = window.innerWidth;
      const rightPosition = screenWidth <= 360 ? "10px" : "20px";
      
      notificationElement.style.right = rightPosition;
      notificationElement.style.opacity = "1";
      notificationElement.style.transform = "translateY(0)";
      notificationElement.classList.add('notification-entry');
      
      // Remove pulse animation after 3 seconds
      setTimeout(() => {
        notificationElement.classList.remove('notification-entry');
      }, 3000);
      
      // Add resize event listener to keep notification positioned correctly
      const handleResize = () => {
        const currentScreenWidth = window.innerWidth;
        const newRightPosition = currentScreenWidth <= 360 ? "10px" : "20px";
        notificationElement.style.right = newRightPosition;
      };
      
      window.addEventListener('resize', handleResize);
      
      // Store the event listener reference on the element for cleanup
      notificationElement._resizeHandler = handleResize;
    }, 100);
  
    // Add event listeners
    notificationDiv.querySelector("#accept-btn").addEventListener("click", () => {
      this.socket.emit("accept_exchange", exchangeId);
      console.log("Intercambio aceptado", exchangeId);
      
      // Add exit animation
      notificationElement.style.opacity = "0";
      notificationElement.style.right = "-350px";
      
      // Remove from DOM and cleanup resize listener after animation completes
      setTimeout(() => {
        if (notificationElement._resizeHandler) {
          window.removeEventListener('resize', notificationElement._resizeHandler);
        }
        document.body.removeChild(notificationDiv);
        this.navigate(`/intercambio/${encodeURIComponent(exchangeId)}`);
      }, 600);
    });
  
    notificationDiv.querySelector("#decline-btn").addEventListener("click", () => {
      this.socket.emit("decline_exchange", { exchangeId });
      
      // Add exit animation
      notificationElement.style.opacity = "0";
      notificationElement.style.right = "-350px";
      
      // Remove from DOM and cleanup resize listener after animation completes
      setTimeout(() => {
        if (notificationElement._resizeHandler) {
          window.removeEventListener('resize', notificationElement._resizeHandler);
        }
        document.body.removeChild(notificationDiv);
        this.navigate("/home");
      }, 600);
    });
  }
  
  handleIncomingRequestMatch(data) {
    const { matchRequestId, solicitanteUsername } = data;
    console.log(matchRequestId)
    
    // Create a container for the notification
    const notificationDiv = document.createElement("div");
    notificationDiv.innerHTML = `
      <div id="match-notification" class="notification-container match-notification">
        <div class="notification-icon match-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
          </svg>
        </div>
        <div class="notification-content">
          <h4>Solicitud de Partido</h4>
          <p><strong>${solicitanteUsername}</strong> quiere jugar un partido</p>
          <div class="notification-actions">
            <button id="accept-match-btn" class="btn accept">Aceptar</button>
            <button id="decline-match-btn" class="btn decline">Rechazar</button>
          </div>
        </div>
      </div>
    `;
  
    // Add styles to the document if they don't exist yet
        if (!document.getElementById('notification-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'notification-styles';
      styleSheet.innerHTML = `
        .notification-container {
          position: fixed;
          top: 20px;
          right: -350px;
          width: 85%;
          max-width: 300px;
          background: #2a2a2a;
          color: #fff;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          z-index: 1000;
          opacity: 0;
          transition: right 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55), 
                      opacity 0.6s ease-out,
                      transform 0.5s ease;
          display: flex;
          align-items: center;
          overflow: hidden;
          transform: translateY(10px);
        }
        
        .notification-container:hover {
          transform: translateY(0) scale(1.02);
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }
        
        .notification-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          background: linear-gradient(to bottom, #4caf50, #2196F3);
        }
        
        .match-notification::before {
          background: linear-gradient(to bottom, #ff9800, #ff5722);
        }
        
        .notification-icon {
          margin-right: 15px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          padding: 10px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .match-icon {
          background: rgba(255, 152, 0, 0.15);
        }
        
        .notification-content {
          flex: 1;
          min-width: 0;
        }
        
        .notification-content h4 {
          margin: 0 0 5px 0;
          font-weight: 600;
          color: #fff;
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .notification-content p {
          margin: 0 0 15px 0;
          font-size: 14px;
          opacity: 0.9;
          word-break: break-word;
        }
        
        .notification-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          flex: 1;
          min-width: 80px;
          text-align: center;
        }
        
        .btn:active {
          transform: scale(0.95);
        }
        
        .accept {
          background: #4caf50;
          color: white;
        }
        
        .accept:hover {
          background: #3d9140;
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
        }
        
        .decline {
          background: #f44336;
          color: white;
        }
        
        .decline:hover {
          background: #d32f2f;
          box-shadow: 0 2px 8px rgba(244, 67, 54, 0.4);
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .notification-entry {
          animation: pulse 2s infinite;
        }
        
        /* Responsive adjustments */
        @media screen and (max-width: 576px) {
          .notification-container {
            top: 10px;
            max-width: 260px;
            padding: 12px;
          }
          
          .notification-content h4 {
            font-size: 15px;
          }
          
          .notification-content p {
            font-size: 13px;
            margin-bottom: 10px;
          }
          
          .btn {
            padding: 6px 12px;
            font-size: 13px;
          }
          
          .notification-icon {
            padding: 8px;
          }
          
          .notification-icon svg {
            width: 20px;
            height: 20px;
          }
        }
        
        @media screen and (max-width: 360px) {
          .notification-container {
            display: flex;
            flex-direction: column;
            text-align: center;
            padding: 10px;
          }
          
          .notification-icon {
            margin-right: 0;
            margin-bottom: 10px;
          }
          
          .notification-actions {
            width: 100%;
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  
    document.body.appendChild(notificationDiv);
  
    // Get the notification element and add animation
    const notificationElement = notificationDiv.firstElementChild;
    
    // Show notification with animation
    setTimeout(() => {
      // Calculate position based on screen size
      const screenWidth = window.innerWidth;
      const rightPosition = screenWidth <= 360 ? "10px" : "20px";
      
      notificationElement.style.right = rightPosition;
      notificationElement.style.opacity = "1";
      notificationElement.style.transform = "translateY(0)";
      notificationElement.classList.add('notification-entry');
      
      // Remove pulse animation after 3 seconds
      setTimeout(() => {
        notificationElement.classList.remove('notification-entry');
      }, 3000);
      
      // Add resize event listener to keep notification positioned correctly
      const handleResize = () => {
        const currentScreenWidth = window.innerWidth;
        const newRightPosition = currentScreenWidth <= 360 ? "10px" : "20px";
        notificationElement.style.right = newRightPosition;
      };
      
      window.addEventListener('resize', handleResize);
      
      // Store the event listener reference on the element for cleanup
      notificationElement._resizeHandler = handleResize;
    }, 100);
  
    // Add event listeners
    notificationDiv.querySelector("#accept-match-btn").addEventListener("click", () => {
      this.socket.emit("accept_match", matchRequestId);
      console.log("Partido aceptado", matchRequestId);
      
      // Add exit animation
      notificationElement.style.opacity = "0";
      notificationElement.style.right = "-350px";
      
      // Remove from DOM and cleanup resize listener after animation completes
      setTimeout(() => {
        if (notificationElement._resizeHandler) {
          window.removeEventListener('resize', notificationElement._resizeHandler);
        }
        document.body.removeChild(notificationDiv);
        this.navigate(`/buscandoPartida`);
      }, 600);
    });
  
    notificationDiv.querySelector("#decline-match-btn").addEventListener("click", () => {
      this.socket.emit("decline_match", { matchRequestId });
      
      // Add exit animation
      notificationElement.style.opacity = "0";
      notificationElement.style.right = "-350px";
      
      // Remove from DOM and cleanup resize listener after animation completes
      setTimeout(() => {
        if (notificationElement._resizeHandler) {
          window.removeEventListener('resize', notificationElement._resizeHandler);
        }
        document.body.removeChild(notificationDiv);
        this.navigate("/home");
      }, 600);
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

  sendChallengeRequest(receptorId, username) {
    const id = String(receptorId); // convierte receptorId a string
    this.socket.emit("request_match", {
      receptorId: id,
      solicitanteUsername: username,
    });
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

  // emitter de pausa
  pause(matchId) {
    if (!this.socket) return;
    this.socket.emit("request_pause", { matchId });
  }
  // emitter de reanudar
  resume(matchId) {
    if (!this.socket) return;
    this.socket.emit("request_resume", { matchId });
  }

  // registra callback
  setOnMatchPaused(cb) {
    this.onMatchPaused = cb;
  }
  setOnMatchResumed(cb) {
    this.onMatchResumed = cb;
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

    this.socket.on("match_paused", (data) => this.handleMatchPaused(data));
    this.socket.on("match_resumed", (data) => this.handleMatchResumed(data));

    this.socket.on("request_match_received", (data) =>
      this.handleIncomingRequestMatch(data)
    );
  }

  //Hanlders
  handleMatchPaused(data) {
    console.log("Partida pausada:", data);
    if (this.onMatchPaused) this.onMatchPaused(data);
  }
  handleMatchResumed(data) {
    console.log("Partida reanudada:", data);
    if (this.onMatchResumed) this.onMatchResumed(data);
  }

  handleMatchmakingStatus(data) {
    console.log("Estado del matchmaking:", data);
  }

  /*handleMatchFound(data) {
    console.log("Partida encontrada:", data);
    this.navigate(`/partida/${encodeURIComponent(data.matchId)}`);
  }*/

  handleMatchFound(data) {
    console.log("Partida encontrada:", data);

    // 1) First, let the component show the UI
    if (typeof this.onMatchFound === "function") {
      this.onMatchFound(data);
    }

    // 2) Only after a delay do we actually navigate
    setTimeout(() => {
      this.navigate(`/partida/${encodeURIComponent(data.matchId)}`);
    }, 5000); // 3 seconds → adjust as you like
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
        5000
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
}

// Usar la instancia única
export const socketService = SocketService.getInstance();
