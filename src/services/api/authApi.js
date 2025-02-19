const API_URL = "http://54.37.50.18:3000/api/v1/auth";

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json(); // Convertimos la respuesta a JSON
    return { status: response.status, data }; // Retornamos el status junto con los datos
  };
  

export const register = async (email, username, lastname, name, password) => {
  const response = await fetch(`${API_URL}/sign-upr`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({email, username, lastname, name, password}),
  });

  return response.json();   
};
