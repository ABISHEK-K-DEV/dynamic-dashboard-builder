import { AlertTriangle } from 'lucide-react';

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = false,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby={message ? 'confirm-modal-desc' : undefined}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="w-full max-w-sm rounded-lg border border-[var(--color-panel-border)] bg-[#141416] shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex gap-3 border-b border-[var(--color-panel-border)] px-4 py-3">
          {danger && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-400">
              <AlertTriangle size={20} aria-hidden />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 id="confirm-modal-title" className="text-sm font-semibold text-white">
              {title}
            </h2>
            {message ? (
              <p
                id="confirm-modal-desc"
                className="mt-1.5 text-xs leading-relaxed text-[var(--color-panel-muted)]"
              >
                {message}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex justify-end gap-2 px-4 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-[var(--color-panel-border)] px-3 py-1.5 text-xs text-white hover:bg-white/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded px-3 py-1.5 text-xs font-medium text-white ${
              danger
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-[var(--color-accent)] hover:opacity-90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
