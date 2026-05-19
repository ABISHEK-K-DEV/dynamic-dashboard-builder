import React, { useEffect } from 'react';
import LeftSidebar from '../components/sidebar/LeftSidebar';
import RightSidebar from '../components/sidebar/RightSidebar';
import Toolbar from '../components/toolbar/Toolbar';
import Canvas from '../components/canvas/Canvas';
import { useDashboard } from '../context/DashboardContext';
import { dashboardService, getAssetUrl } from '../services/api';

const Builder = () => {
  const { dashboardId, setWidgets, isPreviewMode } = useDashboard();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await dashboardService.getDashboard(dashboardId);
        
        // Transform backend data to frontend widget state
        if (data.widgets) {
          const transformedWidgets = data.widgets.map(w => {
            const opacity = w.style?.opacity != null ? parseFloat(w.style.opacity) : 1;
            const chartContent = w.type === 'chart'
              ? (['bar', 'line', 'pie'].includes(w.content) ? w.content : 'bar')
              : w.type === 'image' && w.content
                ? getAssetUrl(w.content)
                : (w.content ?? (w.type === 'text' ? '<p></p>' : ''));
            return {
              id: w.id,
              type: w.type,
              content: chartContent,
              position: {
                x: w.position?.x ?? 0,
                y: w.position?.y ?? 0,
                w: w.position?.w ?? 4,
                h: w.position?.h ?? 4,
              },
              style: {
                fontSize: w.style?.fontSize ?? '16px',
                color: w.style?.color ?? '#ffffff',
                background: w.style?.background ?? 'transparent',
                borderRadius: w.style?.borderRadius ?? '0px',
                opacity: Number.isFinite(opacity) ? opacity : 1,
                align: w.style?.align ?? 'left',
              },
            };
          });
          setWidgets(transformedWidgets);
        }
      } catch (error) {
        console.error('Error fetching dashboard. If this is a new db, no widgets exist yet.', error);
      }
    };

    fetchDashboard();
  }, [dashboardId, setWidgets]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-editor-bg">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        {!isPreviewMode && <LeftSidebar />}
        <Canvas />
        {!isPreviewMode && <RightSidebar />}
      </div>
    </div>
  );
};

export default Builder;
