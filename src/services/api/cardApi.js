import axios from 'axios';

const API_BASE_URL = 'http://54.37.50.18:3000/api/v1';

// Obtener token de autenticación si es necesario
const getToken = () => localStorage.getItem("auth_token");

// Función para abrir un sobre
export const abrirSobre = async (tipo) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/abrirSobre/${tipo}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json"
      }
    });

    const cartas = response.data?.data?.cartas;
    if (!Array.isArray(cartas)) {
      throw new Error('Estructura de respuesta incorrecta');
    }

    return cartas.map((carta) => ({
      id: carta.id || "N/A",
      nombreCompleto: carta.nombreCompleto || "Desconocido",
      club: carta.club || "Sin club",
      posicion: carta.posicion || "N/A",
      nacionalidad: carta.nacionalidad || "N/A",
      stats: {
        defensa: carta.stats?.defensa ?? 0,
        medio: carta.stats?.medio ?? 0,
        ataque: carta.stats?.ataque ?? 0
      },
      rareza: carta.rareza || "Común",
      foto: carta.foto || "default.png"
    }));
  } catch (error) {
    console.error('Error al abrir el sobre:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Función para obtener sobres disponibles
export const sobresDisponibles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sobres`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json"
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error al obtener los sobres disponibles:', error.response?.data?.message || error.message);
    throw error
  }
};
