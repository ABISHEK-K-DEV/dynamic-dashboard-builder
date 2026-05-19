import React, { useState } from 'react';
import { Plus, Layout, Layers, Type, Image as ImageIcon, BarChart2, ChevronDown } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const LeftSidebar = () => {
  const { addWidget, widgets, selectWidget, selectedWidgetId } = useDashboard();
  const [activeTab, setActiveTab] = useState('add');

  return (
    <div className="flex h-full border-r border-editor-border bg-editor-panel shrink-0 select-none">
      {/* Primary thin sidebar */}
      <div className="w-12 h-full bg-editor-sidebar border-r border-editor-border flex flex-col items-center py-4 gap-3">
        <button 
          className={`p-2 rounded ${activeTab === 'add' ? 'text-white' : 'text-editor-text hover:text-white'}`}
          onClick={() => setActiveTab('add')}
        >
          <Plus size={20} />
        </button>
        <button 
          className={`p-2 rounded ${activeTab === 'layers' ? 'text-white' : 'text-editor-text hover:text-white'}`}
          onClick={() => setActiveTab('layers')}
        >
          <Layers size={20} />
        </button>
      </div>

      {/* Secondary panel */}
      <div className="w-64 h-full flex flex-col overflow-y-auto custom-scrollbar">
        {activeTab === 'add' && (
          <>
            <div className="p-4 flex items-center justify-between border-b border-editor-border">
              <h2 className="text-sm font-semibold text-white">Add</h2>
            </div>
            
            <div className="p-4">
              <div className="flex bg-editor-input rounded-md p-1 mb-6 border border-editor-border">
                <button className="flex-1 text-xs py-1 rounded bg-editor-active text-white text-center font-medium shadow-sm">Elements</button>
                <button className="flex-1 text-xs py-1 rounded text-editor-text hover:text-white text-center font-medium">Layouts</button>
              </div>

              {/* Typography Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3 text-editor-text hover:text-white cursor-pointer transition-colors">
                  <span className="text-xs font-semibold tracking-wide uppercase">Typography</span>
                  <ChevronDown size={14} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div onClick={() => addWidget('text')} className="flex flex-col items-center justify-center p-3 border border-transparent hover:border-editor-border hover:bg-editor-active rounded cursor-pointer gap-2 transition-all">
                    <Type size={20} className="text-editor-text" />
                    <span className="text-xxs text-editor-text text-center">Heading</span>
                  </div>
                  <div onClick={() => addWidget('text')} className="flex flex-col items-center justify-center p-3 border border-transparent hover:border-editor-border hover:bg-editor-active rounded cursor-pointer gap-2 transition-all">
                    <Layout size={20} className="text-editor-text" />
                    <span className="text-xxs text-editor-text text-center">Paragraph</span>
                  </div>
                  <div onClick={() => addWidget('text')} className="flex flex-col items-center justify-center p-3 border border-transparent hover:border-editor-border hover:bg-editor-active rounded cursor-pointer gap-2 transition-all">
                    <Type size={20} className="text-editor-text" />
                    <span className="text-xxs text-editor-text text-center">Text link</span>
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3 text-editor-text hover:text-white cursor-pointer transition-colors">
                  <span className="text-xs font-semibold tracking-wide uppercase">Media</span>
                  <ChevronDown size={14} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div onClick={() => addWidget('image')} className="flex flex-col items-center justify-center p-3 border border-transparent hover:border-editor-border hover:bg-editor-active rounded cursor-pointer gap-2 transition-all">
                    <ImageIcon size={20} className="text-editor-text" />
                    <span className="text-xxs text-editor-text text-center">Image</span>
                  </div>
                  <div onClick={() => addWidget('chart')} className="flex flex-col items-center justify-center p-3 border border-transparent hover:border-editor-border hover:bg-editor-active rounded cursor-pointer gap-2 transition-all">
                    <BarChart2 size={20} className="text-editor-text" />
                    <span className="text-xxs text-editor-text text-center">Chart</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'layers' && (
          <>
            <div className="p-4 flex items-center justify-between border-b border-editor-border">
              <h2 className="text-sm font-semibold text-white">Navigator</h2>
            </div>
            <div className="flex flex-col p-2 gap-0.5">
              {widgets.map((widget, index) => (
                <div 
                  key={widget.id}
                  onClick={() => selectWidget(widget.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs cursor-pointer truncate transition-colors ${selectedWidgetId === widget.id ? 'bg-editor-accent/20 text-white border border-editor-accent/50' : 'text-editor-text hover:bg-editor-active hover:text-white border border-transparent'}`}
                >
                  {widget.type === 'text' && <Type size={14} className={selectedWidgetId === widget.id ? 'text-editor-accent' : ''} />}
                  {widget.type === 'image' && <ImageIcon size={14} className={selectedWidgetId === widget.id ? 'text-editor-accent' : ''} />}
                  {widget.type === 'chart' && <BarChart2 size={14} className={selectedWidgetId === widget.id ? 'text-editor-accent' : ''} />}
                  <span>{widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} {index + 1}</span>
                </div>
              ))}
              {widgets.length === 0 && (
                <div className="text-xs text-gray-500 italic p-2 text-center mt-4">Canvas is empty</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
