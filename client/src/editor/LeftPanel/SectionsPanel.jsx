import { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { ConfirmModal } from '@/components/ConfirmModal';

export function SectionsPanel() {
  const activePageId = useEditorStore((s) => s.activePageId);
  const sectionOrder = useEditorStore((s) => s.sectionOrder);
  const sections = useEditorStore((s) => s.sections);
  const addSection = useEditorStore((s) => s.addSection);
  const removeSection = useEditorStore((s) => s.removeSection);
  const reorderSections = useEditorStore((s) => s.reorderSections);
  const setSelection = useEditorStore((s) => s.setSelection);
  const [removeTarget, setRemoveTarget] = useState(null);

  const ids = activePageId ? (sectionOrder[activePageId] ?? []) : [];

  const moveSection = (index, direction) => {
    const next = direction === 'up' ? index - 1 : index + 1;
    if (next < 0 || next >= ids.length || !activePageId) return;
    const reordered = [...ids];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    reorderSections(activePageId, reordered);
  };

  return (
    <>
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
          Use ↑↓ to reorder sections. Drag the bottom handle on the canvas to resize height.
        </p>
        <ul className="space-y-1">
          {ids.map((id, i) => {
            const sec = sections[id];
            if (!sec) return null;
            return (
              <li
                key={id}
                className="flex items-center gap-1 rounded border border-[var(--color-panel-border)] bg-black/20 px-1 py-1 text-xs"
              >
                <div className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    disabled={i === 0}
                    title="Move section up"
                    onClick={() => moveSection(i, 'up')}
                    className="rounded p-0.5 text-[var(--color-panel-muted)] hover:bg-white/10 hover:text-white disabled:opacity-25"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={i === ids.length - 1}
                    title="Move section down"
                    onClick={() => moveSection(i, 'down')}
                    className="rounded p-0.5 text-[var(--color-panel-muted)] hover:bg-white/10 hover:text-white disabled:opacity-25"
                  >
                    <ChevronDown size={12} />
                  </button>
                </div>
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate text-left hover:text-white"
                  onClick={() => setSelection([])}
                >
                  {sec.name || `Section ${i + 1}`}{' '}
                  <span className="text-[var(--color-panel-muted)]">({sec.height}px)</span>
                </button>
                {ids.length > 1 && (
                  <button
                    type="button"
                    title="Remove section"
                    onClick={() => setRemoveTarget({ id: sec.id, name: sec.name || `Section ${i + 1}` })}
                    className="shrink-0 rounded p-1 text-[var(--color-panel-muted)] hover:bg-white/10 hover:text-[var(--color-danger)]"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <ConfirmModal
        open={!!removeTarget}
        danger
        title={`Remove "${removeTarget?.name ?? ''}"?`}
        cancelLabel="Cancel"
        confirmLabel="Remove"
        onCancel={() => setRemoveTarget(null)}
        onConfirm={() => {
          if (removeTarget) removeSection(removeTarget.id);
          setRemoveTarget(null);
        }}
      />
    </>
  );
}
