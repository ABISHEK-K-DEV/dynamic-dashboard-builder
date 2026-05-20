import { create } from 'zustand';
import { temporal } from 'zundo';
import { immer } from 'zustand/middleware/immer';
import { uid } from '@/lib/id';
import { patchResponsive } from '@/lib/responsive';
const DEVICE_BREAKPOINT = {
  mobile: 'base',
  tablet: 'md',
  desktop: 'lg',
};
const DEVICE_WIDTH = {
  mobile: 430,
  tablet: 768,
  desktop: 1280,
};
function emptyProject(name = 'Untitled project') {
  const now = Date.now();
  return {
    id: uid('proj'),
    name,
    createdAt: now,
    updatedAt: now,
    theme: { colors: {}, fonts: {} },
    fonts: [],
    assets: [],
  };
}
function emptyPage(projectId, order, partial) {
  return {
    id: uid('page'),
    projectId,
    name: partial?.name ?? `Page ${order + 1}`,
    order,
    widthBase: 430,
    widthMd: 768,
    widthLg: 1280,
    ...partial,
  };
}
function emptySection(pageId, order, partial) {
  return {
    id: uid('sec'),
    pageId,
    name: partial?.name ?? `Section ${order + 1}`,
    order,
    height: 800,
    background: '#FAF6F0',
    ...partial,
  };
}
const initialState = {
  project: null,
  pageOrder: [],
  pages: {},
  sections: {},
  sectionOrder: {},
  elements: {},
  selection: [],
  hover: null,
  editingId: null,
  activePageId: null,
  viewport: { zoom: 1, pan: { x: 0, y: 0 }, device: 'mobile' },
  mode: 'edit',
  clipboard: [],
  grid: { enabled: false, size: 8 },
};
const useEditorStore = create()(
  temporal(
    immer((set) => ({
      ...initialState,
      loadProject: (project, pages, elements, sectionsArg, activePageId) =>
        set((s) => {
          s.project = project;
          s.pages = Object.fromEntries(pages.map((p) => [p.id, p]));
          s.pageOrder = [...pages].sort((a, b) => a.order - b.order).map((p) => p.id);
          const sections =
            sectionsArg && sectionsArg.length
              ? sectionsArg
              : pages.map((p) => emptySection(p.id, 0, { name: p.name }));
          s.sections = Object.fromEntries(sections.map((sec) => [sec.id, sec]));
          s.sectionOrder = {};
          for (const p of pages) {
            s.sectionOrder[p.id] = sections
              .filter((sec) => sec.pageId === p.id)
              .sort((a, b) => a.order - b.order)
              .map((sec) => sec.id);
          }
          const firstSectionByPage = {};
          for (const [pid, ids] of Object.entries(s.sectionOrder)) firstSectionByPage[pid] = ids[0];
          const migrated = elements.map((el) => {
            if (el.sectionId && s.sections[el.sectionId]) return el;
            const fallbackPage = el.pageId ?? pages[0]?.id;
            const sectionId = fallbackPage ? firstSectionByPage[fallbackPage] : void 0;
            if (!sectionId) return el;
            return { ...el, sectionId };
          });
          s.elements = Object.fromEntries(migrated.map((e) => [e.id, e]));
          s.activePageId = activePageId ?? s.pageOrder[0] ?? null;
          s.selection = [];
          s.hover = null;
        }),
      newProject: (name) =>
        set((s) => {
          const proj = emptyProject(name);
          const page = emptyPage(proj.id, 0);
          const section = emptySection(page.id, 0, { name: 'Section 1' });
          s.project = proj;
          s.pages = { [page.id]: page };
          s.pageOrder = [page.id];
          s.sections = { [section.id]: section };
          s.sectionOrder = { [page.id]: [section.id] };
          s.elements = {};
          s.activePageId = page.id;
          s.selection = [];
          s.hover = null;
        }),
      renameProject: (name) =>
        set((s) => {
          if (!s.project) return;
          s.project.name = name;
          s.project.updatedAt = Date.now();
        }),
      setExportMode: (mode) =>
        set((s) => {
          if (!s.project) return;
          s.project.exportMode = mode;
        }),
      duplicateActiveProject: () => null,
      setSelection: (ids) =>
        set((s) => {
          s.selection = [...ids];
        }),
      addToSelection: (ids) =>
        set((s) => {
          const set_ = /* @__PURE__ */ new Set([...s.selection, ...ids]);
          s.selection = [...set_];
        }),
      toggleSelection: (id) =>
        set((s) => {
          const idx = s.selection.indexOf(id);
          if (idx >= 0) s.selection.splice(idx, 1);
          else s.selection.push(id);
        }),
      clearSelection: () =>
        set((s) => {
          s.selection = [];
        }),
      setHover: (id) =>
        set((s) => {
          s.hover = id;
        }),
      setEditingId: (id) =>
        set((s) => {
          s.editingId = id;
        }),
      setDevice: (device) =>
        set((s) => {
          s.viewport.device = device;
        }),
      setZoom: (zoom) =>
        set((s) => {
          s.viewport.zoom = zoom;
        }),
      setPan: (pan) =>
        set((s) => {
          s.viewport.pan = pan;
        }),
      setMode: (mode) =>
        set((s) => {
          s.mode = mode;
        }),
      setGrid: (patch) =>
        set((s) => {
          s.grid = { ...s.grid, ...patch };
        }),
      addPage: (partial) => {
        const id = uid('page');
        set((s) => {
          if (!s.project) return;
          const page = emptyPage(s.project.id, s.pageOrder.length, {
            ...partial,
            id,
          });
          s.pages[id] = page;
          s.pageOrder.push(id);
          const sec = emptySection(id, 0, { name: 'Section 1' });
          s.sections[sec.id] = sec;
          s.sectionOrder[id] = [sec.id];
        });
        return id;
      },
      duplicatePage: (pageId) => {
        const newPageId = uid('page');
        let didDup = false;
        set((s) => {
          const src = s.pages[pageId];
          if (!src || !s.project) return;
          const dup = {
            ...src,
            id: newPageId,
            name: `${src.name} copy`,
            order: s.pageOrder.length,
          };
          s.pages[newPageId] = dup;
          s.pageOrder.push(newPageId);
          const oldToNewSec = {};
          const srcSectionIds = s.sectionOrder[pageId] ?? [];
          const newSectionIds = [];
          for (const oldSecId of srcSectionIds) {
            const sec = s.sections[oldSecId];
            if (!sec) continue;
            const newSecId = uid('sec');
            oldToNewSec[oldSecId] = newSecId;
            s.sections[newSecId] = { ...sec, id: newSecId, pageId: newPageId };
            newSectionIds.push(newSecId);
          }
          s.sectionOrder[newPageId] = newSectionIds;
          const elIds = Object.keys(s.elements).filter((k) => {
            const el = s.elements[k];
            return oldToNewSec[el.sectionId];
          });
          for (const oldId of elIds) {
            const src2 = s.elements[oldId];
            const newElId = uid(src2.type.slice(0, 3));
            s.elements[newElId] = {
              ...src2,
              id: newElId,
              sectionId: oldToNewSec[src2.sectionId],
            };
          }
          didDup = true;
        });
        return didDup ? newPageId : null;
      },
      setActivePage: (pageId) =>
        set((s) => {
          if (!(pageId in s.pages)) return;
          s.activePageId = pageId;
          s.selection = [];
        }),
      updatePage: (pageId, patch) =>
        set((s) => {
          const page = s.pages[pageId];
          if (!page) return;
          Object.assign(page, patch);
        }),
      removePage: (pageId) =>
        set((s) => {
          if (!(pageId in s.pages)) return;
          const sectionIds = s.sectionOrder[pageId] ?? [];
          const sectionSet = new Set(sectionIds);
          delete s.pages[pageId];
          s.pageOrder = s.pageOrder.filter((p) => p !== pageId);
          delete s.sectionOrder[pageId];
          for (const sid of sectionIds) delete s.sections[sid];
          for (const id of Object.keys(s.elements)) {
            if (sectionSet.has(s.elements[id].sectionId)) delete s.elements[id];
          }
          if (s.activePageId === pageId) s.activePageId = s.pageOrder[0] ?? null;
        }),
      reorderPages: (pageOrder) =>
        set((s) => {
          s.pageOrder = pageOrder;
          pageOrder.forEach((pid, i) => {
            const p = s.pages[pid];
            if (p) p.order = i;
          });
        }),
      addSection: (pageId, partial) => {
        const id = uid('sec');
        set((s) => {
          if (!s.pages[pageId]) return;
          const order = (s.sectionOrder[pageId] ?? []).length;
          s.sections[id] = emptySection(pageId, order, { ...partial, id });
          s.sectionOrder[pageId] = [...(s.sectionOrder[pageId] ?? []), id];
        });
        return id;
      },
      duplicateSection: (sectionId) => {
        const newId = uid('sec');
        let ok = false;
        set((s) => {
          const src = s.sections[sectionId];
          if (!src) return;
          const order = (s.sectionOrder[src.pageId] ?? []).length;
          const dup = { ...src, id: newId, name: `${src.name} copy`, order };
          s.sections[newId] = dup;
          s.sectionOrder[src.pageId] = [...(s.sectionOrder[src.pageId] ?? []), newId];
          const elIds = Object.keys(s.elements).filter(
            (k) => s.elements[k].sectionId === sectionId,
          );
          for (const oldId of elIds) {
            const e = s.elements[oldId];
            const newElId = uid(e.type.slice(0, 3));
            s.elements[newElId] = { ...e, id: newElId, sectionId: newId };
          }
          ok = true;
        });
        return ok ? newId : null;
      },
      updateSection: (sectionId, patch) =>
        set((s) => {
          const sec = s.sections[sectionId];
          if (!sec) return;
          Object.assign(sec, patch);
        }),
      removeSection: (sectionId) =>
        set((s) => {
          const sec = s.sections[sectionId];
          if (!sec) return;
          const pid = sec.pageId;
          const ids = s.sectionOrder[pid] ?? [];
          if (ids.length <= 1) return;
          delete s.sections[sectionId];
          s.sectionOrder[pid] = ids.filter((id) => id !== sectionId);
          const fallback = s.sectionOrder[pid][0];
          for (const id of Object.keys(s.elements)) {
            if (s.elements[id].sectionId === sectionId) {
              s.elements[id].sectionId = fallback;
            }
          }
        }),
      reorderSections: (pageId, ids) =>
        set((s) => {
          if (!s.sectionOrder[pageId]) return;
          s.sectionOrder[pageId] = ids;
          ids.forEach((sid, i) => {
            const sec = s.sections[sid];
            if (sec) sec.order = i;
          });
        }),
      addElement: (element) =>
        set((s) => {
          s.elements[element.id] = element;
        }),
      updateElement: (id, patch) =>
        set((s) => {
          const el = s.elements[id];
          if (!el) return;
          Object.assign(el, patch);
        }),
      setGeometry: (id, bp, patch) =>
        set((s) => {
          const el = s.elements[id];
          if (!el) return;
          el.geometry = patchResponsive(el.geometry, bp, patch);
        }),
      removeElements: (ids) =>
        set((s) => {
          for (const id of ids) delete s.elements[id];
          s.selection = s.selection.filter((sid) => !ids.includes(sid));
        }),
      duplicateElements: (ids) => {
        const newIds = [];
        set((s) => {
          for (const id of ids) {
            const src = s.elements[id];
            if (!src) continue;
            const copy = {
              ...src,
              id: uid(typeForPrefix(src.type)),
              name: `${src.name} copy`,
              geometry: {
                ...src.geometry,
                base: {
                  ...src.geometry.base,
                  x: src.geometry.base.x + 16,
                  y: src.geometry.base.y + 16,
                },
              },
              zIndex: src.zIndex + 1,
            };
            s.elements[copy.id] = copy;
            newIds.push(copy.id);
          }
        });
        return newIds;
      },
      setZIndex: (id, z) =>
        set((s) => {
          const el = s.elements[id];
          if (!el) return;
          el.zIndex = z;
        }),
      groupSelection: () => {
        console.warn(
          'groupSelection: not implemented in V1 \u2014 select multiple to drag together',
        );
        return null;
      },
      ungroupSelection: () => {
        console.warn('ungroupSelection: not implemented in V1');
      },
      alignSelection: (axis) =>
        set((s) => {
          if (s.selection.length < 2) return;
          const els = s.selection.map((id) => s.elements[id]).filter(Boolean);
          if (!els.length) return;
          const bp = DEVICE_BREAKPOINT[s.viewport.device];
          const rects = els.map((el) => {
            const g = {
              ...el.geometry.base,
              ...(bp !== 'base' ? (el.geometry[bp] ?? {}) : {}),
            };
            return { id: el.id, x: g.x, y: g.y, w: g.w, h: g.h ?? g.w };
          });
          const apply = (id, patch) => {
            const el = s.elements[id];
            if (!el) return;
            el.geometry =
              bp === 'base'
                ? { ...el.geometry, base: { ...el.geometry.base, ...patch } }
                : {
                    ...el.geometry,
                    [bp]: { ...(el.geometry[bp] ?? {}), ...patch },
                  };
          };
          if (axis === 'left') {
            const m = Math.min(...rects.map((r) => r.x));
            for (const r of rects) apply(r.id, { x: m });
          } else if (axis === 'right') {
            const m = Math.max(...rects.map((r) => r.x + r.w));
            for (const r of rects) apply(r.id, { x: m - r.w });
          } else if (axis === 'center-x') {
            const minX = Math.min(...rects.map((r) => r.x));
            const maxX = Math.max(...rects.map((r) => r.x + r.w));
            const c = (minX + maxX) / 2;
            for (const r of rects) apply(r.id, { x: c - r.w / 2 });
          } else if (axis === 'top') {
            const m = Math.min(...rects.map((r) => r.y));
            for (const r of rects) apply(r.id, { y: m });
          } else if (axis === 'bottom') {
            const m = Math.max(...rects.map((r) => r.y + r.h));
            for (const r of rects) apply(r.id, { y: m - r.h });
          } else if (axis === 'center-y') {
            const minY = Math.min(...rects.map((r) => r.y));
            const maxY = Math.max(...rects.map((r) => r.y + r.h));
            const c = (minY + maxY) / 2;
            for (const r of rects) apply(r.id, { y: c - r.h / 2 });
          }
        }),
      distributeSelection: (axis) =>
        set((s) => {
          if (s.selection.length < 3) return;
          const bp = DEVICE_BREAKPOINT[s.viewport.device];
          const rects = s.selection
            .map((id) => {
              const el = s.elements[id];
              if (!el) return null;
              const g = {
                ...el.geometry.base,
                ...(bp !== 'base' ? (el.geometry[bp] ?? {}) : {}),
              };
              return { id, x: g.x, y: g.y, w: g.w, h: g.h ?? g.w };
            })
            .filter((r) => !!r);
          if (axis === 'horizontal') {
            rects.sort((a, b) => a.x - b.x);
            const minStart = rects[0].x;
            const maxEnd = rects[rects.length - 1].x + rects[rects.length - 1].w;
            const totalWidth = rects.reduce((sum, r) => sum + r.w, 0);
            const gap = (maxEnd - minStart - totalWidth) / (rects.length - 1);
            let cursor = minStart;
            for (const r of rects) {
              const el = s.elements[r.id];
              if (!el) continue;
              const newX = cursor;
              el.geometry =
                bp === 'base'
                  ? { ...el.geometry, base: { ...el.geometry.base, x: newX } }
                  : {
                      ...el.geometry,
                      [bp]: { ...(el.geometry[bp] ?? {}), x: newX },
                    };
              cursor += r.w + gap;
            }
          } else {
            rects.sort((a, b) => a.y - b.y);
            const minStart = rects[0].y;
            const maxEnd = rects[rects.length - 1].y + rects[rects.length - 1].h;
            const totalHeight = rects.reduce((sum, r) => sum + r.h, 0);
            const gap = (maxEnd - minStart - totalHeight) / (rects.length - 1);
            let cursor = minStart;
            for (const r of rects) {
              const el = s.elements[r.id];
              if (!el) continue;
              const newY = cursor;
              el.geometry =
                bp === 'base'
                  ? { ...el.geometry, base: { ...el.geometry.base, y: newY } }
                  : {
                      ...el.geometry,
                      [bp]: { ...(el.geometry[bp] ?? {}), y: newY },
                    };
              cursor += r.h + gap;
            }
          }
        }),
      addAsset: (asset) =>
        set((s) => {
          if (!s.project) return;
          s.project.assets.push(asset);
        }),
      removeAsset: (assetId) =>
        set((s) => {
          if (!s.project) return;
          s.project.assets = s.project.assets.filter((a) => a.id !== assetId);
        }),
      updateAsset: (assetId, patch) =>
        set((s) => {
          if (!s.project) return;
          const a = s.project.assets.find((x) => x.id === assetId);
          if (a) Object.assign(a, patch);
        }),
      replaceAssetBlob: async (assetId, file, name, mime) => {
        const dataUrl = await new Promise((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result));
          r.onerror = reject;
          r.readAsDataURL(file);
        });
        const cur = useEditorStore.getState().project?.assets.find((a) => a.id === assetId);
        if (!cur) return;
        useEditorStore.getState().updateAsset(assetId, {
          name: name ?? cur.name,
          mime: mime ?? cur.mime,
          size: file.size,
          dataUrl,
        });
      },
      addFont: (font) =>
        set((s) => {
          if (!s.project) return;
          s.project.fonts.push(font);
        }),
      updateFont: (fontId, patch) =>
        set((s) => {
          if (!s.project) return;
          const f = s.project.fonts.find((x) => x.id === fontId);
          if (f) Object.assign(f, patch);
        }),
      removeFont: (fontId) =>
        set((s) => {
          if (!s.project) return;
          s.project.fonts = s.project.fonts.filter((f) => f.id !== fontId);
        }),
      setThemeColor: (name, value) =>
        set((s) => {
          if (!s.project) return;
          s.project.theme.colors[name] = value;
        }),
      renameThemeColor: (oldName, newName) =>
        set((s) => {
          if (!s.project) return;
          if (oldName === newName || !(oldName in s.project.theme.colors)) return;
          s.project.theme.colors[newName] = s.project.theme.colors[oldName];
          delete s.project.theme.colors[oldName];
        }),
      removeThemeColor: (name) =>
        set((s) => {
          if (!s.project) return;
          delete s.project.theme.colors[name];
        }),
      setThemeFontRole: (role, family) =>
        set((s) => {
          if (!s.project) return;
          s.project.theme.fonts[role] = family;
        }),
      removeThemeFontRole: (role) =>
        set((s) => {
          if (!s.project) return;
          delete s.project.theme.fonts[role];
        }),
    })),
    {
      // Only track structural state in undo history. Ignore ephemeral UI state.
      partialize: (state) => ({
        project: state.project,
        pageOrder: state.pageOrder,
        pages: state.pages,
        elements: state.elements,
        activePageId: state.activePageId,
      }),
      // Drag commits only fire on dragEnd, so each drag is already one history entry.
      limit: 100,
    },
  ),
);
function typeForPrefix(t) {
  return t.slice(0, 3);
}
const selectActivePage = (s) => (s.activePageId ? (s.pages[s.activePageId] ?? null) : null);
const selectElement = (id) => (s) => s.elements[id] ?? null;
const selectIsSelected = (id) => (s) => s.selection.includes(id);
const editorTemporal = useEditorStore.temporal;
function currentBreakpoint(s) {
  return DEVICE_BREAKPOINT[s.viewport.device];
}
export {
  DEVICE_BREAKPOINT,
  DEVICE_WIDTH,
  currentBreakpoint,
  editorTemporal,
  selectActivePage,
  selectElement,
  selectIsSelected,
  useEditorStore,
};
