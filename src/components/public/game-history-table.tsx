import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Game, Team } from "@/types/database";
import { Calendar, ArrowUpDown } from "lucide-react";

interface GameHistoryTableProps {
  games: Game[];
  teamId: string;
  teams: Team[];
}

export function GameHistoryTable({ games, teamId, teams }: GameHistoryTableProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getTeamById = (id: string) => teams.find((t) => t.id === id);

  const sortedGames = [...games].sort((a, b) => {
    const dateA = new Date(a.scheduled_at).getTime();
    const dateB = new Date(b.scheduled_at).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Historial de Partidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  onClick={toggleSort}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Fecha
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>Rival</TableHead>
              <TableHead>Resultado</TableHead>
              <TableHead className="text-right">Marcador</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedGames.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No hay partidos registrados
                </TableCell>
              </TableRow>
            ) : (
              sortedGames.map((game) => {
                const isHome = game.home_team_id === teamId;
                const opponentId = isHome ? game.away_team_id : game.home_team_id;
                const opponent = getTeamById(opponentId);
                const teamScore = isHome ? game.home_score : game.away_score;
                const opponentScore = isHome ? game.away_score : game.home_score;

                let result: "V" | "D" | "E" | null = null;
                if (teamScore !== null && opponentScore !== null) {
                  if (teamScore > opponentScore) result = "V";
                  else if (teamScore < opponentScore) result = "D";
                  else result = "E";
                }

                const resultColors = {
                  V: "bg-green-500/10 text-green-700 dark:text-green-400",
                  D: "bg-red-500/10 text-red-700 dark:text-red-400",
                  E: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                };

                const date = new Date(game.scheduled_at).toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <TableRow key={game.id}>
                    <TableCell className="font-medium">{date}</TableCell>
                    <TableCell>
                      {opponent?.name || "Desconocido"}
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({isHome ? "Local" : "Visitante"})
                      </span>
                    </TableCell>
                    <TableCell>
                      {result && (
                        <span className={`px-2 py-1 rounded text-xs font-bold ${resultColors[result]}`}>
                          {result}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {teamScore ?? "-"} - {opponentScore ?? "-"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
