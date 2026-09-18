// Pure offline prototype. Catalog is injected so the eventual app can inline it.
export const defaultCategories = ['push', 'pull', 'legs', 'core', 'cardio'];
const abbreviations = { kb: 'kettlebell', db: 'dumbbell', bb: 'barbell', ohp: 'overhead press', rdl: 'romanian deadlift' };
export function normalize(value) {
  return String(value ?? '').toLowerCase().replace(/benchpress/g, 'bench press')
    .replace(/[’']/g, '').replace(/[+&/]/g, ' combination ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().split(/\s+/)
    .map(t => abbreviations[t] || t).join(' ').split(' ')
    .map(t => t === 'ups' ? 'up' : t.length > 3 && t.endsWith('s') && !t.endsWith('ss') ? t.slice(0, -1) : t).join(' ');
}
const categoryKey = value => ({ 'upper body': 'upper', 'lower body': 'lower', 'push day': 'push', 'pull day': 'pull', 'leg day': 'legs', leg: 'legs', arm: 'arms', shoulder: 'shoulders', ab: 'abs' }[normalize(value)] || normalize(value));
function distance(a, b) {
  let prev = Array.from({length:b.length+1}, (_,i)=>i);
  for(let i=1;i<=a.length;i++) {
    const next=[i];
    for(let j=1;j<=b.length;j++) next[j]=Math.min(next[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]!==b[j-1]));
    prev=next;
  }
  return prev[b.length];
}
export function classify({name, categories=defaultCategories, confirmedSplits, exerciseSplitOverrides={}}, catalog) {
  const abstain = (reason, candidates=[]) => ({status:'ask', splits:[], reason, candidates, confidence:null});
  // Caller must supply an explicit saved choice for THIS activity, never inferred history.
  if (confirmedSplits !== undefined) {
    if (!Array.isArray(confirmedSplits)) throw new TypeError('confirmedSplits must be an array');
    if (confirmedSplits.some(s=>!categories.includes(s))) return abstain('A saved split no longer exists; review the assignment.');
    return {status:'confirmed',splits:[...confirmedSplits],reason:'Your explicit choice for this activity.',confidence:null};
  }
  const input=normalize(name);
  if (!input) return abstain('Enter an activity name.');
  const matches=catalog.filter(e=>[e.name,...e.aliases].some(a=>normalize(a)===input));
  if (matches.length !== 1) {
    const candidates=catalog.map(e=>({id:e.id,name:e.name,distance:Math.min(...[e.name,...e.aliases].map(a=>distance(input,normalize(a))))}))
      .filter(e=>e.distance<=Math.max(1,Math.floor(input.length*0.2))).sort((a,b)=>a.distance-b.distance).slice(0,3);
    return abstain(matches.length ? 'Multiple catalog matches; confirm the activity.' : 'No verified exact name or alias; confirm the activity.', candidates);
  }
  const exercise=matches[0];
  // Explicit per-user mapping, keyed by stable catalog ID. Empty means intentionally unassigned.
  if (Object.hasOwn(exerciseSplitOverrides, exercise.id)) {
    const saved=exerciseSplitOverrides[exercise.id];
    if (!Array.isArray(saved)) throw new TypeError('Exercise override must be an array');
    if (saved.some(s=>!categories.includes(s))) return abstain('A saved split no longer exists; review the assignment.');
    return {status:'confirmed',splits:[...saved],exerciseId:exercise.id,reason:'Your saved split mapping for this recognized activity.',confidence:null};
  }
  if (!exercise.splits.length) return abstain('Recognized exercise; its split depends on your program.',[{id:exercise.id,name:exercise.name}]);
  const splits=categories.filter(c=>exercise.splits.some(s=>categoryKey(s)===categoryKey(c)));
  if (!splits.length) return abstain('Recognized exercise; your split labels need a mapping.',[{id:exercise.id,name:exercise.name}]);
  return {status:'suggest',splits,exerciseId:exercise.id,reason:`Split classification based on ${exercise.name}; exact setup is not inferred.`,source:exercise.source,confidence:null};
}
