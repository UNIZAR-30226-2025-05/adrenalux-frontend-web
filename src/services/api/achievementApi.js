import { getToken } from "../api/authApi";

const API_URL = "https://adrenalux.duckdns.org/api/v1/profile";

export const generateAchievements = async (quantity, type, increment, rewardType, rewardAmount) => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/achievements/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ quantity, type, increment, rewardType, rewardAmount }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error generating achievements:", error);
        throw error;
    }
};

export const getAchievements = async () => {
    const token = getToken();
    if (!token) throw new Error("Token not found");

    try {
        const response = await fetch(`${API_URL}/achievements`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch achievements");
        }
        
        const data = await response.json();
        console.log("Respuesta de la API:", data);  // Verificación de los datos recibidos
        
        if (Array.isArray(data.data)) {
            return data.data;
        } else {
            throw new Error("La respuesta no contiene un arreglo de logros válido");
        }
    } catch (error) {
        console.error("Error fetching achievements:", error);
        throw error;
    }
};


export const insertAchievements = async (achievements) => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/achievements/insert`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ achievements }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error inserting achievements:", error);
        throw error;
    }
};
