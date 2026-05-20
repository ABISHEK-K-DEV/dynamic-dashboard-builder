import { useState } from 'react';
import {
  Undo2,
  Redo2,
  Smartphone,
  Tablet,
  Monitor,
  Play,
  Pause,
  ChevronLeft,
  Database,
  FolderOpen,
} from 'lucide-react';
import { useEditorStore, editorTemporal } from '@/store/editorStore';
import { saveProjectToCloud, loadProjectFromCloud } from '@/persistence/apiPersistence';

export function TopBar({ onBackToProjects }) {
  const project = useEditorStore((s) => s.project);
  const renameProject = useEditorStore((s) => s.renameProject);
  const device = useEditorStore((s) => s.viewport.device);
  const setDevice = useEditorStore((s) => s.setDevice);
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const t = editorTemporal;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await saveProjectToCloud();
      alert('Dashboard saved to MySQL');
    } catch (e) {
      console.error(e);
      alert('Save failed — is the API server running?');
    } finally {
      setSaving(false);
    }
  };

  const onLoad = async () => {
    setLoading(true);
    try {
      const ok = await loadProjectFromCloud();
      alert(ok ? 'Loaded from MySQL' : 'No saved layout yet. Save once, then load.');
    } catch (e) {
      console.error(e);
      alert('Load failed — is the API server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--color-panel-border)] bg-[#101012] px-3">
      <div className="flex items-center gap-2">
        {onBackToProjects && (
          <button
            type="button"
            onClick={onBackToProjects}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[var(--color-panel-muted)] hover:bg-white/5 hover:text-white"
          >
            <ChevronLeft size={14} /> Home
          </button>
        )}
        <input
          value={project?.name ?? ''}
          onChange={(e) => renameProject(e.target.value)}
          className="rounded bg-transparent px-2 py-1 text-sm font-medium outline-none hover:bg-white/5 focus:bg-white/10"
          title="Dashboard name"
        />
      </div>

      <div className="flex items-center gap-1 rounded-md border border-[var(--color-panel-border)] bg-black/20 p-0.5">
        <DeviceButton current={device} value="mobile" onClick={setDevice}>
          <Smartphone size={14} />
        </DeviceButton>
        <DeviceButton current={device} value="tablet" onClick={setDevice}>
          <Tablet size={14} />
        </DeviceButton>
        <DeviceButton current={device} value="desktop" onClick={setDevice}>
          <Monitor size={14} />
        </DeviceButton>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => t.getState().undo()}
          className="rounded p-1.5 text-[var(--color-panel-muted)] hover:bg-white/5 hover:text-white"
          title="Undo"
        >
          <Undo2 size={14} />
        </button>
        <button
          type="button"
          onClick={() => t.getState().redo()}
          className="rounded p-1.5 text-[var(--color-panel-muted)] hover:bg-white/5 hover:text-white"
          title="Redo"
        >
          <Redo2 size={14} />
        </button>
        <div className="mx-1 h-6 w-px bg-[var(--color-panel-border)]" />
        <button
          type="button"
          onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-[var(--color-panel-muted)] hover:bg-white/5 hover:text-white"
        >
          {mode === 'edit' ? <Play size={14} /> : <Pause size={14} />}
          {mode === 'edit' ? 'Preview' : 'Edit'}
        </button>
        <button
          type="button"
          onClick={onLoad}
          disabled={loading}
          className="flex items-center gap-1.5 rounded border border-[var(--color-panel-border)] px-2 py-1 text-xs hover:bg-white/5 disabled:opacity-50"
        >
          <FolderOpen size={14} />
          {loading ? 'Loading…' : 'Load'}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1.5 rounded bg-[var(--color-accent)] px-3 py-1 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          <Database size={14} />
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </header>
  );
}

function DeviceButton({ current, value, onClick, children }) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`rounded px-2 py-1 text-xs ${active ? 'bg-white/10 text-white' : 'text-[var(--color-panel-muted)] hover:text-white'}`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
