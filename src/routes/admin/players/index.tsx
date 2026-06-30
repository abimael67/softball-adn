import { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserCircle, Plus, Pencil, Upload, Download } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { usePlayers, useCreatePlayer, useUpdatePlayer, useChurches } from "@/hooks";
import type { Player, PlayerInsert, PlayerUpdate, BattingHand, ThrowingHand } from "@/types/database";
import { handleError, getUserFriendlyMessage } from "@/lib/errors";
import { storageService } from "@/services/storage-service";
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
import { PageHeader, LoadingState, EmptyState } from "@/components/admin/admin-shared";
import { CsvImportDialog, exportToCsv } from "@/components/admin/csv-import";
import { toast } from "@/components/ui/toast";

export const Route = createFileRoute("/admin/players/")({
  component: AdminPlayersPage,
});

const BATS_LABELS: Record<string, string> = { left: "Izquierda", right: "Derecha", switch: "Ambidiestro" };
const THROWS_LABELS: Record<string, string> = { left: "Izquierda", right: "Derecha" };

function AdminPlayersPage() {
  const { data: players, isLoading } = usePlayers();
  const { data: churches } = useChurches();
  const createPlayer = useCreatePlayer();
  const updatePlayer = useUpdatePlayer();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [filterBats, setFilterBats] = useState<string>("all");
  const [filterThrows, setFilterThrows] = useState<string>("all");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    nickname: "",
    birth_date: "",
    bats: "" as string,
    throws: "" as string,
    church_id: "" as string,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setForm({ first_name: "", last_name: "", nickname: "", birth_date: "", bats: "", throws: "", church_id: "" });
    setEditingPlayer(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormError("");
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (player: Player) => {
    setEditingPlayer(player);
    setForm({
      first_name: player.first_name,
      last_name: player.last_name,
      nickname: player.nickname || "",
      birth_date: player.birth_date || "",
      bats: player.bats || "",
      throws: player.throws || "",
      church_id: player.church_id || "",
    });
    setPhotoPreview(player.photo_key ? storageService.getPublicUrl(player.photo_key) : null);
    setPhotoFile(null);
    setFormError("");
    setDialogOpen(true);
  };

  const handlePhotoChange = (file: File | null) => {
    if (!file) return;
    const validation = storageService.validateImage(file);
    if (!validation.valid) {
      setFormError(validation.error || "Archivo no válido");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      if (!form.first_name.trim() || !form.last_name.trim()) {
        setFormError("Nombre y apellido son requeridos");
        return;
      }

      let photoKey = editingPlayer?.photo_key || null;
      if (photoFile) {
        try {
          photoKey = await storageService.upload(photoFile, `players/photos`);
        } catch {
          setFormError("Error al subir la foto");
          return;
        }
      }

      const data = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        nickname: form.nickname.trim() || null,
        birth_date: form.birth_date || null,
        bats: (form.bats as BattingHand) || null,
        throws: (form.throws as ThrowingHand) || null,
        photo_key: photoKey,
        church_id: form.church_id || null,
      };

      if (editingPlayer) {
        await updatePlayer.mutateAsync({ id: editingPlayer.id, data: data as PlayerUpdate });
        toast({ title: "Jugador actualizado", variant: "success" });
      } else {
        await createPlayer.mutateAsync(data as PlayerInsert);
        toast({ title: "Jugador creado", variant: "success" });
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
        await createPlayer.mutateAsync({
          first_name: row.first_name,
          last_name: row.last_name,
          nickname: row.nickname || null,
          birth_date: row.birth_date || null,
          bats: (row.bats as BattingHand) || null,
          throws: (row.throws as ThrowingHand) || null,
        } as PlayerInsert);
        imported++;
      } catch {
        // continue
      }
    }
    toast({ title: `${imported} jugador(es) importado(s)`, variant: "success" });
  };

  const handleExport = () => {
    if (!players) return;
    exportToCsv(
      players.map((p) => ({
        first_name: p.first_name,
        last_name: p.last_name,
        nickname: p.nickname || "",
        birth_date: p.birth_date || "",
        bats: p.bats || "",
        throws: p.throws || "",
      })),
      "jugadores.csv",
    );
  };

  const filteredPlayers = players?.filter((p) => {
    if (filterBats !== "all" && p.bats !== filterBats) return false;
    if (filterThrows !== "all" && p.throws !== filterThrows) return false;
    return true;
  });

  const columns: ColumnDef<Player>[] = [
    {
      id: "photo",
      header: "",
      cell: ({ row }) => {
        const p = row.original;
        return p.photo_key ? (
          <img src={storageService.getPublicUrl(p.photo_key)} alt={p.first_name} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <UserCircle className="h-5 w-5 text-muted-foreground" />
          </div>
        );
      },
    },
    {
      id: "full_name",
      header: "Nombre",
      accessorFn: (row) => `${row.last_name}, ${row.first_name}`,
      cell: ({ row }) => (
        <div>
          <span className="font-medium">{row.original.last_name}, {row.original.first_name}</span>
          {row.original.nickname && <span className="ml-2 text-xs text-muted-foreground">"{row.original.nickname}"</span>}
        </div>
      ),
    },
    {
      accessorKey: "birth_date",
      header: "Nacimiento",
      cell: ({ getValue }) => getValue<string>() ? new Date(getValue<string>()).toLocaleDateString("es") : "-",
    },
    {
      accessorKey: "bats",
      header: "Batea",
      cell: ({ getValue }) => BATS_LABELS[getValue<string>() || ""] || "-",
    },
    {
      accessorKey: "throws",
      header: "Lanza",
      cell: ({ getValue }) => THROWS_LABELS[getValue<string>() || ""] || "-",
    },
    {
      id: "church",
      header: "Iglesia",
      cell: ({ row }) => {
        const churchId = row.original.church_id;
        if (!churchId) return <span className="text-muted-foreground">No bautizado</span>;
        const church = churches?.find((c) => c.id === churchId);
        return church?.name || "-";
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
        icon={UserCircle}
        title="Jugadores"
        description="Gestiona los jugadores de la liga"
        actions={
          <>
            <Button variant="outline" onClick={() => setCsvOpen(true)}>
              <Upload className="h-4 w-4" />
              Importar CSV
            </Button>
            {players && players.length > 0 && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            )}
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Nuevo jugador
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Select value={filterBats} onValueChange={setFilterBats}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Bateo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los bateos</SelectItem>
            <SelectItem value="left">Izquierda</SelectItem>
            <SelectItem value="right">Derecha</SelectItem>
            <SelectItem value="switch">Ambidiestro</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterThrows} onValueChange={setFilterThrows}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Lanzamiento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los lanzamientos</SelectItem>
            <SelectItem value="left">Izquierda</SelectItem>
            <SelectItem value="right">Derecha</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredPlayers && filteredPlayers.length > 0 ? (
        <DataTable columns={columns} data={filteredPlayers} searchKey="full_name" searchPlaceholder="Buscar jugador..." pageSize={20} />
      ) : (
        <EmptyState
          icon={UserCircle}
          title="Sin jugadores"
          description="Crea el primer jugador o importa desde CSV."
          action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Crear jugador</Button>}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlayer ? "Editar jugador" : "Nuevo jugador"}</DialogTitle>
            <DialogDescription>{editingPlayer ? "Modifica los datos del jugador." : "Define los datos del nuevo jugador."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="h-16 w-16 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer bg-muted"
                onClick={() => fileRef.current?.click()}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Foto" className="h-full w-full object-cover" />
                ) : (
                  <UserCircle className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Foto del jugador</p>
                <p className="text-xs text-muted-foreground">Click para subir</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre *</Label>
                <Input id="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido *</Label>
                <Input id="last_name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname">Apodo</Label>
                <Input id="nickname" value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_date">Fecha nacimiento</Label>
                <Input id="birth_date" type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Batea</Label>
                <Select value={form.bats} onValueChange={(v) => setForm({ ...form, bats: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Izquierda</SelectItem>
                    <SelectItem value="right">Derecha</SelectItem>
                    <SelectItem value="switch">Ambidiestro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Lanza</Label>
                <Select value={form.throws} onValueChange={(v) => setForm({ ...form, throws: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Izquierda</SelectItem>
                    <SelectItem value="right">Derecha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Iglesia</Label>
                <Select value={form.church_id} onValueChange={(v) => setForm({ ...form, church_id: v })}>
                  <SelectTrigger><SelectValue placeholder="No bautizado" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No bautizado</SelectItem>
                    {churches?.map((church) => (
                      <SelectItem key={church.id} value={church.id}>{church.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createPlayer.isPending || updatePlayer.isPending}>
                {editingPlayer ? "Guardar" : "Crear jugador"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <CsvImportDialog
        open={csvOpen}
        onOpenChange={setCsvOpen}
        title="Importar jugadores desde CSV"
        description="Sube un archivo CSV con los datos de los jugadores."
        templateFilename="plantilla_jugadores.csv"
        columns={[
          { key: "first_name", label: "Nombre", required: true },
          { key: "last_name", label: "Apellido", required: true },
          { key: "nickname", label: "Apodo" },
          { key: "birth_date", label: "Fecha nacimiento (YYYY-MM-DD)" },
          { key: "bats", label: "Batea (left/right/switch)" },
          { key: "throws", label: "Lanza (left/right)" },
        ]}
        onImport={handleCsvImport}
      />
    </div>
  );
}
