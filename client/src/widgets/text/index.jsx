import { useEffect, useRef } from 'react';
import { Type } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

function TextEditor({ element, onEdit }) {
  const setEditingId = useEditorStore((s) => s.setEditingId);
  const ref = useRef(null);
  const editing = !!onEdit;

  useEffect(() => {
    if (!editing || !ref.current) return;
    const node = ref.current;
    node.innerHTML = element.html || '';
    node.focus();
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(node);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        node.blur();
        setEditingId(null);
      }
    };
    node.addEventListener('keydown', onKey);
    return () => node.removeEventListener('keydown', onKey);
  }, [editing, element.id]);

  const style = {
    fontFamily: element.fontFamily,
    fontSize: `${element.fontSize}px`,
    fontWeight: element.bold ? 700 : element.fontWeight,
    fontStyle: element.italic ? 'italic' : 'normal',
    color: element.color,
    textAlign: element.align,
    lineHeight: element.lineHeight,
  };

  const save = (html) => {
    onEdit?.({ html });
  };

  if (editing) {
    return (
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-text-editable
        className="h-full w-full cursor-text overflow-auto bg-white/95 p-2 outline-none ring-2 ring-[var(--color-accent)]"
        style={style}
        onMouseDown={(e) => e.stopPropagation()}
        onInput={(e) => save(e.currentTarget.innerHTML)}
        onBlur={(e) => {
          save(e.currentTarget.innerHTML);
          setEditingId(null);
        }}
      />
    );
  }

  const Tag = element.tag || 'p';
  return (
    <Tag
      className="m-0 h-full w-full overflow-hidden p-1"
      style={style}
      dangerouslySetInnerHTML={{ __html: element.html || '<p>Double-click to edit</p>' }}
    />
  );
}

export const textWidget = {
  kind: 'text',
  label: 'Text',
  icon: Type,
  category: 'basic',
  defaultProps: () => ({
    html: 'Double-click to edit',
    tag: 'p',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 18,
    fontWeight: 400,
    color: '#1a1a1c',
    align: 'left',
    lineHeight: 1.4,
    bold: false,
    italic: false,
  }),
  defaultGeometry: () => ({
    base: { x: 24, y: 24, w: 280, h: 80 },
  }),
  schema: {
    html: {
      kind: 'text',
      label: 'Text',
      multiline: true,
    },
    fontSize: {
      kind: 'number',
      label: 'Font size',
      min: 10,
      max: 72,
      step: 1,
      unit: 'px',
    },
    bold: { kind: 'boolean', label: 'Bold' },
    italic: { kind: 'boolean', label: 'Italic' },
    color: { kind: 'color', label: 'Color' },
    align: {
      kind: 'select',
      label: 'Align',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
    },
  },
  Editor: TextEditor,
};
