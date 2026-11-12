import {randomBytes,randomUUID} from 'node:crypto';
import {uuid,fail,audit} from './db.mjs';
import {authorize,scope} from './access.mjs';
import {hash} from './public.mjs';
import {allocateInstallments,finance,briefingSections,templates} from './domain.mjs';
export async function operations(action,req,res,sql,user,body,url){
 const eventId=url.searchParams.get('event')||body.event_id||null;if(eventId&&!uuid(eventId))fail('Evento inválido.');
 const manager=['admin','coordinator'].includes(user.role),write=req.method!=='GET';
 if(action==='me'){res.json({name:user.name,email:user.email,role:user.role,event_ids:user.event_ids});return;}
 if(action==='search'){
  if(!manager)fail('Busca restrita à gestão.',403);
  const q=String(url.searchParams.get('q')||'').trim().slice(0,160);
  if(q.length<2){res.json([]);return;}
  res.json(await sql`SELECT id,kind,event_id,data->>'title' AS title,data->>'date' AS date FROM records WHERE deleted_at IS NULL AND kind IN ('leads','clients','events','tasks','suppliers','contracts','proposals','guests','timeline','notes') AND data::text ILIKE ${'%'+q+'%'} ORDER BY updated_at DESC LIMIT 60`);return;
 }
 if(action==='dashboard'){
  if(!manager)fail('Acesso restrito.',403);
  const records=await sql`SELECT * FROM records WHERE deleted_at IS NULL AND kind IN ('leads','events','tasks','contracts','expenses','installments')`;
  const payments=await sql`SELECT *,CASE WHEN kind='Estorno' THEN -amount_cents ELSE amount_cents END AS amount_cents FROM payments`;
  const by=k=>records.filter(r=>r.kind===k),events=by('events'),tasks=by('tasks'),leads=by('leads'),today=new Date().toLocaleDateString('sv-SE',{timeZone:'America/Sao_Paulo'});
  const financial=finance(by('contracts'),payments,by('expenses'));
  const unpaid=allocateInstallments(by('installments'),payments,today).filter(r=>r.remaining>0&&r.data.due<today);
  res.json({financial,leads:leads.length,won:leads.filter(r=>r.data.status==='Contrato fechado').length,events:events.filter(r=>!['Cancelado','Concluído'].includes(r.data.status)).length,overdue:tasks.filter(r=>r.data.due&&r.data.due<today&&r.data.status!=='Concluída').length,next:events.filter(r=>r.data.date>=today&&r.data.status!=='Cancelado').sort((a,b)=>a.data.date.localeCompare(b.data.date)).slice(0,5),tasks:tasks.filter(r=>r.data.status!=='Concluída').sort((a,b)=>(a.data.due||'9999').localeCompare(b.data.due||'9999')).slice(0,6),pipeline:leads.reduce((a,r)=>({...a,[r.data.status]:(a[r.data.status]||0)+1}),{}),overdue_installments:unpaid.length,overdue_amount:unpaid.reduce((a,r)=>a+r.remaining,0)});return;
 }
 if(action==='payments'){
  if(!manager)fail('Gestão financeira restrita à administração.',403);
  if(!write){res.json(await sql`SELECT p.*,c.data->>'title' AS contract_title FROM payments p JOIN records c ON c.id=p.contract_id WHERE (${eventId}::uuid IS NULL OR p.event_id=${eventId}::uuid) ORDER BY p.paid_date DESC,p.created_at DESC LIMIT 500 OFFSET ${Math.max(0,Number(url.searchParams.get('offset'))||0)}`);return;}
  if(req.method!=='POST'||!uuid(body.contract_id)||!uuid(body.request_key))fail('Pagamento inválido.');
  const amount=Math.round(Number(body.amount)*100);if(!Number.isSafeInteger(amount)||amount<=0||!['Adiantamento','Parcela','Quitação','Estorno'].includes(body.kind)||!/^\d{4}-\d{2}-\d{2}$/.test(body.paid_date||''))fail('Preencha valor, tipo e data do pagamento.');
  try{const [r]=await sql`SELECT * FROM add_payment(${body.contract_id},${amount},${body.kind},${body.paid_date},${String(body.note||'').slice(0,2000)},${user.email},${body.request_key})`;res.json(r);}catch(e){fail('Não foi possível registrar: confira o saldo, o contrato ativo e a data.');}return;
 }
 if(action==='grants'){
  if(user.role!=='admin')fail('Somente o administrador principal pode gerenciar acessos.',403);
  if(!write){res.json(await sql`SELECT * FROM access_grants ORDER BY created_at DESC`);return;}
  const email=String(body.email||'').toLowerCase().trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!['admin','coordinator','staff','checkin','client'].includes(body.role))fail('Informe e-mail e perfil válidos.');
  const ids=body.event_ids||[];if(!Array.isArray(ids)||!ids.every(uuid)||ids.length>200)fail('Eventos inválidos.');
  if(!['admin','coordinator'].includes(body.role)&&!ids.length)fail('Vincule pelo menos um evento.');
  if(email===user.email&&(body.active===false||body.role!=='admin'))fail('Você não pode remover seu próprio acesso administrativo.');
  const events=await sql`SELECT id FROM records WHERE kind='events' AND deleted_at IS NULL AND id=ANY(${ids}::uuid[])`;if(events.length!==ids.length)fail('Evento não encontrado.');
  await sql.transaction([sql`INSERT INTO access_grants(email,role,event_ids,active) VALUES(${email},${body.role},${ids}::uuid[],${body.active!==false}) ON CONFLICT(email) DO UPDATE SET role=excluded.role,event_ids=excluded.event_ids,active=excluded.active,updated_at=now()`,sql`INSERT INTO audit_logs(actor,action,detail) VALUES(${user.email},'access.update',${JSON.stringify({email,role:body.role,active:body.active!==false})}::jsonb)`]);res.json({ok:true});return;
 }
 if(action==='briefing'){
  if(!eventId)fail('Selecione o evento.');authorize(user,'briefings',write,eventId);
  if(!write){const [r]=await sql`SELECT * FROM briefings WHERE event_id=${eventId}`;res.json(r||{data:{},complete:false,version:0});return;}
  if(req.method!=='POST')fail('Método inválido.',405);
  const data={};for(const [k] of briefingSections.flatMap(s=>s[1])){if(typeof body.data?.[k]==='string')data[k]=body.data[k].slice(0,5000);}
  if(body.complete&&(!data.partner1||!data.partner2||!data.phone))fail('Informe os nomes do casal e um telefone antes de concluir.');
  const [r]=await sql`INSERT INTO briefings(event_id,data,complete,updated_by) VALUES(${eventId},${JSON.stringify(data)}::jsonb,${body.complete===true},${user.email}) ON CONFLICT(event_id) DO UPDATE SET data=excluded.data,complete=excluded.complete,updated_by=excluded.updated_by,updated_at=now(),version=briefings.version+1 WHERE briefings.version=${Number(body.version)||0} RETURNING *`;
  if(!r)fail('O formulário mudou. Recarregue antes de salvar.',409);await audit(sql,user.email,'briefing.save',eventId,{complete:r.complete});if(r.complete)await sql`INSERT INTO notifications(title,event_id) VALUES('Briefing do casal concluído',${eventId})`;res.json(r);return;
 }
 if(action==='invite'){
  if(!write||req.method!=='POST'||!manager)fail('Acesso restrito.',403);if(!uuid(body.id))fail('Convite inválido.');
  const [g]=await sql`SELECT * FROM records WHERE id=${body.id} AND kind='guests' AND deleted_at IS NULL`;if(!g)fail('Convidado não encontrado.',404);
  const token=randomBytes(32).toString('hex');await sql`INSERT INTO invitations(id,token_hash) VALUES(${g.id},${hash(token)}) ON CONFLICT(id) DO UPDATE SET token_hash=excluded.token_hash`;
  await audit(sql,user.email,'invitation.rotate',g.id);res.json({path:'/rsvp?token='+token});return;
 }
 if(action==='checkin'){
  if(!eventId)fail('Selecione um evento.');authorize(user,'checkin',true,eventId);if(req.method!=='POST'||!uuid(body.id))fail('Convidado inválido.');
  const n=Number(body.count);if(!Number.isInteger(n)||n<1)fail('Informe a quantidade presente.');
  const key=body.request_key||randomUUID();if(!uuid(key))fail('Solicitação inválida.');
  try{const [r]=await sql`SELECT record_checkin(${body.id},${eventId},${n},${user.email},${key}) AS checked_count`;res.json({ok:true,checked_count:r.checked_count});}catch{fail('Chegada já completa, convite sem confirmação ou quantidade acima do saldo de pessoas.',409);}return;
 }
 if(action==='template'){
  if(!manager||req.method!=='POST'||!eventId||!templates[body.template])fail('Modelo inválido.');
  const [ev]=await sql`SELECT * FROM records WHERE id=${eventId} AND kind='events' AND deleted_at IS NULL`;if(!ev?.data.date)fail('Defina a data do evento primeiro.');
  const queries=templates[body.template].map(([title,offset])=>{const d=new Date(ev.data.date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+offset);return sql`INSERT INTO records(kind,event_id,data) VALUES('tasks',${eventId},${JSON.stringify({title,due:d.toISOString().slice(0,10),status:'Pendente',priority:'Normal',shared:true,category:body.template})}::jsonb)`;});
  await sql.transaction([...queries,sql`INSERT INTO audit_logs(actor,action,entity_id) VALUES(${user.email},'template.apply',${eventId})`]);res.json({ok:true,count:queries.length});return;
 }
 if(action==='convert'){
  if(!manager||req.method!=='POST'||!uuid(body.id))fail('Contato inválido.');
  const [lead]=await sql`SELECT * FROM records WHERE id=${body.id} AND kind='leads' AND deleted_at IS NULL`;if(!lead)fail('Contato não encontrado.');if(lead.data.client_id){res.json({client_id:lead.data.client_id});return;}
  const clientId=randomUUID();const result=await sql.transaction([sql`UPDATE records SET data=data||${JSON.stringify({client_id:clientId,status:'Contrato fechado'})}::jsonb,version=version+1,updated_at=now() WHERE id=${lead.id} AND NOT(data?'client_id') RETURNING id`,sql`INSERT INTO records(id,kind,data) SELECT ${clientId},'clients',${JSON.stringify({title:lead.data.title,phone:lead.data.phone,email:lead.data.email,notes:lead.data.notes})}::jsonb WHERE EXISTS(SELECT 1 FROM records WHERE id=${lead.id} AND data->>'client_id'=${clientId})`,sql`INSERT INTO audit_logs(actor,action,entity_id) VALUES(${user.email},'lead.convert',${lead.id})`]);if(!result[0].length)fail('Contato já convertido. Atualize a tela.',409);res.json({client_id:clientId});return;
 }
 if(action==='notifications'){
  if(!manager)fail('Acesso restrito.',403);if(write){if(req.method!=='POST'||!uuid(body.id))fail('Alerta inválido.');await sql`UPDATE notifications SET read_at=now() WHERE id=${body.id}`;res.json({ok:true});}else res.json(await sql`SELECT * FROM notifications ORDER BY created_at DESC LIMIT 100`);return;
 }
 if(action==='audit'){
  if(user.role!=='admin')fail('Acesso restrito.',403);res.json(await sql`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200`);return;
 }
 fail('Ação não encontrada.',404);
}
