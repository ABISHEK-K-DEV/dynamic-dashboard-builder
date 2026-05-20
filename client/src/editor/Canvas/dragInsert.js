import { useEditorStore, currentBreakpoint } from '@/store/editorStore';
import { widgetRegistry } from '@/widgets/registry';
import { uid } from '@/lib/id';
let artboardEl = null;
function setArtboardEl(el) {
  artboardEl = el;
}
function pointerToArtboard(clientX, clientY) {
  if (!artboardEl) return null;
  const rect = artboardEl.getBoundingClientRect();
  const zoom = useEditorStore.getState().viewport.zoom || 1;
  const x = (clientX - rect.left) / zoom;
  const y = (clientY - rect.top) / zoom;
  if (x < 0 || y < 0 || x > rect.width / zoom || y > rect.height / zoom) return null;
  return { x, y };
}
function widgetKindForAsset(assetKind) {
  switch (assetKind) {
    case 'image':
      return 'image';
    case 'svg':
      return 'svg';
    case 'video':
      return 'video';
    case 'font':
      return null;
  }
}
function handleSidebarDrop(e) {
  const data = e.active.data.current;
  if (!data) return;
  let widgetKind = null;
  let presetAssetId = null;
  if (data.kind === 'widget-tile' && 'widgetKind' in data && data.widgetKind) {
    widgetKind = data.widgetKind;
  } else if (data.kind === 'asset-tile' && 'assetId' in data && data.assetId && data.assetKind) {
    widgetKind = widgetKindForAsset(data.assetKind);
    presetAssetId = data.assetId;
  }
  if (!widgetKind) return;
  const activatorEvent = e.activatorEvent;
  if (!activatorEvent) return;
  const startX = activatorEvent.clientX;
  const startY = activatorEvent.clientY;
  const dropX = startX + e.delta.x;
  const dropY = startY + e.delta.y;
  const pos = pointerToArtboard(dropX, dropY);
  if (!pos) return;
  const s = useEditorStore.getState();
  if (!s.activePageId) return;
  const plugin = widgetRegistry.get(widgetKind);
  const defaults = plugin.defaultProps();
  const baseGeom = plugin.defaultGeometry().base;
  const id = uid(widgetKind.slice(0, 3));
  const bp = currentBreakpoint(s);
  const sectionIds = s.sectionOrder[s.activePageId] ?? [];
  let runningTop = 0;
  let landedSectionId = null;
  let yWithinSection = pos.y;
  for (const sid of sectionIds) {
    const sec = s.sections[sid];
    if (!sec) continue;
    const top = runningTop;
    const bottom = top + sec.height;
    if (pos.y < bottom) {
      landedSectionId = sid;
      yWithinSection = pos.y - top;
      break;
    }
    runningTop = bottom;
  }
  if (!landedSectionId && sectionIds.length) {
    landedSectionId = sectionIds[sectionIds.length - 1];
    const sec = s.sections[landedSectionId];
    yWithinSection = sec.height - (baseGeom.h ?? 60) - 16;
  }
  if (!landedSectionId) return;
  if (presetAssetId && (widgetKind === 'image' || widgetKind === 'svg' || widgetKind === 'video')) {
    defaults.assetId = presetAssetId;
  }
  const x = Math.max(0, pos.x - baseGeom.w / 2);
  const y = Math.max(0, yWithinSection - (baseGeom.h ?? 60) / 2);
  const maxZ = Object.values(s.elements)
    .filter((el) => el.sectionId === landedSectionId)
    .reduce((m, el) => Math.max(m, el.zIndex), 0);
  const element = {
    id,
    sectionId: landedSectionId,
    parentId: null,
    type: widgetKind,
    name: presetAssetId
      ? (s.project?.assets.find((a) => a.id === presetAssetId)?.name ?? plugin.label)
      : plugin.label,
    geometry: { base: { ...baseGeom, x, y } },
    zIndex: maxZ + 1,
    ...defaults,
  };
  s.addElement(element);
  s.setSelection([id]);
  if (bp !== 'base') s.setGeometry(id, bp, { x, y });
}
export { handleSidebarDrop, setArtboardEl };
