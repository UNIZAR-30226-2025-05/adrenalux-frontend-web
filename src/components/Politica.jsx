import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaYoutube, FaDiscord } from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../assets/adrenalux_logo_white.png";
import { getToken } from "../services/api/authApi";

const Politica = () => {
  const navigate = useNavigate();
  const token = getToken();
  const topRef = useRef(null);
  const section1Ref = useRef(null); // Nuevo ref para la sección 1

  // Función para hacer scroll hacia arriba
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Configurar estilos para ocupar toda la pantalla
    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.width = "100%";
    document.body.style.width = "100%";
    document.body.style.minHeight = "100vh";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    // Scroll a la sección 1 después de un pequeño delay para asegurar que el componente se ha renderizado
    const timer = setTimeout(() => {
      if (section1Ref.current) {
        section1Ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);

    return () => {
      // Limpiar timer y estilos al desmontar
      clearTimeout(timer);
      document.documentElement.style.overflowX = "";
      document.documentElement.style.width = "";
      document.body.style.width = "";
      document.body.style.minHeight = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

  const handleLoginClick = () => navigate("/login");
  const handleSignUpClick = () => navigate("/register");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col text-white w-full min-h-screen bg-black"
      ref={topRef}
      style={{
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full px-4 py-4 md:px-8 md:py-6 flex justify-between items-center z-50 backdrop-blur-2xl bg-black/30 border-b border-white/10">
        <motion.img
          src={logo}
          alt="AdrenaLux Logo"
          className="w-16 md:w-24 cursor-pointer transition-all duration-500 hover:scale-105"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          variants={itemVariants}
        />

        <nav className="flex gap-2 md:gap-4">
          {!token && (
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
          {token && (
            <motion.button
              onClick={() => navigate("/home")}
              className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 px-6 py-2 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]"
              variants={itemVariants}
            >
              <span className="relative z-10">Mi Colección</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          )}
        </nav>
      </header>

      {/* Contenido principal - ahora ocupa todo el ancho */} 
      <main className="flex-1 w-full pt-32 pb-16 bg-gradient-to-b from-gray-900 to-black" style={{ marginTop: '2500px' }}>
        <div className="w-full px-4 md:px-8 lg:px-16 mx-auto" style={{ maxWidth: '100%' }}>
          {/* Título principal */}
          <motion.div 
            variants={itemVariants}
            className="mb-12 text-center w-full"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent mb-4">
              Política de Privacidad y Uso
            </h1>
            <p className="text-gray-300/90 max-w-3xl mx-auto">
              En AdrenaLux nos comprometemos a proteger tu información y ofrecerte la mejor experiencia posible.
            </p>
          </motion.div>

          {/* Contenido dividido en secciones */}
          <motion.div 
            variants={containerVariants}
            className="space-y-12 w-full"
          >
            {/* Sección 1 - Añadido ref aquí */}
            <motion.section 
              ref={section1Ref} // Referencia añadida aquí para scroll automático
              variants={itemVariants}
              className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-md w-full"
              id="seccion-1" // Opcional: añadido ID para navegar más fácilmente
            >
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                1. Recopilación de Información
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  AdrenaLux recopila información necesaria para proporcionar y mejorar nuestros servicios de juego coleccionable. La información que recopilamos puede incluir:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Información de registro (nombre, correo electrónico, nombre de usuario)</li>
                  <li>Información de perfil que elijas compartir</li>
                  <li>Historial de transacciones y actividad dentro del juego</li>
                  <li>Información técnica como dirección IP y datos del dispositivo</li>
                  <li>Comunicaciones que mantengas con nuestro equipo de soporte</li>
                </ul>
                <p>
                  Toda la información recopilada se utiliza exclusivamente para mejorar tu experiencia, asegurar el funcionamiento correcto del juego y prevenir actividades fraudulentas.
                </p>
              </div>
            </motion.section>

            {/* Sección 2 */}
            <motion.section 
              variants={itemVariants}
              className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-md w-full"
            >
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                2. Uso de la Información
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  La información que recopilamos nos permite:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Proporcionar, mantener y mejorar nuestros servicios</li>
                  <li>Personalizar tu experiencia de juego</li>
                  <li>Procesar transacciones e intercambios de cartas</li>
                  <li>Comunicarte actualizaciones, promociones y eventos especiales</li>
                  <li>Prevenir el fraude y garantizar la seguridad del juego</li>
                  <li>Cumplir con obligaciones legales y resolver disputas</li>
                </ul>
                <p>
                  Nunca venderemos tu información personal a terceros ni la utilizaremos para fines distintos a los mencionados anteriormente sin tu consentimiento explícito.
                </p>
              </div>
            </motion.section>

            {/* Sección 3 */}
            <motion.section 
              variants={itemVariants}
              className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-md w-full"
            >
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
                3. Cartas y Propiedad Virtual
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Al utilizar AdrenaLux, entiendes y aceptas que:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Las cartas y objetos virtuales adquiridos son una licencia para usar contenido digital dentro del juego</li>
                  <li>AdrenaLux mantiene todos los derechos de propiedad intelectual sobre el contenido del juego</li>
                  <li>Las cartas y su valoración pueden cambiar con el tiempo basado en el rendimiento real de los jugadores</li>
                  <li>Las transacciones e intercambios son finales y se realizan bajo tu responsabilidad</li>
                  <li>Está prohibido vender o intercambiar cartas fuera de la plataforma oficial</li>
                </ul>
                <p>
                  Nos reservamos el derecho de modificar, actualizar o retirar cualquier contenido del juego cuando sea necesario para mantener el equilibrio y la integridad del sistema.
                </p>
              </div>
            </motion.section>

            {/* Sección 4 */}
            <motion.section 
              variants={itemVariants}
              className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-md w-full"
            >
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                4. Conducta del Usuario
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Como usuario de AdrenaLux, te comprometes a:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>No utilizar bots, scripts o métodos automáticos para jugar o adquirir cartas</li>
                  <li>No participar en actividades que puedan considerarse trampa o explotación de errores</li>
                  <li>Mantener un comportamiento respetuoso hacia otros jugadores</li>
                  <li>No compartir información personal de otros usuarios</li>
                  <li>No intentar acceder a áreas o información a la que no tengas autorización</li>
                </ul>
                <p>
                  El incumplimiento de estas normas puede resultar en la suspensión temporal o permanente de tu cuenta, así como la pérdida de contenido digital adquirido.
                </p>
              </div>
            </motion.section>

            {/* Sección 5 */}
            <motion.section 
              variants={itemVariants}
              className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-md w-full"
            >
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                5. Comunicaciones y Notificaciones
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Al registrarte en AdrenaLux, aceptas recibir:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Comunicaciones esenciales sobre tu cuenta y transacciones</li>
                  <li>Actualizaciones importantes sobre el juego y cambios en las políticas</li>
                  <li>Notificaciones sobre eventos, promociones y nuevas características</li>
                </ul>
                <p>
                  Puedes ajustar tus preferencias de notificación en cualquier momento desde la sección de configuración de tu cuenta. Sin embargo, algunas comunicaciones esenciales sobre tu cuenta no pueden deshabilitarse.
                </p>
              </div>
            </motion.section>

            {/* Sección 6 */}
            <motion.section 
              variants={itemVariants}
              className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-md w-full"
            >
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
                6. Modificaciones a la Política
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  AdrenaLux se reserva el derecho de modificar esta política en cualquier momento. Te notificaremos sobre cambios significativos mediante:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Un aviso visible dentro de la aplicación</li>
                  <li>Un correo electrónico a la dirección asociada a tu cuenta</li>
                  <li>Una actualización en nuestra página web oficial</li>
                </ul>
                <p>
                  El uso continuado de nuestros servicios después de cualquier modificación constituye tu aceptación de la nueva política. Te recomendamos revisar periódicamente esta página para estar informado sobre cualquier cambio.
                </p>
              </div>
            </motion.section>

            {/* Sección de contacto */}
            <motion.section 
              variants={itemVariants}
              className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-md text-center w-full"
            >
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ¿Tienes preguntas sobre nuestra política?
              </h2>
              <p className="text-gray-300 mb-6">
                Nuestro equipo está disponible para resolver cualquier duda que puedas tener.
              </p>
              <button 
                onClick={() => navigate("/soporte")}
                className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]"
              >
                <span className="relative z-10">Contactar Soporte</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </button>
            </motion.section>
          </motion.div>
        </div>
      </main>

      {/* Botón para volver arriba */}
      <div className="fixed bottom-10 right-10 z-50">
        <motion.button
          onClick={scrollToTop}
          className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-xl">&#8593;</span>
        </motion.button>
      </div>
      
      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black/90 backdrop-blur-lg mt-auto">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm w-full">
          <div className="flex gap-4">
            <a
              href="/politica"
              className="text-blue-400 transition-colors"
            >
              Política
            </a>
            <a
              href="/terminos"
              className="hover:text-purple-400 transition-colors"
            >
              Términos
            </a>
            <a
              href="/soporte"
              className="hover:text-blue-400 transition-colors"
            >
              Soporte
            </a>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <span>© {new Date().getFullYear()} AdrenaLux</span>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex gap-3">
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
              >
                <FaDiscord className="hover:text-indigo-400 transition-colors" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube className="hover:text-red-500 transition-colors" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram className="hover:text-pink-500 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Background gradient circles */}
      <div className="fixed inset-0 -z-50 overflow-hidden w-full">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float animation-delay-2000" />
      </div>
    </motion.div>
  );
};

export default Politica;