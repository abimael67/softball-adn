import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardCheck, CalendarDays } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useSeasons, useTeams, useVenues, useGames } from "@/hooks";
import type { Game } from "@/types/database";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader, StatusBadge, LoadingState, EmptyState } from "@/components/admin/admin-shared";

export const Route = createFileRoute("/admin/game-reports/")({
  component: AdminGameReportsPage,
});

function AdminGameReportsPage() {
  const { data: seasons } = useSeasons();
  const { data: teams } = useTeams();
  const { data: venues } = useVenues();

  const activeSeason = seasons?.find((s) => s.status === "active") || seasons?.[0];
  const [selectedSeasonId, setSelectedSeasonId] = useState(activeSeason?.id || "");
  const seasonId = selectedSeasonId || activeSeason?.id || "";

  const { data: games, isLoading } = useGames(seasonId);

  const teamMap = useMemo(() => {
    const map = new Map<string, string>();
    teams?.forEach((t) => map.set(t.id, t.name));
    return map;
  }, [teams]);

  const venueMap = useMemo(() => {
    const map = new Map<string, string>();
    venues?.forEach((v) => map.set(v.id, v.name));
    return map;
  }, [venues]);

  const sortedGames = useMemo(() => {
    if (!games) return [];
    return [...games].sort((a, b) => {
      const dateA = new Date(a.scheduled_at).getTime();
      const dateB = new Date(b.scheduled_at).getTime();
      if (dateA !== dateB) return dateA - dateB;
      const venueA = a.venue_id || "";
      const venueB = b.venue_id || "";
      return venueA.localeCompare(venueB);
    });
  }, [games]);

  const gameGroups = useMemo(() => {
    const groups: Record<string, { date: string; venue: string; games: Game[] }> = {};

    sortedGames.forEach((game) => {
      const date = new Date(game.scheduled_at).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const venueName = venueMap.get(game.venue_id || "") || "Sin sede";
      const key = `${date}||${venueName}`;

      if (!groups[key]) {
        groups[key] = {
          date,
          venue: venueName,
          games: [],
        };
      }
      groups[key].games.push(game);
    });

    return Object.values(groups).sort((a, b) => {
      const dateA = new Date(a.games[0].scheduled_at).getTime();
      const dateB = new Date(b.games[0].scheduled_at).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return a.venue.localeCompare(b.venue);
    });
  }, [sortedGames, venueMap]);

  const columns: ColumnDef<Game>[] = [
    {
      accessorKey: "scheduled_at",
      header: "Fecha y Hora",
      cell: ({ getValue }) => {
        const d = new Date(getValue<string>());
        return (
          <div>
            <span className="font-medium">{d.toLocaleDateString("es")}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        );
      },
    },
    {
      id: "matchup",
      header: "Partido",
      cell: ({ row }) => {
        const g = row.original;
        return (
          <span className="font-medium">
            {teamMap.get(g.home_team_id) || "?"}{" "}
            <span className="text-muted-foreground">vs</span>{" "}
            {teamMap.get(g.away_team_id) || "?"}
          </span>
        );
      },
    },
    {
      id: "venue",
      header: "Sede",
      cell: ({ row }) => venueMap.get(row.original.venue_id || "") || "-",
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
    },
    {
      id: "score",
      header: "Marcador",
      cell: ({ row }) => {
        const g = row.original;
        if (g.home_score === null || g.away_score === null) return "-";
        return `${g.home_score} - ${g.away_score}`;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const g = row.original;
        return (
          <div className="flex items-center gap-1 justify-end">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8" title="Estadísticas">
              <Link to="/admin/game-reports/$gameId" params={{ gameId: g.id }}>
                <ClipboardCheck className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardCheck}
        title="Reportes de Juegos"
        description="Ingreso y revisión de estadísticas de juegos"
      />

      <div className="flex items-center gap-3">
        <Select value={selectedSeasonId} onValueChange={setSelectedSeasonId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Temporada" />
          </SelectTrigger>
          <SelectContent>
            {seasons?.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name} {s.status === "active" && "(Activa)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {gameGroups.length > 0 ? (
        <div className="space-y-8">
          {gameGroups.map((group) => (
            <div key={`${group.date}||${group.venue}`} className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold capitalize">{group.date}</h3>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{group.venue}</span>
              </div>
              <DataTable
                columns={columns}
                data={group.games}
                searchKey="matchup"
                searchPlaceholder="Buscar partido..."
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardCheck}
          title="Sin partidos"
          description="No hay partidos programados en esta temporada."
        />
      )}
    </div>
  );
}
