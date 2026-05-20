function cornerRadiusToCSS(r) {
  if (r == null) return void 0;
  if (typeof r === 'number') return r ? `${r}px` : void 0;
  const tl = r.tl ?? 0;
  const tr = r.tr ?? 0;
  const br = r.br ?? 0;
  const bl = r.bl ?? 0;
  if (!tl && !tr && !br && !bl) return void 0;
  return `${tl}px ${tr}px ${br}px ${bl}px`;
}
function borderToCSS(b) {
  if (!b || !b.width) return void 0;
  const s = `${b.width}px ${b.style ?? 'solid'} ${b.color}`;
  if (!b.sides) return s;
  const all = b.sides.top && b.sides.right && b.sides.bottom && b.sides.left;
  if (
    all ||
    (b.sides.top === void 0 &&
      b.sides.right === void 0 &&
      b.sides.bottom === void 0 &&
      b.sides.left === void 0)
  ) {
    return s;
  }
  return void 0;
}
function borderSidesToCSS(b) {
  if (!b || !b.width || !b.sides) return void 0;
  const all = b.sides.top && b.sides.right && b.sides.bottom && b.sides.left;
  if (all) return void 0;
  const parts = [];
  const v = `${b.width}px ${b.style ?? 'solid'} ${b.color}`;
  if (b.sides.top) parts.push(`border-top:${v}`);
  if (b.sides.right) parts.push(`border-right:${v}`);
  if (b.sides.bottom) parts.push(`border-bottom:${v}`);
  if (b.sides.left) parts.push(`border-left:${v}`);
  return parts.join(';');
}
function shadowToCSS(s) {
  if (!s) return void 0;
  return `${s.x}px ${s.y}px ${s.blur}px ${s.spread ?? 0}px ${s.color}`;
}
function paddingToCSS(p) {
  if (p == null) return void 0;
  if (typeof p === 'number') return p ? `${p}px` : void 0;
  const t = p.top ?? 0;
  const r = p.right ?? 0;
  const b = p.bottom ?? 0;
  const l = p.left ?? 0;
  if (!t && !r && !b && !l) return void 0;
  return `${t}px ${r}px ${b}px ${l}px`;
}
function transformOriginToCSS(o) {
  if (!o) return void 0;
  return `${o.x}% ${o.y}%`;
}
export {
  borderSidesToCSS,
  borderToCSS,
  cornerRadiusToCSS,
  paddingToCSS,
  shadowToCSS,
  transformOriginToCSS,
};
