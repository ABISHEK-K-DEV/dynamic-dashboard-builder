const registered = /* @__PURE__ */ new Set();
const googleStylesheets = /* @__PURE__ */ new Set();
async function registerFont(family, file) {
  if (typeof FontFace === 'undefined') return;
  if (registered.has(family)) return;
  try {
    const buf = await file.arrayBuffer();
    const face = new FontFace(family, buf);
    await face.load();
    document.fonts.add(face);
    registered.add(family);
  } catch (err) {
    console.warn('[fonts] failed to register', family, err);
  }
}
function addGoogleFontStylesheet(family) {
  if (typeof document === 'undefined') return;
  if (googleStylesheets.has(family)) return;
  const url = googleFontsUrl(family);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
  googleStylesheets.add(family);
}
function googleFontsUrl(family, weights = [400, 700]) {
  const fam = encodeURIComponent(family).replace(/%20/g, '+');
  const w = weights.join(';');
  return `https://fonts.googleapis.com/css2?family=${fam}:wght@${w}&display=swap`;
}
export { addGoogleFontStylesheet, googleFontsUrl, registerFont };
