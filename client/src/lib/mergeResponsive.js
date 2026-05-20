function mergeResponsiveOverrides(element, bp) {
  const r = element.responsive;
  if (!r || bp === 'base') return element;
  const layers = [];
  if (r.sm) layers.push(r.sm);
  if (bp === 'sm' && layers.length) return { ...element, ...mergeLayers(layers) };
  if (r.md) layers.push(r.md);
  if (bp === 'md' && layers.length) return { ...element, ...mergeLayers(layers) };
  if (r.lg) layers.push(r.lg);
  if (layers.length) return { ...element, ...mergeLayers(layers) };
  return element;
}
function mergeLayers(layers) {
  const out = {};
  for (const layer of layers) Object.assign(out, layer);
  return out;
}
export { mergeResponsiveOverrides };
