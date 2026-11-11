import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const data=JSON.parse(readFileSync(new URL('../docs-private/defects.json',import.meta.url),'utf8'));
assert.equal(data.length,18);
assert.equal(new Set(data.map(x=>x.id)).size,18);
const source=readFileSync(new URL('../src/main.tsx',import.meta.url),'utf8');
const flags=[...source.matchAll(/has\('([A-Z]\d{2})'\)/g)].map(x=>x[1]);
assert.deepEqual([...new Set(flags)].sort(),data.map(x=>x.id).sort(),'Dataset and implemented flag sets differ');
for(const c of ['N','V','O','K','F','S']) assert.equal(data.filter(x=>x.id.startsWith(c)).length,3);
for(const row of data){
  for(const field of ['id','category','state','selector','steps','expected','mutated','wcag','adjudication']) assert.ok(row[field]?.length,`${row.id}: ${field}`);
  assert.equal(row.confirmed,null,'No unperformed adjudication may be recorded as confirmed');
}
console.log('PASS: 18 unique candidates, six categories, three per category; adjudication pending.');
