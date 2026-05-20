import { useCallback, useEffect, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { currentBreakpoint, useEditorStore } from '@/store/editorStore';
import { resolveResponsive } from '@/lib/responsive';
import { Artboard } from './Artboard';
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
function clampZoom(z) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
}
export function CanvasViewport() {
  const zoom = useEditorStore((s) => s.viewport.zoom);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const mode = useEditorStore((s) => s.mode);
  const scrollRef = useRef(null);
  const { setNodeRef } = useDroppable({
    id: 'canvas-droppable',
  });
  const setRefs = useCallback(
    (node) => {
      scrollRef.current = node;
      setNodeRef(node);
    },
    [setNodeRef],
  );
  useEffect(() => {
    const onKey = (e) => {
      const meta = e.metaKey || e.ctrlKey;
      const t = useEditorStore.temporal.getState();
      if (meta && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) t.redo();
        else t.undo();
        return;
      }
      if (meta && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        t.redo();
        return;
      }
      const s = useEditorStore.getState();
      if (s.selection.length === 0) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const target = e.target;
        if (
          target &&
          (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
        )
          return;
        e.preventDefault();
        s.removeElements(s.selection);
        return;
      }
      if (meta && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        const newIds = s.duplicateElements(s.selection);
        if (newIds.length) s.setSelection(newIds);
        return;
      }
      if (meta && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoomAroundViewportCenter(
          scrollRef.current,
          clampZoom(s.viewport.zoom * 1.2),
          s.viewport.zoom,
        );
        return;
      }
      if (meta && e.key === '-') {
        e.preventDefault();
        setZoomAroundViewportCenter(
          scrollRef.current,
          clampZoom(s.viewport.zoom / 1.2),
          s.viewport.zoom,
        );
        return;
      }
      if (meta && e.key === '1') {
        e.preventDefault();
        setZoomAroundViewportCenter(scrollRef.current, 1, s.viewport.zoom);
        return;
      }
      if (meta && e.key === '0') {
        e.preventDefault();
        const sc = scrollRef.current;
        const ab = sc?.querySelector('[data-artboard]');
        if (sc && ab) {
          const cw = sc.clientWidth - 64;
          const ch = sc.clientHeight - 64;
          const aw = ab.offsetWidth;
          const ah = ab.offsetHeight;
          const fit = Math.min(cw / aw, ch / ah);
          setZoomAroundViewportCenter(sc, clampZoom(fit), s.viewport.zoom);
        }
        return;
      }
      if (
        s.mode === 'edit' &&
        (e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown')
      ) {
        const target = e.target;
        if (
          target &&
          (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
        )
          return;
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
        const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
        if (dx === 0 && dy === 0) return;
        e.preventDefault();
        const bp = currentBreakpoint(s);
        for (const id of s.selection) {
          const el = s.elements[id];
          if (!el || el.locked) continue;
          const cur = resolveResponsive(el.geometry, bp);
          s.setGeometry(id, bp, {
            x: cur.x + dx,
            y: cur.y + dy,
          });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const onWheel = (e) => {
    if (!(e.metaKey || e.ctrlKey)) return;
    e.preventDefault();
    e.stopPropagation();
    const sc = scrollRef.current;
    if (!sc) return;
    const cur = useEditorStore.getState().viewport.zoom;
    const factor = Math.exp(-e.deltaY * 15e-4);
    const next = clampZoom(cur * factor);
    if (next === cur) return;
    setZoomAroundPoint(sc, next, cur, e.clientX, e.clientY);
  };
  return (
    <div
      ref={setRefs}
      data-canvas-scroll
      className="relative min-h-0 flex-1 overflow-auto bg-[var(--color-canvas-bg)]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) clearSelection();
      }}
      onWheel={onWheel}
    >
      <div
        className="flex min-h-full min-w-full items-start justify-center p-12"
        style={{ zoom }}
      >
        <Artboard />
      </div>
    </div>
  );
}
function setZoomAroundPoint(container, next, cur, clientX, clientY) {
  const rect = container.getBoundingClientRect();
  const px = clientX - rect.left;
  const py = clientY - rect.top;
  const ratio = next / cur;
  const newScrollLeft = (container.scrollLeft + px) * ratio - px;
  const newScrollTop = (container.scrollTop + py) * ratio - py;
  useEditorStore.getState().setZoom(next);
  requestAnimationFrame(() => {
    container.scrollLeft = newScrollLeft;
    container.scrollTop = newScrollTop;
  });
}
function setZoomAroundViewportCenter(container, next, cur) {
  if (!container) {
    useEditorStore.getState().setZoom(next);
    return;
  }
  const rect = container.getBoundingClientRect();
  setZoomAroundPoint(container, next, cur, rect.left + rect.width / 2, rect.top + rect.height / 2);
}
