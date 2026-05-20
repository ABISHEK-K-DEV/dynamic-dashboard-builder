const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

export function ChartDataField({ label, value, onChange }) {
  const rows =
    value?.length === MONTHS.length
      ? value
      : MONTHS.map((name) => ({ name, value: 300 }));

  const updateRow = (index, newValue) => {
    const next = rows.map((row, i) =>
      i === index ? { ...row, value: Math.max(0, Number(newValue) || 0) } : row,
    );
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <span className="block text-[10px] uppercase tracking-wider text-[var(--color-panel-muted)]">
        {label}
      </span>
      {rows.map((row, i) => (
        <label key={row.name} className="flex items-center gap-2 text-xs text-white">
          <span className="w-9 shrink-0 font-medium text-[var(--color-panel-fg)]">{row.name}</span>
          <input
            type="number"
            min={0}
            max={2000}
            value={row.value}
            onChange={(e) => updateRow(i, e.target.value)}
            className="w-full rounded border border-[var(--color-panel-border)] bg-black/40 px-2 py-1.5 text-white outline-none focus:border-[var(--color-accent)]"
          />
        </label>
      ))}
    </div>
  );
}
