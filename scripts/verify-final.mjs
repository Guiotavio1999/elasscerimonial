import {readFile} from 'node:fs/promises';import assert from 'node:assert/strict';import handler from '../api/app.js';import {recordsAction} from '../lib/records.mjs';import {database} from '../lib/db.mjs';
if(process.env.APP_ENV!=='test')throw Error('Test environment required');
const qa=JSON.parse(await readFile('.qa-browser.json','utf8'));
const token='';
async function call(action,body){let result;const req={method:'POST',url:'/api/app?action='+action,headers:{authorization:'Bearer '+token},body},res={statusCode:200,setHeader(){},status(n){this.statusCode=n;return this;},json(v){result={status:this.statusCode,value:v};}};if(action==='records')await recordsAction(req,res,database(),{role:'admin',email:qa.admin.email,event_ids:[]},body,new URL(req.url,'http://localhost'));else await handler(req,res);return result;}
const sql=database();const [event]=await sql`SELECT * FROM records WHERE id=${qa.event_id}`;
let r=await call('records',{kind:'events',id:event.id,version:event.version,event_id:event.id,data:{...event.data,title:'QA Casamento A revisado'}});assert.equal(r.status,200,JSON.stringify(r));assert.equal(r.value.data.title,'QA Casamento A revisado');assert.equal(r.value.event_id,null);
for(const fields of [{email:'invalid'},{date:'not-a-date'},{guests:-1}]){const result=await call('contact',{name:'QA inválido',phone:'31999990000',consent:true,...fields});assert.equal(result.status,400);}
console.log('Final event editing and public input checks passed.');
