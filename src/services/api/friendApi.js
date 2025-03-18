import axios from "axios";

const API_URL = "https://adrenalux.duckdns.org/api/v1/profile";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("Token not found");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getFriends = async () => {
  try {
    const response = await axios.get(`${API_URL}/friends`, {
      headers: getAuthHeaders(),
    });
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al obtener amigos:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getFriendRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/friends/requests`, {
      headers: getAuthHeaders(),
    });
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al obtener solicitudes de amistad:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const sendFriendRequest = async (friendCode) => {
  try {
    const response = await axios.post(
      `${API_URL}/friends/request`,
      { friendCode },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al enviar solicitud de amistad:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const acceptFriendRequest = async (requestId) => {
  try {
    console.log(requestId)
    const response = await axios.patch(`${API_URL}/friends/requests/${requestId}/accept`,
      {},
      { headers: getAuthHeaders() 
      });
    return response.data;
  } catch (error) {
    console.error(
      "Error al aceptar solicitud de amistad:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const declineFriendRequest = async (requestId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/friends/requests/${requestId}/decline`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al rechazar solicitud de amistad:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteFriend = async (friendId) => {
  try {
    const response = await axios.delete(`${API_URL}/friends/${friendId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al eliminar amigo:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getFriendData = async (friendId) => {
  try {
    const response = await axios.get(`${API_URL}/friends/${friendId}`, {
      headers: getAuthHeaders(),
    });
    return response.data.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener datos del amigo:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  deleteFriend,
  getFriendData,
};
