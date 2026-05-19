import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Trash2, Copy } from 'lucide-react';

const RightSidebar = () => {
  const { getSelectedWidget, updateWidgetStyle, updateWidgetPosition, removeWidget, duplicateWidget } = useDashboard();
  const widget = getSelectedWidget();

  if (!widget) {
    return (
      <div className="w-64 h-full bg-editor-panel border-l border-editor-border flex flex-col items-center justify-center text-sm text-gray-500 p-4 text-center">
        Select a widget to edit its properties
      </div>
    );
  }

  const { style, position } = widget;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateWidgetStyle(widget.id, { [name]: value });
  };

  return (
    <div className="w-72 h-full bg-editor-panel border-l border-editor-border flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-editor-border flex justify-between items-center bg-editor-bg">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-text">Properties</h2>
        <div className="flex gap-2">
          <button onClick={() => duplicateWidget(widget.id)} className="p-1 hover:bg-editor-active rounded tooltip" title="Duplicate">
            <Copy size={16} />
          </button>
          <button onClick={() => removeWidget(widget.id)} className="p-1 hover:bg-red-500/20 text-red-400 rounded tooltip" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Layout Properties */}
        <div>
          <h3 className="text-xs text-gray-500 mb-2 uppercase font-semibold">Layout</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-gray-400 mb-1">X</label>
              <input type="number" value={position.x} onChange={(e) => updateWidgetPosition(widget.id, { x: parseInt(e.target.value) })} className="w-full bg-editor-bg border border-editor-border rounded p-1 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Y</label>
              <input type="number" value={position.y} onChange={(e) => updateWidgetPosition(widget.id, { y: parseInt(e.target.value) })} className="w-full bg-editor-bg border border-editor-border rounded p-1 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">W</label>
              <input type="number" value={position.w} onChange={(e) => updateWidgetPosition(widget.id, { w: parseInt(e.target.value) })} className="w-full bg-editor-bg border border-editor-border rounded p-1 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">H</label>
              <input type="number" value={position.h} onChange={(e) => updateWidgetPosition(widget.id, { h: parseInt(e.target.value) })} className="w-full bg-editor-bg border border-editor-border rounded p-1 text-white" />
            </div>
          </div>
        </div>

        {/* Style Properties */}
        <div className="border-t border-editor-border pt-4">
          <h3 className="text-xs text-gray-500 mb-2 uppercase font-semibold">Appearance</h3>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <label className="text-gray-400 w-1/3">Opacity</label>
              <input type="range" min="0" max="1" step="0.1" name="opacity" value={style.opacity} onChange={handleChange} className="w-2/3 accent-editor-accent" />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-gray-400 w-1/3">Background</label>
              <input type="color" name="background" value={style.background === 'transparent' ? '#000000' : style.background} onChange={handleChange} className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer" />
              <input type="text" name="background" value={style.background} onChange={handleChange} className="w-1/2 bg-editor-bg border border-editor-border rounded p-1 text-white text-right" />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-gray-400 w-1/3">Radius</label>
              <input type="text" name="borderRadius" value={style.borderRadius} onChange={handleChange} className="w-2/3 bg-editor-bg border border-editor-border rounded p-1 text-white" placeholder="e.g. 8px" />
            </div>
          </div>
        </div>

        {/* Text Specific Properties */}
        {widget.type === 'text' && (
          <div className="border-t border-editor-border pt-4">
            <h3 className="text-xs text-gray-500 mb-2 uppercase font-semibold">Typography</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <label className="text-gray-400 w-1/3">Color</label>
                <input type="color" name="color" value={style.color} onChange={handleChange} className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
