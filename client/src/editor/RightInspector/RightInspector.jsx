import { useEditorStore } from '@/store/editorStore';
import { widgetRegistry } from '@/widgets/registry';
import { generateChartData } from '@/widgets/chart';
import { SchemaForm } from '@/inspector/SchemaForm';
import { LayoutPanel } from './LayoutPanel';

export function RightInspector() {
  const selection = useEditorStore((s) => s.selection);
  const elements = useEditorStore((s) => s.elements);
  const updateElement = useEditorStore((s) => s.updateElement);

  if (selection.length === 0) {
    return (
      <aside className="h-full border-l border-[var(--color-panel-border)] bg-[#141416] p-4 text-xs text-[var(--color-panel-muted)]">
        Select a widget to edit its properties.
      </aside>
    );
  }

  if (selection.length > 1) {
    return (
      <aside className="h-full border-l border-[var(--color-panel-border)] bg-[#141416] p-4 text-xs text-[var(--color-panel-muted)]">
        {selection.length} widgets selected.
      </aside>
    );
  }

  const id = selection[0];
  const element = elements[id];
  if (!element) return null;

  const plugin = widgetRegistry.get(element.type);
  const values = {};
  for (const k of Object.keys(plugin.schema)) {
    values[k] = element[k];
  }

  const onChange = (key, value) => {
    if (key === 'newData') {
      const seed = `chart-${Date.now()}`;
      updateElement(id, { seed, chartData: generateChartData(seed) });
      return;
    }
    const topKey = key.split('.')[0];
    updateElement(id, { [topKey]: value });
  };

  return (
    <aside className="flex h-full flex-col overflow-hidden border-l border-[var(--color-panel-border)] bg-[#141416]">
      <header className="border-b border-[var(--color-panel-border)] px-3 py-2 text-xs font-medium text-white">
        {plugin.label}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <section className="mb-4">
          <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-panel-muted)]">
            Content
          </h3>
          <SchemaForm schema={plugin.schema} values={values} onChange={onChange} />
        </section>
        <section>
          <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-panel-muted)]">
            Position & size
          </h3>
          <LayoutPanel elementId={id} />
        </section>
      </div>
    </aside>
  );
}
