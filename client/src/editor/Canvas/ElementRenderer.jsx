import { memo } from 'react';
import { useEditorStore, selectElement, selectIsSelected } from '@/store/editorStore';
import { resolveResponsive } from '@/lib/responsive';
import { mergeResponsiveOverrides } from '@/lib/mergeResponsive';
import { widgetRegistry } from '@/widgets/registry';
import {
  borderToCSS,
  cornerRadiusToCSS,
  paddingToCSS,
  shadowToCSS,
  transformOriginToCSS,
} from '@/lib/decoration';
function resolveScalar(r, bp, fallback) {
  if (!r) return fallback;
  let v = r.base;
  if (bp === 'base') return v;
  if (r.sm !== undefined) v = r.sm;
  if (bp === 'sm') return v;
  if (r.md !== undefined) v = r.md;
  if (bp === 'md') return v;
  if (r.lg !== undefined) v = r.lg;
  return v;
}
function hoverVarStyle(h) {
  const s = {};
  if (h.scale !== undefined) s['--hov-scale'] = h.scale;
  if (h.translate) {
    s['--hov-tx'] = `${h.translate[0]}px`;
    s['--hov-ty'] = `${h.translate[1]}px`;
  }
  if (h.duration) s['--hov-dur'] = `${h.duration}ms`;
  return s;
}
function resolveOpacity(r, bp) {
  if (!r) return 1;
  let v = r.base;
  if (bp === 'base') return v;
  if (r.sm !== undefined) v = r.sm;
  if (bp === 'sm') return v;
  if (r.md !== undefined) v = r.md;
  if (bp === 'md') return v;
  if (r.lg !== undefined) v = r.lg;
  return v;
}
function ElementRendererImpl({ elementId, bp }) {
  const element = useEditorStore(selectElement(elementId));
  const selected = useEditorStore(selectIsSelected(elementId));
  const hovered = useEditorStore((s) => s.hover === elementId);
  const mode = useEditorStore((s) => s.mode);
  const editing = useEditorStore((s) => s.editingId === elementId);
  const setHover = useEditorStore((s) => s.setHover);
  const setEditingId = useEditorStore((s) => s.setEditingId);
  const updateElement = useEditorStore((s) => s.updateElement);
  if (!element) return null;
  const merged = mergeResponsiveOverrides(element, bp);
  const visible = resolveScalar(merged.visible, bp, true);
  if (!visible && mode === 'preview') return null;
  const geom = resolveResponsive(merged.geometry, bp);
  const opacity = resolveOpacity(merged.opacity, bp);
  const plugin = widgetRegistry.get(merged.type);
  const Editor = plugin.Editor;
  const fallbackH =
    merged.type === 'chart' ? 220 : merged.type === 'image' ? 200 : merged.type === 'text' ? 80 : undefined;
  const heightPx = geom.h ?? fallbackH;
  const style = {
    left: `${geom.x}px`,
    top: `${geom.y}px`,
    width: `${geom.w}px`,
    height: heightPx ? `${heightPx}px` : 'auto',
    transform: geom.rot ? `rotate(${geom.rot}deg)` : undefined,
    transformOrigin: transformOriginToCSS(merged.transformOrigin),
    zIndex: merged.zIndex,
    opacity: visible ? opacity : 0.35,
    borderRadius: cornerRadiusToCSS(merged.borderRadius),
    border: borderToCSS(merged.border),
    boxShadow: shadowToCSS(merged.shadow),
    padding: paddingToCSS(merged.padding),
    filter: merged.blur ? `blur(${merged.blur}px)` : undefined,
    overflow: (merged.borderRadius || merged.type === 'chart') ? 'hidden' : undefined,
    display: merged.type === 'chart' ? 'flex' : undefined,
    flexDirection: merged.type === 'chart' ? 'column' : undefined,
  };
  const hoverActive = mode === 'preview' && !!merged.hover;
  const onEdit =
    mode !== 'edit'
      ? undefined
      : element.type === 'text'
        ? editing
          ? (patch) => updateElement(element.id, patch)
          : undefined
        : (patch) => updateElement(element.id, patch);

  const child = (
    <Editor
      element={merged}
      selected={selected}
      hovered={hovered}
      mode={mode}
      onEdit={onEdit}
    />
  );
  return (
    <div
      data-element-id={element.id}
      data-editing-text={element.type === 'text' && editing ? true : undefined}
      data-element-type={element.type}
      data-selected={selected || undefined}
      data-hovered={hovered || undefined}
      data-editing={editing || undefined}
      data-loop-anim={mode === 'preview' ? merged.loopAnimation : undefined}
      data-click-anim={mode === 'preview' ? merged.clickAnimation : undefined}
      className={`el moveable-target${merged.className ? ` ${merged.className}` : ''}`}
      style={style}
      onMouseEnter={() => setHover(element.id)}
      onMouseLeave={() => setHover(null)}
      onDoubleClick={(e) => {
        if (mode !== 'edit' || element.type !== 'text') return;
        e.stopPropagation();
        const root = e.currentTarget;
        setEditingId(element.id);
        requestAnimationFrame(() => {
          const ed = root?.querySelector?.('[data-text-editable]');
          ed?.focus();
        });
      }}
    >
      {hoverActive && element.hover ? (
        <div className="sb-hov" style={hoverVarStyle(element.hover)}>
          {child}
        </div>
      ) : (
        child
      )}
    </div>
  );
}
const ElementRenderer = memo(ElementRendererImpl);
function getElement(id) {
  return useEditorStore.getState().elements[id] ?? null;
}
export { ElementRenderer, getElement };
