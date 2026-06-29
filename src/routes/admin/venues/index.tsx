import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Plus, Pencil, Archive } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useVenues, useCreateVenue, useUpdateVenue } from "@/hooks";
import type { Venue, VenueInsert, VenueUpdate } from "@/types/database";
import { venueSchema } from "@/lib/validations";
import { handleError, getUserFriendlyMessage } from "@/lib/errors";
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
import { useConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "@/components/ui/toast";

export const Route = createFileRoute("/admin/venues/")({
  component: AdminVenuesPage,
});

function AdminVenuesPage() {
  const { data: venues, isLoading } = useVenues();
  const createVenue = useCreateVenue();
  const updateVenue = useUpdateVenue();
  const { confirm, dialog } = useConfirmDialog();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [form, setForm] = useState({ name: "", city: "", address: "", latitude: "", longitude: "" });
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setForm({ name: "", city: "", address: "", latitude: "", longitude: "" });
    setEditingVenue(null);
    setFormError("");
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setForm({
      name: venue.name,
      city: venue.city || "",
      address: venue.address || "",
      latitude: venue.latitude?.toString() || "",
      longitude: venue.longitude?.toString() || "",
    });
    setFormError("");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      const data = {
        name: form.name,
        city: form.city || null,
        address: form.address || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      };
      venueSchema.parse({ ...data, latitude: data.latitude ?? undefined, longitude: data.longitude ?? undefined });

      if (editingVenue) {
        await updateVenue.mutateAsync({ id: editingVenue.id, data: data as VenueUpdate });
        toast({ title: "Sede actualizada", variant: "success" });
      } else {
        await createVenue.mutateAsync(data as VenueInsert);
        toast({ title: "Sede creada", variant: "success" });
      }
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      setFormError(getUserFriendlyMessage(handleError(err)));
    }
  };

  const handleArchive = async (venue: Venue) => {
    const confirmed = await confirm({
      title: "Archivar sede",
      description: `¿Archivar "${venue.name}"?`,
      confirmLabel: "Archivar",
      variant: "destructive",
    });
    if (!confirmed) return;
    try {
      await updateVenue.mutateAsync({ id: venue.id, data: { name: venue.name + " (archivada)" } });
      toast({ title: "Sede archivada", variant: "success" });
    } catch (err) {
      toast({ title: "Error", description: getUserFriendlyMessage(handleError(err)), variant: "destructive" });
    }
  };

  const columns: ColumnDef<Venue>[] = [
    { accessorKey: "name", header: "Nombre", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "city", header: "Ciudad", cell: ({ getValue }) => getValue<string>() || "-" },
    { accessorKey: "address", header: "Dirección", cell: ({ getValue }) => getValue<string>() || "-" },
    {
      id: "coordinates",
      header: "Coordenadas",
      cell: ({ row }) => {
        const v = row.original;
        return v.latitude && v.longitude ? `${v.latitude}, ${v.longitude}` : "-";
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
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleArchive(row.original)} title="Archivar">
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={MapPin}
        title="Sedes"
        description="Gestiona las sedes y canchas de la liga"
        actions={<Button onClick={openCreate}><Plus className="h-4 w-4" />Nueva sede</Button>}
      />

      {venues && venues.length > 0 ? (
        <DataTable columns={columns} data={venues} searchKey="name" searchPlaceholder="Buscar sede..." />
      ) : (
        <EmptyState
          icon={MapPin}
          title="Sin sedes"
          description="Crea la primera sede donde se jugarán los partidos."
          action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Crear sede</Button>}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVenue ? "Editar sede" : "Nueva sede"}</DialogTitle>
            <DialogDescription>{editingVenue ? "Modifica los datos de la sede." : "Define los datos de la nueva sede."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Estadio Municipal" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitud</Label>
                <Input id="latitude" type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitud</Label>
                <Input id="longitude" type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
              </div>
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createVenue.isPending || updateVenue.isPending}>
                {editingVenue ? "Guardar" : "Crear sede"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {dialog}
    </div>
  );
}
