CREATE TABLE IF NOT EXISTS checkin_entries (
 id uuid PRIMARY KEY,
 invitation_id uuid NOT NULL REFERENCES invitations(id),
 event_id uuid NOT NULL REFERENCES records(id),
 quantity integer NOT NULL CHECK(quantity>0),
 operator text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS checkin_entries_event ON checkin_entries(event_id,created_at DESC);
CREATE OR REPLACE FUNCTION record_checkin(p_id uuid,p_event uuid,p_count integer,p_actor text,p_key uuid) RETURNS integer LANGUAGE plpgsql AS $$
DECLARE invitation invitations; previous checkin_entries;
BEGIN
 SELECT i.* INTO invitation FROM invitations i JOIN records r ON r.id=i.id WHERE i.id=p_id AND r.event_id=p_event AND r.deleted_at IS NULL FOR UPDATE OF i;
 IF NOT FOUND THEN RAISE EXCEPTION 'Convite não encontrado'; END IF;
 SELECT * INTO previous FROM checkin_entries WHERE id=p_key;
 IF FOUND THEN
  IF previous.invitation_id<>p_id OR previous.event_id<>p_event OR previous.quantity<>p_count THEN RAISE EXCEPTION 'Chave de solicitação inválida'; END IF;
  RETURN invitation.checked_count;
 END IF;
 IF invitation.response<>'Confirmado' OR p_count<1 OR invitation.checked_count+p_count>invitation.attendees THEN RAISE EXCEPTION 'Quantidade excede as pessoas aguardadas'; END IF;
 INSERT INTO checkin_entries(id,invitation_id,event_id,quantity,operator) VALUES(p_key,p_id,p_event,p_count,p_actor);
 UPDATE invitations SET checked_at=coalesce(checked_at,now()),checked_by=coalesce(checked_by,p_actor),checked_count=checked_count+p_count WHERE id=p_id;
 INSERT INTO audit_logs(actor,action,entity_id,detail) VALUES(p_actor,'guest.checkin',p_id,jsonb_build_object('count',p_count,'request_key',p_key));
 RETURN invitation.checked_count+p_count;
END $$;
INSERT INTO schema_migrations(name) VALUES('005_checkin') ON CONFLICT DO NOTHING;
