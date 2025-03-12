import { getToken } from "../api/authApi";

class SocketService {
  constructor() {
    if (!SocketService.instance) {
      this.socket = null;
      SocketService.instance = this;
    }
    return SocketService.instance;
  }

  initialize(handleNotification) {
    const token = getToken();
    if (!token) {
      console.error("No token found, unable to connect to WebSocket");
      return;
    }

    this.socket = io("http://10.0.2.2:3000", {
      transports: ["websocket"],
      auth: { token },
    });

    this.socket.on("connect", () => console.log("✅ Connected to WebSocket"));

    this.socket.on("notification", (data) =>
      this.handleNotification(data, handleNotification)
    );

    this.socket.on("connect_error", (error) =>
      console.error("⚠️ WebSocket connection error:", error)
    );
    this.socket.on("disconnect", () =>
      console.log("❌ Disconnected from WebSocket")
    );
  }

  handleNotification(data, handleNotification) {
    try {
      const { type, data: notificationData } = data;
      let message = "New notification";

      switch (type) {
        case "exchange":
          message = `Exchange with ${notificationData.senderName} pending`;
          break;
        case "battle":
          message = `⚔️ ${notificationData.senderName} challenges you to a duel!`;
          break;
        default:
          message = "New notification received";
      }

      handleNotification(message);
    } catch (error) {
      console.error("Error processing notification:", error);
      handleNotification("Error processing notification");
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log("🔌 WebSocket disconnected");
    }
  }
}

const socketService = new SocketService();
export default socketService;
