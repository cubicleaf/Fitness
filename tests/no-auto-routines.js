// Fails if the app makes a routine on its own. Run in the app page's console (or the Browser pane):
//   noAutoRoutinesTest('seed')  -> seeds legacy split data, then RELOAD the page
//   noAutoRoutinesTest('check') -> asserts; returns "all passed" or the list of results.
// Covers: boot with legacy split data, weekday/date split assignment, one-time cleanup.
// Does NOT run the CSV importer; it only asserts the source no longer has the routine-making helper.
window.noAutoRoutinesTest = async phase => {
  const out = [], check = (ok, msg) => out.push({ ok: !!ok, msg });
  if (phase === 'seed') {
    for (let i = 0; i < 7; i++) await dbOps.templates.set(i, ['push','pull','legs','rest','','',''][i]);
    await dbOps.dayNotes.set('__split_2030-01-01', 'push');
    await dbOps.dayNotes.set('__categories__', JSON.stringify(['push','pull','legs']));
    for (const r of await dbOps.week.getAll()) await new Promise(res => { const t = db.transaction('week','readwrite'); t.objectStore('week').delete(r.dayOfWeek); t.oncomplete = res; });
    for (const r of await dbOps.routines.getAll()) await dbOps.routines.delete(r.id);
    return 'seeded';
  }
  check((await dbOps.routines.getAll()).length + (await dbOps.week.getAll()).length === 0, 'booting with legacy splits makes no routines or week records');
  try {
    const cats = ['push','pull','legs'];
    await saveAssignment('week', 1, splitAssignment('Push'));
    await saveAssignment('week', 2, splitAssignment('Rest'));
    await saveAssignment('day', '2099-01-05', splitAssignment('Legs'));
    const a = await resolveSplitDate('2099-01-05', cats);
    check((await dbOps.routines.getAll()).length === 0, 'assigning weekday and date splits makes no routines');
    check(a && a.mode === 'split' && a.splitName === 'legs', 'date split still resolves to Legs');
    const w1 = await dbOps.week.get(1), w2 = await dbOps.week.get(2);
    check(w1.split === 'push' && w2.split === '__rest__', 'weekday records hold the split themselves');
    await dbOps.routines.put({ id: 'rt_mig_push', name: 'push', mode: 'split', splitName: 'push', auto: true, manualOrder: null, createdAt: 1 });
    await dbOps.routines.put({ id: 'rt_x', name: 'Mine', mode: 'lineup', activityIds: [], manualOrder: null, createdAt: 2 });
    await dbOps.week.set(4, 'rt_mig_push');
    const res = await clearAutoRoutines(), left = (await dbOps.routines.getAll()).map(r => r.id), w4 = await dbOps.week.get(4);
    check(res.count === 1 && left.join() === 'rt_x', 'cleanup removes only the hidden routine');
    check(w4.routineId === null && w4.split === 'push', 'cleanup keeps that weekday on Push');
    // a date can hold a split AND a started routine, independently
    await dbOps.routines.put({ id: 'rt_m', name: 'Morning', mode: 'lineup', activityIds: [], manualOrder: null, createdAt: 3 });
    await mergeDayRoutine('2099-02-01', { split: splitAssignment('Pull').split });
    await mergeDayRoutine('2099-02-01', { routineId: 'rt_m' });
    const sp = await resolveSplitDate('2099-02-01', cats), st = await resolveStartedRoutine('2099-02-01');
    check(sp && sp.splitName === 'pull' && st && st.id === 'rt_m', 'a date keeps its split and a started routine together');
    await mergeDayRoutine('2099-02-01', { routineId: null });
    check((await resolveStartedRoutine('2099-02-01')) === null && (await resolveSplitDate('2099-02-01', cats))?.splitName === 'pull', 'stopping a routine leaves the split');
    await mergeDayRoutine('2099-02-04', { routineId: 'rt_m' }); // a Wednesday: no weekday split set
    check((await resolveStartedRoutine('2099-02-04'))?.id === 'rt_m' && (await resolveSplitDate('2099-02-04', cats)) === null, 'a started routine alone does not invent a split');
    await dbOps.routines.delete('rt_x'); await dbOps.routines.delete('rt_m');
  } catch (e) { check(false, 'new assignment helpers missing or threw: ' + e); }
  const src = await (await fetch(location.pathname)).text();
  check(!/ensureSplitRoutine|migrateRoutineSystem\(\)/.test(src.replace(/\/\/.*$/gm, '')), 'source has no routine-making helper or migration call');
  return out.every(r => r.ok) ? 'all passed' : out;
};
