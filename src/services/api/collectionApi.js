import axios from "axios";

const API_URL = "https://adrenalux.duckdns.org/api/v1/coleccion";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCollection = async () => {
  try {
    const response = await axios.get(`${API_URL}/getColeccion`, {
      headers: getAuthHeaders(),
    });
    return response.data.data;
  } catch (error) {
    console.error("❌ Error al obtener la colección:", error);
    throw error;
  }
};

export const filterCards = async (params) => {
  try {
    if (params.rareza) {
      if (params.rareza.toUpperCase() === "LUXURYXI") {
        params.rareza = "Luxury XI";
      } else {
        params.rareza =
          params.rareza.charAt(0).toUpperCase() +
          params.rareza.slice(1).toLowerCase();
      }
    }

    const response = await axios.get(`${API_URL}/filtrarCartas`, {
      headers: getAuthHeaders(),
      params,
    });
    console.log("Respuesta de filterCards:", response.data);
    return response.data.data || [];
  } catch (error) {
    console.error("❌ Error al filtrar las cartas:", error);
    throw error;
  }
};

