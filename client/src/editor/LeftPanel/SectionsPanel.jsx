import { Plus, Trash2 } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

export function SectionsPanel() {
  const activePageId = useEditorStore((s) => s.activePageId);
  const sectionOrder = useEditorStore((s) => s.sectionOrder);
  const sections = useEditorStore((s) => s.sections);
  const addSection = useEditorStore((s) => s.addSection);
  const removeSection = useEditorStore((s) => s.removeSection);
  const setSelection = useEditorStore((s) => s.setSelection);

  const ids = activePageId ? (sectionOrder[activePageId] ?? []) : [];

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={!activePageId}
        onClick={() =>
          addSection(activePageId, { name: `Section ${ids.length + 1}` })
        }
        className="flex w-full items-center justify-center gap-1.5 rounded border border-[var(--color-panel-border)] py-2 text-xs text-white hover:bg-white/5 disabled:opacity-40"
      >
        <Plus size={14} /> Add section
      </button>
      <p className="text-[10px] text-[var(--color-panel-muted)]">
        Drag the handle at the bottom of a section on the canvas to resize its height.
      </p>
      <ul className="space-y-1">
        {ids.map((id, i) => {
          const sec = sections[id];
          if (!sec) return null;
          return (
            <li
              key={id}
              className="flex items-center justify-between rounded border border-[var(--color-panel-border)] bg-black/20 px-2 py-1.5 text-xs"
            >
              <button
                type="button"
                className="truncate text-left hover:text-white"
                onClick={() => setSelection([])}
              >
                {sec.name || `Section ${i + 1}`}{' '}
                <span className="text-[var(--color-panel-muted)]">({sec.height}px)</span>
              </button>
              {ids.length > 1 && (
                <button
                  type="button"
                  title="Remove section"
                  onClick={() => {
                    if (confirm(`Remove "${sec.name}" and its elements?`)) removeSection(id);
                  }}
                  className="rounded p-1 text-[var(--color-panel-muted)] hover:bg-white/10 hover:text-[var(--color-danger)]"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
