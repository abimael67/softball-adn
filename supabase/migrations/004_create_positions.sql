-- Migration: Create positions table
-- Description: Reference table for defensive positions

CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT positions_code_unique UNIQUE (code),
  CONSTRAINT positions_name_unique UNIQUE (name),
  CONSTRAINT positions_display_order_positive CHECK (display_order > 0)
);

COMMENT ON TABLE positions IS 'Reference table for defensive positions';
COMMENT ON COLUMN positions.code IS 'Short code (e.g., P, C, 1B, SS)';
COMMENT ON COLUMN positions.name IS 'Full position name';
COMMENT ON COLUMN positions.display_order IS 'Order for display sorting';

-- Seed data
INSERT INTO positions (code, name, display_order) VALUES
  ('P', 'Lanzador', 1),
  ('C', 'Receptor', 2),
  ('1B', 'Primera Base', 3),
  ('2B', 'Segunda Base', 4),
  ('3B', 'Tercera Base', 5),
  ('SS', 'Campo Corto', 6),
  ('LF', 'Jardinero Izquierdo', 7),
  ('CF', 'Jardinero Central', 8),
  ('RF', 'Jardinero Derecho', 9),
  ('DH', 'Bateador Designado', 10),
  ('UTIL', 'Utilidad', 11);
