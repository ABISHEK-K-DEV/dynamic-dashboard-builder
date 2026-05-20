function resolveResponsive(r, bp) {
  const out = { ...r.base };
  if (bp === 'base') return out;
  if (r.sm) Object.assign(out, r.sm);
  if (bp === 'sm') return out;
  if (r.md) Object.assign(out, r.md);
  if (bp === 'md') return out;
  if (r.lg) Object.assign(out, r.lg);
  return out;
}
function patchResponsive(r, bp, patch) {
  if (bp === 'base') {
    return { ...r, base: { ...r.base, ...patch } };
  }
  return { ...r, [bp]: { ...(r[bp] ?? {}), ...patch } };
}
function isOverriddenAt(r, bp, key) {
  if (bp === 'base') return key in r.base;
  const layer = r[bp];
  return !!layer && key in layer;
}
function clearOverrideAt(r, bp, key) {
  const layer = r[bp];
  if (!layer || !(key in layer)) return r;
  const next = { ...r };
  const cloned = { ...layer };
  delete cloned[key];
  if (Object.keys(cloned).length === 0) delete next[bp];
  else next[bp] = cloned;
  return next;
}
export { clearOverrideAt, isOverriddenAt, patchResponsive, resolveResponsive };
