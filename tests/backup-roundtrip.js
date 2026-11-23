// Export -> wipe -> import round trip, compared field by field. Run in the app page (demo mode on):
//   1. Patch Blob to capture the CSV, click Settings > Data > "Export Data to CSV".
//   2. backupRoundtrip(csv, before) where before = await dumpAll() taken at export time.
// Ignored on purpose (regenerated on import, not backup data): sets.createdAt, sessionNotes.updatedAt, all ids of sets/notes.
// Known not restored: legacy `templates` store (only used when a file has no routine week).
window.dumpAll = async () => { const o = {}; for (const n of [...db.objectStoreNames]) o[n] = await new Promise((res, rej) => { const r = db.transaction(n).objectStore(n).getAll(); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); return o; };
window.backupRoundtrip = async (csv, A) => {
  for (const n of [...db.objectStoreNames]) await idbRun(n, 'readwrite', s => s.clear(), () => undefined);
  await importWorkoutCSV(csv);
  const B = await dumpAll(), sj = x => JSON.stringify(Object.fromEntries(Object.entries(x).sort()));
  const strip = (arr, keys) => arr.map(x => { const y = { ...x }; keys.forEach(k => delete y[k]); return sj(y); });
  const diff = (a, b) => { const m = new Map(); a.forEach(x => m.set(x, (m.get(x) || 0) + 1)); b.forEach(x => m.set(x, (m.get(x) || 0) - 1)); return [...m].filter(([, v]) => v).length; };
  const res = {};
  for (const k of Object.keys(A)) { const ig = { sets: ['id', 'createdAt'], sessionNotes: ['id', 'updatedAt'] }[k] || []; res[k] = diff(strip(A[k], ig), strip(B[k], ig)); }
  return res; // every value 0 = identical; templates is expected to differ
};
