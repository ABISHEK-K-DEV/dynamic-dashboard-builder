export function ActionField({ label, buttonLabel, onClick }) {
  return (
    <div className="space-y-1">
      {label ? (
        <span className="block text-[10px] uppercase tracking-wider text-[var(--color-panel-muted)]">
          {label}
        </span>
      ) : null}
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded bg-[var(--color-accent)] px-3 py-2 text-xs font-medium text-white hover:opacity-90"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
