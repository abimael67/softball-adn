import { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Users, Plus, Pencil, Upload, Download } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTeams, useCreateTeam, useUpdateTeam } from "@/hooks";
import type { Team, TeamInsert, TeamUpdate } from "@/types/database";
import { teamSchema } from "@/lib/validations";
import { handleError, getUserFriendlyMessage } from "@/lib/errors";
import { storageService } from "@/services/storage-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader, LoadingState, EmptyState } from "@/components/admin/admin-shared";
import { CsvImportDialog, exportToCsv } from "@/components/admin/csv-import";
import { toast } from "@/components/ui/toast";

export const Route = createFileRoute("/admin/teams/")({
  component: AdminTeamsPage,
});

function AdminTeamsPage() {
  const { data: teams, isLoading } = useTeams();
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [form, setForm] = useState({
    name: "",
    short_name: "",
    city: "",
    primary_color: "#000000",
    secondary_color: "#FFFFFF",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setForm({ name: "", short_name: "", city: "", primary_color: "#000000", secondary_color: "#FFFFFF" });
    setEditingTeam(null);
    setLogoFile(null);
    setLogoPreview(null);
    setFormError("");
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (team: Team) => {
    setEditingTeam(team);
    setForm({
      name: team.name,
      short_name: team.short_name,
      city: team.city || "",
      primary_color: team.primary_color || "#000000",
      secondary_color: team.secondary_color || "#FFFFFF",
    });
    setLogoPreview(team.logo_key ? storageService.getPublicUrl(team.logo_key) : null);
    setLogoFile(null);
    setFormError("");
    setDialogOpen(true);
  };

  const handleLogoChange = (file: File | null) => {
    if (!file) return;
    const validation = storageService.validateImage(file);
    if (!validation.valid) {
      setFormError(validation.error || "Archivo no válido");
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      teamSchema.parse({ ...form, logo_url: "" });

      let logoKey = editingTeam?.logo_key || null;
      if (logoFile) {
        try {
          logoKey = await storageService.upload(logoFile, `teams/logos/${Date.now()}-${logoFile.name}`);
        } catch {
          setFormError("Error al subir el logo");
          return;
        }
      }

      const data = {
        name: form.name,
        short_name: form.short_name,
        city: form.city || null,
        primary_color: form.primary_color || null,
        secondary_color: form.secondary_color || null,
        logo_key: logoKey,
      };

      if (editingTeam) {
        await updateTeam.mutateAsync({ id: editingTeam.id, data: data as TeamUpdate });
        toast({ title: "Equipo actualizado", variant: "success" });
      } else {
        await createTeam.mutateAsync(data as TeamInsert);
        toast({ title: "Equipo creado", variant: "success" });
      }
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      setFormError(getUserFriendlyMessage(handleError(err)));
    }
  };

  const handleCsvImport = async (rows: Record<string, string>[]) => {
    let imported = 0;
    for (const row of rows) {
      try {
        await createTeam.mutateAsync({
          name: row.name,
          short_name: row.short_name,
          city: row.city || null,
          primary_color: row.primary_color || null,
          secondary_color: row.secondary_color || null,
        } as TeamInsert);
        imported++;
      } catch {
        // continue
      }
    }
    toast({ title: `${imported} equipo(s) importado(s)`, variant: "success" });
  };

  const handleExport = () => {
    if (!teams) return;
    exportToCsv(
      teams.map((t) => ({
        name: t.name,
        short_name: t.short_name,
        city: t.city || "",
        primary_color: t.primary_color || "",
        secondary_color: t.secondary_color || "",
      })),
      "equipos.csv",
    );
  };

  const columns: ColumnDef<Team>[] = [
    {
      id: "logo",
      header: "",
      cell: ({ row }) => {
        const team = row.original;
        return team.logo_key ? (
          <img
            src={storageService.getPublicUrl(team.logo_key)}
            alt={team.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
            {team.short_name?.slice(0, 2)}
          </div>
        );
      },
    },
    { accessorKey: "name", header: "Nombre", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "short_name", header: "Abreviatura" },
    { accessorKey: "city", header: "Ciudad", cell: ({ getValue }) => getValue<string>() || "-" },
    {
      id: "colors",
      header: "Colores",
      cell: ({ row }) => {
        const t = row.original;
        return (
          <div className="flex items-center gap-1">
            {t.primary_color && <div className="h-5 w-5 rounded border" style={{ backgroundColor: t.primary_color }} />}
            {t.secondary_color && <div className="h-5 w-5 rounded border" style={{ backgroundColor: t.secondary_color }} />}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row.original)} title="Editar">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Equipos"
        description="Gestiona los equipos de la liga"
        actions={
          <>
            <Button variant="outline" onClick={() => setCsvOpen(true)}>
              <Upload className="h-4 w-4" />
              Importar CSV
            </Button>
            {teams && teams.length > 0 && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            )}
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Nuevo equipo
            </Button>
          </>
        }
      />

      {teams && teams.length > 0 ? (
        <DataTable columns={columns} data={teams} searchKey="name" searchPlaceholder="Buscar equipo..." />
      ) : (
        <EmptyState
          icon={Users}
          title="Sin equipos"
          description="Crea el primer equipo de la liga."
          action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Crear equipo</Button>}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTeam ? "Editar equipo" : "Nuevo equipo"}</DialogTitle>
            <DialogDescription>{editingTeam ? "Modifica los datos del equipo." : "Define los datos del nuevo equipo."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="h-16 w-16 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer bg-muted"
                onClick={() => fileRef.current?.click()}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Logo del equipo</p>
                <p className="text-xs text-muted-foreground">Click para subir (JPEG, PNG, WebP)</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleLogoChange(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tigres" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_name">Abreviatura *</Label>
                <Input id="short_name" value={form.short_name} onChange={(e) => setForm({ ...form, short_name: e.target.value })} placeholder="TIG" maxLength={10} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary_color">Color primario</Label>
                <div className="flex items-center gap-2">
                  <input type="color" id="primary_color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <Input value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Color secundario</Label>
                <div className="flex items-center gap-2">
                  <input type="color" id="secondary_color" value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <Input value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="flex-1" />
                </div>
              </div>
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createTeam.isPending || updateTeam.isPending}>
                {editingTeam ? "Guardar" : "Crear equipo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <CsvImportDialog
        open={csvOpen}
        onOpenChange={setCsvOpen}
        title="Importar equipos desde CSV"
        description="Sube un archivo CSV con los datos de los equipos."
        templateFilename="plantilla_equipos.csv"
        columns={[
          { key: "name", label: "Nombre", required: true },
          { key: "short_name", label: "Abreviatura", required: true },
          { key: "city", label: "Ciudad" },
          { key: "primary_color", label: "Color primario" },
          { key: "secondary_color", label: "Color secundario" },
        ]}
        onImport={handleCsvImport}
      />
    </div>
  );
}
