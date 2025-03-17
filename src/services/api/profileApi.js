import axios from "axios";

const API_URL = "https://adrenalux.duckdns.org:3000/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    console.error("❌ Error: Token no encontrado");
    throw new Error("Token not found");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

/**
 * 📌 Obtener perfil del usuario
 */
export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener el perfil:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * 📌 Actualizar perfil del usuario
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, profileData, {
      headers: getAuthHeaders(),
    });
    return response.status === 204;
  } catch (error) {
    console.error(
      "❌ Error al actualizar el perfil:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * 📌 Obtener nivel y XP del usuario
 */
export const getLevelXP = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile/levelxp`, {
      headers: getAuthHeaders(),
    });
    if (!response.data) throw new Error("Respuesta vacía de la API");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener nivel y XP:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * 📌 Obtener clasificación
 */
export const getClasificacion = async () => {
  try {
    const response = await axios.get(`${API_URL}/clasificacion`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener clasificación:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * 📌 Obtener logros del usuario
 */
export const getAchievements = async () => {
  try {
    const response = await axios.get(`${API_URL}/achievements`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener logros:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * 📌 Obtener lista de amigos
 */
export const getFriends = async () => {
  try {
    const response = await axios.get(`${API_URL}/friends`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener amigos:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * 📌 Obtener solicitudes de amistad
 */
export const getFriendRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/friend-requests`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener solicitudes de amistad:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * 📌 Enviar una solicitud de amistad
 */
export const sendFriendRequest = async (friendId) => {
  try {
    const response = await axios.post(
      `${API_URL}/friend-requests`,
      { friendId },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.status === 204;
  } catch (error) {
    console.error(
      "❌ Error al enviar solicitud de amistad:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * 📌 Obtener Adrenacoins del usuario
 */
export const getAdrenacoins = async () => {
  try {
    const response = await axios.get(`${API_URL}/adrenacoins`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener Adrenacoins:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default {
  getProfile,
  updateProfile,
  getLevelXP,
  getClasificacion,
  getAchievements,
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  getAdrenacoins,
};
