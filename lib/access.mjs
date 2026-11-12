import { createLocalJWKSet,jwtVerify } from 'jose';
import { fail } from './db.mjs';
let keys,keyExpires=0;
export async function authenticate(req,sql){
 const token=(req.headers.authorization||'').replace(/^Bearer /,''); if(!token)fail('Entre na sua conta para continuar.',401);
 if(!keys||Date.now()>keyExpires){const rows=await sql`SELECT id,"publicKey",alg FROM neon_auth.jwks ORDER BY "createdAt" DESC LIMIT 10`;keys=createLocalJWKSet({keys:rows.map(r=>({...JSON.parse(r.publicKey),kid:r.id,alg:r.alg||'EdDSA',use:'sig'}))});keyExpires=Date.now()+60000;}
 let payload;try{({payload}=await jwtVerify(token,keys,{issuer:new URL(process.env.NEON_AUTH_BASE_URL).origin,audience:new URL(process.env.NEON_AUTH_BASE_URL).origin}));}catch(error){console.error('Auth verification',{code:error.code||error.name});fail('Sua sessão expirou. Entre novamente.',401);}
 const [user]=await sql`SELECT id,name,email,"emailVerified" FROM neon_auth."user" WHERE id=${payload.sub}::uuid AND COALESCE(banned,false)=false`;
 if(!user)fail('Sessão inválida.',401);if(!user.emailVerified)fail('Verifique seu e-mail antes de acessar.',403);
 const [grant]=await sql`SELECT * FROM access_grants WHERE email=${user.email.toLowerCase()} AND active=true`;
 if(!grant)fail('Seu acesso ainda não foi autorizado pela Elass. Solicite à equipe a liberação do e-mail usado no cadastro.',403);
 return {...user,...grant,user_id:user.id};
}
export function scope(user,eventId){return ['admin','coordinator'].includes(user.role)||user.event_ids.includes(eventId);}
export function authorize(user,kind,write=false,eventId=null){
 if(user.role==='admin')return true;
 if(user.role==='coordinator'&&!['grants','audit'].includes(kind))return true;
 if(!eventId||!scope(user,eventId))fail('Você não tem acesso a este evento.',403);
 const allowed=user.role==='client'?['events','tasks','timeline','bookings','guests','tables','notes','contracts','documents','briefings']:user.role==='checkin'?['events','guests','checkin']:['events','tasks','timeline','bookings','guests','tables','notes','documents','briefings','checkin'];
 if(!allowed.includes(kind)||(write&&user.role==='client'&&!['briefings','guests'].includes(kind))||(write&&user.role==='checkin'&&kind!=='checkin'))fail('Você não tem permissão para esta ação.',403);return true;
}
export function visible(user,row){
 if(['admin','coordinator'].includes(user.role))return row;
 if(user.role==='client'){
  if(!['events','guests','briefings'].includes(row.kind)&&!row.data.shared)return null;
  const data={...row.data};for(const key of ['notes','emergency','client_id','amount','contract_id'])delete data[key];
  if(row.kind==='contracts')data.amount=row.data.amount;
  return {...row,data};
 }
 if(user.role==='checkin')return {...row,data:row.kind==='events'?{title:row.data.title,date:row.data.date}:{title:row.data.title,capacity:row.data.capacity,members:row.data.members,table_id:row.data.table_id}};
 return row;
}
