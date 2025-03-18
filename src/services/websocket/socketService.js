import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.onOpponentCardSelected = null; // Callback para notificar la selección de carta
    this.onConfirmationsUpdated = null;
    this.navigate = null;
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
      this.socket = io('wss://adrenalux.duckdns.org', {
        path: '/socket.io',
        transports: ['websocket'],
        query: { username },
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        secure: true,
        withCredentials: true
      });

      this.socket.on('connect', () => {
        console.log('Conectado al socket');
        this.setupExchangeListeners();
      });

      this.socket.on('notification', (data) => this.handleNotification(data));
      this.socket.on('connect_error', (error) => console.log('Error de conexión:', error));
      this.socket.on('connect_timeout', () => console.log('Tiempo de conexión agotado'));
    } catch (error) {
      console.error('Error al conectar con el socket:', error);
    }
  }

  // Configuración de los listeners
  setupExchangeListeners() {
    this.socket.on('request_exchange_received', (data) => this.handleIncomingRequest(data));
    this.socket.on('exchange_accepted', (data) => this.handleExchangeAccepted(data));
    this.socket.on('exchange_declined', (data) => this.handleExchangeRejected(data));
    this.socket.on('error', (data) => this.handleExchangeError(data));
    this.socket.on('cards_selected', (data) => this.handleCardsSelected(data)); // Escuchar cards_selected
    this.socket.on('confirmation_updated', (data) => this.handleConfirmationUpdate(data));
    this.socket.on('exchange_completed', (data) => this.handleExchangeCompleted(data));
    this.socket.on('exchange_cancelled', (data) => this.handleExchangeCancelled(data));
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

  // Resto de las funciones de SocketService...
  handleExchangeCompleted(data) {
    console.log(data);
  }

  handleExchangeCancelled(data) {
    console.log(data);
  }

  handleConfirmationUpdate(data) {
    const confirmations = data['confirmations'];
    if (this.onConfirmationsUpdated) {
      this.onConfirmationsUpdated(confirmations);
    }
  }

  handleNotification(data) {
    console.log(data);
  }

  handleIncomingRequest(data) {
    const { solicitanteUsername, exchangeId } = data;
    const notificationDiv = document.createElement('div');
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

    const notificationElement = document.getElementById('exchange-notification');
    setTimeout(() => {
      notificationElement.style.right = '20px';
      notificationElement.style.opacity = '1';
    }, 100);

    document.getElementById('accept-btn').addEventListener('click', () => {
      this.socket.emit('accept_exchange', exchangeId);
      console.log('Intercambio aceptado', exchangeId);
      this.navigate(`/intercambio/${encodeURIComponent(exchangeId)}`);
      document.body.removeChild(notificationDiv);
    });

    document.getElementById('decline-btn').addEventListener('click', () => {
      this.socket.emit('accept_exchange', { exchangeId });
      this.navigate('/home');
      document.body.removeChild(notificationDiv);
    });
  }

  handleExchangeAccepted(data) {
    console.log('Intercambio aceptado', data);
    this.navigate(`/intercambio/${encodeURIComponent(data.exchangeId)}`);
  }

  handleExchangeRejected(data) {
    console.log('Intercambio rechazado', data);
    this.navigate('/amigo');
  }

  handleExchangeError(error) {
    console.log(error);
  }

  confirmExchange(exchangeId) {
    this.socket.emit('confirm_exchange', exchangeId);
  }

  cancelConfirmation(exchangeId) {
    this.socket.emit('cancel_confirmation', exchangeId);
  }

  cancelExchange(exchangeId) {
    this.socket.emit('cancel_exchange', exchangeId);
  }

  selectCard(exchangeId, cardId) {
    console.log(cardId);
    if (this.socket == null) {
      console.log("Socket desconectado");
    }
    this.socket.emit('select_cards', { exchangeId, cardId });
  }

  sendExchangeRequest(receptorId, username) {
    this.socket.emit('request_exchange', { receptorId, solicitanteUsername: username });
  }

  acceptExchangeRequest(exchangeId) {
    this.socket.emit('accept_exchange', exchangeId);
  }

  cancelExchangeRequest(exchangeId) {
    this.socket.emit('decline_exchange', exchangeId);
  }

  requestExchange(id, username) {
    this.socket.emit('request_exchange', { id, username });
  }
}

// Usar la instancia única
export const socketService = SocketService.getInstance();