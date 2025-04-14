import { getToken } from "../api/authApi";

const API_URL = "https://adrenalux.duckdns.org/api/v1/profile";

// Objeto con mensajes de error amigables
const ERROR_MESSAGES = {
  AUTH: {
    title: "Acceso no autorizado",
    message: "Debes iniciar sesión para acceder a esta función",
    type: "auth"
  },
  NETWORK: {
    title: "Error de conexión",
    message: "No se pudo conectar al servidor. Verifica tu conexión a internet",
    type: "network"
  },
  API: {
    title: "Error del servidor",
    message: "El servidor no pudo procesar tu solicitud",
    type: "api"
  },
  FORMAT: {
    title: "Error de datos",
    message: "La información recibida no es válida",
    type: "format"
  },
  DEFAULT: {
    title: "Error inesperado",
    message: "Ocurrió un problema al procesar tu solicitud",
    type: "unknown"
  }
};

// Función para crear errores estandarizados
const createUserFriendlyError = (errorType, details = null) => {
  const errorTemplate = ERROR_MESSAGES[errorType] || ERROR_MESSAGES.DEFAULT;
  console.error(`[${errorType}] ${details || errorTemplate.message}`);
  
  return {
    ...errorTemplate,
    details: details || errorTemplate.message,
    timestamp: new Date().toISOString(),
    isUserFriendly: true
  };
};

export const getAchievements = async () => {
  const token = getToken();
  if (!token) throw createUserFriendlyError('AUTH');

  try {
    const response = await fetch(`${API_URL}/achievements`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorDetails = `HTTP ${response.status} - ${response.statusText}`;
      throw createUserFriendlyError('API', errorDetails);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data.data)) {
      throw createUserFriendlyError('FORMAT', 'La estructura de datos no es válida');
    }

    return data.data;
  } catch (error) {
    if (error.isUserFriendly) throw error;
    
    if (error.message.includes('Failed to fetch')) {
      throw createUserFriendlyError('NETWORK');
    }
    
    throw createUserFriendlyError('DEFAULT', error.message);
  }
};

export const generateAchievements = async (quantity, type, increment, rewardType, rewardAmount) => {
  const token = getToken();
  if (!token) throw createUserFriendlyError('AUTH');

  try {
    const response = await fetch(`${API_URL}/achievements/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity, type, increment, rewardType, rewardAmount }),
    });

    if (!response.ok) {
      const errorDetails = `HTTP ${response.status} - ${response.statusText}`;
      throw createUserFriendlyError('API', errorDetails);
    }

    return await response.json();
  } catch (error) {
    if (error.isUserFriendly) throw error;
    throw createUserFriendlyError('DEFAULT', error.message);
  }
};

export const insertAchievements = async (achievements) => {
  const token = getToken();
  if (!token) throw createUserFriendlyError('AUTH');

  try {
    const response = await fetch(`${API_URL}/achievements/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ achievements }),
    });

    if (!response.ok) {
      const errorDetails = `HTTP ${response.status} - ${response.statusText}`;
      throw createUserFriendlyError('API', errorDetails);
    }

    return await response.json();
  } catch (error) {
    if (error.isUserFriendly) throw error;
    throw createUserFriendlyError('DEFAULT', error.message);
  }
};