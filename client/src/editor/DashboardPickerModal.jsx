import { useEffect, useState } from 'react';
import { X, Database, Trash2 } from 'lucide-react';
import { deleteDashboard, listDashboards } from '@/services/api';
import { toast } from '@/store/toastStore';
import { useEditorStore } from '@/store/editorStore';
import { ConfirmModal } from '@/components/ConfirmModal';

export function DashboardPickerModal({ open, onClose, onSelect, currentCloudDashboardId }) {
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const reload = () =>
    listDashboards()
      .then((list) => {
        const withLayout = list.filter((d) => d.hasLayout);
        const nextRows = withLayout.length ? withLayout : list;
        setRows(nextRows);
        setSelectedId((prev) =>
          nextRows.some((r) => r.id === prev) ? prev : (nextRows[0]?.id ?? ''),
        );
      })
      .catch((e) => {
        console.error(e);
        const msg = 'Could not load dashboard list. Is the API server running?';
        setError(msg);
        toast.error(msg);
        setRows([]);
      });

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError('');
    reload().finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) setDeleteTarget(null);
  }, [open]);

  if (!open) return null;

  const handleLoad = () => {
    if (!selectedId) return;
    onSelect(selectedId);
  };

  const requestDelete = (e, rowId, rowName) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTarget({ id: rowId, name: rowName });
  };

  const runDelete = async () => {
    if (!deleteTarget) return;
    const { id: rowId, name: rowName } = deleteTarget;
    setDeleteTarget(null);
    setDeletingId(rowId);
    try {
      await deleteDashboard(rowId);
      toast.success(`"${rowName}"`);
      if (rowId === currentCloudDashboardId) {
        useEditorStore.getState().setCloudDashboardId(null);
      }
      await reload();
    } catch (err) {
      console.error(err);
      toast.error('Could not delete dashboard.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-picker-title"
      >
        <div className="w-full max-w-md rounded-lg border border-[var(--color-panel-border)] bg-[#141416] shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--color-panel-border)] px-4 py-3">
            <h2 id="dashboard-picker-title" className="flex items-center gap-2 text-sm font-semibold text-white">
              <Database size={16} /> Choose dashboard to load
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-[var(--color-panel-muted)] hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <p className="border-b border-[var(--color-panel-border)] px-4 py-2 text-[10px] text-[var(--color-panel-muted)]">
            Trash removes the selected dashboard from the database.
          </p>

          <div className="max-h-72 overflow-y-auto p-3">
            {loading && (
              <p className="py-6 text-center text-xs text-[var(--color-panel-muted)]">Loading from MySQL…</p>
            )}
            {error && <p className="py-4 text-center text-xs text-[var(--color-danger)]">{error}</p>}
            {!loading && !error && rows.length === 0 && (
              <p className="py-6 text-center text-xs text-[var(--color-panel-muted)]">
                No dashboards in the database yet. Create one and click Save.
              </p>
            )}
            {!loading && !error && rows.length > 0 && (
              <ul className="space-y-1">
                {rows.map((d) => (
                  <li key={d.id}>
                    <div
                      className={`flex items-start gap-2 rounded border px-2 py-2 text-xs transition-colors ${
                        selectedId === d.id
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                          : 'border-[var(--color-panel-border)] hover:bg-white/5'
                      }`}
                    >
                      <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-2">
                        <input
                          type="radio"
                          name="dashboard"
                          className="mt-1"
                          checked={selectedId === d.id}
                          onChange={() => setSelectedId(d.id)}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-white">{d.name}</span>
                          <span className="mt-0.5 block text-[10px] text-[var(--color-panel-muted)]">
                            ID: {d.id}
                            {d.widgetCount > 0 ? ` · ${d.widgetCount} widget(s)` : ''}
                            {!d.hasLayout ? ' · (empty)' : ''}
                          </span>
                          {d.updatedAt && (
                            <span className="mt-0.5 block text-[10px] text-[var(--color-panel-muted)]">
                              Updated: {new Date(d.updatedAt).toLocaleString()}
                            </span>
                          )}
                        </span>
                      </label>
                      <button
                        type="button"
                        title="Delete this dashboard"
                        disabled={deletingId === d.id}
                        onClick={(e) => requestDelete(e, d.id, d.name)}
                        className="shrink-0 rounded p-1.5 text-[var(--color-panel-muted)] hover:bg-red-500/20 hover:text-red-400 disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-[var(--color-panel-border)] px-4 py-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-[var(--color-panel-border)] px-3 py-1.5 text-xs text-white hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedId || loading}
              onClick={handleLoad}
              className="rounded bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-40"
            >
              Load selected
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        danger
        title={`Delete "${deleteTarget?.name ?? ''}"?`}
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void runDelete()}
      />
    </>
  );
}
