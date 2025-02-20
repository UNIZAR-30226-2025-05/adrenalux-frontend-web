import { getToken } from "../api/authApi";

const API_URL = "http://54.37.50.18:3000/api/v1";

export const getProfile = async () => {
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
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const updateProfile = async (profileData) => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        });
        return response.status === 204;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

export const getLevelXP = async () => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/levelxp`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching level and XP:", error);
        throw error;
    }
};

export const getClasificacion = async () => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/clasificacion`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching classification:", error);
        throw error;
    }
};

export const getAchievements = async () => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/achievements`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching achievements:", error);
        throw error;
    }
};

export const getFriends = async () => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/friends`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching friends:", error);
        throw error;
    }
};

export const getFriendRequests = async () => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/friend-requests`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        throw error;
    }
};

export const sendFriendRequest = async (friendId) => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/friend-requests`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ friendId }),
        });
        return response.status === 204;
    } catch (error) {
        console.error("Error sending friend request:", error);
        throw error;
    }
};

export const getAdrenacoins = async () => {
    const token = getToken();
    if (!token) throw new Error("Token not found");
    try {
        const response = await fetch(`${API_URL}/adrenacoins`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching adrenacoins:", error);
        throw error;
    }
};
