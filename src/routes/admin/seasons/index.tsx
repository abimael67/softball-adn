import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Plus, Pencil, Archive, Star } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useSeasons, useCreateSeason, useUpdateSeason } from "@/hooks";
import type { Season, SeasonInsert, SeasonUpdate } from "@/types/database";
import { seasonSchema } from "@/lib/validations";
import { handleError, getUserFriendlyMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "@/components/ui/toast";

export const Route = createFileRoute("/admin/seasons/")({
  component: AdminSeasonsPage,
});

function AdminSeasonsPage() {
  const { data: seasons, isLoading } = useSeasons();
  const createSeason = useCreateSeason();
  const updateSeason = useUpdateSeason();
  const { confirm, dialog } = useConfirmDialog();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [form, setForm] = useState({
    name: "",
    year: new Date().getFullYear(),
    start_date: "",
    end_date: "",
    status: "draft" as Season["status"],
    description: "",
  });
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setForm({ name: "", year: new Date().getFullYear(), start_date: "", end_date: "", status: "draft", description: "" });
    setEditingSeason(null);
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (season: Season) => {
    setEditingSeason(season);
    setForm({
      name: season.name,
      year: season.year,
      start_date: season.start_date,
      end_date: season.end_date,
      status: season.status,
      description: season.description || "",
    });
    setFormError("");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    try {
      const validated = seasonSchema.parse(form);
      const data = {
        name: validated.name,
        year: validated.year,
        start_date: validated.start_date,
        end_date: validated.end_date,
        status: validated.status as Season["status"],
        description: validated.description || null,
      };

      if (editingSeason) {
        await updateSeason.mutateAsync({ id: editingSeason.id, data: data as SeasonUpdate });
        toast({ title: "Temporada actualizada", variant: "success" });
      } else {
        await createSeason.mutateAsync(data as SeasonInsert);
        toast({ title: "Temporada creada", variant: "success" });
      }
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      const error = handleError(err);
      setFormError(getUserFriendlyMessage(error));
    }
  };

  const handleActivate = async (season: Season) => {
    const confirmed = await confirm({
      title: "Activar temporada",
      description: `¿Activar "${season.name}"? Solo una temporada puede estar activa a la vez.`,
      confirmLabel: "Activar",
    });
    if (!confirmed) return;

    try {
      const activeSeason = seasons?.find((s) => s.status === "active");
      if (activeSeason && activeSeason.id !== season.id) {
        await updateSeason.mutateAsync({ id: activeSeason.id, data: { status: "completed" } });
      }
      await updateSeason.mutateAsync({ id: season.id, data: { status: "active" } });
      toast({ title: "Temporada activada", variant: "success" });
    } catch (err) {
      toast({ title: "Error", description: getUserFriendlyMessage(handleError(err)), variant: "destructive" });
    }
  };

  const handleArchive = async (season: Season) => {
    const confirmed = await confirm({
      title: "Archivar temporada",
      description: `¿Archivar "${season.name}"? Esta acción marcará la temporada como archivada.`,
      confirmLabel: "Archivar",
      variant: "destructive",
    });
    if (!confirmed) return;

    try {
      await updateSeason.mutateAsync({ id: season.id, data: { status: "archived" } });
      toast({ title: "Temporada archivada", variant: "success" });
    } catch (err) {
      toast({ title: "Error", description: getUserFriendlyMessage(handleError(err)), variant: "destructive" });
    }
  };

  const columns: ColumnDef<Season>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    { accessorKey: "year", header: "Año" },
    {
      accessorKey: "start_date",
      header: "Inicio",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString("es"),
    },
    {
      accessorKey: "end_date",
      header: "Fin",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString("es"),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const season = row.original;
        return (
          <div className="flex items-center gap-1 justify-end">
            {season.status !== "active" && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleActivate(season)} title="Activar">
                <Star className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(season)} title="Editar">
              <Pencil className="h-4 w-4" />
            </Button>
            {season.status !== "archived" && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleArchive(season)} title="Archivar">
                <Archive className="h-4 w-4" />
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
        icon={Calendar}
        title="Temporadas"
        description="Gestiona las temporadas de la liga"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nueva temporada
          </Button>
        }
      />

      {seasons && seasons.length > 0 ? (
        <DataTable columns={columns} data={seasons} searchKey="name" searchPlaceholder="Buscar temporada..." />
      ) : (
        <EmptyState
          icon={Calendar}
          title="Sin temporadas"
          description="Crea la primera temporada para comenzar a configurar la liga."
          action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Crear temporada</Button>}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSeason ? "Editar temporada" : "Nueva temporada"}</DialogTitle>
            <DialogDescription>
              {editingSeason ? "Modifica los datos de la temporada." : "Define los datos de la nueva temporada."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Temporada 2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Año</Label>
                <Input
                  id="year"
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Season["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="active">Activa</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                    <SelectItem value="archived">Archivada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">Fecha inicio</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Fecha fin</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descripción opcional..."
                />
              </div>
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createSeason.isPending || updateSeason.isPending}>
                {editingSeason ? "Guardar cambios" : "Crear temporada"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {dialog}
    </div>
  );
}
