import axios from 'axios';
import { getToken } from "../api/authApi";


const API_URL = "https://adrenalux.duckdns.org/api/v1/clasificacion";

export const obtenerClasificacionTotal = async () => {
  console.log('[API] Iniciando obtención de clasificación total');
  try {
    const token = getToken();
    console.log('[API] Token encontrado:', token ? 'Sí' : 'No');

    const response = await axios.get(`${API_URL}/total`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('[API] Respuesta de /total - Status:', response.status);
    console.log('[API] Datos recibidos:', response.data);

    const datosTransformados = Array.isArray(response.data?.data) 
      ? response.data.data
          .sort((a, b) => b.clasificacion - a.clasificacion) 
          .map((user, index) => ({
            position: index + 1,
            name: user.name || user.username || 'Jugador',
            won: user.estadisticas?.partidasGanadas || 0,
            played: user.estadisticas?.partidasJugadas || 0,
            lost: user.estadisticas?.partidasPerdidas || 0,
            userid: user.userid || user.id,
            puntos: user.clasificacion || 0,
          }))
      : [];

    console.log('[API] Datos transformados:', datosTransformados);
    return datosTransformados;

  } catch (error) {
    console.error('[API] Error en obtenerClasificacionTotal:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });
    return [];
  }
};

export const obtenerClasificacionUsuario = async () => {
  console.log('[API] Iniciando obtención de clasificación de usuario');
  try {
    const token = getToken();
    if (!token) {
      console.warn('[API] No se encontró token');
      return null;
    }

    // 1. Intentar con endpoint específico
    try {
      const response = await axios.get(`${API_URL}/usuario`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('[API] Respuesta de /usuario:', response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status !== 404) throw error;
      console.log('[API] Endpoint /usuario no existe (404)');
    }

    // 2. Fallback: Obtener de la lista total
    console.log('[API] Obteniendo datos del total como alternativa');
    const total = await obtenerClasificacionTotal();
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const userId = tokenData?.id;
    
    console.log('[API] UserID obtenido del token:', userId);
    const usuarioEncontrado = total.find(user => user.userid === userId);
    console.log('[API] Usuario encontrado en ranking total:', usuarioEncontrado ? 'Sí' : 'No');
    
    return usuarioEncontrado || null;

  } catch (error) {
    console.error('[API] Error crítico en obtenerClasificacionUsuario:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });
    return null;
  }
};