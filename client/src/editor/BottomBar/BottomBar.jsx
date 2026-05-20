import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
function clampZoom(z) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
}
export function BottomBar() {
  const elementCount = useEditorStore((s) =>
    s.activePageId
      ? Object.values(s.elements).filter((e) => e.pageId === s.activePageId).length
      : 0,
  );
  const zoom = useEditorStore((s) => s.viewport.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const stepIn = () => setZoom(clampZoom(zoom * 1.2));
  const stepOut = () => setZoom(clampZoom(zoom / 1.2));
  const fit = () => {
    const sc = document.querySelector('[data-canvas-scroll]');
    const ab = document.querySelector('[data-artboard]');
    if (!sc || !ab) {
      setZoom(1);
      return;
    }
    const cw = sc.clientWidth - 64;
    const ch = sc.clientHeight - 64;
    const aw = ab.offsetWidth;
    const ah = ab.offsetHeight;
    if (aw === 0 || ah === 0) {
      setZoom(1);
      return;
    }
    setZoom(clampZoom(Math.min(cw / aw, ch / ah)));
  };
  return (
    <footer className="flex h-8 shrink-0 items-center justify-between border-t border-[var(--color-panel-border)] bg-[#101012] px-3 text-[10px] text-[var(--color-panel-muted)]">
      <div>
        {elementCount} element{elementCount === 1 ? '' : 's'}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={stepOut}
          className="rounded p-1 hover:bg-white/5 hover:text-white"
          title="Zoom out (⌘-)"
        >
          <ZoomOut size={12} />
        </button>
        <input
          type="text"
          value={`${Math.round(zoom * 100)}%`}
          onChange={(e) => {
            const n = parseFloat(e.target.value.replace('%', '').trim());
            if (Number.isFinite(n)) setZoom(clampZoom(n / 100));
          }}
          className="w-14 rounded border border-[var(--color-panel-border)] bg-black/30 px-1 py-0.5 text-center font-mono text-[10px] text-white outline-none focus:border-[var(--color-accent)]"
          title="Zoom level"
        />
        <button
          onClick={stepIn}
          className="rounded p-1 hover:bg-white/5 hover:text-white"
          title="Zoom in (⌘+)"
        >
          <ZoomIn size={12} />
        </button>
        <button
          onClick={fit}
          className="ml-1 flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-white/5 hover:text-white"
          title="Fit to viewport (⌘0)"
        >
          <Maximize2 size={11} /> Fit
        </button>
        <button
          onClick={() => setZoom(1)}
          className="rounded px-1.5 py-0.5 hover:bg-white/5 hover:text-white"
          title="Reset to 100% (⌘1)"
        >
          1:1
        </button>
      </div>
    </footer>
  );
}
