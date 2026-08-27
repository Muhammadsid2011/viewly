import api from "./axios";

const register = async (data) => {
    const response = await api.post("/api/users/register", data);
    return response.data;
}

const login = async (data) => {
    const response = await api.post("/api/users/login", data);
    return response.data;
}

const logout = async () => {
    await api.post("/api/users/logout");
}

const getCurrentUser = async () => {
    const response = await api.get("/api/users/current-user");
    return response.data;
}

const refreshAccessToken = async () => {
    await api.post("/api/users/refresh-accesstoken");
}

export {
    register,
    login,
    refreshAccessToken,
    logout,
    getCurrentUser
}
