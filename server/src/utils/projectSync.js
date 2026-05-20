const { randomUUID } = require('crypto');
const { Widget, WidgetPosition, WidgetStyle } = require('../models');

const META_KEYS = new Set([
  'id',
  'type',
  'sectionId',
  'parentId',
  'name',
  'zIndex',
  'geometry',
  'pageId',
]);

function parseContent(raw, type) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    /* legacy plain HTML in content column */
  }
  if (type === 'text') return { html: raw };
  return {};
}

function elementToRows(el, dashboardId) {
  const base = el.geometry?.base ?? { x: 0, y: 0, w: 200, h: 80 };
  const props = {};
  for (const [key, value] of Object.entries(el)) {
    if (!META_KEYS.has(key) && value !== undefined) props[key] = value;
  }

  const content = JSON.stringify({
    ...props,
    html: el.html,
    geometry: el.geometry ?? { base },
  });

  return {
    widget: {
      id: el.id,
      dashboardId,
      type: el.type,
      content,
    },
    position: {
      id: randomUUID(),
      widgetId: el.id,
      x: Math.round(base.x ?? 0),
      y: Math.round(base.y ?? 0),
      w: Math.round(base.w ?? 200),
      h: Math.round(base.h ?? 80),
    },
    style: {
      id: randomUUID(),
      widgetId: el.id,
      fontSize: el.fontSize != null ? `${el.fontSize}px` : '16px',
      color: el.color ?? '#1a1a1c',
      background: 'transparent',
      borderRadius: '0px',
      opacity: 1,
      align: el.align ?? 'left',
    },
  };
}

function widgetToElement(widget, sectionId) {
  const props = parseContent(widget.content, widget.type);
  const pos = widget.position;
  const style = widget.style;
  const geometry =
    props.geometry ??
    (pos
      ? {
          base: {
            x: pos.x ?? 0,
            y: pos.y ?? 0,
            w: pos.w ?? 200,
            h: pos.h ?? 80,
          },
        }
      : { base: { x: 0, y: 0, w: 200, h: 80 } });

  const fontSize =
    props.fontSize ??
    (style?.fontSize ? parseInt(String(style.fontSize), 10) : undefined) ??
    18;

  return {
    id: widget.id,
    type: widget.type,
    sectionId,
    parentId: null,
    name: props.name ?? widget.type,
    zIndex: props.zIndex ?? 1,
    geometry,
    ...props,
    fontSize,
    color: props.color ?? style?.color ?? '#1a1a1c',
    align: props.align ?? style?.align ?? 'left',
    bold: props.bold ?? false,
    italic: props.italic ?? false,
  };
}

function buildSnapshotFromWidgets(dashboard, widgets, sectionId) {
  const pageId = 'page-main';
  const secId = sectionId || 'sec-main';
  const elements = widgets.map((w) => widgetToElement(w, secId));

  return {
    project: {
      id: dashboard.id,
      name: dashboard.name,
      assets: [],
      fonts: [],
      theme: { colors: {}, fonts: {} },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    pages: [
      {
        id: pageId,
        projectId: dashboard.id,
        name: 'Page 1',
        order: 0,
        widthBase: 430,
        widthMd: 768,
        widthLg: 1280,
      },
    ],
    sections: [
      {
        id: secId,
        pageId,
        name: 'Section 1',
        order: 0,
        height: 800,
        background: '#FAF6F0',
      },
    ],
    elements,
    pageOrder: [pageId],
    sectionOrder: { [pageId]: [secId] },
    _source: 'widgets_tables',
  };
}

async function syncWidgetsFromSnapshot(dashboardId, snapshot) {
  const elements = snapshot.elements ?? [];
  await Widget.destroy({ where: { dashboardId } });

  for (const el of elements) {
    const { widget, position, style } = elementToRows(el, dashboardId);
    await Widget.create(widget);
    await WidgetPosition.create(position);
    await WidgetStyle.create(style);
  }
}

async function loadWidgetsForDashboard(dashboardId) {
  return Widget.findAll({
    where: { dashboardId },
    include: [
      { model: WidgetPosition, as: 'position' },
      { model: WidgetStyle, as: 'style' },
    ],
    order: [['createdAt', 'ASC']],
  });
}

module.exports = {
  syncWidgetsFromSnapshot,
  loadWidgetsForDashboard,
  buildSnapshotFromWidgets,
  elementToRows,
  widgetToElement,
};
