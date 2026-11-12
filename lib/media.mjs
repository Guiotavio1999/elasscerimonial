import {fail,uuid} from './db.mjs';
export async function readMedia(req,res,sql,url){
 const id=url.searchParams.get('id');if(!uuid(id))fail('Imagem não encontrada.',404);
 const [row]=await sql`SELECT filename,alt,mime,encode(content,'base64') AS encoded FROM site_media WHERE id=${id} AND published=true`;
 if(!row)fail('Imagem não encontrada.',404);
 res.setHeader('Content-Type',row.mime);res.setHeader('Cache-Control','public,max-age=300');res.end(Buffer.from(row.encoded,'base64'));
}
export async function manageMedia(req,res,sql,user,body){
 if(!['admin','coordinator'].includes(user.role))fail('Acesso restrito à gestão.',403);
 if(req.method==='GET'){res.json(await sql`SELECT id,filename,alt,mime,size,published,created_at FROM site_media ORDER BY created_at DESC LIMIT 200`);return;}
 if(req.method!=='POST')fail('Método inválido.',405);
 if(body.id){if(!uuid(body.id))fail('Imagem inválida.');await sql.transaction([sql`UPDATE site_media SET published=${body.published===true},alt=${String(body.alt||'').slice(0,300)} WHERE id=${body.id}`,sql`INSERT INTO audit_logs(actor,action,entity_id) VALUES(${user.email},'media.visibility',${body.id})`]);res.json({ok:true});return;}
 const bytes=Buffer.from(String(body.content||''),'base64');if(bytes.length<12||bytes.length>2097152)fail('Envie uma imagem de até 2 MB.');
 const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255,webp=bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP';
 const mime=png?'image/png':jpeg?'image/jpeg':webp?'image/webp':null;if(!mime||body.mime!==mime)fail('Formato inválido. Use JPEG, PNG ou WebP.');
 const [row]=await sql`INSERT INTO site_media(filename,alt,mime,content,size,published,uploaded_by) VALUES(${String(body.filename||'imagem').slice(0,160)},${String(body.alt||'').slice(0,300)},${mime},decode(${bytes.toString('base64')},'base64'),${bytes.length},${body.published===true},${user.email}) RETURNING id`;
 await sql`INSERT INTO audit_logs(actor,action,entity_id) VALUES(${user.email},'media.upload',${row.id})`;res.status(201).json(row);
}
