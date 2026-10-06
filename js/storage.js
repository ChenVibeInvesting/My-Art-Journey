// Storage layer. Views only talk to `ArtStore`, never to IndexedDB directly.
// To move to a real database / cloud storage later, provide another object with the
// same async methods (list, get, add, remove) and assign it to window.ArtStore.
//
// Entry shape:
//   { id, practiceId, date: 'YYYY-MM-DD', title, note, image: Blob, createdAt, sample }

(function () {
  const DB_NAME = 'my-art-journey';
  const STORE = 'artworks';
  let dbPromise;

  function db() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
          const s = req.result.createObjectStore(STORE, { keyPath: 'id' });
          s.createIndex('practiceId', 'practiceId');
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return dbPromise;
  }

  async function run(mode, fn) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const tx = d.transaction(STORE, mode);
      const result = fn(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(result.result !== undefined ? result.result : undefined);
      tx.onerror = () => reject(tx.error);
    });
  }

  const byTime = (a, b) =>
    a.date.localeCompare(b.date) || a.createdAt - b.createdAt;

  window.ArtStore = {
    // All entries for a practice, earliest -> most recent.
    async list(practiceId) {
      const all = await run('readonly', s => s.getAll());
      return all.filter(e => !practiceId || e.practiceId === practiceId).sort(byTime);
    },
    async get(id) { return run('readonly', s => s.get(id)); },
    async add(entry) {
      const full = { id: Util.newId(), createdAt: Date.now(), title: '', note: '', sample: false, ...entry };
      await run('readwrite', s => s.add(full));
      return full;
    },
    async remove(id) {
      await run('readwrite', s => s.delete(id));
      Util.forgetImageUrl(id);
    },
    async count() { return run('readonly', s => s.count()); },
  };
})();
