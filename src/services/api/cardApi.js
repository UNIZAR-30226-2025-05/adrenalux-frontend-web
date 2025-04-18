import axios from "axios";
import { getToken } from "../api/authApi";

const API_BASE_URL = "https://adrenalux.duckdns.org/api/v1/cartas";

export const abrirSobre = async (tipo) => {
  try {
    const token = getToken();
    console.log(token);
    const response = await axios.get(`${API_BASE_URL}/abrirSobre/${tipo}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    const cartas = response.data?.data?.responseJson.cartas;

    if (!Array.isArray(cartas)) {
      throw new Error("Estructura de respuesta incorrecta");
    }

    return cartas.map((carta) => ({
      id: carta.id || "N/A",
      nombre: carta.nombre || "Desconocido",
      alias: carta.alias || "Desconocido",
      pais: carta.pais || "N/A",
      photo: carta.photo || "default.png",
      equipo: carta.equipo || "Sin club",
      escudo: carta.escudo || "default_escudo.png",
      ataque: carta.ataque ?? 0,
      control: carta.control ?? 0,
      defensa: carta.defensa ?? 0,
      tipo_carta: carta.tipo_carta || "Común",
      posicion: carta.posicion || "N/A",
    }));
  } catch (error) {
    console.error(
      "Error al abrir el sobre:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

export const sobresDisponibles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sobres`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.map((sobre) => ({
      ...sobre,
    }));
  } catch (error) {
    console.error(
      "Error al obtener los sobres disponibles:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

export const abrirSobreGratis = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/abrirSobreRandom`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    console.log(response.data?.data?.responseJson.cartas)

    const cartas = response.data?.data?.responseJson.cartas;

    if (!Array.isArray(cartas)) {
      throw new Error("Estructura de respuesta incorrecta");
    }

    return cartas.map((carta) => ({
      id: carta.id || "N/A",
      nombre: carta.nombre || "Desconocido",
      alias: carta.alias || "Desconocido",
      pais: carta.pais || "N/A",
      photo: carta.photo || "default.png",
      equipo: carta.equipo || "Sin club",
      escudo: carta.escudo || "default_escudo.png",
      ataque: carta.ataque ?? 0,
      control: carta.control ?? 0,
      defensa: carta.defensa ?? 0,
      tipo_carta: carta.tipo_carta || "Normal",
      posicion: carta.posicion || "N/A",
    }));
  } catch (error) {
    console.error(
      "Error al abrir el sobre gratis:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};
