import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDashboard } from '../../context/DashboardContext';
import { Move } from 'lucide-react';

const TextWidget = ({ widget }) => {
  const { updateWidget, selectedWidgetId } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const isSelected = selectedWidgetId === widget.id;

  const handleChange = (content) => {
    updateWidget(widget.id, { content });
  };

  return (
    <div className="w-full h-full flex flex-col group">
      <div className={`drag-handle h-6 bg-editor-border/50 flex items-center justify-center cursor-move opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}>
        <Move size={14} className="text-gray-400" />
      </div>
      <div 
        className="flex-1 p-2 overflow-y-auto custom-scrollbar" 
        onDoubleClick={() => setIsEditing(true)}
        style={{ color: widget.style.color || '#fff' }}
      >
        {isEditing ? (
          <ReactQuill 
            value={widget.content} 
            onChange={handleChange}
            onBlur={() => setIsEditing(false)}
            theme="snow"
            className="text-white"
          />
        ) : (
          <div 
            dangerouslySetInnerHTML={{ __html: widget.content }} 
            className="prose prose-invert max-w-none prose-sm"
          />
        )}
      </div>
    </div>
  );
};

export default TextWidget;
