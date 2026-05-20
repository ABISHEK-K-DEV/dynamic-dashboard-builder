import { useMemo } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Plus, Trash2 } from 'lucide-react';
const DEFAULT_LINEAR = {
  mode: 'linear',
  angle: 135,
  stops: [
    {
      color: '#FAF6F0',
      pos: 0,
    },
    {
      color: '#C8A96E',
      pos: 100,
    },
  ],
};
const DEFAULT_RADIAL = {
  mode: 'radial',
  shape: 'ellipse',
  stops: [
    {
      color: '#FAF6F0',
      pos: 0,
    },
    {
      color: '#C8A96E',
      pos: 100,
    },
  ],
};
function parse(value) {
  const v = (value ?? '').trim();
  if (!v)
    return {
      mode: 'solid',
      color: '#FFFFFF',
    };
  let m = v.match(/^linear-gradient\(([^,]+),\s*(.+)\)$/i);
  if (m) {
    const angleStr = m[1].trim();
    const angle = parseFloat(angleStr.replace(/deg$/, '')) || 0;
    const stops = parseStops(m[2]);
    return {
      mode: 'linear',
      angle,
      stops,
    };
  }
  m = v.match(/^radial-gradient\((?:([^,]+),\s*)?(.+)\)$/i);
  if (m) {
    const shapeStr = (m[1] ?? '').toLowerCase();
    const shape = shapeStr.includes('circle') ? 'circle' : 'ellipse';
    const stops = parseStops(m[2]);
    return {
      mode: 'radial',
      shape,
      stops,
    };
  }
  return {
    mode: 'solid',
    color: v,
  };
}
function parseStops(s) {
  const parts = [];
  let depth = 0;
  let buf = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(buf.trim());
      buf = '';
    } else buf += ch;
  }
  if (buf.trim()) parts.push(buf.trim());
  return parts.map((p, i, arr) => {
    const m = p.match(/^(.+?)\s+([\d.]+)%$/);
    if (m)
      return {
        color: m[1].trim(),
        pos: parseFloat(m[2]),
      };
    return {
      color: p.trim(),
      pos: arr.length > 1 ? (i / (arr.length - 1)) * 100 : 0,
    };
  });
}
function serialize(p) {
  if (p.mode === 'solid') return p.color;
  const stops = p.stops
    .slice()
    .sort((a, b) => a.pos - b.pos)
    .map((s) => `${s.color} ${s.pos}%`)
    .join(', ');
  if (p.mode === 'linear') return `linear-gradient(${p.angle}deg, ${stops})`;
  return `radial-gradient(${p.shape} at center, ${stops})`;
}
export function BackgroundField({ label, value, onChange }) {
  const parsed = useMemo(() => parse(value), [value]);
  const setMode = (mode) => {
    if (mode === 'solid') {
      onChange(parsed.mode === 'solid' ? parsed.color : '#FFFFFF');
    } else if (mode === 'linear') {
      onChange(serialize(parsed.mode === 'linear' ? parsed : DEFAULT_LINEAR));
    } else {
      onChange(serialize(parsed.mode === 'radial' ? parsed : DEFAULT_RADIAL));
    }
  };
  return (
    <div className="space-y-2">
      <span className="block text-[10px] uppercase tracking-wider text-[var(--color-panel-muted)]">
        {label}
      </span>
      <div className="grid grid-cols-3 gap-1 rounded border border-[var(--color-panel-border)] bg-black/30 p-0.5 text-[10px]">
        {['solid', 'linear', 'radial'].map((m) => (
          <button
            type="button"
            onClick={() => setMode(m)}
            className={`rounded py-1 ${parsed.mode === m ? 'bg-white/10 text-white' : 'text-[var(--color-panel-muted)] hover:text-white'}`}
          >
            {m === 'solid' ? 'Solid' : m === 'linear' ? 'Linear' : 'Radial'}
          </button>
        ))}
      </div>
      <div
        className="h-12 rounded border border-[var(--color-panel-border)]"
        style={{
          background: serialize(parsed),
        }}
      />
      {parsed.mode === 'solid' ? (
        <SolidEditor color={parsed.color} onChange={(c) => onChange(c)} />
      ) : parsed.mode === 'linear' ? (
        <LinearEditor parsed={parsed} onChange={(p) => onChange(serialize(p))} />
      ) : (
        <RadialEditor parsed={parsed} onChange={(p) => onChange(serialize(p))} />
      )}
    </div>
  );
}
function SolidEditor({ color, onChange }) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-[var(--color-panel-border)] bg-black/30 px-2 py-1 font-mono text-[11px] text-white outline-none focus:border-[var(--color-accent)]"
      />
      <HexColorPicker color={color} onChange={onChange} />
    </div>
  );
}
function LinearEditor({ parsed, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] uppercase tracking-wider text-[var(--color-panel-muted)]">
        Angle
        <input
          type="range"
          min={0}
          max={360}
          value={parsed.angle}
          onChange={(e) =>
            onChange({
              ...parsed,
              angle: parseFloat(e.target.value),
            })
          }
          className="mt-1 w-full accent-[var(--color-accent)]"
        />
        <span className="ml-1 text-white">{parsed.angle}°</span>
      </label>
      <StopsEditor
        stops={parsed.stops}
        onChange={(stops) =>
          onChange({
            ...parsed,
            stops,
          })
        }
      />
    </div>
  );
}
function RadialEditor({ parsed, onChange }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-1 rounded border border-[var(--color-panel-border)] bg-black/30 p-0.5 text-[10px]">
        {['ellipse', 'circle'].map((shape) => (
          <button
            type="button"
            onClick={() =>
              onChange({
                ...parsed,
                shape,
              })
            }
            className={`rounded py-1 capitalize ${parsed.shape === shape ? 'bg-white/10 text-white' : 'text-[var(--color-panel-muted)] hover:text-white'}`}
          >
            {shape}
          </button>
        ))}
      </div>
      <StopsEditor
        stops={parsed.stops}
        onChange={(stops) =>
          onChange({
            ...parsed,
            stops,
          })
        }
      />
    </div>
  );
}
function StopsEditor({ stops, onChange }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-panel-muted)]">
          Stops
        </span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...stops,
              {
                color: '#000000',
                pos: 100,
              },
            ])
          }
          className="rounded bg-white/5 px-2 py-0.5 text-[10px] hover:bg-white/10"
        >
          <Plus size={10} className="inline" /> Add
        </button>
      </div>
      <ul className="space-y-1">
        {stops.map((s, i) => (
          <li className="flex items-center gap-1">
            <input
              type="color"
              value={s.color}
              onChange={(e) => {
                const next = stops.slice();
                next[i] = {
                  ...s,
                  color: e.target.value,
                };
                onChange(next);
              }}
              className="h-6 w-6 cursor-pointer rounded border border-[var(--color-panel-border)] bg-transparent"
            />
            <input
              type="number"
              value={s.pos}
              min={0}
              max={100}
              step={1}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (!Number.isFinite(v)) return;
                const next = stops.slice();
                next[i] = {
                  ...s,
                  pos: v,
                };
                onChange(next);
              }}
              className="w-16 rounded border border-[var(--color-panel-border)] bg-black/30 px-1 py-0.5 text-[11px] text-white outline-none focus:border-[var(--color-accent)]"
            />
            <span className="text-[10px] text-[var(--color-panel-muted)]">%</span>
            {stops.length > 2 && (
              <button
                type="button"
                onClick={() => onChange(stops.filter((_, idx) => idx !== i))}
                className="ml-auto text-[var(--color-panel-muted)] hover:text-[var(--color-danger)]"
              >
                <Trash2 size={11} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
