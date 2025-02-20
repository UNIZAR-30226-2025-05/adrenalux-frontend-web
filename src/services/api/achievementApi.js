import { getToken } from "../api/authApi";

const API_URL = "http://54.37.50.18:3000/api/v1";

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
            headers: { "Authorization": `Bearer ${token}` }
        });
        return await response.json();
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
