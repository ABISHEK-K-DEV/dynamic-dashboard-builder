import { useState } from 'react';
import { Shapes, Image as ImageIcon, Layers } from 'lucide-react';
import { WidgetsPanel } from './WidgetsPanel';
import { AssetsPanel } from './AssetsPanel';
import { SectionsPanel } from './SectionsPanel';

export function LeftPanel() {
  const [tab, setTab] = useState('widgets');

  return (
    <aside className="flex h-full flex-col overflow-hidden border-r border-[var(--color-panel-border)] bg-[#141416]">
      <nav className="flex border-b border-[var(--color-panel-border)] bg-[#101012] text-[10px]">
        <TabButton active={tab === 'widgets'} onClick={() => setTab('widgets')} icon={<Shapes size={13} />}>
          Widgets
        </TabButton>
        <TabButton active={tab === 'sections'} onClick={() => setTab('sections')} icon={<Layers size={13} />}>
          Sections
        </TabButton>
        <TabButton active={tab === 'assets'} onClick={() => setTab('assets')} icon={<ImageIcon size={13} />}>
          Images
        </TabButton>
      </nav>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === 'widgets' && <WidgetsPanel />}
        {tab === 'sections' && <SectionsPanel />}
        {tab === 'assets' && <AssetsPanel />}
      </div>
    </aside>
  );
}

function TabButton({ active, onClick, icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 px-2 py-2.5 transition-colors ${active ? 'border-b-2 border-[var(--color-accent)] text-white' : 'border-b-2 border-transparent text-[var(--color-panel-muted)] hover:text-white'}`}
    >
      {icon}
      {children}
    </button>
  );
}
