import { useEffect } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { TopBar } from './TopBar';
import { LeftPanel } from './LeftPanel/LeftPanel';
import { CanvasViewport } from './Canvas/CanvasViewport';
import { RightInspector } from './RightInspector/RightInspector';
import { BottomBar } from './BottomBar/BottomBar';
import { PanelDivider } from './PanelDivider';
import { handleSidebarDrop } from './Canvas/dragInsert';
import { widgetRegistry } from '@/widgets/registry';
export function EditorShell({ onBackToProjects }) {
  const project = useEditorStore((s) => s.project);
  const newProject = useEditorStore((s) => s.newProject);
  const mode = useEditorStore((s) => s.mode);
  useEffect(() => {
    if (!project) newProject('Untitled project');
  }, [project, newProject]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );
  const [drag, setDrag] = useState(null);
  const [leftW, setLeftW] = useState(288);
  const [rightW, setRightW] = useState(288);
  const onDragStart = (e) => {
    const data = e.active.data.current;
    if (data?.kind === 'widget-tile' && 'widgetKind' in data && data.widgetKind) {
      setDrag({
        kind: 'widget',
        widgetKind: data.widgetKind,
      });
    } else if (data?.kind === 'asset-tile' && 'assetId' in data && data.assetId) {
      const asset = useEditorStore.getState().project?.assets.find((a) => a.id === data.assetId);
      setDrag({
        kind: 'asset',
        label: asset?.name ?? 'asset',
      });
    }
  };
  const onDragEnd = (e) => {
    setDrag(null);
    handleSidebarDrop(e);
  };
  const onDragCancel = () => setDrag(null);
  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div
        className="flex h-screen flex-col bg-[var(--color-panel-bg)] text-[var(--color-panel-fg)]"
        data-edit-mode={mode}
      >
        <TopBar onBackToProjects={onBackToProjects} />
        <div className="flex min-h-0 flex-1">
          <div
            style={{
              width: leftW,
            }}
            className="h-full shrink-0"
          >
            <LeftPanel />
          </div>
          <PanelDivider
            side="left"
            width={leftW}
            min={220}
            max={520}
            onResize={setLeftW}
            storageKey="sb.leftW"
          />
          <CanvasViewport />
          <PanelDivider
            side="right"
            width={rightW}
            min={220}
            max={520}
            onResize={setRightW}
            storageKey="sb.rightW"
          />
          <div
            style={{
              width: rightW,
            }}
            className="h-full shrink-0"
          >
            <RightInspector />
          </div>
        </div>
        <BottomBar />
      </div>
      <DragOverlay dropAnimation={null}>
        {drag?.kind === 'widget' ? (
          <WidgetGhost kind={drag.widgetKind} />
        ) : drag?.kind === 'asset' ? (
          <span className="rounded border border-[var(--color-accent)] bg-[var(--color-accent)]/20 px-2 py-1 text-xs text-white shadow-lg">
            {drag.label}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
function WidgetGhost({ kind }) {
  const plugin = widgetRegistry.get(kind);
  const Icon = plugin.icon;
  return (
    <div className="flex items-center gap-1.5 rounded border border-[var(--color-accent)] bg-[var(--color-accent)]/20 px-2 py-1 text-xs text-white shadow-lg">
      <Icon size={14} /> {plugin.label}
    </div>
  );
}
