import axios from "axios";

const API_URL = "https://adrenalux.duckdns.org/api/v1/cartas";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getEquipos = async () => {
  try {
    const response = await axios.get(`${API_URL}/getEquipos`, {
      headers: getAuthHeaders(),
    });
    console.log("Equipos API response:", response.data);

    const equipos = response?.data?.data?.equipo || [];
    console.log("Parsed equipos array:", equipos);

    const equiposFormatted = equipos.map((team) => {
      let escudo;
      if (team.escudo) {
        if (team.escudo.startsWith("http")) {
          escudo = team.escudo;
        } else {
          escudo = `https://adrenalux.duckdns.org/${team.escudo.replace(
            /^public\//,
            ""
          )}`;
        }
      } else {
        escudo = "/src/assets/default_escudo.png";
      }

      return {
        id: team.equipo,
        nombre: team.equipo,
        escudo,
      };
    });

    return equiposFormatted;
  } catch (error) {
    console.error("Error en getEquipos:", error);
    throw new Error("Error al obtener los equipos");
  }
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
