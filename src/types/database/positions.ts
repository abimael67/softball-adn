export interface Position {
  id: string;
  code: string;
  name: string;
  display_order: number;
  created_at: string;
}

export type PositionInsert = Omit<Position, "id" | "created_at">;
