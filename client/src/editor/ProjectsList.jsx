import { useState } from 'react';
import { Database, Plus } from 'lucide-react';
import { loadProjectFromCloud } from '@/persistence/apiPersistence';
import { useEditorStore } from '@/store/editorStore';

export function ProjectsList({ onOpened }) {
  const newProject = useEditorStore((s) => s.newProject);
  const [loading, setLoading] = useState(false);

  const openNew = () => {
    newProject('My Dashboard');
    onOpened();
  };

  const openSaved = async () => {
    setLoading(true);
    try {
      const ok = await loadProjectFromCloud();
      if (ok) onOpened();
      else alert('No saved dashboard yet. Create one and click Save in the editor.');
    } catch (e) {
      console.error(e);
      alert('Could not load — start the API server (npm start in server folder).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-8 text-white">
      <h1 className="mb-2 text-2xl font-semibold">Dashboard Builder</h1>
      <p className="mb-8 max-w-md text-center text-sm text-neutral-400">
        Add text, images, and charts. Drag and resize widgets. Save your layout to MySQL.
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
          onClick={() => void openSaved()}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-neutral-700 px-6 py-3 text-sm hover:bg-neutral-900 disabled:opacity-50"
        >
          <Database size={18} />
          {loading ? 'Loading…' : 'Load from MySQL'}
        </button>
      </div>
    </div>
  );
}
