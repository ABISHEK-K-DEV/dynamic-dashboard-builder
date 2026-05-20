import { useRef } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
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

function ImageEditor({ element, onEdit }) {
  const addAsset = useEditorStore((s) => s.addAsset);
  const updateElement = useEditorStore((s) => s.updateElement);
  const fileRef = useRef(null);
  const url = useAssetUrl(element.assetId);

  const onUpload = async (files) => {
    const file = files?.[0];
    if (!file?.type.startsWith('image/')) return;
    const dataUrl = await readDataUrl(file);
    const asset = {
      id: uid('asset'),
      kind: 'image',
      name: file.name,
      mime: file.type,
      size: file.size,
      dataUrl,
    };
    addAsset(asset);
    updateElement(element.id, { assetId: asset.id });
  };

  if (!url) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded border border-dashed border-neutral-300 bg-neutral-100 p-2">
        <ImageIcon size={28} className="text-neutral-400" />
        <p className="text-center text-[10px] text-neutral-500">Upload or pick image in inspector</p>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1 rounded bg-[var(--color-accent)] px-2 py-1 text-[10px] text-white"
        >
          <Upload size={12} /> Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            void onUpload(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={element.alt || ''}
      draggable={false}
      className="block h-full w-full select-none object-cover"
      style={{
        objectFit: element.objectFit ?? 'cover',
        borderRadius: element.radius ? `${element.radius}px` : undefined,
      }}
    />
  );
}

export const imageWidget = {
  kind: 'image',
  label: 'Image',
  icon: ImageIcon,
  category: 'basic',
  defaultProps: () => ({
    assetId: null,
    alt: '',
    objectFit: 'cover',
    radius: 0,
  }),
  defaultGeometry: () => ({
    base: { x: 24, y: 24, w: 200, h: 200 },
  }),
  schema: {
    assetId: {
      kind: 'asset',
      label: 'Image',
      accept: 'image',
    },
    alt: { kind: 'text', label: 'Alt text' },
    objectFit: {
      kind: 'select',
      label: 'Fit',
      options: [
        { value: 'cover', label: 'Cover' },
        { value: 'contain', label: 'Contain' },
        { value: 'fill', label: 'Fill' },
      ],
    },
  },
  Editor: ImageEditor,
};
