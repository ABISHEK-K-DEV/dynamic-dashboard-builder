function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function escapeAttr(s) {
  return escapeHtml(s);
}
function dataJSON(v) {
  return JSON.stringify(v).replace(/'/g, '&#39;');
}
export { dataJSON, escapeAttr, escapeHtml };
