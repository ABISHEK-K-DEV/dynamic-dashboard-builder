import React from 'react';
import { Save, Play, Monitor } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { dashboardService } from '../../services/api';

const Toolbar = () => {
  const { widgets, dashboardId, isSaving, setIsSaving } = useDashboard();

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
    <div className="h-14 bg-editor-panel border-b border-editor-border flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-editor-accent rounded flex items-center justify-center text-white font-bold">
          D
        </div>
        <span className="text-white font-medium ml-2">Dashboard Builder</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Preview">
          <Play size={18} />
        </button>
        <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Desktop View">
          <Monitor size={18} />
        </button>
        
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="flex items-center gap-2 bg-editor-accent hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
