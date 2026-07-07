import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useSeasons, useStandings, useTeams } from "@/hooks";
import { storageService } from "@/services/storage-service";
import type { Standing } from "@/types/domain/standings";

export const Route = createFileRoute("/standings/")({
  component: StandingsPage,
});

function StandingsPage() {
  const { data: seasons, isLoading: seasonsLoading } = useSeasons();
  const activeSeason = seasons?.find((s) => s.status === "active") || seasons?.[0];
  const { data: standings, isLoading: standingsLoading } = useStandings(activeSeason?.id || "");
  const { data: teams } = useTeams();

  const isLoading = seasonsLoading || standingsLoading;

  const getTeam = (teamId: string) => teams?.find((t) => t.id === teamId);

  const TeamLogo = ({ teamId, standing }: { teamId: string; standing: Standing }) => {
    const team = getTeam(teamId);
    if (team?.logo_key) {
      return (
        <img
          src={storageService.getPublicUrl(team.logo_key)}
          alt={standing.teamName}
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover ring-2 ring-primary/20"
        />
      );
    }
    return (
      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10 text-[10px] sm:text-xs font-bold text-primary ring-2 ring-primary/20">
        {standing.teamShortName}
      </div>
    );
  };

  const getRunDiffColor = (diff: number) => {
    if (diff > 0) return "text-green-600";
    if (diff < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  const StreakBadge = ({ streak }: { streak: string }) => {
    if (streak === "-") return <span className="text-muted-foreground">-</span>;

    const type = streak[0];
    const count = streak.slice(1);

    if (type === "W") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <TrendingUp className="h-3 w-3" />
          {count}
        </span>
      );
    }
    if (type === "L") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <TrendingDown className="h-3 w-3" />
          {count}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
        <Minus className="h-3 w-3" />
        {count}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Cargando posiciones...</div>
      </div>
    );
  }

  if (!activeSeason) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Tabla de Posiciones</h1>
        </div>
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-muted-foreground">No hay temporadas disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg ring-4 ring-primary/20">
            <Trophy className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Tabla de Posiciones</h1>
            <p className="text-sm font-semibold text-primary">{activeSeason.name}</p>
          </div>
        </div>
      </div>

      {(!standings || standings.length === 0) ? (
        <div className="rounded-xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-muted/30 to-background p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-8 w-8 text-primary/60" />
          </div>
          <p className="mt-4 text-lg font-bold text-foreground">No hay posiciones disponibles</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Las posiciones aparecerán cuando haya juegos completados en esta temporada
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border-2 border-primary/20 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary/10 bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Equipo</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">JJ</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">G</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">P</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">PCT</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">DS</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">CA</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">CR</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">DIF</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Racha</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Últ. 10</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {standings.map((team: Standing, index: number) => {
                  const positionClass = index === 0
                    ? "bg-yellow-50 dark:bg-yellow-900/10"
                    : index < 3
                      ? "bg-green-50/50 dark:bg-green-900/5"
                      : "";

                  const rankColors = ["text-yellow-500", "text-gray-400", "text-amber-600"];
                  const rankColor = index < 3 ? rankColors[index] : "text-muted-foreground";
                  const rankBg = index < 3 ? "bg-primary/5" : "";

                  return (
                    <tr
                      key={team.teamId}
                      className={`transition-colors hover:bg-primary/5 ${positionClass}`}
                    >
                      <td className="px-4 py-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${rankColor} ${rankBg}`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to="/teams/$teamId"
                          params={{ teamId: team.teamId }}
                          className="group flex items-center gap-3"
                        >
                          <TeamLogo teamId={team.teamId} standing={team} />
                          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {team.teamName}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-foreground">
                        {team.gamesPlayed}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-bold text-green-600 dark:text-green-400">
                        {team.wins}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-bold text-red-600 dark:text-red-400">
                        {team.losses}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                        {team.winningPercentage.toFixed(3).replace(/^0/, "")}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                        {team.gamesBack > 0 ? team.gamesBack.toFixed(1) : "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-foreground">
                        {team.runsScored}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-foreground">
                        {team.runsAllowed}
                      </td>
                      <td className={`px-4 py-3 text-center text-sm font-bold ${getRunDiffColor(team.runDifferential)}`}>
                        {team.runDifferential > 0 ? "+" : ""}{team.runDifferential}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StreakBadge streak={team.streak} />
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-foreground">
                        {team.lastTen}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-xl border-2 border-primary/10 bg-card p-4">
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span><strong className="text-foreground">JJ</strong> Juegos Jugados</span>
          <span><strong className="text-foreground">G</strong> Ganados</span>
          <span><strong className="text-foreground">P</strong> Perdidos</span>
          <span><strong className="text-foreground">PCT</strong> Porcentaje de Victorias</span>
          <span><strong className="text-foreground">DS</strong> Diferencia (Juegos Atrás)</span>
          <span><strong className="text-foreground">CA</strong> Carreras Anotadas</span>
          <span><strong className="text-foreground">CR</strong> Carreras Permitidas</span>
          <span><strong className="text-foreground">DIF</strong> Diferencial de Carreras</span>
        </div>
      </div>
    </div>
  );
}
