import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [widgets, setWidgets] = useState([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState(null);
  const [dashboardId, setDashboardId] = useState('d1'); // Default to d1 for demo
  const [isSaving, setIsSaving] = useState(false);

  const addWidget = useCallback((type) => {
    const newWidget = {
      id: uuidv4(),
      type,
      content: type === 'text' ? '<p>New Text Widget</p>' : type === 'image' ? '' : '[]',
      position: { x: 0, y: 0, w: 4, h: 4 },
      style: {
        fontSize: '16px',
        color: '#ffffff',
        background: 'transparent',
        borderRadius: '0px',
        opacity: 1,
        align: 'left'
      }
    };
    setWidgets((prev) => [...prev, newWidget]);
    setSelectedWidgetId(newWidget.id);
  }, []);

  const updateWidget = useCallback((id, updates) => {
    setWidgets((prev) => prev.map(w => (w.id === id ? { ...w, ...updates } : w)));
  }, []);

  const updateWidgetStyle = useCallback((id, styleUpdates) => {
    setWidgets((prev) => prev.map(w => {
      if (w.id === id) {
        return { ...w, style: { ...w.style, ...styleUpdates } };
      }
      return w;
    }));
  }, []);

  const updateWidgetPosition = useCallback((id, positionUpdates) => {
    setWidgets((prev) => prev.map(w => {
      if (w.id === id) {
        return { ...w, position: { ...w.position, ...positionUpdates } };
      }
      return w;
    }));
  }, []);

  const removeWidget = useCallback((id) => {
    setWidgets((prev) => prev.filter(w => w.id !== id));
    if (selectedWidgetId === id) setSelectedWidgetId(null);
  }, [selectedWidgetId]);

  const duplicateWidget = useCallback((id) => {
    const widgetToDuplicate = widgets.find(w => w.id === id);
    if (!widgetToDuplicate) return;

    const newWidget = {
      ...widgetToDuplicate,
      id: uuidv4(),
      position: {
        ...widgetToDuplicate.position,
        x: widgetToDuplicate.position.x + 1,
        y: widgetToDuplicate.position.y + 1
      }
    };
    setWidgets((prev) => [...prev, newWidget]);
    setSelectedWidgetId(newWidget.id);
  }, [widgets]);

  const selectWidget = useCallback((id) => {
    setSelectedWidgetId(id);
  }, []);

  const getSelectedWidget = useCallback(() => {
    return widgets.find(w => w.id === selectedWidgetId);
  }, [widgets, selectedWidgetId]);

  return (
    <DashboardContext.Provider
      value={{
        widgets,
        setWidgets,
        selectedWidgetId,
        selectWidget,
        dashboardId,
        setDashboardId,
        addWidget,
        updateWidget,
        updateWidgetStyle,
        updateWidgetPosition,
        removeWidget,
        duplicateWidget,
        getSelectedWidget,
        isSaving,
        setIsSaving
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
