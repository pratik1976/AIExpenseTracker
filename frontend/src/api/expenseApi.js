import api from "./api";

export const getExpenses = async () => (await api.get("/expenses")).data;
export const createExpense = async (payload) => (await api.post("/expenses", payload)).data;
export const updateExpense = async (id, payload) => (await api.put(`/expenses/${id}`, payload)).data;
export const deleteExpense = async (id) => (await api.delete(`/expenses/${id}`)).data;
export const getDashboard = async () => (await api.get("/dashboard")).data;
export const scanReceipt = async (image, mimeType) =>
  (await api.post("/ai/scan-receipt", { image, mimeType }, { timeout: 60000 })).data;
export const getAiInsights = async () => (await api.get("/ai/insights", { timeout: 60000 })).data;
