-- Add RLS policies for stats tables
-- These tables have RLS enabled but no policies, which blocks all access

-- Batting stats policies
CREATE POLICY "Allow public read access to batting_stats"
ON batting_stats
FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to manage batting_stats"
ON batting_stats
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Pitching stats policies
CREATE POLICY "Allow public read access to pitching_stats"
ON pitching_stats
FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to manage pitching_stats"
ON pitching_stats
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Fielding stats policies
CREATE POLICY "Allow public read access to fielding_stats"
ON fielding_stats
FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to manage fielding_stats"
ON fielding_stats
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
