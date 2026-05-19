import axios from 'axios';

function resolveApiBase() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return 'http://localhost:5000';
  return '';
}

export const API_BASE = resolveApiBase();
const API_URL = API_BASE ? `${API_BASE}/api` : '/api';

export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (!API_BASE) return path;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
};

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
  },
};
