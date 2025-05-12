import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCoins, FaTimes } from "react-icons/fa";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const CoinShop = ({ onClose, adrenacoins }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");
  const modalRef = useRef();

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  const coinPackages = [
    {
      id: "basic",
      title: "Paquete Básico",
      coins: 500,
      bonus: 50,
      price: 10,
      color: "from-blue-500 to-blue-700",
      border: "border-blue-400",
    },
    {
      id: "premium",
      title: "Paquete Premium",
      coins: 3000,
      bonus: 500,
      price: 50,
      color: "from-purple-500 to-purple-700",
      border: "border-purple-400",
    },
    {
      id: "deluxe",
      title: "Paquete Deluxe",
      coins: 7000,
      bonus: 1500,
      price: 100,
      color: "from-yellow-500 to-yellow-700",
      border: "border-yellow-400",
    },
  ];

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowSuccess(false);
    setShowError(false);
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: `${selectedPackage.title} - ${
            selectedPackage.coins + selectedPackage.bonus
          } monedas`,
          amount: {
            value: selectedPackage.price,
            currency_code: "EUR",
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      setMessage(
        `¡Compra exitosa! Has recibido ${
          selectedPackage.coins + selectedPackage.bonus
        } monedas.`
      );
      setShowSuccess(true);
      setShowError(false);
    });
  };

  const onError = (err) => {
    console.error("Error en PayPal:", err);
    setMessage(
      "Ocurrió un error al procesar el pago. Por favor, intenta nuevamente."
    );
    setShowError(true);
    setShowSuccess(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Cierra al hacer clic en el fondo
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border-2 border-purple-500 max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Evita que el clic se propague al fondo
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-purple-600 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaCoins className="text-yellow-400 mr-2" />
            Tienda de Monedas
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-300 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Current Balance */}
        <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
          <span className="text-gray-300">Tus monedas:</span>
          <div className="flex items-center">
            <span className="text-yellow-400 font-bold text-xl mr-2">
              {adrenacoins}
            </span>
            <FaCoins className="text-yellow-400 text-xl" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Selecciona un paquete:
          </h3>

          {/* Packages */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {coinPackages.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePackageSelect(pkg)}
                className={`bg-gradient-to-r ${
                  pkg.color
                } rounded-lg p-4 cursor-pointer border-2 ${
                  selectedPackage?.id === pkg.id
                    ? `${pkg.border} ring-2 ring-white`
                    : "border-transparent"
                } transition-all`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-bold text-lg">
                      {pkg.title}
                    </h4>
                    <div className="flex items-center mt-2">
                      <FaCoins className="text-yellow-400 mr-2" />
                      <span className="text-white font-bold">
                        {pkg.coins + pkg.bonus} monedas
                      </span>
                      {pkg.bonus > 0 && (
                        <span className="ml-2 bg-yellow-500 text-xs text-black px-2 py-1 rounded-full">
                          +{pkg.bonus} bonus
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold text-xl">
                      {pkg.price}€
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {selectedPackage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4"
            >
              <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-purple-500">
                <h4 className="text-white font-bold mb-2">Resumen:</h4>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>Paquete:</span>
                  <span>{selectedPackage.title}</span>
                </div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>Monedas:</span>
                  <span className="flex items-center">
                    {selectedPackage.coins}
                    {selectedPackage.bonus > 0 && (
                      <span className="text-yellow-400 ml-1">
                        (+{selectedPackage.bonus})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-white font-bold mt-3 pt-2 border-t border-gray-700">
                  <span>Total:</span>
                  <span>{selectedPackage.price}€</span>
                </div>
              </div>

              <PayPalScriptProvider
                options={{
                  "client-id": paypalClientId,
                  currency: "EUR",
                }}
              >
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "gold",
                    shape: "pill",
                    label: "pay",
                    height: 40,
                  }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              </PayPalScriptProvider>
            </motion.div>
          )}

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-3 bg-green-600 text-white rounded-lg"
              >
                {message}
              </motion.div>
            )}
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-3 bg-red-600 text-white rounded-lg"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 p-3 text-center text-xs text-gray-400 border-t border-gray-800">
          Las compras son finales y no reembolsables.
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CoinShop;
