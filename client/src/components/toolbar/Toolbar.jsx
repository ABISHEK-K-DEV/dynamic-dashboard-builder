import React from 'react';
import { Save, Play, Monitor, Tablet, Smartphone, Share2, UploadCloud, ChevronDown, Menu, Settings } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { dashboardService } from '../../services/api';

const Toolbar = () => {
  const { widgets, dashboardId, isSaving, setIsSaving, viewport, setViewport, isPreviewMode, setIsPreviewMode } = useDashboard();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await dashboardService.saveLayout(dashboardId, widgets);
      alert('Dashboard saved successfully!');
    } catch (error) {
      console.error('Failed to save dashboard', error);
      alert('Failed to save dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-12 bg-editor-panel border-b border-editor-border flex items-center justify-between px-2 shrink-0 select-none">
      
      {/* Left section: Logo & Menu */}
      <div className="flex items-center gap-1">
        <button onClick={() => alert('Menu clicked')} className="p-1.5 text-editor-text hover:text-white rounded hover:bg-editor-active transition-colors">
          <Menu size={18} />
        </button>
        <div onClick={() => alert('Home navigation clicked')} className="flex items-center gap-2 bg-editor-active/50 hover:bg-editor-active px-3 py-1 rounded cursor-pointer transition-colors border border-editor-border/50">
          <div className="w-4 h-4 bg-editor-accent rounded flex items-center justify-center text-[10px] text-white font-bold">W</div>
          <span className="text-xs text-white font-medium">Home</span>
          <ChevronDown size={14} className="text-editor-text" />
        </div>
      </div>
      
      {/* Middle section: Device Viewports */}
      <div className="flex items-center gap-1 bg-editor-input p-0.5 rounded border border-editor-border">
        <button 
          onClick={() => setViewport('desktop')}
          className={`p-1.5 rounded transition-colors tooltip ${viewport === 'desktop' ? 'text-white bg-editor-active shadow-sm' : 'text-editor-text hover:text-white'}`} 
          title="Desktop"
        >
          <Monitor size={14} />
        </button>
        <button 
          onClick={() => setViewport('tablet')}
          className={`p-1.5 rounded transition-colors tooltip ${viewport === 'tablet' ? 'text-white bg-editor-active shadow-sm' : 'text-editor-text hover:text-white'}`} 
          title="Tablet"
        >
          <Tablet size={14} />
        </button>
        <button 
          onClick={() => setViewport('mobile')}
          className={`p-1.5 rounded transition-colors tooltip ${viewport === 'mobile' ? 'text-white bg-editor-active shadow-sm' : 'text-editor-text hover:text-white'}`} 
          title="Mobile"
        >
          <Smartphone size={14} />
        </button>
        <div className="w-[1px] h-4 bg-editor-border mx-1"></div>
        <span className="text-xxs text-editor-text px-2">
          {viewport === 'desktop' ? '1200 PX' : viewport === 'tablet' ? '768 PX' : '375 PX'}
        </span>
      </div>
      
      {/* Right section: Actions */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 border-r border-editor-border pr-2 mr-1">
          <button onClick={() => alert('Settings modal opened')} className="p-1.5 text-editor-text hover:text-white rounded transition-colors tooltip" title="Settings">
            <Settings size={14} />
          </button>
          <button 
            onClick={() => setIsPreviewMode(!isPreviewMode)} 
            className={`p-1.5 rounded transition-colors tooltip ${isPreviewMode ? 'text-white bg-green-600' : 'text-editor-text hover:text-white'}`} 
            title={isPreviewMode ? 'Exit Preview' : 'Preview'}
          >
            <Play size={14} />
          </button>
        </div>
        
        <button onClick={() => alert('Share link copied to clipboard!')} className="flex items-center gap-1.5 text-editor-text hover:text-white px-3 py-1 rounded text-xs transition-colors border border-transparent hover:border-editor-border">
          <Share2 size={12} />
          Share
        </button>
        
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="flex items-center gap-1.5 bg-editor-accent hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50"
        >
          <UploadCloud size={14} />
          {isSaving ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
