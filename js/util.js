// Small helpers shared by all views.
window.el = function el(tag, props = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'style') n.style.cssText = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    n.append(kid.nodeType ? kid : document.createTextNode(kid));
  }
  return n;
};

window.Util = {
  todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },
  // Parse YYYY-MM-DD as a local date (avoids timezone day-shift).
  parseISO(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  },
  formatDate(iso, opts = { month: 'long', day: 'numeric', year: 'numeric' }) {
    return Util.parseISO(iso).toLocaleDateString(undefined, opts);
  },
  monthKey(iso) { return iso.slice(0, 7); },
  randomPrompt(exclude) {
    const pool = PROMPTS.filter(p => p !== exclude);
    return pool[Math.floor(Math.random() * pool.length)];
  },
  newId() {
    return (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()) + Math.random().toString(16).slice(2);
  },
  // Object URLs for stored image blobs, cached so each is created once.
  _urls: new Map(),
  imageUrl(entry) {
    if (!Util._urls.has(entry.id)) Util._urls.set(entry.id, URL.createObjectURL(entry.image));
    return Util._urls.get(entry.id);
  },
  forgetImageUrl(id) {
    const u = Util._urls.get(id);
    if (u) URL.revokeObjectURL(u);
    Util._urls.delete(id);
  },
  // Shrink big phone photos so storage stays light. Falls back to the original file.
  async prepareImage(file, maxSide = 1800) {
    try {
      const bmp = await createImageBitmap(file);
      const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas');
      c.width = Math.round(bmp.width * scale);
      c.height = Math.round(bmp.height * scale);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.9));
      return blob || file;
    } catch { return file; }
  },
};
