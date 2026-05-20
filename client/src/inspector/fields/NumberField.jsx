export function NumberField({ label, value, min, max, step, unit, onChange }) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-panel-muted)]">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={Number.isFinite(value) ? value : ''}
          min={min}
          max={max}
          step={step ?? 1}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isFinite(n)) return;
            onChange(n);
          }}
          className="w-full rounded border border-[var(--color-panel-border)] bg-black/30 px-2 py-1.5 text-xs text-white outline-none focus:border-[var(--color-accent)]"
        />
        {unit && <span className="text-[10px] text-[var(--color-panel-muted)]">{unit}</span>}
      </div>
    </label>
  );
}
