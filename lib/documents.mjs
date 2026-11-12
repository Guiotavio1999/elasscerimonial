import {fail,uuid,audit} from './db.mjs';
import {authorize} from './access.mjs';
export async function documents(req,res,sql,user,body,url){
 const eventId=url.searchParams.get('event')||body.event_id;if(!uuid(eventId))fail('Selecione um evento.');authorize(user,'documents',req.method!=='GET',eventId);
 if(req.method==='GET'){
  const id=url.searchParams.get('id');if(id){if(!uuid(id))fail('Documento inválido.');const [doc]=await sql`SELECT *,encode(content,'base64') AS encoded FROM documents WHERE id=${id} AND event_id=${eventId} AND (${user.role!=='client'} OR shared=true)`;if(!doc)fail('Documento não encontrado.',404);res.setHeader('Content-Type',doc.mime);res.setHeader('Content-Disposition',`attachment; filename="${doc.filename.replace(/[^a-zA-Z0-9._-]/g,'_')}"`);res.end(Buffer.from(doc.encoded,'base64'));return;}
  res.json(await sql`SELECT id,event_id,title,filename,mime,size,shared,version,created_at FROM documents WHERE event_id=${eventId} AND (${user.role!=='client'} OR shared=true) ORDER BY created_at DESC`);return;
 }
 if(req.method!=='POST')fail('Método inválido.',405);
 const content=Buffer.from(String(body.content||''),'base64');if(content.length<1||content.length>2097152)fail('Arquivo deve ter até 2 MB.');
 const signature=content.subarray(0,16),isPdf=signature.subarray(0,5).toString()==='%PDF-',isPng=signature.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),isJpeg=signature[0]===255&&signature[1]===216&&signature[2]===255;
 const mime=isPdf?'application/pdf':isPng?'image/png':isJpeg?'image/jpeg':null;if(!mime||body.mime!==mime)fail('Envie um PDF, PNG ou JPEG válido.');
 const filename=String(body.filename||'arquivo').replace(/[^a-zA-Z0-9._-]/g,'_').slice(0,160),title=String(body.title||filename).slice(0,200);
 const [doc]=await sql`INSERT INTO documents(event_id,title,filename,mime,content,size,shared,version,uploaded_by) VALUES(${eventId},${title},${filename},${mime},decode(${content.toString('base64')},'base64'),${content.length},${body.shared===true},coalesce((SELECT max(version)+1 FROM documents WHERE event_id=${eventId} AND title=${title}),1),${user.email}) RETURNING id`;
 await audit(sql,user.email,'document.upload',doc.id);res.status(201).json(doc);
}
