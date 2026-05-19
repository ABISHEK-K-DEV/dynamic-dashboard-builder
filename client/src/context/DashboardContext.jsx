import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  createDefaultLayouts,
  ensureWidgetLayouts,
  getLayoutForViewport,
  offsetLayouts,
  clampToGrid,
  VIEWPORT_CONFIG,
  buildResponsiveLayoutsForWidgets,
} from '../utils/responsiveLayout';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [widgets, setWidgets] = useState([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState(null);
  const [dashboardId, setDashboardId] = useState('d1');
  const [isSaving, setIsSaving] = useState(false);
  const [viewport, setViewport] = useState('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const addWidget = useCallback((type) => {
    const layouts = createDefaultLayouts();
    const newWidget = {
      id: uuidv4(),
      type,
      content: type === 'text' ? '<p>New Text Widget</p>' : type === 'image' ? '' : 'bar',
      layouts,
      position: layouts.desktop,
      style: {
        fontSize: '16px',
        color: '#ffffff',
        background: 'transparent',
        borderRadius: '0px',
        opacity: 1,
        align: 'left',
      },
    };
    setWidgets((prev) => [...prev, newWidget]);
    setSelectedWidgetId(newWidget.id);
  }, []);

  const updateWidget = useCallback((id, updates) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  }, []);

  const updateWidgetStyle = useCallback((id, styleUpdates) => {
    setWidgets((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, style: { ...w.style, ...styleUpdates } };
        }
        return w;
      })
    );
  }, []);

  const updateWidgetLayout = useCallback((viewportKey, id, positionUpdates) => {
    const cols = VIEWPORT_CONFIG[viewportKey]?.cols ?? 12;
    const sanitized = Object.fromEntries(
      Object.entries(positionUpdates).map(([key, val]) => {
        const num = Number(val);
        return [key, Number.isFinite(num) ? num : 0];
      })
    );

    setWidgets((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        const layouts = ensureWidgetLayouts(w);
        const next = clampToGrid({ ...layouts[viewportKey], ...sanitized }, cols);
        const newLayouts = { ...layouts, [viewportKey]: next };
        return {
          ...w,
          layouts: newLayouts,
          position: newLayouts.desktop,
        };
      })
    );
  }, []);

  const updateWidgetPosition = useCallback(
    (id, positionUpdates) => {
      updateWidgetLayout(viewport, id, positionUpdates);
    },
    [viewport, updateWidgetLayout]
  );

  const removeWidget = useCallback(
    (id) => {
      setWidgets((prev) => prev.filter((w) => w.id !== id));
      if (selectedWidgetId === id) setSelectedWidgetId(null);
    },
    [selectedWidgetId]
  );

  const duplicateWidget = useCallback(
    (id) => {
      const widgetToDuplicate = widgets.find((w) => w.id === id);
      if (!widgetToDuplicate) return;

      const layouts = offsetLayouts(ensureWidgetLayouts(widgetToDuplicate));
      const newWidget = {
        ...widgetToDuplicate,
        id: uuidv4(),
        layouts,
        position: layouts.desktop,
      };
      setWidgets((prev) => [...prev, newWidget]);
      setSelectedWidgetId(newWidget.id);
    },
    [widgets]
  );

  const selectWidget = useCallback((id) => {
    setSelectedWidgetId(id);
  }, []);

  const getSelectedWidget = useCallback(() => {
    const widget = widgets.find((w) => w.id === selectedWidgetId);
    if (!widget) return null;
    return {
      ...widget,
      position: getLayoutForViewport(widget, viewport),
    };
  }, [widgets, selectedWidgetId, viewport]);

  const normalizeWidgets = useCallback((list) => {
    const withLayouts = list.map((w) => {
      if (w.layouts?.desktop && w.layouts?.tablet && w.layouts?.mobile) {
        const layouts = ensureWidgetLayouts(w);
        return { ...w, layouts, position: layouts.desktop };
      }
      return w;
    });
    const needsStack = withLayouts.some((w) => !w.layouts?.mobile);
    const arranged = needsStack ? buildResponsiveLayoutsForWidgets(withLayouts) : withLayouts;
    return arranged.map((w) => {
      const layouts = ensureWidgetLayouts(w);
      return { ...w, layouts, position: layouts.desktop };
    });
  }, []);

  const setWidgetsNormalized = useCallback(
    (updater) => {
      if (typeof updater === 'function') {
        setWidgets((prev) => normalizeWidgets(updater(prev)));
      } else {
        setWidgets(normalizeWidgets(updater));
      }
    },
    [normalizeWidgets]
  );

  return (
    <DashboardContext.Provider
      value={{
        widgets,
        setWidgets: setWidgetsNormalized,
        selectedWidgetId,
        selectWidget,
        dashboardId,
        setDashboardId,
        addWidget,
        updateWidget,
        updateWidgetStyle,
        updateWidgetLayout,
        updateWidgetPosition,
        removeWidget,
        duplicateWidget,
        getSelectedWidget,
        isSaving,
        setIsSaving,
        viewport,
        setViewport,
        isPreviewMode,
        setIsPreviewMode,
        getLayoutForViewport,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
