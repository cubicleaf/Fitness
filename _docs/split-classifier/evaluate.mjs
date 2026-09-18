import fs from 'node:fs';
import assert from 'node:assert/strict';
import {classify,normalize} from './classifier.mjs';
const read = file => JSON.parse(fs.readFileSync(new URL(file,import.meta.url),'utf8'));
const catalog=read('catalog.json'),cases=read('cases.json');
const results=cases.map(c=>{
 const result=classify(c,catalog);
 const correct=c.expected===null ? result.status==='ask' : result.status!=='ask' && JSON.stringify([...result.splits].sort())===JSON.stringify([...c.expected].sort());
 return {...c,result,correct};
});
// Structural guards that protect future catalog maintenance and caller data.
const keys=new Map();
for(const e of catalog) for(const alias of [e.name,...e.aliases]) {
 const key=normalize(alias);assert.ok(!keys.has(key)||keys.get(key)===e.id,`Alias collision: ${alias}`);keys.set(key,e.id);
}
const input={name:'bench press',categories:['push'],confirmedSplits:['push']};
const before=JSON.stringify(input); classify(input,catalog);assert.equal(JSON.stringify(input),before);
const suggested=results.filter(r=>r.result.status==='suggest');
const eligible=results.filter(r=>r.expected!==null && r.group!=='override');
function wilson(k,n) {if(!n)return null; const z=1.96,p=k/n;return (p+z*z/(2*n)-z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n)))/(1+z*z/n);}
const report={date:'2026-09-17',qualification:'Development fixtures authored by the same agent as the classifier; not independent validation or a measured production confidence.',catalogSize:catalog.length,total:results.length,passed:results.filter(r=>r.correct).length,suggestions:suggested.length,correctSuggestions:suggested.filter(r=>r.correct).length,precision:suggested.length?suggested.filter(r=>r.correct).length/suggested.length:null,coverage:results.filter(r=>r.group!=='override'&&r.result.status==='suggest').length/results.filter(r=>r.group!=='override').length,answerableCoverage:eligible.filter(r=>r.result.status==='suggest').length/eligible.length,descriptiveWilsonLower95:wilson(suggested.filter(r=>r.correct).length,suggested.length),failures:results.filter(r=>!r.correct),results};
fs.writeFileSync(new URL('results.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,results:undefined},null,2));
if(report.failures.length)process.exitCode=1;
