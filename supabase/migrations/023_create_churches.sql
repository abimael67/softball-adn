CREATE TABLE churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE players ADD COLUMN church_id UUID REFERENCES churches(id);

CREATE INDEX idx_players_church_id ON players(church_id);

ALTER TABLE churches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to churches"
  ON churches FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to manage churches"
  ON churches FOR ALL
  USING (auth.role() = 'authenticated');
