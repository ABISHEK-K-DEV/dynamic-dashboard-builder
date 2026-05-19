import React, { useEffect } from 'react';
import LeftSidebar from '../components/sidebar/LeftSidebar';
import RightSidebar from '../components/sidebar/RightSidebar';
import Toolbar from '../components/toolbar/Toolbar';
import Canvas from '../components/canvas/Canvas';
import { useDashboard } from '../context/DashboardContext';
import { dashboardService } from '../services/api';

const Builder = () => {
  const { dashboardId, setWidgets } = useDashboard();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await dashboardService.getDashboard(dashboardId);
        
        // Transform backend data to frontend widget state
        if (data.widgets) {
          const transformedWidgets = data.widgets.map(w => ({
            id: w.id,
            type: w.type,
            content: w.content,
            position: {
              x: w.position ? w.position.x : 0,
              y: w.position ? w.position.y : 0,
              w: w.position ? w.position.w : 4,
              h: w.position ? w.position.h : 4,
            },
            style: {
              fontSize: w.style ? w.style.fontSize : '16px',
              color: w.style ? w.style.color : '#ffffff',
              background: w.style ? w.style.background : 'transparent',
              borderRadius: w.style ? w.style.borderRadius : '0px',
              opacity: w.style ? parseFloat(w.style.opacity) : 1,
              align: w.style ? w.style.align : 'left',
            }
          }));
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
        <LeftSidebar />
        <Canvas />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Builder;
