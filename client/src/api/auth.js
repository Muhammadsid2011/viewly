import api from "./axios";

const register = async (data) => {
    try {
        const response = await api.post("/api/users/register", data);

        return response.data;
    } catch (error) {
        throw error;
    }
}

const login = async (data) => {
    try {
        const response = await api.post("/api/users/login", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const logout = async () => {
    try {
        await api.post("/api/users/logout");
    } catch (error) {
        throw error;
    }
}

const getCurrentUser = async () => {
    try {
        const response = await api.get("/api/users/current-user");

        return response.data;
    } catch (error) {
        throw error;
    }
}

const refreshAccessToken = async () => {
    try {
        await api.post("/api/users/refresh-accesstoken");
    } catch (error) {
        throw error;
    }
}

export {
    register,
    login,
    refreshAccessToken,
    logout,
    getCurrentUser
}