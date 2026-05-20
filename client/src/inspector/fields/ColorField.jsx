import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
export function ColorField({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <label className="block text-xs">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-panel-muted)]">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="h-6 w-6 shrink-0 rounded border border-[var(--color-panel-border)]"
          style={{
            background: value ?? 'transparent',
          }}
        />
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded border border-[var(--color-panel-border)] bg-black/30 px-2 py-1 font-mono text-[11px] text-white outline-none focus:border-[var(--color-accent)]"
          placeholder="#000000"
        />
      </div>
      {open && (
        <div className="mt-2">
          <HexColorPicker color={value ?? '#000000'} onChange={onChange} />
        </div>
      )}
    </label>
  );
}
