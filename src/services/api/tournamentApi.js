import axios from "axios";
import { getToken } from "../api/authApi";

const API_URL = "https://adrenalux.duckdns.org/api/v1/torneos";

// Configuración de Axios para manejar errores globalmente
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Formateador estándar de torneos
const formatTorneo = (torneo) => ({
  id: torneo.id,
  nombre: torneo.nombre,
  descripcion: torneo.descripcion,
  premio: torneo.premio,
  estado: torneo.torneo_en_curso ? "en_curso" : "pendiente",
  participantes: torneo.participantes || 0,
  maxParticipantes: torneo.maxParticipantes || 8, // Valor por defecto
  requiereContraseña: !!torneo.contrasena,
  creadorId: torneo.creador_id,
  fechaInicio: torneo.fecha_inicio ? new Date(torneo.fecha_inicio) : null
});

// Helper para procesar respuestas
const handleResponse = (response) => {
  // Caso 1: La respuesta es directamente un array
  if (Array.isArray(response.data)) {
    return response.data.map(formatTorneo);
  }
  
  // Caso 2: La respuesta tiene propiedad 'data' con el array
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data.map(formatTorneo);
  }
  
  // Caso 3: La respuesta tiene otro formato
  throw new Error(`Formato de respuesta no soportado: ${JSON.stringify(response.data)}`);
};

export const tournamentApi = {
  /**
   * Obtiene todos los torneos activos
   * @returns {Promise<Array>} Lista de torneos formateados
   */
  obtenerTorneosActivos: async () => {
    try {
      const response = await api.get("/getTorneosActivos");
      return handleResponse(response);
    } catch (error) {
      console.error("[TournamentAPI] Error en obtenerTorneosActivos:", {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || "Error al cargar torneos");
    }
  },

  /**
   * Crea un nuevo torneo
   * @param {Object} datosTorneo
   * @param {string} datosTorneo.nombre
   * @param {string} datosTorneo.descripcion
   * @param {string} datosTorneo.premio
   * @param {string} [datosTorneo.contrasena]
   * @returns {Promise<Object>} Torneo creado
   */
  crearTorneo: async ({ nombre, descripcion, premio, contrasena = null }) => {
    try {
      const response = await api.post("/crear", {
        nombre,
        descripcion,
        premio,
        contrasena
      });
      
      return formatTorneo(response.data);
    } catch (error) {
      console.error("[TournamentAPI] Error en crearTorneo:", error.response?.data);
      throw new Error(error.response?.data?.message || "Error al crear torneo");
    }
  },

  /**
   * Obtiene detalles de un torneo específico
   * @param {number} torneoId
   * @returns {Promise<Object>} Detalles del torneo
   */
  obtenerDetallesTorneo: async (torneoId) => {
    try {
      const response = await api.get(`/getTorneo/${torneoId}`);
      
      // Formateo especial para detalles
      return {
        ...formatTorneo(response.data.torneo),
        participantes: response.data.participantes || [],
        partidas: response.data.partidas || []
      };
    } catch (error) {
      console.error("[TournamentAPI] Error en obtenerDetallesTorneo:", error.response?.data);
      throw new Error(error.response?.data?.message || "Error al obtener detalles");
    }
  },

  /**
   * Unirse a un torneo
   * @param {number} torneoId
   * @param {string} [contrasena]
   * @returns {Promise<Object>} Resultado de la operación
   */
  unirseATorneo: async (torneoId, contrasena = null) => {
    try {
      const response = await api.post("/unirse", {
        torneo_id: torneoId,
        contrasena
      });
      
      return {
        success: true,
        message: response.data.message || "Te has unido al torneo correctamente",
        torneo: formatTorneo(response.data.torneo)
      };
    } catch (error) {
      console.error("[TournamentAPI] Error en unirseATorneo:", error.response?.data);
      throw new Error(error.response?.data?.message || "Error al unirse al torneo");
    }
  },

  /**
   * Abandonar un torneo
   * @param {number} torneoId
   * @returns {Promise<Object>} Resultado de la operación
   */
  abandonarTorneo: async (torneoId) => {
    try {
      const response = await api.post("/abandonarTorneo", {
        torneo_id: torneoId
      });
      
      return {
        success: true,
        message: response.data.message || "Has abandonado el torneo correctamente"
      };
    } catch (error) {
      console.error("[TournamentAPI] Error en abandonarTorneo:", error.response?.data);
      throw new Error(error.response?.data?.message || "Error al abandonar torneo");
    }
  },

  /**
   * Obtener torneos de amigos
   * @returns {Promise<Array>} Lista de torneos
   */
  obtenerTorneosAmigos: async () => {
    try {
      const response = await api.get("/getTorneosAmigos");
      return handleResponse(response);
    } catch (error) {
      console.error("[TournamentAPI] Error en obtenerTorneosAmigos:", error.response?.data);
      throw new Error(error.response?.data?.message || "Error al cargar torneos de amigos");
    }
  },

  /**
   * Obtener partidas de un torneo
   * @param {number} torneoId
   * @returns {Promise<Array>} Lista de partidas
   */
  obtenerPartidasTorneo: async (torneoId) => {
    try {
      const response = await api.get(`/torneo/${torneoId}/partidas`);
      
      if (!Array.isArray(response.data)) {
        return response.data.partidas || [];
      }
      
      return response.data.map(partida => ({
        id: partida.id,
        jugador1: partida.user1_id,
        jugador2: partida.user2_id,
        estado: partida.estado,
        ganador: partida.ganador_id,
        fecha: partida.fecha ? new Date(partida.fecha) : null
      }));
    } catch (error) {
      console.error("[TournamentAPI] Error en obtenerPartidasTorneo:", error.response?.data);
      throw new Error(error.response?.data?.message || "Error al cargar partidas");
    }
  }
};

export default tournamentApi;
