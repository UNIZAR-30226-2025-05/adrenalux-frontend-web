import axios from 'axios';

const API_BASE_URL = 'http://54.37.50.18:3000/api/v1/cartas';

const getToken = () => localStorage.getItem("auth_token");

export const abrirSobre = async (tipo) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/abrirSobre/${tipo}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json"
      }
    });

    const cartas = response.data?.data?.responseJson.cartas;

    if (!Array.isArray(cartas)) {
      throw new Error('Estructura de respuesta incorrecta');
    }

    return cartas.map((carta) => ({
      id: carta.id || "N/A",                      
      nombre: carta.nombre || "Desconocido",      
      alias: carta.alias || "Desconocido",   
      pais: carta.pais || "N/A",                  
      photo: carta.photo || "default.png",          
      equipo: carta.club || "Sin club",           
      escudo: carta.escudo || "default_escudo.png",   
      ataque: carta.ataque ?? 0,             
      control: carta.medio ?? 0,            
      defensa: carta.defensa ?? 0,         
      tipo_carta: carta.rareza || "Común",       
      posicion: carta.posicion || "N/A",         
    }));
  } catch (error) {
    console.error('Error al abrir el sobre:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const sobresDisponibles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sobres`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json"
      }
    });

    return response.data.map(sobre => ({
      ...sobre,
    }));
    
  } catch (error) {
    console.error('Error al obtener los sobres disponibles:', error.response?.data?.message || error.message);
    throw error;
  }
};
