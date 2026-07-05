import { Card, CardContent } from "@/components/ui/card";
import type { Game, Team } from "@/types/database";
import { Calendar, MapPin } from "lucide-react";

interface MatchResultCardProps {
  game: Game;
  teamId: string;
  homeTeam: Team;
  awayTeam: Team;
}

export function MatchResultCard({ game, teamId, homeTeam, awayTeam }: MatchResultCardProps) {
  const isHome = game.home_team_id === teamId;
  const teamScore = isHome ? game.home_score : game.away_score;
  const opponentScore = isHome ? game.away_score : game.home_score;
  const opponent = isHome ? awayTeam : homeTeam;

  let result: "W" | "L" | "T" | null = null;
  if (teamScore !== null && opponentScore !== null) {
    if (teamScore > opponentScore) result = "W";
    else if (teamScore < opponentScore) result = "L";
    else result = "T";
  }

  const resultColors = {
    W: "bg-green-500 text-white",
    L: "bg-red-500 text-white",
    T: "bg-yellow-500 text-white",
  };

  const date = new Date(game.scheduled_at).toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="h-full">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          {result && (
            <span className={`px-2 py-1 rounded text-xs font-bold ${resultColors[result]}`}>
              {result === "W" ? "V" : result === "L" ? "D" : "E"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-foreground">{isHome ? homeTeam.short_name : awayTeam.short_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">vs</span>
              <span className="font-semibold text-foreground">{opponent.short_name}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {teamScore ?? "-"} - {opponentScore ?? "-"}
            </div>
          </div>
        </div>

        {game.venue_id && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">Estadio</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
