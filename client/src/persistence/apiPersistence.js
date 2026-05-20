import { useEditorStore } from '@/store/editorStore';
import {
  createDashboard,
  loadProjectFromApi,
  saveProjectToApi,
} from '@/services/api';

function buildApiSnapshot() {
  const s = useEditorStore.getState();
  if (!s.project) throw new Error('No active project');

  const project = { ...s.project, updatedAt: Date.now() };
  const pages = s.pageOrder.map((pid) => s.pages[pid]).filter(Boolean);
  const sections = Object.values(s.sections);
  const elements = Object.values(s.elements);

  return {
    project,
    pages,
    sections,
    elements,
    pageOrder: s.pageOrder,
    sectionOrder: s.sectionOrder,
  };
}

function applySnapshot(snapshot, cloudDashboardId) {
  const pages =
    snapshot.pages?.length > 0
      ? snapshot.pages
      : [
          {
            id: 'page-main',
            projectId: snapshot.project.id,
            name: 'Page 1',
            order: 0,
            widthBase: 430,
            widthMd: 768,
            widthLg: 1280,
          },
        ];

  const sections =
    snapshot.sections?.length > 0
      ? snapshot.sections
      : [
          {
            id: 'sec-main',
            pageId: pages[0].id,
            name: 'Section 1',
            order: 0,
            height: 800,
            background: '#FAF6F0',
          },
        ];

  const store = useEditorStore.getState();
  store.setCloudDashboardId(cloudDashboardId);
  store.loadProject(
    snapshot.project,
    pages,
    snapshot.elements ?? [],
    sections,
    snapshot.pageOrder?.[0] ?? pages[0]?.id,
  );
}

/** Resolves after save with project identifiers (for toasts), not the MySQL row id only. */
export async function saveProjectToCloud() {
  const s = useEditorStore.getState();
  let dashboardId = s.cloudDashboardId;

  if (!dashboardId) {
    const created = await createDashboard(s.project?.name ?? 'Untitled Dashboard');
    dashboardId = created.id;
    useEditorStore.getState().setCloudDashboardId(dashboardId);
  }

  const snapshot = buildApiSnapshot();
  await saveProjectToApi(snapshot, dashboardId);

  const { id: projectId, name: projectName } = snapshot.project;
  return { dashboardId, projectId, projectName };
}

export async function loadProjectFromCloud(dashboardId) {
  const snapshot = await loadProjectFromApi(dashboardId);
  if (!snapshot?.project) return false;

  applySnapshot(snapshot, dashboardId);
  return true;
}
