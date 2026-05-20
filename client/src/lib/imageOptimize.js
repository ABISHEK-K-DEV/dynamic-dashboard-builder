async function optimizeImage(file, opts = {}) {
  const passthrough = () => ({
    blob: file,
    mime: file.type || 'application/octet-stream',
    savedBytes: 0,
  });
  if (typeof createImageBitmap !== 'function') return passthrough();
  if (!file.type.startsWith('image/')) return passthrough();
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return passthrough();
  const maxEdge = opts.maxEdge ?? 2400;
  const quality = opts.quality ?? 0.85;
  let bmp;
  try {
    bmp = await createImageBitmap(file);
  } catch {
    return passthrough();
  }
  const scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height));
  const targetW = Math.round(bmp.width * scale);
  const targetH = Math.round(bmp.height * scale);
  const canvas =
    typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(targetW, targetH)
      : document.createElement('canvas');
  if (canvas instanceof HTMLCanvasElement) {
    canvas.width = targetW;
    canvas.height = targetH;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx || !('drawImage' in ctx)) {
    bmp.close?.();
    return passthrough();
  }
  ctx.drawImage(bmp, 0, 0, targetW, targetH);
  bmp.close?.();
  let blob = null;
  try {
    if ('convertToBlob' in canvas) {
      blob = await canvas.convertToBlob({ type: 'image/webp', quality });
    } else {
      blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/webp', quality),
      );
    }
  } catch {
    return passthrough();
  }
  if (!blob) return passthrough();
  if (blob.size >= file.size) return passthrough();
  return {
    blob,
    mime: 'image/webp',
    w: targetW,
    h: targetH,
    savedBytes: file.size - blob.size,
  };
}
export { optimizeImage };
