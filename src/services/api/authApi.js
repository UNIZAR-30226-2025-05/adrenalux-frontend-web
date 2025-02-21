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
  if (response.status === 200) {
    setToken(data.data.token); // Guardar el token
  }
  return { status: response.status, data }; // Retornamos el status junto con los datos
};

export const register = async (email, username, lastname, name, password) => {
  const response = await fetch(`${API_URL}/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, lastname, name, password }),
  });

  return response.json();
};

// Logout
export const logout = () => {
  removeToken();
  window.location.href = "/sign-in"; // Redireccion
};

// Validar token
export const validateToken = async () => {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_URL}/validate-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.status === 200;
  } catch (error) {
    return false;
  }
};
