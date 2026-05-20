import { useDraggable } from '@dnd-kit/core';
import { widgetRegistry } from '@/widgets/registry';

export function WidgetsPanel() {
  const plugins = widgetRegistry.all();

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-[var(--color-panel-muted)]">
        Drag a widget onto the canvas. Double-click text to edit (bold/italic via toolbar or
        inspector).
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {plugins.map((p) => (
          <DraggableWidget key={p.kind} plugin={p} />
        ))}
      </div>
    </div>
  );
}

function DraggableWidget({ plugin }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `widget-${plugin.kind}`,
    data: { kind: 'widget-tile', widgetKind: plugin.kind },
  });
  const Icon = plugin.icon;

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      className={`flex aspect-square flex-col items-center justify-center gap-1 rounded border border-[var(--color-panel-border)] bg-black/20 text-[10px] text-[var(--color-panel-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-white ${isDragging ? 'opacity-30' : ''}`}
    >
      <Icon size={18} />
      {plugin.label}
    </button>
  );
}
