import { useEffect, useRef } from 'react';
import {
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Group as GroupIcon,
  Ungroup,
} from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
export function ContextMenu({ pos, onClose }) {
  const ref = useRef(null);
  const selection = useEditorStore((s) => s.selection);
  const elements = useEditorStore((s) => s.elements);
  const updateElement = useEditorStore((s) => s.updateElement);
  const duplicateElements = useEditorStore((s) => s.duplicateElements);
  const removeElements = useEditorStore((s) => s.removeElements);
  const setSelection = useEditorStore((s) => s.setSelection);
  const setZIndex = useEditorStore((s) => s.setZIndex);
  useEffect(() => {
    const onDown = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);
  if (selection.length === 0) return null;
  const allLocked = selection.every((id) => elements[id]?.locked);
  const anyHidden = selection.some((id) => elements[id]?.visible?.base === false);
  const canGroup = selection.length > 1;
  const allInSameGroup =
    selection.length > 1 &&
    selection.every((id) => {
      const p = elements[id]?.parentId;
      return p && p === elements[selection[0]]?.parentId;
    });
  const action = (fn) => () => {
    fn();
    onClose();
  };
  const samePageElements = () => {
    const pid = elements[selection[0]]?.pageId;
    return Object.values(elements).filter((e) => e.pageId === pid);
  };
  const bringForward = () => {
    const all = samePageElements().sort((a, b) => a.zIndex - b.zIndex);
    for (const id of selection) {
      const el = elements[id];
      if (!el) continue;
      const above = all.find((e) => e.zIndex > el.zIndex);
      if (above) setZIndex(id, above.zIndex + 1);
    }
  };
  const sendBackward = () => {
    const all = samePageElements().sort((a, b) => b.zIndex - a.zIndex);
    for (const id of selection) {
      const el = elements[id];
      if (!el) continue;
      const below = all.find((e) => e.zIndex < el.zIndex);
      if (below) setZIndex(id, Math.max(0, below.zIndex - 1));
    }
  };
  const bringToFront = () => {
    const max = samePageElements().reduce((m, e) => Math.max(m, e.zIndex), 0);
    selection.forEach((id, i) => setZIndex(id, max + 1 + i));
  };
  const sendToBack = () => {
    const min = samePageElements().reduce((m, e) => Math.min(m, e.zIndex), 0);
    selection.forEach((id, i) => setZIndex(id, Math.max(0, min - selection.length + i)));
  };
  return (
    <div
      ref={ref}
      role="menu"
      style={{
        left: pos.x,
        top: pos.y,
        position: 'fixed',
        zIndex: 9999,
      }}
      className="min-w-[200px] rounded-md border border-[var(--color-panel-border)] bg-[#0f0f10] py-1 text-xs text-white shadow-2xl"
    >
      <Item
        icon={<Copy size={12} />}
        label="Duplicate"
        shortcut="⌘D"
        onClick={action(() => {
          const newIds = duplicateElements(selection);
          if (newIds.length) setSelection(newIds);
        })}
      />
      <Item
        icon={<Trash2 size={12} />}
        label="Delete"
        shortcut="⌫"
        onClick={action(() => removeElements(selection))}
        danger
      />
      <Separator />
      <Item
        icon={anyHidden ? <Eye size={12} /> : <EyeOff size={12} />}
        label={anyHidden ? 'Show' : 'Hide'}
        onClick={action(() => {
          for (const id of selection) {
            const el = elements[id];
            if (!el) continue;
            const cur = el.visible ?? {
              base: true,
            };
            updateElement(id, {
              visible: {
                ...cur,
                base: anyHidden ? true : false,
              },
            });
          }
        })}
      />
      <Item
        icon={allLocked ? <Unlock size={12} /> : <Lock size={12} />}
        label={allLocked ? 'Unlock' : 'Lock'}
        onClick={action(() => {
          for (const id of selection)
            updateElement(id, {
              locked: !allLocked,
            });
        })}
      />
      <Separator />
      <Item
        icon={<ArrowUp size={12} />}
        label="Bring forward"
        shortcut="]"
        onClick={action(bringForward)}
      />
      <Item
        icon={<ArrowDown size={12} />}
        label="Send backward"
        shortcut="["
        onClick={action(sendBackward)}
      />
      <Item
        icon={<ChevronsUp size={12} />}
        label="Bring to front"
        shortcut="⌘]"
        onClick={action(bringToFront)}
      />
      <Item
        icon={<ChevronsDown size={12} />}
        label="Send to back"
        shortcut="⌘["
        onClick={action(sendToBack)}
      />
      <Separator />
      <Item
        icon={<GroupIcon size={12} />}
        label="Group"
        shortcut="⌘G"
        disabled={!canGroup}
        onClick={action(() => useEditorStore.getState().groupSelection())}
      />
      <Item
        icon={<Ungroup size={12} />}
        label="Ungroup"
        shortcut="⇧⌘G"
        disabled={!allInSameGroup}
        onClick={action(() => useEditorStore.getState().ungroupSelection())}
      />
    </div>
  );
}
function Item({ icon, label, shortcut, onClick, disabled, danger }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left transition-colors ${disabled ? 'cursor-not-allowed opacity-40' : danger ? 'hover:bg-[var(--color-danger)]/15 hover:text-[var(--color-danger)]' : 'hover:bg-white/10'}`}
    >
      <span className="flex items-center gap-2">
        <span className="text-[var(--color-panel-muted)]">{icon}</span>
        {label}
      </span>
      {shortcut && <span className="text-[10px] text-[var(--color-panel-muted)]">{shortcut}</span>}
    </button>
  );
}
function Separator() {
  return <div className="my-1 h-px bg-[var(--color-panel-border)]" />;
}
