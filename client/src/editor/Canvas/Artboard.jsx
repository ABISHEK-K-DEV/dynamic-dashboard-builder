import { useEffect, useMemo, useRef, useState } from 'react';
import {
  useEditorStore,
  selectActivePage,
  DEVICE_WIDTH,
  currentBreakpoint,
} from '@/store/editorStore';
import { ElementRenderer } from './ElementRenderer';
import { SelectionLayer } from './SelectionLayer';
import { setArtboardEl } from './dragInsert';
import { ContextMenu } from './ContextMenu';
import { SectionBlock } from './SectionBlock';
export function Artboard() {
  const page = useEditorStore(selectActivePage);
  const elementMap = useEditorStore((s) => s.elements);
  const sections = useEditorStore((s) => s.sections);
  const sectionOrder = useEditorStore((s) => s.sectionOrder);
  const activePageId = useEditorStore((s) => s.activePageId);
  const elementsBySection = useMemo(() => {
    const m = {};
    for (const el of Object.values(elementMap)) {
      if (!m[el.sectionId]) m[el.sectionId] = [];
      m[el.sectionId].push(el);
    }
    for (const list of Object.values(m)) list.sort((a, b) => a.zIndex - b.zIndex);
    return m;
  }, [elementMap]);
  const device = useEditorStore((s) => s.viewport.device);
  const bp = useEditorStore(currentBreakpoint);
  const setSelection = useEditorStore((s) => s.setSelection);
  const selection = useEditorStore((s) => s.selection);
  const ref = useRef(null);
  const [menuPos, setMenuPos] = useState(null);
  useEffect(() => {
    setArtboardEl(ref.current);
    return () => setArtboardEl(null);
  }, []);
  const width = useMemo(() => {
    if (!page) return DEVICE_WIDTH[device];
    if (device === 'mobile') return page.widthBase;
    if (device === 'tablet') return page.widthMd ?? page.widthBase;
    return page.widthLg ?? page.widthMd ?? page.widthBase;
  }, [page, device]);
  if (!page || !activePageId) return null;
  const sectionIds = sectionOrder[activePageId] ?? [];
  const totalHeight = sectionIds.reduce((sum, sid) => sum + (sections[sid]?.height ?? 0), 0);
  return (
    <div
      ref={ref}
      data-artboard
      data-bp={bp}
      data-device={device}
      className="relative shrink-0 shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
      style={{
        width: `${width}px`,
        minHeight: `${totalHeight}px`,
        background: '#ffffff',
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setSelection([]);
      }}
      onContextMenu={(e) => {
        const target = e.target?.closest?.('[data-element-id]');
        if (target?.dataset.elementId) {
          const id = target.dataset.elementId;
          if (!selection.includes(id)) setSelection([id]);
          e.preventDefault();
          setMenuPos({
            x: e.clientX,
            y: e.clientY,
          });
        } else if (selection.length > 0) {
          e.preventDefault();
          setMenuPos({
            x: e.clientX,
            y: e.clientY,
          });
        }
      }}
    >
      {sectionIds.map((sid) => {
        const sec = sections[sid];
        if (!sec) return null;
        const els = elementsBySection[sid] ?? [];
        return (
          <SectionBlock key={sid} section={sec}>
            {els.map((el) => (
              <ElementRenderer key={el.id} elementId={el.id} bp={bp} />
            ))}
          </SectionBlock>
        );
      })}
      <SelectionLayer />
      {menuPos && <ContextMenu pos={menuPos} onClose={() => setMenuPos(null)} />}
    </div>
  );
}
