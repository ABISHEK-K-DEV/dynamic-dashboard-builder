import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useDashboard } from '../../context/DashboardContext';
import { Move } from 'lucide-react';

const TextWidget = ({ widget }) => {
  const { updateWidget, selectedWidgetId, isPreviewMode } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const isSelected = selectedWidgetId === widget.id;

  useEffect(() => {
    if (!isSelected) {
      setIsEditing(false);
    }
  }, [isSelected]);

  const handleChange = (content) => {
    updateWidget(widget.id, { content });
  };

  return (
    <div className="w-full h-full flex flex-col group">
      {!isPreviewMode && (
        <div className={`drag-handle absolute top-0 left-0 right-0 h-6 bg-black/50 z-20 flex items-center justify-center cursor-move opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}>
          <Move size={14} className="text-white" />
        </div>
      )}
      <div 
        className="flex-1 p-2 mt-6 overflow-y-auto custom-scrollbar"
        style={{ 
          color: widget.style.color || '#fff',
          fontSize: widget.style.fontSize || '16px',
          textAlign: widget.style.align || 'left',
          fontFamily: widget.style.fontFamily || 'inherit'
        }}
        onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
      >
        {isEditing ? (
          <ReactQuill 
            value={widget.content ?? ''} 
            onChange={handleChange}
            theme="snow"
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ size: ['small', false, 'large', 'huge'] }],
              ],
            }}
            className="text-white h-full"
          />
        ) : (
          <div 
            dangerouslySetInnerHTML={{ __html: widget.content ?? '' }} 
            className="prose prose-invert max-w-none prose-sm"
            style={{ fontSize: 'inherit', color: 'inherit', textAlign: 'inherit' }}
          />
        )}
      </div>
    </div>
  );
};

export default TextWidget;
