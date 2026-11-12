import {readMedia,manageMedia} from '../lib/media.mjs';
import {database,fail} from '../lib/db.mjs';
import {authenticate} from '../lib/access.mjs';
import {publicAction} from '../lib/public.mjs';
import {recordsAction} from '../lib/records.mjs';
import {operations} from '../lib/operations.mjs';
import {documents} from '../lib/documents.mjs';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 try{
  const url=new URL(req.url,'http://localhost');const action=url.searchParams.get('action')||'me';
  if(!['GET','POST','DELETE'].includes(req.method))fail('Método não permitido.',405);
  if(req.method!=='GET'&&req.headers.origin){const allowed=[process.env.APP_ORIGIN,...(process.env.EXTRA_ORIGINS||'').split(','),...[process.env.VERCEL_URL,process.env.VERCEL_BRANCH_URL].filter(Boolean).map(host=>'https://'+host)];if(process.env.NODE_ENV!=='production')allowed.push('http://localhost:3000');if(!allowed.includes(req.headers.origin))fail('Origem não autorizada.',403);}
  let body=req.body||{};if(typeof body==='string'){if(Buffer.byteLength(body)>3000000)fail('Envio muito grande.',413);try{body=JSON.parse(body);}catch{fail('Formato inválido.');}}
  if(Buffer.byteLength(JSON.stringify(body))>3000000)fail('Envio muito grande.',413);
  const sql=database();if(action==='media'&&req.method==='GET'&&url.searchParams.get('id'))return await readMedia(req,res,sql,url);if(await publicAction(action,req,res,sql,body,url))return;
  const user=await authenticate(req,sql);
  if(action==='media')return await manageMedia(req,res,sql,user,body);
  if(action==='records')return await recordsAction(req,res,sql,user,body,url);
  if(action==='documents')return await documents(req,res,sql,user,body,url);
  return await operations(action,req,res,sql,user,body,url);
 }catch(e){const status=e.status||(e.code==='P0001'?400:(e.code==='23505'||e.code==='23503')?409:500);if(status===500)console.error('Request failed',{code:e.code||e.name});res.status(status).json({error:status===500?'Não foi possível concluir. Tente novamente.':e.code==='P0001'?'Verifique a capacidade, os vínculos e os valores do registro.':e.message});}
}
