import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserCheck, Plus, Trash2, ArrowRightLeft, Search } from "lucide-react";
import {
  useSeasons,
  useTeams,
  usePlayers,
  useRostersByTeam,
  useCreateRoster,
  useUpdateRoster,
  useDeactivateRoster,
} from "@/hooks";
import type { Player, SeasonRoster, SeasonRosterInsert } from "@/types/database";
import { handleError, getUserFriendlyMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader, LoadingState, EmptyState } from "@/components/admin/admin-shared";
import { useConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "@/components/ui/toast";

export const Route = createFileRoute("/admin/rosters/")({
  component: AdminRostersPage,
});

function AdminRostersPage() {
  const { data: seasons } = useSeasons();
  const { data: teams } = useTeams();
  const { data: players, isLoading: playersLoading } = usePlayers();
  const createRoster = useCreateRoster();
  const updateRoster = useUpdateRoster();
  const deactivateRoster = useDeactivateRoster();
  const { confirm, dialog } = useConfirmDialog();

  const activeSeason = seasons?.find((s) => s.status === "active") || seasons?.[0];
  const [selectedSeasonId, setSelectedSeasonId] = useState(activeSeason?.id || "");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [playerSearch, setPlayerSearch] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferringPlayer, setTransferringPlayer] = useState<{ roster: SeasonRoster; player: Player } | null>(null);
  const [transferTeamId, setTransferTeamId] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");

  const seasonId = selectedSeasonId || activeSeason?.id || "";
  const { data: rosters, isLoading: rostersLoading } = useRostersByTeam(selectedTeamId, seasonId);

  const assignedPlayerIds = useMemo(
    () => new Set((rosters || []).filter((r) => r.is_active).map((r) => r.player_id)),
    [rosters],
  );

  const availablePlayers = useMemo(() => {
    if (!players) return [];
    let filtered = players.filter((p) => !assignedPlayerIds.has(p.id));
    if (playerSearch.trim()) {
      const q = playerSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.first_name.toLowerCase().includes(q) ||
          p.last_name.toLowerCase().includes(q) ||
          (p.nickname && p.nickname.toLowerCase().includes(q)),
      );
    }
    return filtered;
  }, [players, assignedPlayerIds, playerSearch]);

  const rosterWithPlayers = useMemo(() => {
    if (!rosters || !players) return [];
    return rosters
      .filter((r) => r.is_active)
      .map((r) => ({
        roster: r,
        player: players.find((p) => p.id === r.player_id),
      }))
      .filter((r) => r.player)
      .sort((a, b) => (a.roster.jersey_number ?? 99) - (b.roster.jersey_number ?? 99));
  }, [rosters, players]);

  const handleAssign = async (player: Player) => {
    if (!selectedTeamId || !seasonId) return;
    try {
      await createRoster.mutateAsync({
        season_id: seasonId,
        team_id: selectedTeamId,
        player_id: player.id,
        jersey_number: jerseyNumber ? parseInt(jerseyNumber) : null,
        is_active: true,
      } as SeasonRosterInsert);
      toast({ title: `${player.first_name} ${player.last_name} asignado`, variant: "success" });
      setAssignDialogOpen(false);
      setJerseyNumber("");
    } catch (err) {
      toast({ title: "Error", description: getUserFriendlyMessage(handleError(err)), variant: "destructive" });
    }
  };

  const handleRemove = async (roster: SeasonRoster, player: Player) => {
    const confirmed = await confirm({
      title: "Remover jugador",
      description: `¿Remover a ${player.first_name} ${player.last_name} del equipo?`,
      confirmLabel: "Remover",
      variant: "destructive",
    });
    if (!confirmed) return;
    try {
      await deactivateRoster.mutateAsync(roster.id);
      toast({ title: "Jugador removido", variant: "success" });
    } catch (err) {
      toast({ title: "Error", description: getUserFriendlyMessage(handleError(err)), variant: "destructive" });
    }
  };

  const handleTransfer = async () => {
    if (!transferringPlayer || !transferTeamId) return;
    try {
      await deactivateRoster.mutateAsync(transferringPlayer.roster.id);
      await createRoster.mutateAsync({
        season_id: seasonId,
        team_id: transferTeamId,
        player_id: transferringPlayer.player.id,
        jersey_number: transferringPlayer.roster.jersey_number,
        is_active: true,
      } as SeasonRosterInsert);
      toast({ title: "Jugador transferido", variant: "success" });
      setTransferDialogOpen(false);
      setTransferringPlayer(null);
      setTransferTeamId("");
    } catch (err) {
      toast({ title: "Error", description: getUserFriendlyMessage(handleError(err)), variant: "destructive" });
    }
  };

  const handleUpdateJersey = async (roster: SeasonRoster, newNumber: number | null) => {
    try {
      await updateRoster.mutateAsync({ id: roster.id, data: { jersey_number: newNumber } });
    } catch (err) {
      toast({ title: "Error", description: getUserFriendlyMessage(handleError(err)), variant: "destructive" });
    }
  };

  if (playersLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={UserCheck}
        title="Rosters"
        description="Asigna jugadores a equipos por temporada"
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Temporada</Label>
          <Select value={selectedSeasonId} onValueChange={setSelectedSeasonId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar temporada" />
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
        <div className="space-y-1">
          <Label className="text-xs">Equipo</Label>
          <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar equipo" />
            </SelectTrigger>
            <SelectContent>
              {teams?.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedTeamId ? (
        <EmptyState
          icon={UserCheck}
          title="Selecciona un equipo"
          description="Elige una temporada y un equipo para gestionar su roster."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                Roster actual
                <Badge variant="secondary" className="ml-2">
                  {rosterWithPlayers.length}
                </Badge>
              </h3>
            </div>

            {rostersLoading ? (
              <LoadingState />
            ) : rosterWithPlayers.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                Sin jugadores asignados. Usa el panel derecho para asignar.
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {rosterWithPlayers.map(({ roster, player }) => (
                    <div
                      key={roster.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {roster.jersey_number ?? "-"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {player!.last_name}, {player!.first_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Desde {new Date(roster.joined_at).toLocaleDateString("es")}
                        </p>
                      </div>
                      <Input
                        type="number"
                        min={0}
                        max={99}
                        value={roster.jersey_number ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdateJersey(roster, val ? parseInt(val) : null);
                        }}
                        className="w-16 h-8 text-center text-sm"
                        placeholder="#"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setTransferringPlayer({ roster, player: player! });
                          setTransferDialogOpen(true);
                        }}
                        title="Transferir"
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleRemove(roster, player!)}
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                Jugadores disponibles
                <Badge variant="secondary" className="ml-2">
                  {availablePlayers.length}
                </Badge>
              </h3>
              <Button size="sm" onClick={() => setAssignDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Asignar
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar jugador..."
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-[460px]">
              <div className="space-y-1">
                {availablePlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 rounded-lg border p-2 hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      setJerseyNumber("");
                      handleAssign(player);
                    }}
                  >
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {player.first_name[0]}{player.last_name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {player.last_name}, {player.first_name}
                      </p>
                      {player.nickname && (
                        <p className="text-xs text-muted-foreground">"{player.nickname}"</p>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {availablePlayers.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    {playerSearch ? "Sin resultados" : "Todos los jugadores están asignados"}
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asignar jugadores</DialogTitle>
            <DialogDescription>
              Selecciona jugadores para agregar al roster de {teams?.find((t) => t.id === selectedTeamId)?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar jugador..."
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <ScrollArea className="h-[300px]">
              <div className="space-y-1">
                {availablePlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 rounded-lg border p-2 hover:bg-accent cursor-pointer"
                    onClick={() => handleAssign(player)}
                  >
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {player.first_name[0]}{player.last_name[0]}
                    </div>
                    <span className="text-sm flex-1">{player.last_name}, {player.first_name}</span>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transferir jugador</DialogTitle>
            <DialogDescription>
              Transferir a {transferringPlayer?.player.first_name} {transferringPlayer?.player.last_name} a otro equipo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Equipo destino</Label>
              <Select value={transferTeamId} onValueChange={setTransferTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  {teams
                    ?.filter((t) => t.id !== selectedTeamId)
                    .map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleTransfer} disabled={!transferTeamId}>Transferir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {dialog}
    </div>
  );
}
