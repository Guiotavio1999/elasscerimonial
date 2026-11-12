CREATE OR REPLACE FUNCTION add_payment(p_contract uuid,p_amount bigint,p_kind text,p_date date,p_note text,p_actor text,p_key uuid) RETURNS payments LANGUAGE plpgsql AS $$
DECLARE c records; total bigint; paid payments;
BEGIN
 SELECT * INTO c FROM records WHERE id=p_contract AND kind='contracts' AND deleted_at IS NULL FOR UPDATE;
 IF NOT FOUND OR c.data->>'status' IN ('Cancelado','Rascunho','Arquivado') THEN RAISE EXCEPTION 'Contrato não está ativo'; END IF;
 SELECT * INTO paid FROM payments WHERE request_key=p_key;
 IF FOUND THEN RETURN paid; END IF;
 SELECT coalesce(sum(CASE WHEN kind='Estorno' THEN -amount_cents ELSE amount_cents END),0) INTO total FROM payments WHERE contract_id=p_contract;
 IF p_amount<=0 OR (p_kind='Estorno' AND p_amount>total) OR (p_kind<>'Estorno' AND total+p_amount>(c.data->>'amount')::bigint) THEN RAISE EXCEPTION 'Valor excede o saldo do contrato'; END IF;
 INSERT INTO payments(contract_id,event_id,amount_cents,kind,paid_date,note,actor,request_key) VALUES(p_contract,c.event_id,p_amount,p_kind,p_date,p_note,p_actor,p_key) RETURNING * INTO paid;
 INSERT INTO audit_logs(actor,action,entity_id,detail) VALUES(p_actor,'payment.create',paid.id,jsonb_build_object('amount_cents',p_amount,'kind',p_kind));
 RETURN paid;
END $$;
CREATE OR REPLACE FUNCTION save_rsvp(p_hash text,p_response text,p_count integer) RETURNS text LANGUAGE plpgsql AS $$
DECLARE inv invitations; capacity integer;
BEGIN
 SELECT i.* INTO inv FROM invitations i JOIN records r ON r.id=i.id WHERE i.token_hash=p_hash AND r.deleted_at IS NULL FOR UPDATE OF i;
 IF NOT FOUND THEN RAISE EXCEPTION 'Convite não encontrado'; END IF;
 IF inv.checked_at IS NOT NULL THEN RAISE EXCEPTION 'Convite já utilizado no check-in'; END IF;
 SELECT (data->>'capacity')::integer INTO capacity FROM records WHERE id=inv.id;
 IF p_response NOT IN ('Confirmado','Recusado') OR p_count<0 OR p_count>capacity OR (p_response='Confirmado' AND p_count<1) OR (p_response='Recusado' AND p_count<>0) THEN RAISE EXCEPTION 'Quantidade inválida'; END IF;
 UPDATE invitations SET response=p_response,attendees=p_count,responded_at=now() WHERE id=inv.id;
 INSERT INTO notifications(title,event_id) SELECT 'Nova resposta de RSVP',event_id FROM records WHERE id=inv.id;
 RETURN p_response;
END $$;
INSERT INTO schema_migrations(name) VALUES('002_atomic_operations') ON CONFLICT DO NOTHING;
