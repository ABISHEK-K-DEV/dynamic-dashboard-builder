import React, { useEffect, useState } from 'react';
import { ResponsiveGridLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { useDashboard } from '../../context/DashboardContext';
import TextWidget from '../widgets/TextWidget';
import ImageWidget from '../widgets/ImageWidget';
import ChartWidget from '../widgets/ChartWidget';

const Canvas = () => {
  const { widgets, selectWidget, selectedWidgetId, updateWidgetPosition, dashboardId, setWidgets, viewport, isPreviewMode } = useDashboard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onLayoutChange = (layout) => {
    layout.forEach(l => {
      updateWidgetPosition(l.i, { x: l.x, y: l.y, w: l.w, h: l.h });
    });
  };

  const renderWidget = (widget) => {
    const isSelected = !isPreviewMode && (selectedWidgetId === widget.id);
    const style = {
      ...widget.style,
      border: isSelected ? '1px solid #007fd4' : '1px solid transparent',
      position: 'relative'
    };

    return (
      <div 
        key={widget.id} 
        data-grid={{ i: widget.id, x: widget.position.x, y: widget.position.y, w: widget.position.w, h: widget.position.h }}
        onClick={(e) => {
          e.stopPropagation();
          selectWidget(widget.id);
        }}
        className={`bg-transparent overflow-hidden transition-shadow ${isSelected ? 'shadow-[0_0_0_1px_rgba(0,127,212,0.5)] z-10' : (!isPreviewMode ? 'hover:border-editor-border hover:shadow-sm z-0' : 'z-0')}`}
        style={style}
      >
        {widget.type === 'text' && <TextWidget widget={widget} />}
        {widget.type === 'image' && <ImageWidget widget={widget} />}
        {widget.type === 'chart' && <ChartWidget widget={widget} />}
        
        {isSelected && !isPreviewMode && (
          <div className="absolute top-0 right-0 bg-editor-accent text-white text-xxs px-1.5 py-0.5 rounded-bl shadow-sm pointer-events-none">
            {widget.type}
          </div>
        )}
      </div>
    );
  };

  const containerWidth = viewport === 'desktop' ? '1200px' : viewport === 'tablet' ? '768px' : '375px';
  const label = viewport === 'desktop' ? 'Desktop View' : viewport === 'tablet' ? 'Tablet View' : 'Mobile View';

  const bgStyle = isPreviewMode ? {} : {
    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0)', 
    backgroundSize: '24px 24px',
    backgroundPosition: '0 0'
  };

  return (
    <div 
      className="flex-1 h-full overflow-y-auto bg-editor-bg p-6 lg:p-12 flex justify-center custom-scrollbar"
      onClick={() => selectWidget(null)}
    >
      <div className="w-full min-h-[800px] bg-editor-panel shadow-2xl relative transition-all duration-300 mx-auto" 
           style={{ 
             maxWidth: containerWidth,
             ...bgStyle
           }}>
        
        {/* Canvas Header / Tab */}
        {!isPreviewMode && (
          <div className="absolute top-0 left-0 -mt-7 bg-editor-panel px-4 py-1.5 rounded-t text-xs text-white font-medium shadow-sm flex items-center gap-2 border-b-2 border-editor-accent">
            <span>{label}</span>
          </div>
        )}

        {mounted && (
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: widgets.map(w => ({ i: w.id, ...w.position })) }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            onLayoutChange={onLayoutChange}
            draggableHandle=".drag-handle"
            isDraggable={!isPreviewMode}
            isResizable={!isPreviewMode}
            margin={[0, 0]}
            containerPadding={[0, 0]}
          >
            {widgets.map(renderWidget)}
          </ResponsiveGridLayout>
        )}
      </div>
    </div>
  );
};

export default Canvas;
