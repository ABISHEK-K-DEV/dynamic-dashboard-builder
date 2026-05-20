import { useEffect, useRef, useState } from 'react';
import { GripHorizontal } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { useAssetUrl } from '@/lib/assetUrls';
export function SectionBlock({ section, children }) {
  const updateSection = useEditorStore((s) => s.updateSection);
  const setSelection = useEditorStore((s) => s.setSelection);
  const zoom = useEditorStore((s) => s.viewport.zoom);
  const bgUrl = useAssetUrl(section.backgroundAssetId ?? null);
  const ref = useRef(null);
  const [drag, setDrag] = useState(null);
  useEffect(() => {
    if (!drag) return;
    const onMove = (e) => {
      const next = Math.max(80, Math.round(drag.startH + (e.clientY - drag.startY) / zoom));
      updateSection(section.id, {
        height: next,
      });
    };
    const onUp = () => setDrag(null);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [drag, section.id, updateSection, zoom]);
  const bgStyle = bgUrl
    ? {
        backgroundImage: `url("${bgUrl}")`,
        backgroundSize: section.backgroundSize ?? 'cover',
        backgroundPosition: section.backgroundPosition ?? 'center',
        backgroundRepeat: section.backgroundRepeat ?? 'no-repeat',
        backgroundColor: section.background,
      }
    : {
        background: section.background,
      };
  return (
    <div
      ref={ref}
      data-section-id={section.id}
      className="relative w-full"
      style={{
        height: section.height,
        ...bgStyle,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setSelection([]);
      }}
    >
      <span
        className="pointer-events-none absolute left-2 top-2 z-10 select-none rounded bg-white/85 px-2 py-0.5 text-[10px] font-medium text-neutral-700 opacity-0 shadow-sm transition-opacity hover:opacity-100"
        style={{
          transition: 'opacity 0.15s',
        }}
      >
        {section.name}
        {section.slug ? ` \xB7 #${section.slug}` : ''}
      </span>
      {children}
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag({
            startY: e.clientY,
            startH: section.height,
          });
        }}
        className="absolute inset-x-0 -bottom-1 z-20 flex h-2 cursor-row-resize items-center justify-center"
        title="Drag to resize section height"
      >
        <span className="rounded bg-[var(--color-accent)] px-1.5 py-0 text-[8px] font-bold text-white opacity-0 transition-opacity hover:opacity-100">
          <GripHorizontal size={10} className="inline" /> {section.height}px
        </span>
      </div>
    </div>
  );
}
