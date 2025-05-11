import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api/authApi";
import background from "../assets/background.png";
import { googleSignIn } from "../services/api/authApi";
import GoogleSignInButton from "../components/layout/game/GoogleSignInButton";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const isDebugMode = import.meta.env.VITE_NODE_ENV === "development";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t("auth.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("auth.errors.emailInvalid");
    }

    if (!formData.password.trim()) {
      newErrors.password = t("auth.errors.passwordRequired");
    } else if (formData.password.length < 6) {
      newErrors.password = t("auth.errors.passwordLength");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  //Google sign in
  const handleGoogleSuccess = async (tokenId) => {
    const { status, data } = await googleSignIn(tokenId);
    if (status === 200) {
      // Verificar si es nuevo usuario (depende de tu API)
      if (data.isNewUser) {
        localStorage.removeItem("welcomeTutorialSeen");
        localStorage.setItem("isNewUser", "true");
        navigate("/info");
      } else {
        navigate("/home");
      }
    }
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const { status } = await login(formData.email, formData.password);

      if (status === 200) {
        console.log("Inicio de sesión exitoso");
        navigate("/home");
      } else {
        setErrors({
          ...errors,
          general: "Error en las credenciales",
        });
      }
    } catch (error) {
      setErrors({
        ...errors,
        general: isDebugMode
          ? `Error en la conexión con el servidor: ${error}`
          : "Error en la conexión con el servidor",
      });
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-cover bg-center px-4 sm:px-6 py-8"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-gray-300 dark:bg-gray-900 p-4 sm:p-6 md:p-8 w-full max-w-lg rounded-lg shadow-xl">
        {/* Header row with title and Google button - flex items-center makes them vertically aligned */}
        <div className="flex flex-row justify-between items-center mb-4 gap-2">
          <h2 className="text-black dark:text-white text-xl sm:text-2xl font-bold">
            {t("auth.title")}
          </h2>

          <GoogleSignInButton onSuccess={handleGoogleSuccess} />
        </div>

        <p className="text-black dark:text-white text-sm mb-4">
          {t("auth.title2")}
        </p>

        {errors.general && (
          <p className="text-red-500 text-sm mb-4">{errors.general}</p>
        )}

        <form onSubmit={handleLoginClick} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder={t("auth.emailPlaceholder")}
            className={`w-full bg-gray-800 border ${
              errors.email ? "border-red-500" : "border-gray-700"
            } rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder={t("auth.passwordPlaceholder")}
            className={`w-full bg-gray-800 border ${
              errors.password ? "border-red-500" : "border-gray-700"
            } rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={formData.password}
            onChange={handleChange}
          />

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          {/* Botones de iniciar sesión y olvidar contraseña */}
          <div className="flex flex-row items-center justify-between gap-4">
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white rounded py-2 px-4 transition duration-300"
              type="submit"
            >
              {t("auth.login")}
            </button>

            <button
              className="text-blue-600 hover:text-blue-200 transition duration-300 py-2 bg-gray-300 dark:bg-gray-900"
              type="button"
            >
              {t("auth.forgotPassword")}
            </button>
          </div>

          {/* Botón "No tengo cuenta" debajo */}
          <div className="flex justify-center mt-4">
            <button
              className="text-blue-600 hover:text-blue-200 transition duration-300 py-2 bg-gray-300 dark:bg-gray-900"
              type="button"
              onClick={() => navigate("/register")}
            >
              {t("auth.noAccount")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
