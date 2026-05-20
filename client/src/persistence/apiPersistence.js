import { useEditorStore } from '@/store/editorStore';
import { loadProjectFromApi, saveProjectToApi } from '@/services/api';

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

export async function saveProjectToCloud() {
  await saveProjectToApi(buildApiSnapshot());
}

export async function loadProjectFromCloud() {
  const snapshot = await loadProjectFromApi();
  if (!snapshot?.project) return false;

  useEditorStore.getState().loadProject(
    snapshot.project,
    snapshot.pages,
    snapshot.elements,
    snapshot.sections ?? [],
    snapshot.pageOrder?.[0] ?? snapshot.pages?.[0]?.id,
  );
  return true;
}
