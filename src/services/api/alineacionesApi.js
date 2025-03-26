import axios from 'axios';

const API_URL = 'https://adrenalux.duckdns.org/api/v1';

// Función para obtener todas las plantillas del usuario
export const obtenerPlantillas = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/plantillas`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error al obtener plantillas:', error);
        throw error;
    }
};

// Función para crear una nueva plantilla
export const crearPlantilla = async (nombre, token) => {
    try {
        console.log(token)
        const response = await axios.post(`${API_URL}/plantillas`, { nombre }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear plantilla:', error);
        throw error;
    }
};

// Función para actualizar una plantilla
export const actualizarPlantilla = async (plantillaId, nuevoNombre, token) => {
    try {
        const response = await axios.put(`${API_URL}/plantillas`, { plantillaIdNum: plantillaId, nuevoNombre }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar plantilla:', error);
        throw error;
    }
};

export const eliminarPlantilla = async (plantillaId, token) => {
    try {
      const response = await axios.delete(`${API_URL}/plantillas`, {
        data: { plantillaIdNum: plantillaId }, // Cuerpo de la solicitud
        headers: {
          Authorization: `Bearer ${token}`, // Token en el encabezado
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar la plantilla:", error);
      throw error;
    }
  };

// Función para agregar cartas a una plantilla
export const agregarCartasPlantilla = async (plantillaId, cartasid, posiciones, token) => {
    try {
        const response = await axios.post(`${API_URL}/agregarCartasPlantilla`, { plantillaId, cartasid, posiciones }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al agregar cartas a la plantilla:', error);
        throw error;
    }
};

// Función para obtener las cartas de una plantilla
export const obtenerCartasDePlantilla = async (plantillaId, token) => {
    try {
        const response = await axios.get(`${API_URL}/getCartasporPlantilla/${plantillaId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener cartas de la plantilla:', error);
        throw error;
    }
};

// Función para actualizar una carta en una plantilla
export const actualizarCarta = async (plantillaId, cartaidActual, cartaidNueva, token) => {
    try {
        const response = await axios.put(`${API_URL}/actualizarCarta`, { plantillaId, cartaidActual, cartaidNueva }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar carta en la plantilla:', error);
        throw error;
    }
};