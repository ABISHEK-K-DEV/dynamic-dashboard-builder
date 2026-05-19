import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Trash2, Copy, Settings, Zap, Palette, AlignLeft, AlignCenter, AlignRight, AlignJustify, Type } from 'lucide-react';

const RightSidebar = () => {
  const { getSelectedWidget, updateWidgetStyle, updateWidgetPosition, removeWidget, duplicateWidget } = useDashboard();
  const widget = getSelectedWidget();
  const [activeTab, setActiveTab] = useState('style');

  if (!widget) {
    return (
      <div className="w-[280px] h-full bg-editor-panel border-l border-editor-border flex flex-col items-center justify-center text-xs text-editor-text p-4 text-center shrink-0">
        Select an element on the canvas to edit its properties
      </div>
    );
  }

  const { style, position } = widget;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateWidgetStyle(widget.id, { [name]: value });
  };

  const handlePositionChange = (e) => {
    const { name, value } = e.target;
    updateWidgetPosition(widget.id, { [name]: parseInt(value) || 0 });
  };

  return (
    <div className="w-[280px] h-full bg-editor-panel border-l border-editor-border flex flex-col overflow-y-auto custom-scrollbar shrink-0 select-none">
      {/* Top Tabs */}
      <div className="flex text-xs font-medium border-b border-editor-border bg-editor-sidebar">
        <button 
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${activeTab === 'style' ? 'border-editor-accent text-white' : 'border-transparent text-editor-text hover:text-white'}`}
        >
          Style
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${activeTab === 'settings' ? 'border-editor-accent text-white' : 'border-transparent text-editor-text hover:text-white'}`}
        >
          Settings
        </button>
        <button 
          onClick={() => setActiveTab('interactions')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${activeTab === 'interactions' ? 'border-editor-accent text-white' : 'border-transparent text-editor-text hover:text-white'}`}
        >
          Interactions
        </button>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Style Selector */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-white">Style selector</span>
            <span className="text-xxs text-editor-text">Inheriting</span>
          </div>
          <div className="bg-editor-bg border border-editor-border rounded px-2 py-1.5 flex items-center gap-2">
            <div className="bg-editor-accent text-white text-xxs px-1.5 py-0.5 rounded flex items-center gap-1">
              {widget.type}-class
            </div>
            <input type="text" className="bg-transparent border-none outline-none text-xs text-white w-full" placeholder="" />
          </div>
        </div>

        {/* Layout */}
        <div className="border-t border-editor-border pt-4">
          <div className="flex justify-between items-center mb-3 text-white">
            <span className="text-xs font-semibold">Layout</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex flex-col">
              <label className="text-xxs text-editor-text mb-1">Position X</label>
              <input type="number" name="x" value={position.x} onChange={handlePositionChange} className="bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-white outline-none focus:border-editor-accent" />
            </div>
            <div className="flex flex-col">
              <label className="text-xxs text-editor-text mb-1">Position Y</label>
              <input type="number" name="y" value={position.y} onChange={handlePositionChange} className="bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-white outline-none focus:border-editor-accent" />
            </div>
            <div className="flex flex-col">
              <label className="text-xxs text-editor-text mb-1">Width (Cols)</label>
              <input type="number" name="w" value={position.w} onChange={handlePositionChange} className="bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-white outline-none focus:border-editor-accent" />
            </div>
            <div className="flex flex-col">
              <label className="text-xxs text-editor-text mb-1">Height (Rows)</label>
              <input type="number" name="h" value={position.h} onChange={handlePositionChange} className="bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-white outline-none focus:border-editor-accent" />
            </div>
          </div>
        </div>

        {/* Typography */}
        {(widget.type === 'text' || widget.type === 'chart') && (
          <div className="border-t border-editor-border pt-4">
            <div className="flex justify-between items-center mb-3 text-white">
              <span className="text-xs font-semibold">Typography</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xxs text-editor-text w-12">Font</span>
                <select className="flex-1 bg-editor-bg border border-editor-border rounded px-2 py-1.5 text-xs text-white outline-none focus:border-editor-accent appearance-none">
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Arial</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xxs text-editor-text w-12">Size</span>
                <input type="text" name="fontSize" value={style.fontSize || '16px'} onChange={handleChange} className="flex-1 bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-white outline-none focus:border-editor-accent" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xxs text-editor-text w-12">Color</span>
                <div className="flex-1 flex gap-2">
                  <input type="color" name="color" value={style.color || '#ffffff'} onChange={handleChange} className="w-8 h-6 bg-transparent border-none cursor-pointer p-0" />
                  <input type="text" name="color" value={style.color || '#ffffff'} onChange={handleChange} className="flex-1 bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-white outline-none focus:border-editor-accent uppercase" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xxs text-editor-text w-12">Align</span>
                <div className="flex-1 flex bg-editor-input rounded p-0.5 border border-editor-border">
                  <button className="flex-1 flex justify-center py-1 rounded hover:bg-editor-active text-editor-text"><AlignLeft size={14} /></button>
                  <button className="flex-1 flex justify-center py-1 rounded bg-editor-active text-white shadow-sm"><AlignCenter size={14} /></button>
                  <button className="flex-1 flex justify-center py-1 rounded hover:bg-editor-active text-editor-text"><AlignRight size={14} /></button>
                  <button className="flex-1 flex justify-center py-1 rounded hover:bg-editor-active text-editor-text"><AlignJustify size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backgrounds */}
        <div className="border-t border-editor-border pt-4">
          <div className="flex justify-between items-center mb-3 text-white">
            <span className="text-xs font-semibold">Backgrounds</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xxs text-editor-text w-12">Color</span>
              <div className="flex-1 flex gap-2">
                <input type="color" name="background" value={style.background === 'transparent' ? '#000000' : style.background} onChange={handleChange} className="w-8 h-6 bg-transparent border-none cursor-pointer p-0" />
                <input type="text" name="background" value={style.background} onChange={handleChange} className="flex-1 bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-white outline-none focus:border-editor-accent placeholder-editor-text" placeholder="transparent" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xxs text-editor-text w-12">Opacity</span>
              <input type="range" min="0" max="1" step="0.1" name="opacity" value={style.opacity !== undefined ? style.opacity : 1} onChange={handleChange} className="flex-1 accent-editor-accent" />
              <span className="text-xxs text-editor-text w-6 text-right">{Math.round((style.opacity !== undefined ? style.opacity : 1) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Borders */}
        <div className="border-t border-editor-border pt-4">
          <div className="flex justify-between items-center mb-3 text-white">
            <span className="text-xs font-semibold">Borders</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xxs text-editor-text w-12">Radius</span>
              <input type="text" name="borderRadius" value={style.borderRadius || '0px'} onChange={handleChange} className="flex-1 bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-white outline-none focus:border-editor-accent" />
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="border-t border-editor-border pt-4 flex gap-2">
          <button onClick={() => duplicateWidget(widget.id)} className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-editor-input hover:bg-editor-active border border-editor-border rounded text-xs text-white transition-colors">
            <Copy size={14} /> Duplicate
          </button>
          <button onClick={() => removeWidget(widget.id)} className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-red-900/30 hover:bg-red-900/60 border border-red-900/50 rounded text-xs text-red-400 transition-colors">
            <Trash2 size={14} /> Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default RightSidebar;
