import test from 'node:test';import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';import {readFile} from 'node:fs/promises';import {database} from '../lib/db.mjs';
test('segunda parcela, estorno, saldo e operação independentes', {skip:process.env.INTEGRATION!=='1',timeout:180000},async()=>{
 const qa=JSON.parse(await readFile('.qa-browser.json','utf8')),sql=database(),eventId=randomUUID(),contractId=randomUUID();const [source]=await sql`SELECT data FROM records WHERE id=${qa.event_id}`;assert.ok(source);
 const event={title:'QA Parcelas e estorno '+Date.now(),client_id:source.data.client_id,type:'Casamento',status:'Planejamento',date:'2026-12-12'};
 const result=await sql.transaction([
 sql`INSERT INTO records(id,kind,data) VALUES(${eventId},'events',${JSON.stringify(event)}::jsonb)`,
 sql`INSERT INTO records(id,kind,event_id,data) VALUES(${contractId},'contracts',${eventId},'{"title":"QA parcelas","amount":200000,"status":"Assinado"}'::jsonb)`,
 sql`SELECT amount_cents FROM add_payment(${contractId},35000,'Adiantamento','2026-11-11','Primeiro recebimento','qa',${randomUUID()})`,
 sql`SELECT amount_cents FROM add_payment(${contractId},65000,'Parcela','2026-11-12','Segunda parcela','qa',${randomUUID()})`,
 sql`SELECT amount_cents FROM add_payment(${contractId},20000,'Estorno','2026-11-12','Estorno parcial','qa',${randomUUID()})`,
 sql`SELECT sum(CASE WHEN kind='Estorno' THEN -amount_cents ELSE amount_cents END) AS received,count(*) AS movements FROM payments WHERE contract_id=${contractId}`,
 sql`SELECT data->>'status' AS status FROM records WHERE id=${eventId}`
 ]);
 assert.equal(Number(result[5][0].received),80000);assert.equal(200000-Number(result[5][0].received),120000);assert.equal(Number(result[5][0].movements),3);assert.equal(result[6][0].status,'Planejamento');
 await assert.rejects(sql`SELECT * FROM add_payment(${contractId},130000,'Quitação','2026-11-12','Excesso','qa',${randomUUID()})`,e=>e.code==='P0001');
 const [balance]=await sql`SELECT sum(CASE WHEN kind='Estorno' THEN -amount_cents ELSE amount_cents END) AS received FROM payments WHERE contract_id=${contractId}`;assert.equal(Number(balance.received),80000);
 console.log('Segunda parcela e estorno validados sem alterar o andamento do evento.');
});
