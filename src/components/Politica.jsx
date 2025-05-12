import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/adrenalux_logo_white.png";
import { getToken } from "../services/api/authApi";

const Politica = () => {
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    document.documentElement.classList.add("bg-black");
    document.body.className = "bg-gradient-to-b from-gray-900 to-black text-white";
    return () => {
      document.documentElement.classList.remove("bg-black");
      document.body.className = "";
    };
  }, []);

  const handleLoginClick = () => navigate("/login");
  const handleSignUpClick = () => navigate("/register");

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const sectionBoxStyle = "bg-gray-800/20 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur";

  return (
    <div className="w-full h-screen flex justify-center bg-gradient-to-b from-gray-900 to-black overflow-y-auto">
      <main className="w-full lg:w-2/3 px-6 pb-8 md:pb-12 space-y-10">
        {/* Navbar */}
        <header className="w-full px-4 py-4 md:px-8 md:py-6 flex justify-between items-center z-50 backdrop-blur-2xl border-b border-white/10">
          <motion.img
            src={logo}
            alt="AdrenaLux Logo"
            className="w-16 md:w-24 cursor-pointer transition-all duration-500 hover:scale-105"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            variants={itemVariants}
          />
          <nav className="flex gap-2 md:gap-4">
            {token ? (
              <motion.button
                onClick={() => navigate("/home")}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300 border border-white/10 backdrop-blur-lg text-sm md:text-base"
                variants={itemVariants}
              >
                Inicio
              </motion.button>
            ) : (
              <>
                <motion.button
                  onClick={handleLoginClick}
                  className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-300 border border-white/10 backdrop-blur-lg text-sm md:text-base"
                  variants={itemVariants}
                >
                  Iniciar sesión
                </motion.button>
                <motion.button
                  onClick={handleSignUpClick}
                  className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 px-6 py-2 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]"
                  variants={itemVariants}
                >
                  <span className="relative z-10">Registrarse</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </>
            )}
          </nav>
        </header>

        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent text-center">
          Política de Privacidad y Uso
        </h1>

        <p className="text-gray-300 text-lg max-w-3xl mx-auto text-center">
          En AdrenaLux nos comprometemos a proteger tu información y ofrecerte la mejor experiencia posible.
        </p>

        <section className="space-y-8">
          {/* Sección 1 - Recopilación de Información */}
          <div className={sectionBoxStyle}>
            <h2 className="text-2xl font-semibold text-white mb-3">
              1. Recopilación de Información
            </h2>
            <p className="text-gray-300">
              AdrenaLux recopila información necesaria para proporcionar y mejorar nuestros servicios de juego coleccionable. La información que recopilamos puede incluir:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mt-2 space-y-1">
              <li>Información de registro (nombre, correo electrónico, nombre de usuario)</li>
              <li>Información de perfil que elijas compartir</li>
              <li>Historial de transacciones y actividad dentro del juego</li>
              <li>Información técnica como dirección IP y datos del dispositivo</li>
              <li>Comunicaciones que mantengas con nuestro equipo de soporte</li>
            </ul>
            <p className="text-gray-300 mt-2">
              Toda la información recopilada se utiliza exclusivamente para mejorar tu experiencia, asegurar el funcionamiento correcto del juego y prevenir actividades fraudulentas.
            </p>
          </div>

          {/* Sección 2 - Uso de la Información */}
          <div className={sectionBoxStyle}>
            <h2 className="text-2xl font-semibold text-white mb-3">
              2. Uso de la Información
            </h2>
            <p className="text-gray-300">
              La información que recopilamos nos permite:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mt-2 space-y-1">
              <li>Proporcionar, mantener y mejorar nuestros servicios</li>
              <li>Personalizar tu experiencia de juego</li>
              <li>Procesar transacciones e intercambios de cartas</li>
              <li>Comunicarte actualizaciones, promociones y eventos especiales</li>
              <li>Prevenir el fraude y garantizar la seguridad del juego</li>
              <li>Cumplir con obligaciones legales y resolver disputas</li>
            </ul>
            <p className="text-gray-300 mt-2">
              Nunca venderemos tu información personal a terceros ni la utilizaremos para fines distintos a los mencionados anteriormente sin tu consentimiento explícito.
            </p>
          </div>

          {/* Sección 3 - Cartas y Propiedad Virtual */}
          <div className={sectionBoxStyle}>
            <h2 className="text-2xl font-semibold text-white mb-3">
              3. Cartas y Propiedad Virtual
            </h2>
            <p className="text-gray-300">
              Al utilizar AdrenaLux, entiendes y aceptas que:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mt-2 space-y-1">
              <li>Las cartas y objetos virtuales adquiridos son una licencia para usar contenido digital dentro del juego</li>
              <li>AdrenaLux mantiene todos los derechos de propiedad intelectual sobre el contenido del juego</li>
              <li>Las cartas y su valoración pueden cambiar con el tiempo basado en el rendimiento real de los jugadores</li>
              <li>Las transacciones e intercambios son finales y se realizan bajo tu responsabilidad</li>
              <li>Está prohibido vender o intercambiar cartas fuera de la plataforma oficial</li>
            </ul>
            <p className="text-gray-300 mt-2">
              Nos reservamos el derecho de modificar, actualizar o retirar cualquier contenido del juego cuando sea necesario para mantener el equilibrio y la integridad del sistema.
            </p>
          </div>

          {/* Sección 4 - Conducta del Usuario */}
          <div className={sectionBoxStyle}>
            <h2 className="text-2xl font-semibold text-white mb-3">
              4. Conducta del Usuario
            </h2>
            <p className="text-gray-300">
              Como usuario de AdrenaLux, te comprometes a:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mt-2 space-y-1">
              <li>No utilizar bots, scripts o métodos automáticos para jugar o adquirir cartas</li>
              <li>No participar en actividades que puedan considerarse trampa o explotación de errores</li>
              <li>Mantener un comportamiento respetuoso hacia otros jugadores</li>
              <li>No compartir información personal de otros usuarios</li>
              <li>No intentar acceder a áreas o información a la que no tengas autorización</li>
            </ul>
            <p className="text-gray-300 mt-2">
              El incumplimiento de estas normas puede resultar en la suspensión temporal o permanente de tu cuenta, así como la pérdida de contenido digital adquirido.
            </p>
          </div>

          {/* Sección 5 - Comunicaciones y Notificaciones */}
          <div className={sectionBoxStyle}>
            <h2 className="text-2xl font-semibold text-white mb-3">
              5. Comunicaciones y Notificaciones
            </h2>
            <p className="text-gray-300">
              Al registrarte en AdrenaLux, aceptas recibir:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mt-2 space-y-1">
              <li>Comunicaciones esenciales sobre tu cuenta y transacciones</li>
              <li>Actualizaciones importantes sobre el juego y cambios en las políticas</li>
              <li>Notificaciones sobre eventos, promociones y nuevas características</li>
            </ul>
            <p className="text-gray-300 mt-2">
              Puedes ajustar tus preferencias de notificación en cualquier momento desde la sección de configuración de tu cuenta. Sin embargo, algunas comunicaciones esenciales sobre tu cuenta no pueden deshabilitarse.
            </p>
          </div>

          {/* Sección 6 - Modificaciones a la Política */}
          <div className={sectionBoxStyle}>
            <h2 className="text-2xl font-semibold text-white mb-3">
              6. Modificaciones a la Política
            </h2>
            <p className="text-gray-300">
              AdrenaLux se reserva el derecho de modificar esta política en cualquier momento. Te notificaremos sobre cambios significativos mediante:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mt-2 space-y-1">
              <li>Un aviso visible dentro de la aplicación</li>
              <li>Un correo electrónico a la dirección asociada a tu cuenta</li>
              <li>Una actualización en nuestra página web oficial</li>
            </ul>
            <p className="text-gray-300 mt-2">
              El uso continuado de nuestros servicios después de cualquier modificación constituye tu aceptación de la nueva política. Te recomendamos revisar periódicamente esta página para estar informado sobre cualquier cambio.
            </p>
          </div>
        </section>

        <p className="text-sm text-gray-500 text-center py-10">
          © {new Date().getFullYear()} AdrenaLux
        </p>
      </main>
    </div>
  );
};

export default Politica;