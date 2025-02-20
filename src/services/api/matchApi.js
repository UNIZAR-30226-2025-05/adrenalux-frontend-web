import { getToken } from "./authApi";

const API_URL = "http://54.37.50.18:3000/api/v1";

export const matchmaking = async () => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/matchmaking`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Error finding a match:", error);
        throw error;
    }
};

export const desafiarAmigo = async (friendId) => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/desafiar-amigo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ friendId }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error sending challenge:", error);
        throw error;
    }
};

export const aceptarDesafio = async (desafioId) => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/aceptar-desafio`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ desafioId }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error accepting challenge:", error);
        throw error;
    }
};

export const realizarJugada = async (partidaId, cartaId, estadistica) => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/realizar-jugada`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ partidaId, cartaId, estadistica }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error making a move:", error);
        throw error;
    }
};

export const abandonarPartida = async (partidaId) => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/abandonar-partida`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ partidaId }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error abandoning match:", error);
        throw error;
    }
};
