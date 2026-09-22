import fs from 'node:fs';
import path from 'node:path';
const root = new URL('../../', import.meta.url);
const output = process.argv[2] || '/tmp/fitness-split-preview';
fs.mkdirSync(output, {recursive:true});
for (const file of ['index.html','sw.js','seed-data.csv']) fs.copyFileSync(new URL(file,root),path.join(output,file));
console.log(output);
