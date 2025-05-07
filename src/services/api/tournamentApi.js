import axios from "axios";
import { getToken } from "../api/authApi";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://adrenalux.duckdns.org/api/v1/torneos";

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
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const formatTorneo = (torneo) => ({
  id: torneo.id,
  nombre: torneo.nombre,
  descripcion: torneo.descripcion,
  premio: torneo.premio,
  estado: torneo.torneo_en_curso ? "en_curso" : "pendiente",
  participantes: torneo.participantes?.length || 0,
  maxParticipantes: torneo.maxParticipantes || 8,
  requiereContraseña: !!torneo.contrasena,
  creadorId: torneo.creador_id,
  fechaInicio: torneo.fecha_inicio ? new Date(torneo.fecha_inicio) : null,
  ganador_id: torneo.ganador_id ?? null,
});

export const tournamentApi = {
  /**
   * Obtiene todos los torneos activos
   * @returns {Promise<Array>} Lista de torneos formateados
   */
  obtenerTorneosActivos: async () => {
    try {
      const response = await api.get("/getTorneosActivos");
      const data = response.data.data || response.data;
      return Array.isArray(data) ? data.map(formatTorneo) : [formatTorneo(data)];
    } catch (error) {
      if(error.response?.status == 404) {
        return [];
      }
      console.error("Error al obtener torneos:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.message || "Error al cargar torneos");
    }
  },

  /**
   * Crea un nuevo torneo
   * @param {Object} datos - Datos del torneo {nombre, descripcion, premio, contrasena?}
   * @returns {Promise<Object>} Torneo creado
   */
  crearTorneo: async ({ nombre, descripcion, premio, contrasena }) => {
    try {
      const payload = { nombre, descripcion, premio };
      if (contrasena) payload.contrasena = contrasena;

      console.log(payload)

      const response = await api.post("/crear", payload);
      return formatTorneo(response.data.data || response.data);
    } catch (error) {
      console.error("Error al crear torneo:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al crear torneo");
    }
  },

  /**
   * Obtiene detalles de un torneo específico
   * @param {number} torneoId - ID del torneo
   * @returns {Promise<Object>} Detalles del torneo
   */
  obtenerDetallesTorneo: async (torneoId) => {
    try {
      const response = await api.get(`/getTorneo/${torneoId}`);
      const data = response.data.data || response.data;
      return {
        ...formatTorneo(data.torneo || data),
        participantes: data.participantes || [],
        partidas: data.partidas || []
      };
    } catch (error) {
      console.error("Error al obtener detalles:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al obtener detalles");
    }
  },

  /**
   * Une un usuario a un torneo
   * @param {number} torneoId - ID del torneo
   * @param {string} [contrasena] - Contraseña opcional (solo para torneos privados)
   * @returns {Promise<Object>} Resultado de la operación
   */
  unirseATorneo: async (torneoId, contrasena) => {
    try {
      const id = Number(torneoId);
      if (isNaN(id)) throw new Error("ID de torneo inválido");

      const payload = { torneo_id: id };
      if (contrasena) payload.contrasena = contrasena;

      const response = await api.post("/unirse", payload);
      return {
        success: true,
        message: response.data.message || "Te has unido al torneo correctamente",
        torneo: formatTorneo(response.data.data || response.data)
      };
    } catch (error) {
      console.error("Error al unirse:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al unirse al torneo");
    }
  },

  /**
   * Abandona un torneo
   * @param {number} torneoId - ID del torneo
   * @returns {Promise<Object>} Resultado de la operación
   */
  abandonarTorneo: async (torneoId) => {
    try {
      const response = await api.post("/abandonarTorneo", {
        torneo_id: Number(torneoId)
      });
      return {
        success: true,
        message: response.data.message || "Has abandonado el torneo correctamente"
      };
    } catch (error) {
      console.error("Error al abandonar:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al abandonar torneo");
    }
  },

  /**
   * Obtiene torneos de amigos
   * @returns {Promise<Array>} Lista de torneos
   */
  obtenerTorneosAmigos: async () => {
    try {
      const response = await api.get("/getTorneosAmigos");
      const data = response.data.data || response.data;
      return Array.isArray(data) ? data.map(formatTorneo) : [formatTorneo(data)];
    } catch (error) {
      console.error("Error al obtener torneos de amigos:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al cargar torneos de amigos");
    }
  },

  /**
   * Obtiene los torneos en los que el usuario ha participado
   * @returns {Promise<Array>} Lista de torneos formateados
   */
  obtenerTorneosJugador: async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No hay token de autenticación");

      const { id: jugadorId } = jwtDecode(token);

      const response = await api.get("/getTorneosJugador", {
        params: { jugadorId }
      });

      const data = response.data.data || response.data;
      return data.map(item => ({
        id: item.infoTorneo.torneo_id,
        nombre: item.infoTorneo.torneo.nombre,
        descripcion: item.infoTorneo.torneo.descripcion,
        premio: item.infoTorneo.torneo.premio,
        estado: item.infoTorneo.torneo.torneo_en_curso ? "en_curso" : "pendiente",
        participantes: item.numParticipantes || 0,
        maxParticipantes: item.infoTorneo.torneo.maxParticipantes || 8,
        requiereContraseña: !!item.infoTorneo.torneo.contrasena,
        creadorId: item.infoTorneo.torneo.creador_id,
        fechaInicio: item.infoTorneo.torneo.fecha_inicio ? new Date(item.infoTorneo.torneo.fecha_inicio) : null,
        ganador_id: item.infoTorneo.torneo.ganador_id ?? null,
      }));

    } catch (error) {
      if(error.response?.status == 404) return [];
      console.error("Error al obtener torneos del jugador:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al cargar torneos del jugador");
    }
  },

  /**
   * Obtiene partidas de un torneo
   * @param {number} torneoId - ID del torneo
   * @returns {Promise<Array>} Lista de partidas
   */
  obtenerPartidasTorneo: async (torneoId) => {
    try {
      const response = await api.get(`/torneo/${torneoId}/partidas`);
      const data = response.data.data || response.data;
      return Array.isArray(data) ? data : (data.partidas || []);
    } catch (error) {
      console.error("Error al obtener partidas:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al cargar partidas");
    }
  },

  /**
   * Inicia un torneo
   * @param {number} torneoId - ID del torneo
   * @returns {Promise<Object>} Resultado de la operación
   */
  iniciarTorneo: async (torneoId) => {
    try {
      const response = await api.post("/iniciarTorneo", { torneo_id: Number(torneoId) });
      return response.data;
    } catch (error) {
      console.error("Error al iniciar torneo:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al iniciar torneo");
    }
  },

  /**
   * Elimina un torneo (usa el endpoint abandonarTorneo que ya maneja la lógica para creadores)
   * @param {number} torneoId - ID del torneo
   * @returns {Promise<Object>} Resultado de la operación
   */
  eliminarTorneo: async (torneoId) => {
    try {
      const response = await api.post("/abandonarTorneo", { torneo_id: Number(torneoId) });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar torneo:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al eliminar torneo");
    }
  }
};

export default tournamentApi;