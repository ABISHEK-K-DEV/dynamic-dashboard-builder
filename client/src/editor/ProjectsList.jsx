import { useState } from 'react';
import { Database, Plus } from 'lucide-react';
import { loadProjectFromCloud } from '@/persistence/apiPersistence';
import { useEditorStore } from '@/store/editorStore';
import { toast } from '@/store/toastStore';
import { DashboardPickerModal } from './DashboardPickerModal';

export function ProjectsList({ onOpened }) {
  const newProject = useEditorStore((s) => s.newProject);
  const cloudDashboardId = useEditorStore((s) => s.cloudDashboardId);
  const [loading, setLoading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const openNew = () => {
    newProject('My Dashboard');
    onOpened();
  };

  const openSaved = async (dashboardId) => {
    setPickerOpen(false);
    setLoading(true);
    try {
      const ok = await loadProjectFromCloud(dashboardId);
      if (ok) {
        const p = useEditorStore.getState().project;
        const label = p?.name?.trim() || 'Untitled';
        toast.success(`"${label}"`);
        onOpened();
      } else toast.info('That dashboard has no saved layout yet.');
    } catch (e) {
      console.error(e);
      toast.error('Could not load — start the API server (npm start).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-8 text-white">
        <h1 className="mb-2 text-2xl font-semibold">Dashboard Builder</h1>
        <p className="mb-8 max-w-md text-center text-sm text-neutral-400">
          Add text, images, and charts. Save multiple dashboards to MySQL — Load lets you pick which
          one to open.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={openNew}
            className="flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-medium hover:opacity-90"
          >
            <Plus size={18} /> New dashboard
          </button>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-neutral-700 px-6 py-3 text-sm hover:bg-neutral-900 disabled:opacity-50"
          >
            <Database size={18} />
            {loading ? 'Loading…' : 'Load from MySQL'}
          </button>
        </div>
      </div>

      <DashboardPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(id) => void openSaved(id)}
        currentCloudDashboardId={cloudDashboardId}
      />
    </>
  );
}
