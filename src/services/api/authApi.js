const API_URL = "http://54.37.50.18:3000/api/v1/auth";

// Función para obtener o generar un identificador único para el dispositivo
const getDeviceId = () => {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = crypto.randomUUID(); // Generar un ID único
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
};

// Funciones para manejar el token en localStorage
const setToken = (token) => localStorage.setItem("auth_token", token);
export const getToken = () => localStorage.getItem("auth_token");
const removeToken = () => localStorage.removeItem("auth_token");

// Función para iniciar sesión
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, device_id: getDeviceId() }),
    });

    const data = await response.json();
    if (response.status === 200) {
      setToken(data.data.token); // Guardar el token
    }
    return { status: response.status, data };
  } catch (error) {
    console.error("Error en login:", error);
    return { status: 500, data: { message: "Error de conexión" } };
  }
};

// Función para registrar un nuevo usuario
export const register = async (email, username, lastname, name, password) => {
  try {
    const response = await fetch(`${API_URL}/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, lastname, name, password }),
    });

    return response.json();
  } catch (error) {
    console.error("Error en register:", error);
    return { status: 500, data: { message: "Error de conexión" } };
  }
};

// Función para validar el token actual
export const validateToken = async () => {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_URL}/validate-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.status === 200;
  } catch (error) {
    console.error("Error validando token:", error);
    return false;
  }
};

// Función para cerrar sesión y eliminar el token
export const logout = () => {
  removeToken();
  window.location.href = "/sign-in"; // Redirigir al login
};
