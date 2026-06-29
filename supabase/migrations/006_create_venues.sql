-- Migration: Create venues table
-- Description: Reference table for game locations

CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT venues_name_unique UNIQUE (name),
  CONSTRAINT venues_latitude_range CHECK (
    latitude IS NULL OR (latitude >= -90 AND latitude <= 90)
  ),
  CONSTRAINT venues_longitude_range CHECK (
    longitude IS NULL OR (longitude >= -180 AND longitude <= 180)
  )
);

COMMENT ON TABLE venues IS 'Game venues that persist across all seasons';
COMMENT ON COLUMN venues.name IS 'Venue name';
COMMENT ON COLUMN venues.city IS 'City where venue is located';
COMMENT ON COLUMN venues.address IS 'Street address';
COMMENT ON COLUMN venues.latitude IS 'GPS latitude coordinate';
COMMENT ON COLUMN venues.longitude IS 'GPS longitude coordinate';
