import { useEffect, useState } from "react";
import socketService from "../../../services/websocket/socketService";

export default function NotificacionIntercambio() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    socketService.setOnIncomingRequest((data) => {
      setNotification({
        solicitanteUsername: data.solicitanteUsername,
        exchangeId: data.exchangeId,
      });
    });
  }, []);

  const handleAccept = () => {
    setNotification(null);
    socketService.acceptExchangeRequest(notification.exchangeId);
  };

  const handleReject = () => {
    setNotification(null);
    socketService.cancelExchangeRequest(notification.exchangeId);
  };

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-xl shadow-lg z-50 animate-fade-in">
      <p className="text-lg font-semibold mb-2">
        {notification.solicitanteUsername} te ha invitado a un intercambio
      </p>
      <div className="mt-2 flex justify-end gap-2">
        <button
          onClick={handleAccept}
          className="bg-green-500 px-4 py-2 rounded font-bold"
        >
          Aceptar
        </button>
        <button
          onClick={handleReject}
          className="bg-gray-800 px-4 py-2 rounded font-bold"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
