export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          created_at: string
          entity: Database["public"]["Enums"]["audit_entity"]
          entity_id: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          new_values: Json | null
          previous_values: Json | null
          timestamp: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          created_at?: string
          entity: Database["public"]["Enums"]["audit_entity"]
          entity_id?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_values?: Json | null
          previous_values?: Json | null
          timestamp?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          created_at?: string
          entity?: Database["public"]["Enums"]["audit_entity"]
          entity_id?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_values?: Json | null
          previous_values?: Json | null
          timestamp?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      batting_stats: {
        Row: {
          at_bats: number
          caught_stealing: number
          created_at: string
          doubles: number
          game_id: string
          hit_by_pitch: number
          hits: number
          home_runs: number
          id: string
          player_id: string
          rbi: number
          runs: number
          sacrifice_flies: number
          season_id: string
          stolen_bases: number
          strikeouts: number
          team_id: string
          triples: number
          updated_at: string
          walks: number
        }
        Insert: {
          at_bats?: number
          caught_stealing?: number
          created_at?: string
          doubles?: number
          game_id: string
          hit_by_pitch?: number
          hits?: number
          home_runs?: number
          id?: string
          player_id: string
          rbi?: number
          runs?: number
          sacrifice_flies?: number
          season_id: string
          stolen_bases?: number
          strikeouts?: number
          team_id: string
          triples?: number
          updated_at?: string
          walks?: number
        }
        Update: {
          at_bats?: number
          caught_stealing?: number
          created_at?: string
          doubles?: number
          game_id?: string
          hit_by_pitch?: number
          hits?: number
          home_runs?: number
          id?: string
          player_id?: string
          rbi?: number
          runs?: number
          sacrifice_flies?: number
          season_id?: string
          stolen_bases?: number
          strikeouts?: number
          team_id?: string
          triples?: number
          updated_at?: string
          walks?: number
        }
        Relationships: [
          {
            foreignKeyName: "batting_stats_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batting_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batting_stats_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batting_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      churches: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      fielding_stats: {
        Row: {
          assists: number
          created_at: string
          double_plays: number
          errors: number
          game_id: string
          id: string
          player_id: string
          putouts: number
          season_id: string
          team_id: string
          updated_at: string
        }
        Insert: {
          assists?: number
          created_at?: string
          double_plays?: number
          errors?: number
          game_id: string
          id?: string
          player_id: string
          putouts?: number
          season_id: string
          team_id: string
          updated_at?: string
        }
        Update: {
          assists?: number
          created_at?: string
          double_plays?: number
          errors?: number
          game_id?: string
          id?: string
          player_id?: string
          putouts?: number
          season_id?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fielding_stats_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fielding_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fielding_stats_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fielding_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      game_score_sheets: {
        Row: {
          created_at: string
          game_id: string
          id: string
          image_key: string
          notes: string | null
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          image_key: string
          notes?: string | null
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          image_key?: string
          notes?: string | null
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_score_sheets_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          away_errors: number | null
          away_hits: number | null
          away_score: number | null
          away_team_id: string
          created_at: string
          home_errors: number | null
          home_hits: number | null
          home_score: number | null
          home_team_id: string
          id: string
          last_edited_at: string | null
          last_edited_by: string | null
          published_at: string | null
          published_by: string | null
          review_notes: string | null
          scheduled_at: string
          season_id: string
          status: Database["public"]["Enums"]["game_status"]
          submitted_at: string | null
          submitted_by: string | null
          updated_at: string
          venue_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          away_errors?: number | null
          away_hits?: number | null
          away_score?: number | null
          away_team_id: string
          created_at?: string
          home_errors?: number | null
          home_hits?: number | null
          home_score?: number | null
          home_team_id: string
          id?: string
          last_edited_at?: string | null
          last_edited_by?: string | null
          published_at?: string | null
          published_by?: string | null
          review_notes?: string | null
          scheduled_at: string
          season_id: string
          status?: Database["public"]["Enums"]["game_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
          venue_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          away_errors?: number | null
          away_hits?: number | null
          away_score?: number | null
          away_team_id?: string
          created_at?: string
          home_errors?: number | null
          home_hits?: number | null
          home_score?: number | null
          home_team_id?: string
          id?: string
          last_edited_at?: string | null
          last_edited_by?: string | null
          published_at?: string | null
          published_by?: string | null
          review_notes?: string | null
          scheduled_at?: string
          season_id?: string
          status?: Database["public"]["Enums"]["game_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      pitching_stats: {
        Row: {
          created_at: string
          earned_runs: number
          game_id: string
          hits_allowed: number
          home_runs_allowed: number
          id: string
          innings_pitched: number
          losses: number
          player_id: string
          runs_allowed: number
          saves: number
          season_id: string
          strikeouts: number
          team_id: string
          updated_at: string
          walks: number
          wild_pitches: number
          wins: number
        }
        Insert: {
          created_at?: string
          earned_runs?: number
          game_id: string
          hits_allowed?: number
          home_runs_allowed?: number
          id?: string
          innings_pitched?: number
          losses?: number
          player_id: string
          runs_allowed?: number
          saves?: number
          season_id: string
          strikeouts?: number
          team_id: string
          updated_at?: string
          walks?: number
          wild_pitches?: number
          wins?: number
        }
        Update: {
          created_at?: string
          earned_runs?: number
          game_id?: string
          hits_allowed?: number
          home_runs_allowed?: number
          id?: string
          innings_pitched?: number
          losses?: number
          player_id?: string
          runs_allowed?: number
          saves?: number
          season_id?: string
          strikeouts?: number
          team_id?: string
          updated_at?: string
          walks?: number
          wild_pitches?: number
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "pitching_stats_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pitching_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pitching_stats_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pitching_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          bats: Database["public"]["Enums"]["batting_hand"] | null
          birth_date: string | null
          church_id: string | null
          created_at: string
          first_name: string
          id: string
          last_name: string
          nickname: string | null
          photo_key: string | null
          primary_position_id: string | null
          throws: Database["public"]["Enums"]["throwing_hand"] | null
          updated_at: string
        }
        Insert: {
          bats?: Database["public"]["Enums"]["batting_hand"] | null
          birth_date?: string | null
          church_id?: string | null
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          nickname?: string | null
          photo_key?: string | null
          primary_position_id?: string | null
          throws?: Database["public"]["Enums"]["throwing_hand"] | null
          updated_at?: string
        }
        Update: {
          bats?: Database["public"]["Enums"]["batting_hand"] | null
          birth_date?: string | null
          church_id?: string | null
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          nickname?: string | null
          photo_key?: string | null
          primary_position_id?: string | null
          throws?: Database["public"]["Enums"]["throwing_hand"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_primary_position_id_fkey"
            columns: ["primary_position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          code: string
          created_at: string
          display_order: number
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          display_order: number
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      season_rosters: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          jersey_number: number | null
          joined_at: string
          left_at: string | null
          player_id: string
          season_id: string
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          jersey_number?: number | null
          joined_at?: string
          left_at?: string | null
          player_id: string
          season_id: string
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          jersey_number?: number | null
          joined_at?: string
          left_at?: string | null
          player_id?: string
          season_id?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "season_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          name: string
          start_date: string
          status: Database["public"]["Enums"]["season_status"]
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          name: string
          start_date: string
          status?: Database["public"]["Enums"]["season_status"]
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["season_status"]
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      stat_revisions: {
        Row: {
          changed_at: string
          changed_by: string
          created_at: string
          game_id: string
          id: string
          new_values: Json
          player_id: string
          previous_values: Json | null
          reason: string | null
          revision_number: number
          stat_type: string
        }
        Insert: {
          changed_at?: string
          changed_by: string
          created_at?: string
          game_id: string
          id?: string
          new_values: Json
          player_id: string
          previous_values?: Json | null
          reason?: string | null
          revision_number: number
          stat_type: string
        }
        Update: {
          changed_at?: string
          changed_by?: string
          created_at?: string
          game_id?: string
          id?: string
          new_values?: Json
          player_id?: string
          previous_values?: Json | null
          reason?: string | null
          revision_number?: number
          stat_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "stat_revisions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stat_revisions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          city: string | null
          created_at: string
          id: string
          logo_key: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          short_name: string
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          logo_key?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          short_name: string
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          logo_key?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          short_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      audit_action:
        | "user_login"
        | "user_logout"
        | "game_created"
        | "game_updated"
        | "game_submitted"
        | "game_approved"
        | "game_published"
        | "game_returned"
        | "statistics_entered"
        | "statistics_updated"
        | "roster_modified"
        | "player_created"
        | "player_updated"
        | "team_created"
        | "team_updated"
        | "season_created"
        | "season_updated"
        | "venue_created"
        | "venue_updated"
        | "user_role_assigned"
        | "user_role_revoked"
        | "score_sheet_uploaded"
        | "score_sheet_deleted"
      audit_entity:
        | "user"
        | "game"
        | "statistics"
        | "roster"
        | "player"
        | "team"
        | "season"
        | "venue"
        | "score_sheet"
      batting_hand: "left" | "right" | "switch"
      game_status:
        | "scheduled"
        | "in_progress"
        | "completed"
        | "postponed"
        | "cancelled"
        | "statistics_entry"
        | "pending_review"
        | "approved"
        | "published"
      season_status: "draft" | "active" | "completed" | "archived"
      throwing_hand: "left" | "right"
      user_role: "administrator" | "collaborator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      audit_action: [
        "user_login",
        "user_logout",
        "game_created",
        "game_updated",
        "game_submitted",
        "game_approved",
        "game_published",
        "game_returned",
        "statistics_entered",
        "statistics_updated",
        "roster_modified",
        "player_created",
        "player_updated",
        "team_created",
        "team_updated",
        "season_created",
        "season_updated",
        "venue_created",
        "venue_updated",
        "user_role_assigned",
        "user_role_revoked",
        "score_sheet_uploaded",
        "score_sheet_deleted",
      ],
      audit_entity: [
        "user",
        "game",
        "statistics",
        "roster",
        "player",
        "team",
        "season",
        "venue",
        "score_sheet",
      ],
      batting_hand: ["left", "right", "switch"],
      game_status: [
        "scheduled",
        "in_progress",
        "completed",
        "postponed",
        "cancelled",
        "statistics_entry",
        "pending_review",
        "approved",
        "published",
      ],
      season_status: ["draft", "active", "completed", "archived"],
      throwing_hand: ["left", "right"],
      user_role: ["administrator", "collaborator"],
    },
  },
} as const
