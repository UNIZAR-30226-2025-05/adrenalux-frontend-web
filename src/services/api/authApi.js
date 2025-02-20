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
  const response = await fetch(`${API_URL}/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({email, username, lastname, name, password}),
  });

  const data = await response.json(); 
  return { status: response.status, data }; 
};

// Logout
export const logout = () => {
    removeToken();
    window.location.href = "/sign-in"; // Redirect to sign-in page
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
                "Authorization": `Bearer ${token}`,
            },
        });

        return response.status === 200;
    } catch (error) {
        return false;
    }
};

// Hacer fetch 
export const getUserData = async () => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    
    try {
        const response = await fetch(`${API_URL}/profile`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};
