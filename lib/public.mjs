import {createHash,randomUUID} from 'node:crypto';
import {fail} from './db.mjs';
export const hash=value=>createHash('sha256').update(value).digest('hex');
export async function rate(sql,req,bucket,max=15){const ip=(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();const key=hash(ip+bucket);const [r]=await sql`INSERT INTO rate_limits(key,hits) VALUES(${key},1) ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN rate_limits.window_start<now()-interval '15 minutes' THEN 1 ELSE rate_limits.hits+1 END, window_start=CASE WHEN rate_limits.window_start<now()-interval '15 minutes' THEN now() ELSE rate_limits.window_start END RETURNING hits`;if(r.hits>max)fail('Muitas tentativas. Aguarde alguns minutos.',429);}
export async function publicAction(action,req,res,sql,body,url){
 if(action==='config'){res.json({authUrl:process.env.NEON_AUTH_BASE_URL,brand:'Elass Cerimonial'});return true;}
 if(action==='content'){
  const rows=await sql`SELECT id,kind,data FROM records WHERE kind IN ('sections','portfolio','partners','testimonials','faqs','services') AND data->>'published'='true' AND deleted_at IS NULL ORDER BY created_at`;
  res.json(rows.map(r=>({id:r.id,kind:r.kind,data:Object.fromEntries(Object.entries(r.data).filter(([k])=>!['notes','authorized'].includes(k)))})));return true;
 }
 if(action==='contact'){
  if(req.method!=='POST')fail('Método não permitido.',405);await rate(sql,req,'contact',8);
  if(body.website)fail('Não foi possível enviar.');
  const title=String(body.name||'').trim(),phone=String(body.phone||'').replace(/\D/g,'');
  if(title.length<2||title.length>160||phone.length<10||phone.length>15||body.consent!==true)fail('Informe nome, WhatsApp válido e aceite o uso dos dados para atendimento.');
  if(String(body.message||'').length>6000)fail('Mensagem muito longa.');
  const data={title,phone,email:String(body.email||'').slice(0,200),date:String(body.date||'').slice(0,40),city:String(body.city||'').slice(0,160),guests:Number(body.guests)||0,service:String(body.service||'').slice(0,200),notes:String(body.message||''),status:'Novo contato',source:'Site',priority:'Normal',consent_at:new Date().toISOString()};
  const id=randomUUID();await sql.transaction([sql`INSERT INTO records(id,kind,data) VALUES(${id},'leads',${JSON.stringify(data)}::jsonb)`,sql`INSERT INTO notifications(title) VALUES('Novo contato recebido pelo site')`,sql`INSERT INTO audit_logs(actor,action,entity_id) VALUES('site','lead.create',${id})`]);
  res.status(201).json({ok:true,whatsapp:'https://wa.me/5531996472045?text='+encodeURIComponent('Olá, Elass! Enviei meus dados pelo site. Meu nome é '+title+'.')});return true;
 }
 if(action==='rsvp'){
  const token=url.searchParams.get('token')||body.token;if(!/^[0-9a-f]{64}$/.test(token||''))fail('Convite inválido.',404);await rate(sql,req,'rsvp',60);
  const [r]=await sql`SELECT r.data->>'title' AS title,r.data->>'capacity' AS capacity,e.data->>'title' AS event,e.data->>'date' AS date,e.data->>'time' AS time,e.data->>'venue' AS venue,e.data->>'address' AS address,i.response,i.attendees FROM invitations i JOIN records r ON r.id=i.id JOIN records e ON e.id=r.event_id WHERE i.token_hash=${hash(token)} AND r.deleted_at IS NULL AND e.deleted_at IS NULL`;
  if(!r)fail('Convite não encontrado ou desativado.',404);
  if(req.method==='POST'){try{await sql`SELECT save_rsvp(${hash(token)},${body.response},${Number(body.attendees)})`;}catch{fail('Não foi possível confirmar. Confira a quantidade autorizada ou fale com o cerimonial.');}res.json({ok:true});}else res.json(r);return true;
 }
 return false;
}
