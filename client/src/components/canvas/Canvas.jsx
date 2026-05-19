import React, { useEffect, useMemo, useState } from 'react';
import { GridLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { useDashboard } from '../../context/DashboardContext';
import TextWidget from '../widgets/TextWidget';
import ImageWidget from '../widgets/ImageWidget';
import ChartWidget from '../widgets/ChartWidget';
import { VIEWPORT_CONFIG, getLayoutForViewport } from '../../utils/responsiveLayout';

const Canvas = () => {
  const {
    widgets,
    selectWidget,
    selectedWidgetId,
    updateWidgetLayout,
    viewport,
    isPreviewMode,
  } = useDashboard();
  const [mounted, setMounted] = useState(false);

  const config = VIEWPORT_CONFIG[viewport];

  useEffect(() => {
    setMounted(true);
  }, []);

  const layout = useMemo(
    () =>
      widgets.map((w) => ({
        i: w.id,
        ...getLayoutForViewport(w, viewport),
      })),
    [widgets, viewport]
  );

  const onLayoutChange = (newLayout) => {
    newLayout.forEach((l) => {
      updateWidgetLayout(viewport, l.i, { x: l.x, y: l.y, w: l.w, h: l.h });
    });
  };

  const renderWidget = (widget) => {
    const isSelected = !isPreviewMode && selectedWidgetId === widget.id;
    const style = {
      ...widget.style,
      border: isSelected ? '1px solid #007fd4' : '1px solid transparent',
      position: 'relative',
    };

    return (
      <div
        key={widget.id}
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

  const bgStyle = isPreviewMode
    ? {}
    : {
        backgroundImage:
          'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0)',
        backgroundSize: '24px 24px',
        backgroundPosition: '0 0',
      };

  return (
    <div
      className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-editor-bg p-4 sm:p-6 lg:p-12 flex justify-center custom-scrollbar"
      onClick={() => selectWidget(null)}
    >
      <div
        className="w-full min-h-[800px] bg-editor-panel shadow-2xl relative transition-all duration-300 mx-auto shrink-0"
        style={{
          width: '100%',
          maxWidth: config.width,
          ...bgStyle,
        }}
      >
        {!isPreviewMode && (
          <div className="absolute top-0 left-0 -mt-7 bg-editor-panel px-4 py-1.5 rounded-t text-xs text-white font-medium shadow-sm flex items-center gap-2 border-b-2 border-editor-accent">
            <span>{config.label}</span>
            <span className="text-editor-text font-normal">{config.width}px</span>
          </div>
        )}

        {mounted && (
          <GridLayout
            key={viewport}
            className="layout"
            width={config.width}
            cols={config.cols}
            layout={layout}
            rowHeight={30}
            onLayoutChange={onLayoutChange}
            draggableHandle=".drag-handle"
            isDraggable={!isPreviewMode}
            isResizable={!isPreviewMode}
            margin={[8, 8]}
            containerPadding={[8, 8]}
            compactType="vertical"
            preventCollision={false}
          >
            {widgets.map(renderWidget)}
          </GridLayout>
        )}
      </div>
    </div>
  );
};

export default Canvas;
