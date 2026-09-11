import api from "./api";

export const register = async (payload) => (await api.post("/auth/register", payload)).data;
export const login = async (payload) => (await api.post("/auth/login", payload)).data;
export const getMe = async () => (await api.get("/auth/me")).data;
