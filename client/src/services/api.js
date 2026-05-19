import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const dashboardService = {
  getDashboard: async (id) => {
    const response = await api.get(`/dashboards/${id}`);
    return response.data;
  },
  saveLayout: async (id, widgets) => {
    const response = await api.put(`/dashboards/${id}/layout`, { widgets });
    return response.data;
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
};
