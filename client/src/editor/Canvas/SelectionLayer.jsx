import { Fragment, useEffect, useMemo, useRef } from 'react';
import Moveable from 'react-moveable';
import Selecto from 'react-selecto';
import { useEditorStore, currentBreakpoint } from '@/store/editorStore';
export function SelectionLayer() {
  const selection = useEditorStore((s) => s.selection);
  const setSelection = useEditorStore((s) => s.setSelection);
  const setGeometry = useEditorStore((s) => s.setGeometry);
  const bp = useEditorStore(currentBreakpoint);
  const mode = useEditorStore((s) => s.mode);
  const grid = useEditorStore((s) => s.grid);
  const zoom = useEditorStore((s) => s.viewport.zoom);
  const elementMap = useEditorStore((s) => s.elements);
  const moveableRef = useRef(null);
  const selectoRef = useRef(null);
  const targets = useMemo(() => {
    if (mode !== 'edit') return [];
    const out = [];
    for (const id of selection) {
      const el = document.querySelector(`[data-element-id="${id}"]`);
      if (el && !el.dataset.editingText) out.push(el);
    }
    return out;
  }, [selection, mode]);
  const guidelineElements = useMemo(() => {
    const ids = new Set(selection);
    const all = Array.from(document.querySelectorAll('[data-element-id]'));
    return all.filter((el) => !ids.has(el.dataset.elementId ?? ''));
  }, [elementMap, selection, mode]);
  useEffect(() => {
    moveableRef.current?.updateRect();
  }, [targets]);
  if (mode !== 'edit') return null;
  const isMulti = targets.length > 1;
  return (
    <Fragment>
      <Moveable
        ref={moveableRef}
        target={targets}
        draggable
        resizable
        rotatable
        keepRatio={false}
        throttleDrag={1}
        throttleResize={1}
        throttleRotate={0}
        snappable
        snapDirections={{
          top: true,
          left: true,
          bottom: true,
          right: true,
          center: true,
          middle: true,
        }}
        elementSnapDirections={{
          top: true,
          left: true,
          bottom: true,
          right: true,
          center: true,
          middle: true,
        }}
        snapThreshold={grid.enabled ? Math.max(2, grid.size / 2) : 5}
        snapGridWidth={grid.enabled ? grid.size : 0}
        snapGridHeight={grid.enabled ? grid.size : 0}
        verticalGuidelines={[]}
        horizontalGuidelines={[]}
        elementGuidelines={guidelineElements}
        onDrag={(e) => {
          e.target.style.left = `${parseFloat(e.target.style.left || '0') + e.delta[0] / zoom}px`;
          e.target.style.top = `${parseFloat(e.target.style.top || '0') + e.delta[1] / zoom}px`;
        }}
        onDragEnd={(e) => {
          if (!e.lastEvent) return;
          const id = e.target.dataset.elementId;
          if (!id) return;
          const left = parseFloat(e.target.style.left || '0');
          const top = parseFloat(e.target.style.top || '0');
          setGeometry(id, bp, {
            x: left,
            y: top,
          });
        }}
        onDragGroup={(e) => {
          for (const ev of e.events) {
            ev.target.style.left = `${parseFloat(ev.target.style.left || '0') + ev.delta[0] / zoom}px`;
            ev.target.style.top = `${parseFloat(ev.target.style.top || '0') + ev.delta[1] / zoom}px`;
          }
        }}
        onDragGroupEnd={(e) => {
          for (const ev of e.events) {
            const id = ev.target.dataset.elementId;
            if (!id) continue;
            const left = parseFloat(ev.target.style.left || '0');
            const top = parseFloat(ev.target.style.top || '0');
            setGeometry(id, bp, {
              x: left,
              y: top,
            });
          }
        }}
        onResize={(e) => {
          e.target.style.width = `${e.width / zoom}px`;
          e.target.style.height = `${e.height / zoom}px`;
        }}
        onResizeEnd={(e) => {
          if (!e.lastEvent) return;
          const id = e.target.dataset.elementId;
          if (!id) return;
          const w = parseFloat(e.target.style.width || '0');
          const h = parseFloat(e.target.style.height || '0');
          const beforeTranslate = e.lastEvent?.drag?.beforeTranslate;
          const patch = {
            w,
            h,
          };
          if (beforeTranslate) {
            const left = parseFloat(e.target.style.left || '0');
            const top = parseFloat(e.target.style.top || '0');
            patch.x = left + beforeTranslate[0] / zoom;
            patch.y = top + beforeTranslate[1] / zoom;
            e.target.style.transform = '';
            e.target.style.left = `${patch.x}px`;
            e.target.style.top = `${patch.y}px`;
          }
          setGeometry(id, bp, patch);
        }}
        onRotate={(e) => {
          e.target.style.transform = e.drag.transform;
        }}
        onRotateEnd={(e) => {
          if (!e.lastEvent) return;
          const id = e.target.dataset.elementId;
          if (!id) return;
          const rot = e.lastEvent?.rotate ?? 0;
          e.target.style.transform = `rotate(${rot}deg)`;
          setGeometry(id, bp, {
            rot,
          });
        }}
        zoom={zoom}
        origin={false}
        edge={false}
        renderDirections={
          isMulti ? ['nw', 'ne', 'sw', 'se'] : ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']
        }
      />
      <Selecto
        ref={selectoRef}
        dragContainer={
          typeof document !== 'undefined' ? document.querySelector('[data-artboard]') : undefined
        }
        selectableTargets={['[data-artboard] [data-element-id]']}
        hitRate={0}
        selectByClick
        selectFromInside={false}
        toggleContinueSelect={['shift']}
        continueSelect={false}
        ratio={0}
        onDragStart={(e) => {
          const moveable = moveableRef.current;
          const target = e.inputEvent.target;
          if (!target.closest?.('[data-artboard]')) {
            e.stop();
            return;
          }
          if (moveable?.isMoveableElement(target)) {
            e.stop();
            return;
          }
          if (targets.some((t) => t === target || t.contains(target))) {
            e.stop();
            return;
          }
        }}
        onSelect={(e) => {
          const ids = e.selected.map((node) => node.dataset.elementId).filter((s) => !!s);
          setSelection(ids);
        }}
        onSelectEnd={(e) => {
          const moveable = moveableRef.current;
          if (e.isDragStart) {
            e.inputEvent.preventDefault();
            moveable?.waitToChangeTarget().then(() => {
              moveable?.dragStart(e.inputEvent);
            });
          }
          const ids = e.selected.map((node) => node.dataset.elementId).filter((s) => !!s);
          setSelection(ids);
        }}
      />
    </Fragment>
  );
}
