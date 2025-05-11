import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import background from "../assets/background.png";
import { register, login, googleSignIn } from "../services/api/authApi";
import GoogleSignInButton from "../components/layout/game/GoogleSignInButton";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    lastname: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSuccess = async (tokenId) => {
    const { status, data } = await googleSignIn(tokenId);
    if (status === 200) {
      // Verificar si es nuevo usuario (depende de tu API)
      if (data.isNewUser) {
        localStorage.setItem("isNewUser", "true");
        navigate("/info");
      } else {
        navigate("/home");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" }); // Limpiar error al escribir
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El correo no es válido.";
    }

    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!formData.lastname.trim())
      newErrors.lastname = "El apellido es obligatorio.";
    if (!formData.username.trim())
      newErrors.username = "El nombre de usuario es obligatorio.";

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleSignUpClick = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { status, data } = await register(
        formData.email,
        formData.username,
        formData.lastname,
        formData.name,
        formData.password
      );

      if (status.error_message === "") {
        const { status } = await login(formData.email, formData.password);
        if (status === 200) {
          // Marcar como nuevo usuario antes de redirigir
          localStorage.setItem("isNewUser", "true");
          navigate("/info"); // Redirigir al tutorial de bienvenida
        }
      } else {
        // Manejo de errores específicos
        const newErrors = {};
        if (status.error_message.includes("correo")) {
          newErrors.email = "Este correo ya está en uso.";
        }
        if (status.error_message.includes("usuario")) {
          newErrors.username = "Este nombre de usuario ya está en uso.";
        }
        if (status.error_message.includes("password")) {
          newErrors.password =
            "La contraseña debe tener al menos 6 caracteres.";
        }
        setErrors(newErrors);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center p-4 sm:p-0"
      style={{ backgroundImage: `url(${background})` }}
    >
      <motion.div
        className="bg-gray-300 dark:bg-gray-900 p-4 sm:p-8 w-full max-w-md rounded-lg shadow-2xl backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center mb-6"
          variants={itemVariants}
        >
          <h2 className="text-black dark:text-white text-2xl font-bold mb-2 sm:mb-0">
            Registrarse
          </h2>
          <GoogleSignInButton onSuccess={handleGoogleSuccess} />
        </motion.div>

        <motion.p
          className="text-black dark:text-white text-sm mb-6"
          variants={itemVariants}
        >
          Crear una nueva cuenta
        </motion.p>

        <form onSubmit={handleSignUpClick} className="space-y-4">
          {/** Email */}
          <motion.div variants={itemVariants}>
            <input
              type="text"
              name="email"
              placeholder="Correo electrónico"
              className={`w-full bg-gray-800 border ${
                errors.email ? "border-red-500" : "border-gray-700"
              } focus:border-blue-500 rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-300`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </motion.div>

          {/** Nombre */}
          <motion.div variants={itemVariants}>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              className={`w-full bg-gray-800 border ${
                errors.name ? "border-red-500" : "border-gray-700"
              } focus:border-blue-500 rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-300`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </motion.div>

          {/** Apellido */}
          <motion.div variants={itemVariants}>
            <input
              type="text"
              name="lastname"
              placeholder="Apellido"
              className={`w-full bg-gray-800 border ${
                errors.lastname ? "border-red-500" : "border-gray-700"
              } focus:border-blue-500 rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-300`}
              value={formData.lastname}
              onChange={handleChange}
            />
            {errors.lastname && (
              <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
            )}
          </motion.div>

          {/** Nombre de usuario */}
          <motion.div variants={itemVariants}>
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              className={`w-full bg-gray-800 border ${
                errors.username ? "border-red-500" : "border-gray-700"
              } focus:border-blue-500 rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-300`}
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </motion.div>

          {/** Contraseña */}
          <motion.div variants={itemVariants}>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className={`w-full bg-gray-800 border ${
                errors.password ? "border-red-500" : "border-gray-700"
              } focus:border-blue-500 rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-300`}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </motion.div>

          {/** Botón de registro */}
          <motion.div variants={itemVariants}>
            <motion.button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-lg py-3 font-medium shadow-lg transition duration-300"
              type="submit"
              disabled={isSubmitting}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              {isSubmitting ? (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Procesando...
                </div>
              ) : (
                "Registrarse"
              )}
            </motion.button>
          </motion.div>

          {/* Botón "Ya tengo cuenta" */}
          <motion.div
            className="flex justify-center mt-6"
            variants={itemVariants}
          >
            <motion.button
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium transition duration-300 px-4 py-2"
              type="button"
              onClick={() => navigate("/login")}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              Ya tengo cuenta
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
