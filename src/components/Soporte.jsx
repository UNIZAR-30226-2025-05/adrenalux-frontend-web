import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/adrenalux_logo_white.png";
import { getToken } from "../services/api/authApi";

const Soporte = () => {
    const navigate = useNavigate();
    const token = getToken();

    useEffect(() => {
        document.documentElement.classList.add('bg-black');
        document.body.className = 'bg-gradient-to-b from-gray-900 to-black text-white';
        return () => {
            document.documentElement.classList.remove('bg-black');
            document.body.className = '';
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
            onClick={() => navigate("/home")} // o a donde quieras
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
          Soporte
        </h1>

        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Si necesitas ayuda o tienes alguna pregunta, no dudes en ponerte en contacto con nosotros a través de los siguientes canales:
        </p>

        <section className="space-y-8">

          {/* Sección 1 */}
          <div className={sectionBoxStyle}>
            <h2 className="text-2xl font-semibold text-white mb-3">Contacto por Email</h2>
            <p className="text-gray-300">
                Para consultas generales o problemas técnicos, puedes enviarnos un correo electrónico a: <a href="mailto:support@adrenalux.com" className="text-blue-400">support@adrenalux.com</a>.
            </p>
          </div>

          {/* Sección 2 */}
          <div className={sectionBoxStyle}>
            <h2 className="text-2xl font-semibold text-white mb-3">Llamada Telefónica</h2>
            <p className="text-gray-300">
                Si tienes algún problema relacionado con el acceso a tu cuenta o con funciones premium, no dudes en llamarnos para que podamos solucionarlo lo antes posible. Nuestro número de atención es <span className="text-blue-400">+34 912 34 56 78</span>, y estamos disponibles para ayudarte en todo lo que necesites.
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

export default Soporte;