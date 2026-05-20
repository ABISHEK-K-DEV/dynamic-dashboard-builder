import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : '/api',
});

const dashboardId = import.meta.env.VITE_DASHBOARD_ID || 'd1';

async function loadProjectFromApi(id = dashboardId) {
  const { data } = await api.get(`/dashboards/${id}/project`);
  if (!data?.project) return null;
  return data;
}

async function saveProjectToApi(snapshot, id = dashboardId) {
  await api.put(`/dashboards/${id}/project`, snapshot);
}

export { loadProjectFromApi, saveProjectToApi };
