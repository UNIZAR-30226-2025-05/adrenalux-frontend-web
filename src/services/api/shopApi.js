import axios from "axios";

const API_BASE_URL = "https://adrenalux.duckdns.org/api/v1/mercado";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Obtener todas las cartas en venta en el mercado
 */
export const obtenerCartasEnVenta = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/mercadoCartas/obtenerCartasMercado`,
      {
        headers: getAuthHeaders(),
      }
    );
    console.log("📥 Respuesta API obtenerCartasEnVenta:", response.data);
    return response.data.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener cartas en venta:",
      error.response ? error.response.data : error.message
    );
    return [];
  }
};

/**
 * Filtrar cartas en el mercado
 */
export const filterCards = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mercadoCartas`, {
      headers: getAuthHeaders(),
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al filtrar cartas:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

export const publicarCarta = async (cartaId, precio) => {
  try {
    console.log("📤 Enviando solicitud de venta:", {
      cartaId,
      precio,
    });

    const response = await axios.post(
      `${API_BASE_URL}/mercadoCartas/venderCarta`,
      { cartaId, precio },
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Respuesta exitosa:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error en publicarCarta:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Comprar una carta del mercado
 */
export const comprarCarta = async (id) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/mercadoCartas/comprarCarta/${id}`,
      {},
      {
        headers: {
          ...getAuthHeaders(), // ✅ Pasa el token
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al comprar carta:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * Retirar una carta del mercado
 */
export const retirarCarta = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/mercadoCartas/retirarCarta/${id}`, // Nota el cambio aquí
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al retirar carta:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * Carta diaria obtener
 */
export const obtenerCartasDiarias = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/mercadoDiario/obtenerCartasEspeciales`,
      { headers: getAuthHeaders() }
    );
    console.log("📥 Respuesta API obtenerCartasDiarias:", response.data);
    return response.data.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener cartas diarias:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

/**
 * Carta diaria comprar
 */
export const comprarCartaDiaria = async (id) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/mercadoDiario/comprarCartaEspecial/${id}`,
      {},
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Respuesta API comprarCartaDiaria:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al comprar carta diaria:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export default {
  obtenerCartasEnVenta,
  filterCards,
  publicarCarta,
  comprarCarta,
  retirarCarta,
  obtenerCartasDiarias,
  comprarCartaDiaria,
};
