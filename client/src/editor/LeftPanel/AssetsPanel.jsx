import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { useEditorStore } from '@/store/editorStore';
import { useAssetUrl } from '@/lib/assetUrls';
import { uid } from '@/lib/id';

function readDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function DraggableAsset({ asset }) {
  const url = useAssetUrl(asset.id);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `asset-${asset.id}`,
    data: { kind: 'asset-tile', assetId: asset.id, assetKind: 'image' },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      className={`flex flex-col overflow-hidden rounded border border-[var(--color-panel-border)] bg-black/20 ${isDragging ? 'opacity-30' : ''}`}
      title="Drag onto canvas"
    >
      {url ? (
        <img src={url} alt={asset.name} className="aspect-square w-full object-cover" />
      ) : (
        <span className="flex aspect-square items-center justify-center text-[10px] text-[var(--color-panel-muted)]">
          Image
        </span>
      )}
      <span className="truncate px-1 py-0.5 text-[9px] text-[var(--color-panel-muted)]">{asset.name}</span>
    </button>
  );
}

export function AssetsPanel() {
  const project = useEditorStore((s) => s.project);
  const addAsset = useEditorStore((s) => s.addAsset);
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const images = (project?.assets ?? []).filter((a) => a.kind === 'image');

  const onFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const dataUrl = await readDataUrl(file);
        addAsset({
          id: uid('asset'),
          kind: 'image',
          name: file.name,
          mime: file.type,
          size: file.size,
          dataUrl,
        });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void onFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded border border-dashed border-[var(--color-panel-border)] py-3 text-xs text-[var(--color-panel-muted)] hover:border-[var(--color-accent)] hover:text-white disabled:opacity-50"
      >
        <Upload size={14} />
        {uploading ? 'Uploading…' : 'Upload image'}
      </button>
      <p className="text-[10px] text-[var(--color-panel-muted)]">
        Drag an image onto the canvas, or pick one in the inspector after adding an Image widget.
      </p>
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-1.5">
          {images.map((a) => (
            <DraggableAsset key={a.id} asset={a} />
          ))}
        </div>
      )}
    </div>
  );
}
