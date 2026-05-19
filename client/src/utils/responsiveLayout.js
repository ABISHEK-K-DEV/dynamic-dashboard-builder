export const VIEWPORT_CONFIG = {
  desktop: { width: 1200, cols: 12, label: 'Desktop View' },
  tablet: { width: 768, cols: 6, label: 'Tablet View' },
  mobile: { width: 375, cols: 2, label: 'Mobile View' },
};

export function normalizePosition(pos) {
  return {
    x: Math.max(0, Number(pos?.x) || 0),
    y: Math.max(0, Number(pos?.y) || 0),
    w: Math.max(1, Number(pos?.w) || 4),
    h: Math.max(1, Number(pos?.h) || 4),
  };
}

export function clampToGrid(pos, cols) {
  const w = Math.min(Math.max(1, pos.w), cols);
  const x = Math.min(Math.max(0, pos.x), Math.max(0, cols - w));
  return { x, y: pos.y, w, h: pos.h };
}

/** Derive a reasonable layout for tablet/mobile from desktop */
export function deriveLayout(desktopPos, targetCols) {
  const d = normalizePosition(desktopPos);

  if (targetCols <= 2) {
    return clampToGrid({ x: 0, y: d.y, w: targetCols, h: d.h }, targetCols);
  }

  const ratio = targetCols / 12;
  return clampToGrid({
    x: Math.round(d.x * ratio),
    y: d.y,
    w: Math.max(1, Math.min(Math.round(d.w * ratio), targetCols)),
    h: d.h,
  }, targetCols);
}

export function ensureWidgetLayouts(widget) {
  const desktop = normalizePosition(widget.layouts?.desktop ?? widget.position);
  const tablet = widget.layouts?.tablet
    ? normalizePosition(widget.layouts.tablet)
    : deriveLayout(desktop, VIEWPORT_CONFIG.tablet.cols);
  const mobile = widget.layouts?.mobile
    ? normalizePosition(widget.layouts.mobile)
    : deriveLayout(desktop, VIEWPORT_CONFIG.mobile.cols);

  return {
    desktop: clampToGrid(desktop, VIEWPORT_CONFIG.desktop.cols),
    tablet: clampToGrid(tablet, VIEWPORT_CONFIG.tablet.cols),
    mobile: clampToGrid(mobile, VIEWPORT_CONFIG.mobile.cols),
  };
}

export function getLayoutForViewport(widget, viewport) {
  return ensureWidgetLayouts(widget)[viewport] ?? ensureWidgetLayouts(widget).desktop;
}

export function createDefaultLayouts(overrides = {}) {
  const desktop = normalizePosition(overrides.desktop ?? { x: 0, y: 0, w: 4, h: 4 });
  return {
    desktop,
    tablet: overrides.tablet ?? deriveLayout(desktop, VIEWPORT_CONFIG.tablet.cols),
    mobile: overrides.mobile ?? deriveLayout(desktop, VIEWPORT_CONFIG.mobile.cols),
  };
}

/** Stack widgets vertically for mobile when no saved mobile layout exists */
export function buildResponsiveLayoutsForWidgets(widgets) {
  const sorted = [...widgets].sort((a, b) => {
    const da = normalizePosition(a.layouts?.desktop ?? a.position);
    const db = normalizePosition(b.layouts?.desktop ?? b.position);
    return da.y - db.y || da.x - db.x;
  });

  let mobileY = 0;
  const mobileById = {};

  sorted.forEach((w) => {
    const desktop = normalizePosition(w.layouts?.desktop ?? w.position);
    const h = desktop.h;
    mobileById[w.id] = { x: 0, y: mobileY, w: VIEWPORT_CONFIG.mobile.cols, h };
    mobileY += h;
  });

  return widgets.map((w) => {
    const desktop = normalizePosition(w.layouts?.desktop ?? w.position);
    const hasSavedMobile = Boolean(w.layouts?.mobile);
    const hasSavedTablet = Boolean(w.layouts?.tablet);

    return {
      ...w,
      layouts: {
        desktop: clampToGrid(desktop, VIEWPORT_CONFIG.desktop.cols),
        tablet: hasSavedTablet
          ? clampToGrid(normalizePosition(w.layouts.tablet), VIEWPORT_CONFIG.tablet.cols)
          : deriveLayout(desktop, VIEWPORT_CONFIG.tablet.cols),
        mobile: hasSavedMobile
          ? clampToGrid(normalizePosition(w.layouts.mobile), VIEWPORT_CONFIG.mobile.cols)
          : clampToGrid(mobileById[w.id], VIEWPORT_CONFIG.mobile.cols),
      },
    };
  });
}

export function offsetLayouts(layouts, dx = 1, dy = 1) {
  const result = {};
  for (const [vp, pos] of Object.entries(layouts)) {
    const cols = VIEWPORT_CONFIG[vp].cols;
    result[vp] = clampToGrid(
      { ...pos, x: pos.x + dx, y: pos.y + dy },
      cols
    );
  }
  return result;
}
