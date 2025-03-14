import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.onOpponentCardSelected = null;
    this.onConfirmationsUpdated = null;
  }

  static getInstance() {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  // Función para inicializar el socket
  initialize(token, username) {
    this.connect(token, username);
  }

  async connect(token, username) {
    if (this.socket) {
      console.log("Socket ya está conectado.");
      return;
    }
    try {
      this.socket = io('http://54.37.50.18:3000', {
        transports: ['websocket'],
        query: { username },
        auth: { token },
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
    this.socket.on('cards_selected', (data) => this.handleCardsSelected(data));
    this.socket.on('confirmation_updated', (data) => this.handleConfirmationUpdate(data));
    this.socket.on('exchange_completed', (data) => this.handleExchangeCompleted(data));
    this.socket.on('exchange_cancelled', (data) => this.handleExchangeCancelled(data));
  }

  // Funciones para manejar los mensajes entrantes
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

  handleCardsSelected(data) {
    const userId = data['userId'];
    const card = data['card']; // Asumiendo que card es un objeto que ya tienes definido en algún lugar
    if (userId !== 'currentUserId') {
      if (this.onOpponentCardSelected) {
        this.onOpponentCardSelected(card);
      }
    }
  }

  handleNotification(data) {
    console.log(data);

  }

  handleIncomingRequest(data) {
    console.log(data);
    console.log("hola");
  }

  handleExchangeAccepted(data) {
    const myUsername = 'currentUserName'; // Esto deberías obtenerlo de algún estado global o contexto
    const { solicitanteUsername, receptorUsername } = data;
    const username = myUsername === solicitanteUsername ? receptorUsername : solicitanteUsername;

    console.log('Intercambio aceptado', data, username);
    // Navegar a la pantalla de intercambio
  }

  handleExchangeRejected(data) {
    console.log(data);
  }

  handleExchangeError(error) {
    console.log(error);
  }

  // Funciones para emitir eventos por socket
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

  requestExchange(id, username){
    
    this.socket.emit('request_exchange', { id, username });
  }
}

// Usar la instancia única
export const socketService = SocketService.getInstance();
