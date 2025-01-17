import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const getItems = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/items`);
    return response.data;
};

export const createItem = async (itemData) => {
    const response = await axios.post(`${API_BASE_URL}/api/items`, itemData);
    return response.data;
};

export const updateItem = async (id, updatedData) => {
    const response = await axios.put(`${API_BASE_URL}/api/items/${id}`, updatedData);
    return response.data;
};

export const deleteItem = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/api/items/${id}`);
    return response.data;
};

export const completeItem = async (id) => {
    // Must match the server route EXACTLY
    const response = await axios.put(`${API_BASE_URL}/api/items/${id}/complete`);
    return response.data;
};
