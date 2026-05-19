import React from 'react';
import { Type, Image, BarChart2, Layers } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const LeftSidebar = () => {
  const { addWidget, widgets, selectWidget, selectedWidgetId } = useDashboard();

  return (
    <div className="w-64 h-full bg-editor-panel border-r border-editor-border flex flex-col">
      <div className="p-4 border-b border-editor-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-text">Components</h2>
      </div>
      
      <div className="p-4 flex flex-col gap-2">
        <button 
          onClick={() => addWidget('text')}
          className="flex items-center gap-3 w-full p-2 rounded hover:bg-editor-active transition-colors text-sm text-left"
        >
          <Type size={16} /> Add Text
        </button>
        <button 
          onClick={() => addWidget('image')}
          className="flex items-center gap-3 w-full p-2 rounded hover:bg-editor-active transition-colors text-sm text-left"
        >
          <Image size={16} /> Add Image
        </button>
        <button 
          onClick={() => addWidget('chart')}
          className="flex items-center gap-3 w-full p-2 rounded hover:bg-editor-active transition-colors text-sm text-left"
        >
          <BarChart2 size={16} /> Add Chart
        </button>
      </div>

      <div className="p-4 border-t border-editor-border mt-auto flex-1 overflow-y-auto">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-text mb-4 flex items-center gap-2">
          <Layers size={16} /> Layers
        </h2>
        <div className="flex flex-col gap-1">
          {widgets.map((widget, index) => (
            <div 
              key={widget.id}
              onClick={() => selectWidget(widget.id)}
              className={`p-2 rounded text-sm cursor-pointer truncate ${selectedWidgetId === widget.id ? 'bg-editor-accent text-white' : 'hover:bg-editor-active'}`}
            >
              {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} Widget {index + 1}
            </div>
          ))}
          {widgets.length === 0 && (
            <div className="text-xs text-gray-500 italic">No layers yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
