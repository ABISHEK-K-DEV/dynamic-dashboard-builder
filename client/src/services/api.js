import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : '/api',
});

const defaultDashboardId = import.meta.env.VITE_DASHBOARD_ID || 'd1';

async function listDashboards() {
  const { data } = await api.get('/dashboards');
  return data;
}

async function createDashboard(name, id) {
  const { data } = await api.post('/dashboards', { name, id });
  return data;
}

async function loadProjectFromApi(id = defaultDashboardId) {
  const { data } = await api.get(`/dashboards/${id}/project`);
  if (!data?.project && !(data?.elements?.length > 0)) return null;
  return data;
}

async function saveProjectToApi(snapshot, id = defaultDashboardId) {
  await api.put(`/dashboards/${id}/project`, snapshot);
}

async function deleteDashboard(id) {
  await api.delete(`/dashboards/${id}`);
}

export {
  defaultDashboardId,
  listDashboards,
  createDashboard,
  loadProjectFromApi,
  saveProjectToApi,
  deleteDashboard,
};
