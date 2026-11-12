import {readFile,readdir} from 'node:fs/promises';
import {database} from '../lib/db.mjs';
const sql=database();
for(const f of (await readdir('migrations')).filter(x=>x.endsWith('.sql')).sort()){
 const source=await readFile('migrations/'+f,'utf8'),blocks=[];
 const masked=source.replace(/\$\$[\s\S]*?\$\$/g,s=>{blocks.push(s);return '@@BLOCK'+(blocks.length-1)+'@@';});
 const statements=masked.split(';').map(s=>s.replace(/@@BLOCK(\d+)@@/g,(_,i)=>blocks[i]).trim()).filter(Boolean);
 await sql.transaction(statements.map(s=>sql.query(s)));console.log('Applied',f);
}
