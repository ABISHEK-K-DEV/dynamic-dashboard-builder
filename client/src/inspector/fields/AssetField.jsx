import { useMemo, useRef } from 'react';
import { Upload } from 'lucide-react';
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

export function AssetField({ label, value, onChange }) {
  const addAsset = useEditorStore((s) => s.addAsset);
  const projectAssets = useEditorStore((s) => s.project?.assets);
  const assets = useMemo(
    () => (projectAssets ?? []).filter((a) => a.kind === 'image'),
    [projectAssets],
  );
  const fileRef = useRef(null);
  const url = useAssetUrl(value);

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
    onChange(asset.id);
  };

  return (
    <div className="block text-xs">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-panel-muted)]">
        {label}
      </span>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-[var(--color-panel-border)] bg-black/30">
          {url ? (
            <img src={url} className="h-full w-full object-cover" alt="" />
          ) : (
            <span className="text-[9px] text-[var(--color-panel-muted)]">No image</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1 rounded border border-[var(--color-panel-border)] px-2 py-1 text-[10px] hover:bg-white/5"
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
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full rounded border border-[var(--color-panel-border)] bg-black/30 px-2 py-1.5 text-xs text-white outline-none focus:border-[var(--color-accent)]"
      >
        <option value="" className="bg-[#101012]">
          — select image —
        </option>
        {assets.map((a) => (
          <option key={a.id} value={a.id} className="bg-[#101012]">
            {a.name}
          </option>
        ))}
      </select>
    </div>
  );
}


