export function TextField({ label, value, multiline, onChange }) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-panel-muted)]">
        {label}
      </span>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded border border-[var(--color-panel-border)] bg-black/30 px-2 py-1.5 text-xs text-white outline-none focus:border-[var(--color-accent)]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded border border-[var(--color-panel-border)] bg-black/30 px-2 py-1.5 text-xs text-white outline-none focus:border-[var(--color-accent)]"
        />
      )}
    </label>
  );
}
