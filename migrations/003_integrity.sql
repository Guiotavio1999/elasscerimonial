CREATE OR REPLACE FUNCTION record_integrity() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE total bigint; cap integer; occupied integer;
BEGIN
 IF NEW.kind='contracts' AND TG_OP='UPDATE' THEN
 SELECT coalesce(sum(CASE WHEN kind='Estorno' THEN -amount_cents ELSE amount_cents END),0) INTO total FROM payments WHERE contract_id=NEW.id;
 IF total>(NEW.data->>'amount')::bigint OR (total>0 AND (NEW.deleted_at IS NOT NULL OR NEW.data->>'status' IN ('Cancelado','Rascunho','Arquivado'))) THEN RAISE EXCEPTION 'Contrato possui recebimentos'; END IF;
 END IF;
 IF NEW.kind='guests' AND coalesce(NEW.data->>'table_id','')<>'' AND NEW.deleted_at IS NULL THEN
 SELECT (data->>'capacity')::integer INTO cap FROM records WHERE id=(NEW.data->>'table_id')::uuid AND kind='tables' AND event_id=NEW.event_id AND deleted_at IS NULL FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Mesa inválida'; END IF;
 SELECT coalesce(sum((data->>'capacity')::integer),0) INTO occupied FROM records WHERE kind='guests' AND data->>'table_id'=NEW.data->>'table_id' AND id<>NEW.id AND deleted_at IS NULL;
 IF occupied+(NEW.data->>'capacity')::integer>cap THEN RAISE EXCEPTION 'Mesa sem capacidade'; END IF;
 END IF;
 IF NEW.kind='tables' AND TG_OP='UPDATE' THEN
 SELECT coalesce(sum((data->>'capacity')::integer),0) INTO occupied FROM records WHERE kind='guests' AND data->>'table_id'=NEW.id::text AND deleted_at IS NULL;
 IF occupied>(NEW.data->>'capacity')::integer THEN RAISE EXCEPTION 'Capacidade abaixo da ocupação'; END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER records_integrity BEFORE INSERT OR UPDATE ON records FOR EACH ROW EXECUTE FUNCTION record_integrity();
INSERT INTO schema_migrations(name) VALUES('003_integrity') ON CONFLICT DO NOTHING;
