import { useEffect, useRef } from 'react';
export function PanelDivider({ side, width, min = 200, max = 600, onResize, storageKey }) {
  const startX = useRef(0);
  const startW = useRef(0);
  useEffect(() => {
    if (!storageKey) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const n = parseFloat(saved);
      if (Number.isFinite(n)) onResize(clamp(n, min, max));
    }
  }, [storageKey]);
  const onMouseDown = (e) => {
    e.preventDefault();
    startX.current = e.clientX;
    startW.current = width;
    const onMove = (ev) => {
      const dx = ev.clientX - startX.current;
      const next = clamp(side === 'left' ? startW.current + dx : startW.current - dx, min, max);
      onResize(next);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (storageKey) localStorage.setItem(storageKey, String(width));
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      onMouseDown={onMouseDown}
      className="relative w-1 shrink-0 cursor-col-resize bg-[var(--color-panel-border)] hover:bg-[var(--color-accent)]"
      title="Drag to resize"
    >
      <div className="absolute inset-y-0 -left-1 -right-1" />
    </div>
  );
}
function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}
