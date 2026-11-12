CREATE TABLE IF NOT EXISTS records (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), kind text NOT NULL,
 event_id uuid REFERENCES records(id), data jsonb NOT NULL DEFAULT '{}',
 version integer NOT NULL DEFAULT 1, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz,
 CHECK (jsonb_typeof(data)='object')
);
CREATE INDEX IF NOT EXISTS records_kind ON records(kind,updated_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS records_event ON records(event_id,kind) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS records_title ON records(lower(data->>'title')) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS sections_key ON records((data->>'key')) WHERE kind='sections' AND deleted_at IS NULL;
CREATE TABLE IF NOT EXISTS access_grants (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL UNIQUE CHECK(email=lower(email)), role text NOT NULL CHECK(role IN ('admin','coordinator','staff','checkin','client')),
 event_ids uuid[] NOT NULL DEFAULT '{}', active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS payments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), contract_id uuid NOT NULL REFERENCES records(id), event_id uuid NOT NULL REFERENCES records(id),
 amount_cents bigint NOT NULL CHECK(amount_cents>0), kind text NOT NULL CHECK(kind IN ('Adiantamento','Parcela','Quitação','Estorno')),
 paid_date date NOT NULL, note text NOT NULL DEFAULT '', actor text NOT NULL, request_key uuid NOT NULL UNIQUE, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS payments_contract ON payments(contract_id);
CREATE TABLE IF NOT EXISTS invitations (
 id uuid PRIMARY KEY REFERENCES records(id), token_hash text NOT NULL UNIQUE, response text NOT NULL DEFAULT 'Aguardando' CHECK(response IN ('Aguardando','Confirmado','Recusado')),
 attendees integer NOT NULL DEFAULT 0 CHECK(attendees>=0), responded_at timestamptz, checked_at timestamptz, checked_by text, checked_count integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS briefings (
 event_id uuid PRIMARY KEY REFERENCES records(id), data jsonb NOT NULL DEFAULT '{}', complete boolean NOT NULL DEFAULT false, version integer NOT NULL DEFAULT 1,
 updated_at timestamptz NOT NULL DEFAULT now(), updated_by text NOT NULL
);
CREATE TABLE IF NOT EXISTS audit_logs (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, actor text NOT NULL, action text NOT NULL, entity_id uuid, detail jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS notifications (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, event_id uuid REFERENCES records(id), read_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS documents (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), event_id uuid NOT NULL REFERENCES records(id), title text NOT NULL, filename text NOT NULL, mime text NOT NULL,
 content bytea NOT NULL, size integer NOT NULL CHECK(size>0 AND size<=2097152), shared boolean NOT NULL DEFAULT false, version integer NOT NULL DEFAULT 1,
 uploaded_by text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS documents_event ON documents(event_id);
CREATE TABLE IF NOT EXISTS rate_limits (key text PRIMARY KEY, hits integer NOT NULL, window_start timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
INSERT INTO schema_migrations(name) VALUES('001_platform') ON CONFLICT DO NOTHING;
