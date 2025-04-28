import axios from "axios";

const API_URL = "https://adrenalux.duckdns.org/api/v1/partidas"; // Ajusta el endpoint aquí si es diferente

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPartidasPausadas = async () => {
  try {
    // Cambia el endpoint si no es este
    const response = await axios.get(`${API_URL}/pausadas`, {
      headers: getAuthHeaders(),
    });
    // Verifica la estructura y ajusta si hace falta
    const matches = response?.data?.data?.pausedMatches || [];
    return matches;
  } catch (error) {
    console.error("Error al obtener partidas pausadas:", error);
    throw new Error("Error al obtener partidas pausadas");
  }
};

export default { getPartidasPausadas };
