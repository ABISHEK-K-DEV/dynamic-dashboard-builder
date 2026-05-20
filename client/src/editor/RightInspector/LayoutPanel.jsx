import { useEditorStore, currentBreakpoint } from '@/store/editorStore';
import { resolveResponsive, isOverriddenAt, clearOverrideAt } from '@/lib/responsive';
import { NumberField } from '@/inspector/fields/NumberField';
import { RotateCcw } from 'lucide-react';
export function LayoutPanel({ elementId }) {
  const element = useEditorStore((s) => s.elements[elementId]);
  const setGeometry = useEditorStore((s) => s.setGeometry);
  const updateElement = useEditorStore((s) => s.updateElement);
  const bp = useEditorStore(currentBreakpoint);
  if (!element) return null;
  const geom = resolveResponsive(element.geometry, bp);
  const set = (patch) => setGeometry(elementId, bp, patch);
  const overrideBadge = (key) =>
    bp !== 'base' && isOverriddenAt(element.geometry, bp, key) ? (
      <button
        onClick={() =>
          updateElement(elementId, {
            geometry: clearOverrideAt(element.geometry, bp, key),
          })
        }
        title="Reset to inherited value"
        className="ml-1 inline-flex text-[var(--color-accent)] hover:text-white"
      >
        <RotateCcw size={10} />
      </button>
    ) : null;
  return (
    <div className="space-y-2">
      {bp !== 'base' && (
        <div className="rounded bg-[var(--color-accent)]/15 px-2 py-1 text-[10px] text-[var(--color-accent)]">
          Editing {bp.toUpperCase()} overrides — base values are inherited unless set.
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <NumberField
            label={`X${overrideBadge('x') ? ' *' : ''}`}
            value={geom.x}
            unit="px"
            onChange={(v) =>
              set({
                x: v,
              })
            }
          />
          {overrideBadge('x')}
        </div>
        <div>
          <NumberField
            label={`Y${overrideBadge('y') ? ' *' : ''}`}
            value={geom.y}
            unit="px"
            onChange={(v) =>
              set({
                y: v,
              })
            }
          />
          {overrideBadge('y')}
        </div>
        <NumberField
          label="W"
          value={geom.w}
          min={1}
          unit="px"
          onChange={(v) =>
            set({
              w: v,
            })
          }
        />
        <NumberField
          label="H"
          value={geom.h ?? 0}
          min={0}
          unit="px"
          onChange={(v) =>
            set({
              h: v,
            })
          }
        />
      </div>
      <NumberField
        label="Rotation"
        value={geom.rot ?? 0}
        min={-360}
        max={360}
        step={1}
        unit="°"
        onChange={(v) =>
          set({
            rot: v,
          })
        }
      />
      <NumberField
        label="Z-index"
        value={element.zIndex}
        min={0}
        step={1}
        onChange={(v) =>
          updateElement(elementId, {
            zIndex: v,
          })
        }
      />
    </div>
  );
}
