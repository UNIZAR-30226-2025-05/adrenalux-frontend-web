import { useEffect, useState } from "react";
import exchangeSocketService from "../../../services/websocket/socketService";

export default function NotificacionIntercambio() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    exchangeSocketService.setOnNotification((data) => {
      setNotification(data);
    });
  }, []);

  const handleAccept = () => {
    setNotification(null);
    exchangeSocketService.acceptExchange(notification.exchangeId);
  };

  const handleReject = () => {
    setNotification(null);
    exchangeSocketService.cancelExchange(notification.exchangeId);
  };

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-xl shadow-lg z-50">
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