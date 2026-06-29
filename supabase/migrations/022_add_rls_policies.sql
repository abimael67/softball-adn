ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to seasons"
  ON seasons FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to manage seasons"
  ON seasons FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to teams"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to manage teams"
  ON teams FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to players"
  ON players FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to manage players"
  ON players FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to venues"
  ON venues FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to manage venues"
  ON venues FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to season_rosters"
  ON season_rosters FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to manage season_rosters"
  ON season_rosters FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to games"
  ON games FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to manage games"
  ON games FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to positions"
  ON positions FOR SELECT
  USING (true);
