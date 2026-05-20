import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useToastStore } from '@/store/toastStore';

const styles = {
  success: 'border-emerald-500/40 bg-emerald-950/95 text-emerald-50',
  error: 'border-red-500/40 bg-red-950/95 text-red-50',
  info: 'border-[var(--color-accent)]/40 bg-[#1a1a1e] text-white',
};

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function Toasts() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (!toasts.length) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => {
        const Icon = icons[t.type] ?? Info;
        return (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm shadow-lg ${styles[t.type] ?? styles.info}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0 opacity-90" aria-hidden />
            <p className="min-w-0 flex-1 leading-snug">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
