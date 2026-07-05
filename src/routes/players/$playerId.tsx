import { createFileRoute } from "@tanstack/react-router";
import { usePlayer } from "@/hooks/use-players";
import { usePositions } from "@/hooks/use-positions";
import { useChurch } from "@/hooks/use-churches";
import { useLatestSeason, usePlayerSeasonStats } from "@/hooks/use-public-data";
import { storageService } from "@/services/storage-service";
import { PlayerStatsTables } from "@/components/public/player-stats-tables";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Church } from "lucide-react";

export const Route = createFileRoute("/players/$playerId")({
  component: PlayerDetailsPage,
});

function PlayerDetailsPage() {
  const { playerId } = Route.useParams();
  const { data: player, isLoading: playerLoading } = usePlayer(playerId);
  const { data: season } = useLatestSeason();
  const { data: positions } = usePositions();
  const { data: church } = useChurch(player?.church_id || "");
  const { data: stats, isLoading: statsLoading } = usePlayerSeasonStats(playerId, season?.id || "");

  if (playerLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!player) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Jugador no encontrado
        </CardContent>
      </Card>
    );
  }

  const fullName = `${player.first_name} ${player.last_name}`;
  const position = positions?.find((p) => p.id === player.primary_position_id);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-24 w-24">
              {player.photo_key ? (
                <AvatarImage
                  src={storageService.getPublicUrl(player.photo_key)}
                  alt={fullName}
                />
              ) : (
                <AvatarFallback className="bg-muted">
                  <UserCircle className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                {fullName}
                {player.nickname && (
                  <span className="ml-2 text-xl text-muted-foreground">"{player.nickname}"</span>
                )}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {position && (
                  <Badge variant="secondary">{position.name}</Badge>
                )}
                {player.bats && (
                  <Badge variant="outline">
                    Batea: {player.bats === "left" ? "Izquierda" : player.bats === "right" ? "Derecha" : "Ambos"}
                  </Badge>
                )}
                {player.throws && (
                  <Badge variant="outline">
                    Lanza: {player.throws === "left" ? "Izquierda" : "Derecha"}
                  </Badge>
                )}
              </div>
              {church && (
                <div className="flex items-center gap-1 text-muted-foreground mt-2">
                  <Church className="h-4 w-4" />
                  <span>{church.name}</span>
                  {church.city && <span className="text-sm">- {church.city}</span>}
                </div>
              )}
              {season && (
                <p className="text-sm text-muted-foreground mt-2">
                  Temporada {season.name}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {statsLoading ? (
        <Card>
          <CardContent className="p-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : (
        stats && <PlayerStatsTables batting={stats.batting} pitching={stats.pitching} fielding={stats.fielding} />
      )}
    </div>
  );
}
