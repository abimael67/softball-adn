import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Plus, Pencil, Trash2, Upload, Download } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useSeasons,
  useTeams,
  useVenues,
  useGames,
  useCreateGame,
  useUpdateGame,
  useDeleteGame,
} from "@/hooks";
import type { Game, GameInsert, GameUpdate } from "@/types/database";
import { handleError, getUserFriendlyMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { DataTable } from "@/components/admin/data-table";
import { PageHeader, StatusBadge, LoadingState, EmptyState } from "@/components/admin/admin-shared";
import { useConfirmDialog } from "@/components/admin/confirm-dialog";
import { CsvImportDialog, exportToCsv } from "@/components/admin/csv-import";
import { toast } from "@/components/ui/toast";

export const Route = createFileRoute("/admin/schedule/")({
  component: AdminSchedulePage,
});

function AdminSchedulePage() {
  const { data: seasons } = useSeasons();
  const { data: teams } = useTeams();
  const { data: venues } = useVenues();
  const { confirm, dialog } = useConfirmDialog();
  const createGame = useCreateGame();
  const updateGame = useUpdateGame();
  const deleteGame = useDeleteGame();

  const activeSeason = seasons?.find((s) => s.status === "active") || seasons?.[0];
  const [selectedSeasonId, setSelectedSeasonId] = useState(activeSeason?.id || "");
  const seasonId = selectedSeasonId || activeSeason?.id || "";

  const { data: games, isLoading } = useGames(seasonId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [form, setForm] = useState({
    home_team_id: "",
    away_team_id: "",
    venue_id: "",
    scheduled_at: "",
  });
  const [formError, setFormError] = useState("");

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

  const resetForm = () => {
    setForm({ home_team_id: "", away_team_id: "", venue_id: "", scheduled_at: "" });
    setEditingGame(null);
    setFormError("");
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (game: Game) => {
    setEditingGame(game);
    const dt = new Date(game.scheduled_at);
    const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setForm({
      home_team_id: game.home_team_id,
      away_team_id: game.away_team_id,
      venue_id: game.venue_id || "",
      scheduled_at: local,
    });
    setFormError("");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.home_team_id || !form.away_team_id || !form.scheduled_at) {
      setFormError("Equipo local, visitante y fecha son requeridos");
      return;
    }

    if (form.home_team_id === form.away_team_id) {
      setFormError("El equipo local y visitante no pueden ser el mismo");
      return;
    }

    try {
      const data = {
        season_id: seasonId,
        home_team_id: form.home_team_id,
        away_team_id: form.away_team_id,
        venue_id: form.venue_id || null,
        scheduled_at: new Date(form.scheduled_at).toISOString(),
        status: "scheduled" as const,
      };

      if (editingGame) {
        await updateGame.mutateAsync({ id: editingGame.id, data: data as GameUpdate });
        toast({ title: "Partido actualizado", variant: "success" });
      } else {
        const duplicate = games?.find(
          (g) =>
            g.home_team_id === data.home_team_id &&
            g.away_team_id === data.away_team_id &&
            g.scheduled_at === data.scheduled_at,
        );
        if (duplicate) {
          setFormError("Ya existe un partido programado con estos equipos en esta fecha");
          return;
        }
        await createGame.mutateAsync(data as GameInsert);
        toast({ title: "Partido creado", variant: "success" });
      }
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      setFormError(getUserFriendlyMessage(handleError(err)));
    }
  };

  const handleDelete = async (game: Game) => {
    if (game.status !== "scheduled") {
      toast({ title: "Solo se pueden eliminar partidos programados", variant: "destructive" });
      return;
    }
    const confirmed = await confirm({
      title: "Eliminar partido",
      description: `${teamMap.get(game.home_team_id)} vs ${teamMap.get(game.away_team_id)} - ${new Date(game.scheduled_at).toLocaleDateString("es")}`,
      confirmLabel: "Eliminar",
      variant: "destructive",
    });
    if (!confirmed) return;
    try {
      await deleteGame.mutateAsync(game.id);
      toast({ title: "Partido eliminado", variant: "success" });
    } catch (err) {
      toast({ title: "Error", description: getUserFriendlyMessage(handleError(err)), variant: "destructive" });
    }
  };

  const handleCsvImport = async (rows: Record<string, string>[]) => {
    let imported = 0;
    const errors: string[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const homeTeam = teams?.find((t) => t.name === row.home_team || t.short_name === row.home_team);
      const awayTeam = teams?.find((t) => t.name === row.away_team || t.short_name === row.away_team);
      const venue = row.venue ? venues?.find((v) => v.name === row.venue) : null;

      if (!homeTeam) { errors.push(`Fila ${i + 2}: Equipo local "${row.home_team}" no encontrado`); continue; }
      if (!awayTeam) { errors.push(`Fila ${i + 2}: Equipo visitante "${row.away_team}" no encontrado`); continue; }
      if (homeTeam.id === awayTeam.id) { errors.push(`Fila ${i + 2}: Mismo equipo como local y visitante`); continue; }

      try {
        await createGame.mutateAsync({
          season_id: seasonId,
          home_team_id: homeTeam.id,
          away_team_id: awayTeam.id,
          venue_id: venue?.id || null,
          scheduled_at: new Date(row.scheduled_at).toISOString(),
          status: "scheduled",
        } as GameInsert);
        imported++;
      } catch {
        errors.push(`Fila ${i + 2}: Error al crear partido`);
      }
    }
    if (errors.length > 0) {
      toast({ title: `${imported} importado(s), ${errors.length} error(es)`, variant: "destructive" });
    } else {
      toast({ title: `${imported} partido(s) importado(s)`, variant: "success" });
    }
  };

  const handleExport = () => {
    if (!games) return;
    exportToCsv(
      games.map((g) => ({
        home_team: teamMap.get(g.home_team_id) || g.home_team_id,
        away_team: teamMap.get(g.away_team_id) || g.away_team_id,
        venue: venueMap.get(g.venue_id || "") || "",
        scheduled_at: g.scheduled_at,
        status: g.status,
      })),
      "calendario.csv",
    );
  };

  const columns: ColumnDef<Game>[] = [
    {
      accessorKey: "scheduled_at",
      header: "Fecha",
      cell: ({ getValue }) => {
        const d = new Date(getValue<string>());
        return (
          <div>
            <span className="font-medium">{d.toLocaleDateString("es")}</span>
            <span className="ml-2 text-xs text-muted-foreground">{d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</span>
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
            {teamMap.get(g.home_team_id) || "?"} <span className="text-muted-foreground">vs</span> {teamMap.get(g.away_team_id) || "?"}
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
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(g)} title="Editar">
              <Pencil className="h-4 w-4" />
            </Button>
            {g.status === "scheduled" && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(g)} title="Eliminar">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarDays}
        title="Calendario"
        description="Programa y gestiona los partidos de la temporada"
        actions={
          <>
            <Button variant="outline" onClick={() => setCsvOpen(true)}>
              <Upload className="h-4 w-4" />
              Importar CSV
            </Button>
            {games && games.length > 0 && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            )}
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Nuevo partido
            </Button>
          </>
        }
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

      {games && games.length > 0 ? (
        <DataTable columns={columns} data={games} searchKey="matchup" searchPlaceholder="Buscar partido..." />
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="Sin partidos"
          description="Programa el primer partido de la temporada."
          action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Crear partido</Button>}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGame ? "Editar partido" : "Nuevo partido"}</DialogTitle>
            <DialogDescription>{editingGame ? "Modifica los datos del partido." : "Programa un nuevo partido."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Equipo local *</Label>
                <Select value={form.home_team_id} onValueChange={(v) => setForm({ ...form, home_team_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {teams?.map((t) => (
                      <SelectItem key={t.id} value={t.id} disabled={t.id === form.away_team_id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Equipo visitante *</Label>
                <Select value={form.away_team_id} onValueChange={(v) => setForm({ ...form, away_team_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {teams?.map((t) => (
                      <SelectItem key={t.id} value={t.id} disabled={t.id === form.home_team_id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sede</Label>
                <Select value={form.venue_id} onValueChange={(v) => setForm({ ...form, venue_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar sede" /></SelectTrigger>
                  <SelectContent>
                    {venues?.map((v) => (
                      <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fecha y hora *</Label>
                <Input
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                />
              </div>
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createGame.isPending || updateGame.isPending}>
                {editingGame ? "Guardar" : "Crear partido"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <CsvImportDialog
        open={csvOpen}
        onOpenChange={setCsvOpen}
        title="Importar calendario desde CSV"
        description="Sube un archivo CSV con los partidos. Los equipos se buscan por nombre o abreviatura."
        templateFilename="plantilla_calendario.csv"
        columns={[
          { key: "home_team", label: "Equipo local", required: true },
          { key: "away_team", label: "Equipo visitante", required: true },
          { key: "venue", label: "Sede" },
          { key: "scheduled_at", label: "Fecha (YYYY-MM-DD HH:MM)", required: true },
        ]}
        onImport={handleCsvImport}
      />

      {dialog}
    </div>
  );
}
