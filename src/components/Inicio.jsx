import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaYoutube, FaDiscord } from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../assets/adrenalux_logo_white.png";
import pantallaPrincipal from "../assets/Sobres.png";
import { getToken } from "../services/api/authApi";

const Inicio = () => {
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
    document.documentElement.classList.add("bg-black");
    document.body.className =
      "bg-gradient-to-b from-gray-900 to-black overflow-x-hidden";

    return () => {
      document.documentElement.classList.remove("bg-black");
      document.body.className = "";
    };
  }, [token, navigate]);

  const handleLoginClick = () => navigate("/login");
  const handleSignUpClick = () => navigate("/register");
  const handleDiscoverClick = () => navigate("/register");

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

  const sectionRef = useRef(null);
  const [setIsSectionVisible] = useState(false);

  // Función para hacer scroll a la sección
  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Detectar cuando la sección es visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Si la sección es visible, ocultamos el botón
        setIsSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.5 } // La sección es visible cuando el 50% de ella está en la pantalla
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Limpiar el observador cuando el componente se desmonte
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col text-white relative h-screen min-h-screen w-full max-w-full bg-black" // Añadir bg-black aquí
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
        </nav>
      </header>

      <main className="flex-1 bg-gradient-to-b from-gray-900 to-black w-full max-w-full">
        <div className="relative px-4 md:px-8 lg:px-16 w-full max-w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            <motion.section
              className="flex-1 space-y-8 z-10 max-w-2xl"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                  <span className="block">Colecciona</span>
                  <span className="block mt-2 text-4xl md:text-6xl font-medium">
                    Juega. Compite. Gana.
                  </span>
                </h1>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-gray-300/90 leading-relaxed"
              >
                AdrenaLux reinventa el TCG tradicional con tecnología en tiempo
                real. Colecciona cartas dinámicas que evolucionan con el
                rendimiento de los jugadores en La Liga.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex gap-4 flex-wrap items-center"
              >
                <button
                  onClick={handleDiscoverClick}
                  className="group relative bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
                >
                  <span className="text-lg">Empezar ahora</span>
                  <span className="group-hover:translate-x-1.5 transition-transform">
                    &rarr;
                  </span>
                </button>

                <div className="flex items-center gap-4">
                  <a
                    href="https://discord.gg"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Discord"
                  >
                    <FaDiscord className="text-2xl text-indigo-400 hover:text-indigo-300 transition-colors" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                  >
                    <FaYoutube className="text-2xl text-red-500 hover:text-red-400 transition-colors" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-2xl text-pink-500 hover:text-pink-400 transition-colors" />
                  </a>
                </div>
              </motion.div>
            </motion.section>

            {/* Imagen */}
            <motion.div
              className="relative flex-1 max-w-3xl"
              variants={itemVariants}
            >
              <img
                src={pantallaPrincipal}
                alt="Sobres de cartas TCG"
                className="w-full max-w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>

        {/* Botón de scroll hacia abajo */}
        <motion.button
          ref={sectionRef}
          onClick={scrollToSection}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 py-3 px-4 rounded-full bg-white/5 text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          <span className="text-2xl">&#8595;</span> {/* Flecha hacia abajo */}
        </motion.button>

        {/* Sección de características */}
        <section className="pb-12 px-6 md:px-16 lg:px-32 text-white relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-center"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-md hover:shadow-blue-400/10 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-2 text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ¡Experiencia de Fútbol Digital!
              </h3>
              <p className="text-gray-300">
                Únete a un mundo donde el fútbol cobra vida a través de cartas coleccionables. ¡Desafía a tus amigos, construye tu equipo y demuestra que eres el mejor!
              </p>
              <div className="text-4xl mt-4 text-center">
                <span role="img" aria-label="Balón de fútbol">
                  ⚽
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-md hover:shadow-blue-400/10 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-2 text-gradient bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Colecciona y Abre Sobres
              </h3>
              <p className="text-gray-300">
                ¡Consigue sobres con cartas de futbolistas únicos! Cada carta tiene una valoración que aumenta su poder en el campo.
              </p>
              <div className="text-4xl mt-4 text-center">
                <span role="img" aria-label="Balón de fútbol">
                  💌
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-md hover:shadow-blue-400/10 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-2 text-gradient bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
                Duela con Amigos
              </h3>
              <p className="text-gray-300">
                Desafía a tus amigos o jugadores de todo el mundo en emocionantes duelos. ¡Solo los mejores equipos ganan!
              </p>
              <div className="text-4xl mt-4 text-center">
                <span role="img" aria-label="Balón de fútbol">
                  🎮
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-md hover:shadow-blue-400/10 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-2 text-gradient bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                Mercado de Intercambios
              </h3>
              <p className="text-gray-300">
                ¿Quieres mejorar tu equipo? Usa el mercado para intercambiar cartas con otros jugadores.
              </p>
              <div className="text-4xl mt-4 text-center">
                <span role="img" aria-label="Balón de fútbol">
                  🛒
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-md hover:shadow-blue-400/10 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-2 text-gradient bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                Construye Tu Equipo de Ensueño
              </h3>
              <p className="text-gray-300">
                Escoge tus jugadores favoritos y forma el equipo que siempre soñaste. Usa tu estrategia y habilidades para crear el mejor equipo posible para competir.
              </p>
              <div className="text-4xl mt-4 text-center">
                <span role="img" aria-label="Balón de fútbol">
                  🏆
                </span>
              </div>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-md hover:shadow-blue-400/10 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-2 text-gradient bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
                Participa en Torneos
              </h3>
              <p className="text-gray-300">
                Compite en grandes eventos donde los mejores jugadores luchan por la gloria. Gana premios y cartas raras para mejorar tu colección.
              </p>
              <div className="text-4xl mt-4 text-center">
                <span role="img" aria-label="Balón de fútbol">
                  ⭐
                </span>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black/90 backdrop-blur-lg mt-auto">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <div className="flex gap-4">
            <a
              href="/politica"
              className="hover:text-blue-400 transition-colors"
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
            </div>
          </div>
        </div>
      </footer>

      {/* Background gradient circles */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float animation-delay-2000" />
      </div>
    </motion.div>
  );
};

export default Inicio;
