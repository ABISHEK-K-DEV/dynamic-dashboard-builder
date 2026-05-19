import React, { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { useDashboard } from '../../context/DashboardContext';
import TextWidget from '../widgets/TextWidget';
import ImageWidget from '../widgets/ImageWidget';
import ChartWidget from '../widgets/ChartWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Canvas = () => {
  const { widgets, selectWidget, selectedWidgetId, updateWidgetPosition, dashboardId, setWidgets } = useDashboard();
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
    const isSelected = selectedWidgetId === widget.id;
    const style = {
      ...widget.style,
      border: isSelected ? '2px solid #007fd4' : '1px solid transparent',
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
        className={`bg-editor-panel overflow-hidden transition-shadow ${isSelected ? 'shadow-[0_0_0_2px_rgba(0,127,212,0.5)] z-10' : 'hover:border-editor-border z-0'}`}
        style={style}
      >
        {widget.type === 'text' && <TextWidget widget={widget} />}
        {widget.type === 'image' && <ImageWidget widget={widget} />}
        {widget.type === 'chart' && <ChartWidget widget={widget} />}
        
        {isSelected && (
          <div className="absolute top-0 right-0 bg-editor-accent text-white text-[10px] px-1 rounded-bl">
            {widget.type}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="flex-1 h-full overflow-y-auto bg-editor-bg p-8"
      onClick={() => selectWidget(null)}
    >
      <div className="min-h-[800px] border border-editor-border/30 rounded-lg shadow-2xl relative" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 0)', backgroundSize: '20px 20px' }}>
        {mounted && (
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: widgets.map(w => ({ i: w.id, ...w.position })) }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            onLayoutChange={onLayoutChange}
            draggableHandle=".drag-handle"
            isDraggable={true}
            isResizable={true}
            margin={[10, 10]}
            containerPadding={[10, 10]}
          >
            {widgets.map(renderWidget)}
          </ResponsiveGridLayout>
        )}
      </div>
    </div>
  );
};

export default Canvas;
