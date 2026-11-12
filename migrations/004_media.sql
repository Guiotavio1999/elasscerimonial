CREATE TABLE IF NOT EXISTS site_media (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 filename text NOT NULL,
 alt text NOT NULL DEFAULT '',
 mime text NOT NULL CHECK(mime IN ('image/png','image/jpeg','image/webp')),
 content bytea NOT NULL,
 size integer NOT NULL CHECK(size>0 AND size<=2097152),
 published boolean NOT NULL DEFAULT false,
 uploaded_by text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS site_media_created ON site_media(created_at DESC);
INSERT INTO schema_migrations(name) VALUES('004_media') ON CONFLICT DO NOTHING;
