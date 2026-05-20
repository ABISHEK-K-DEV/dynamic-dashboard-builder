import { useEditorStore } from '@/store/editorStore';
const SYSTEM_FONTS = [
  'system-ui, sans-serif',
  'ui-serif, Georgia, serif',
  'ui-monospace, monospace',
  'Cormorant Garamond, Georgia, serif',
  'Montserrat, system-ui, sans-serif',
];
export function FontField({ label, value, onChange }) {
  const projectFonts = useEditorStore((s) => s.project?.fonts ?? []);
  return (
    <label className="block text-xs">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-panel-muted)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-[var(--color-panel-border)] bg-black/30 px-2 py-1.5 text-xs text-white outline-none focus:border-[var(--color-accent)]"
      >
        <optgroup label="System">
          {SYSTEM_FONTS.map((f) => (
            <option value={f} className="bg-[#101012]">
              {f.split(',')[0]}
            </option>
          ))}
        </optgroup>
        {projectFonts.length > 0 && (
          <optgroup label="Custom">
            {projectFonts.map((f) => (
              <option value={`'${f.family}'`} className="bg-[#101012]">
                {f.family}
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </label>
  );
}
