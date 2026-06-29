import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const seasonSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  year: z.number().int().min(2000).max(2100),
  start_date: z.string().min(1, "La fecha de inicio es requerida"),
  end_date: z.string().min(1, "La fecha de fin es requerida"),
  status: z.enum(["draft", "active", "completed", "archived"]),
  description: z.string().optional(),
});

export type SeasonInput = z.infer<typeof seasonSchema>;

export const teamSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  short_name: z.string().min(1).max(10, "Máximo 10 caracteres"),
  city: z.string().optional(),
  logo_url: z.string().url().optional().or(z.literal("")),
  primary_color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color inválido").optional(),
  secondary_color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color inválido").optional(),
});

export type TeamInput = z.infer<typeof teamSchema>;

export const playerSchema = z.object({
  first_name: z.string().min(1, "El nombre es requerido"),
  last_name: z.string().min(1, "El apellido es requerido"),
  nickname: z.string().optional(),
  birth_date: z.string().optional(),
  position: z.string().optional(),
  bats: z.enum(["left", "right", "switch"]).optional(),
  throws: z.enum(["left", "right"]).optional(),
  photo_url: z.string().url().optional().or(z.literal("")),
});

export type PlayerInput = z.infer<typeof playerSchema>;

export const venueSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  address: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export type VenueInput = z.infer<typeof venueSchema>;

export const gameSchema = z.object({
  season_id: z.string().uuid("ID de temporada inválido"),
  home_team_id: z.string().uuid("ID de equipo local inválido"),
  away_team_id: z.string().uuid("ID de equipo visitante inválido"),
  venue_id: z.string().uuid("ID de sede inválido").optional(),
  scheduled_at: z.string().min(1, "La fecha y hora son requeridas"),
  status: z.enum([
    "scheduled",
    "in_progress",
    "statistics_entry",
    "pending_review",
    "approved",
    "published",
    "postponed",
    "cancelled",
  ]),
  home_score: z.number().int().min(0).optional(),
  away_score: z.number().int().min(0).optional(),
});

export type GameInput = z.infer<typeof gameSchema>;

export const rosterSchema = z.object({
  season_id: z.string().uuid("ID de temporada inválido"),
  team_id: z.string().uuid("ID de equipo inválido"),
  player_id: z.string().uuid("ID de jugador inválido"),
  jersey_number: z.number().int().min(0).max(99).optional(),
});

export type RosterInput = z.infer<typeof rosterSchema>;
