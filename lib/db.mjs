import { neon } from '@neondatabase/serverless';
export function database(){if(!process.env.DATABASE_URL)throw Object.assign(new Error('Serviço temporariamente indisponível.'),{status:503});return neon(process.env.DATABASE_URL);}
export const uuid=value=>typeof value==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
export function fail(message,status=400){throw Object.assign(new Error(message),{status});}
export async function audit(sql,actor,action,id=null,detail={}){await sql`INSERT INTO audit_logs(actor,action,entity_id,detail) VALUES(${actor},${action},${id},${JSON.stringify(detail)}::jsonb)`;}
