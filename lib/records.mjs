import {randomUUID} from 'node:crypto';
import {definitions,validate} from './domain.mjs';
import {uuid,fail} from './db.mjs';
import {authorize,scope,visible} from './access.mjs';
export async function recordsAction(req,res,sql,user,body,url){
 const kind=url.searchParams.get('kind')||body.kind,def=definitions[kind];if(!def)fail('Módulo inválido.');
 let eventId=url.searchParams.get('event')||body.event_id||null;if(eventId&&!uuid(eventId))fail('Evento inválido.');
 if(req.method==='GET'){
  if(!['admin','coordinator'].includes(user.role)&&!eventId&&kind!=='events')fail('Selecione um evento.',403);
  if(kind!=='events'||eventId)authorize(user,kind,false,eventId);
  const limit=Math.min(200,Math.max(1,Number(url.searchParams.get('limit'))||50)),offset=Math.max(0,Number(url.searchParams.get('offset'))||0),q=String(url.searchParams.get('q')||'').slice(0,200),status=url.searchParams.get('status')||'';
  const allowed=['admin','coordinator'].includes(user.role);
  let rows=await sql`SELECT r.*,i.response,i.attendees,i.checked_at,i.checked_count FROM records r LEFT JOIN invitations i ON i.id=r.id WHERE r.kind=${kind} AND r.deleted_at IS NULL AND (${eventId}::uuid IS NULL OR r.event_id=${eventId}::uuid OR (r.kind='events' AND r.id=${eventId}::uuid)) AND (${allowed} OR (r.kind='events' AND r.id=ANY(${user.event_ids}::uuid[])) OR r.event_id=ANY(${user.event_ids}::uuid[])) AND (${q}='' OR r.data::text ILIKE ${'%'+q+'%'}) AND (${status}='' OR r.data->>'status'=${status}) ORDER BY r.updated_at DESC LIMIT ${limit+1} OFFSET ${offset}`;
  const more=rows.length>limit;rows=rows.slice(0,limit).map(r=>visible(user,r)).filter(Boolean);res.json({rows,more,offset,limit});return;
 }
 if(req.method==='DELETE'){
  if(!uuid(body.id))fail('Registro inválido.');const [old]=await sql`SELECT * FROM records WHERE id=${body.id} AND kind=${kind} AND deleted_at IS NULL`;if(!old)fail('Registro não encontrado.',404);authorize(user,kind,true,old.kind==='events'?old.id:old.event_id);
  if(!['admin','coordinator'].includes(user.role))fail('Somente a gestão pode arquivar registros.',403);
  if(['events','clients','contracts','tables'].includes(kind)){const [deps]=await sql`SELECT (SELECT count(*) FROM records WHERE deleted_at IS NULL AND (event_id=${body.id} OR data->>'client_id'=${body.id} OR data->>'contract_id'=${body.id} OR data->>'table_id'=${body.id}))+(SELECT count(*) FROM payments WHERE contract_id=${body.id}) AS count`;if(Number(deps.count)>0)fail('Registro possui vínculos. Preserve o histórico e ajuste a situação em vez de arquivar.');}
  const results=await sql.transaction([sql`UPDATE records SET deleted_at=now(),updated_at=now(),version=version+1 WHERE id=${body.id} AND version=${body.version} RETURNING id`,sql`INSERT INTO audit_logs(actor,action,entity_id) VALUES(${user.email},'record.archive',${body.id})`]);if(!results[0].length)fail('O registro mudou. Atualize a tela.',409);res.json({ok:true});return;
 }
 if(req.method!=='POST')fail('Método não permitido.',405);
 const data=validate(kind,body.data||{});let old=null;
 if(body.id){if(!uuid(body.id))fail('Registro inválido.');[old]=await sql`SELECT * FROM records WHERE id=${body.id} AND kind=${kind} AND deleted_at IS NULL`;if(!old)fail('Registro não encontrado.',404);if(old.event_id!==eventId)fail('O evento de um registro não pode ser alterado.');}
 if(kind==='leads'&&old){for(const key of ['client_id','consent_at'])if(old.data[key])data[key]=old.data[key];}
 if(kind==='events')eventId=old?.id||null;
 authorize(user,kind,true,eventId);
 if(def.event&&!eventId)fail('Selecione o evento.');
 if(def.event){const [event]=await sql`SELECT id FROM records WHERE id=${eventId} AND kind='events' AND deleted_at IS NULL`;if(!event)fail('Evento não encontrado.');}
 for(const f of def.fields.filter(f=>f.type.startsWith('ref:')&&data[f.key])){const [ref]=await sql`SELECT * FROM records WHERE id=${data[f.key]} AND kind=${f.type.slice(4)} AND deleted_at IS NULL`;if(!ref||ref.event_id&&ref.event_id!==eventId)fail(`${f.label}: vínculo inválido.`);}
 if(user.role==='client'){
  if(kind!=='guests')fail('Ação não autorizada.',403);delete data.notes;
  if(old&&old.data.capacity!==data.capacity)fail('Solicite à equipe a alteração do limite de pessoas.');
 }
 if(kind==='contracts'&&old){const [p]=await sql`SELECT coalesce(sum(CASE WHEN kind='Estorno' THEN -amount_cents ELSE amount_cents END),0) AS total FROM payments WHERE contract_id=${old.id}`;if(Number(p.total)>data.amount||Number(p.total)>0&&['Cancelado','Rascunho','Arquivado'].includes(data.status))fail('Contrato possui recebimentos. Registre os estornos antes de reduzir ou cancelar.');}
 if(kind==='guests'&&old){const [i]=await sql`SELECT attendees FROM invitations WHERE id=${old.id}`;if(i&&data.capacity<i.attendees)fail('Capacidade abaixo do número já confirmado.');}
 const id=old?.id||randomUUID();
 const detail={kind,before_status:old?.data.status,after_status:data.status};
 let saved;
 if(old){const result=await sql.transaction([sql`UPDATE records SET data=${JSON.stringify(data)}::jsonb,version=version+1,updated_at=now() WHERE id=${id} AND version=${Number(body.version)||0} RETURNING *`,sql`INSERT INTO audit_logs(actor,action,entity_id,detail) VALUES(${user.email},'record.update',${id},${JSON.stringify(detail)}::jsonb)`]);saved=result[0][0];if(!saved)fail('Outra pessoa alterou este registro. Atualize antes de salvar.',409);}
 else{const result=await sql.transaction([sql`INSERT INTO records(id,kind,event_id,data) VALUES(${id},${kind},${def.event?eventId:null},${JSON.stringify(data)}::jsonb) RETURNING *`,sql`INSERT INTO audit_logs(actor,action,entity_id,detail) VALUES(${user.email},'record.create',${id},${JSON.stringify(detail)}::jsonb)`]);saved=result[0][0];}
 res.json(visible(user,saved));
}
