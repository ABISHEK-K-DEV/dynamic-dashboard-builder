import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { dashboardService } from '../../services/api';
import { UploadCloud, Move } from 'lucide-react';

const ImageWidget = ({ widget }) => {
  const { updateWidget, selectedWidgetId } = useDashboard();
  const [uploading, setUploading] = useState(false);
  const isSelected = selectedWidgetId === widget.id;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { url } = await dashboardService.uploadImage(file);
      updateWidget(widget.id, { content: `http://localhost:5000${url}` });
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col group">
      <div className={`drag-handle absolute top-0 left-0 right-0 h-6 bg-black/50 z-10 flex items-center justify-center cursor-move opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}>
        <Move size={14} className="text-white" />
      </div>
      
      {widget.content ? (
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <img 
            src={widget.content} 
            alt="Widget" 
            className="max-w-full max-h-full object-contain"
            style={{ borderRadius: widget.style.borderRadius }}
          />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-editor-border rounded m-2 bg-editor-bg/50">
          <UploadCloud size={32} className="text-gray-400 mb-2" />
          <label className="cursor-pointer bg-editor-accent text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageWidget;
