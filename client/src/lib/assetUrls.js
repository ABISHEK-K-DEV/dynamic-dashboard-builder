import { useEditorStore } from '@/store/editorStore';

/** Resolve image URL from project asset (dataUrl stored in MySQL snapshot). */
export function useAssetUrl(assetId) {
  return useEditorStore((s) => {
    if (!assetId) return null;
    const asset = s.project?.assets?.find((a) => a.id === assetId);
    return asset?.dataUrl ?? asset?.url ?? null;
  });
}
