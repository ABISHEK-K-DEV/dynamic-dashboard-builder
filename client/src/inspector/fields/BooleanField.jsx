export function BooleanField({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between text-xs">
      <span className="text-[var(--color-panel-muted)]">{label}</span>
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 accent-[var(--color-accent)]"
      />
    </label>
  );
}
