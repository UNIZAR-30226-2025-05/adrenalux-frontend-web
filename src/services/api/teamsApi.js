import axios from "axios";

const API_URL = "http://54.37.50.18:3000/api/v1/cartas";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getEquipos = async () => {
  const response = await axios.get(`${API_URL}/getEquipos`, {
    headers: getAuthHeaders(),
  });
  return response.data.data.equipos;
};

export const getRaridades = async () => {
  const response = await axios.get(`${API_URL}/getRarezascartas`, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
};

export const getPosiciones = async () => {
  const response = await axios.get(`${API_URL}/getPosiciones`, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
};

export default { getEquipos, getRaridades, getPosiciones };
