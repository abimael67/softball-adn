import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Church, Plus, Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useChurches, useCreateChurch, useUpdateChurch, useDeleteChurch } from "@/hooks";
import type { Church as ChurchType, ChurchInsert, ChurchUpdate } from "@/types/database";
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

export const Route = createFileRoute("/admin/churches/")({
  component: AdminChurchesPage,
});

function AdminChurchesPage() {
  const { data: churches, isLoading } = useChurches();
  const createChurch = useCreateChurch();
  const updateChurch = useUpdateChurch();
  const deleteChurch = useDeleteChurch();
  const { confirm, dialog } = useConfirmDialog();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChurch, setEditingChurch] = useState<ChurchType | null>(null);
  const [form, setForm] = useState({ name: "", city: "", address: "" });
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setForm({ name: "", city: "", address: "" });
    setEditingChurch(null);
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (church: ChurchType) => {
    setEditingChurch(church);
    setForm({
      name: church.name,
      city: church.city || "",
      address: church.address || "",
    });
    setFormError("");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      if (!form.name.trim()) {
        setFormError("El nombre es requerido");
        return;
      }

      const data = {
        name: form.name.trim(),
        city: form.city.trim() || null,
        address: form.address.trim() || null,
      };

      if (editingChurch) {
        await updateChurch.mutateAsync({ id: editingChurch.id, data: data as ChurchUpdate });
        toast({ title: "Iglesia actualizada", variant: "success" });
      } else {
        await createChurch.mutateAsync(data as ChurchInsert);
        toast({ title: "Iglesia creada", variant: "success" });
      }
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      setFormError(getUserFriendlyMessage(handleError(err)));
    }
  };

  const handleDelete = async (church: ChurchType) => {
    const confirmed = await confirm({
      title: "Eliminar iglesia",
      description: `¿Eliminar "${church.name}"? Los jugadores asociados quedarán sin iglesia.`,
      confirmLabel: "Eliminar",
      variant: "destructive",
    });
    if (!confirmed) return;
    try {
      await deleteChurch.mutateAsync(church.id);
      toast({ title: "Iglesia eliminada", variant: "success" });
    } catch (err) {
      toast({
        title: "Error",
        description: getUserFriendlyMessage(handleError(err)),
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<ChurchType>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    { accessorKey: "city", header: "Ciudad", cell: ({ getValue }) => getValue<string>() || "-" },
    {
      accessorKey: "address",
      header: "Dirección",
      cell: ({ getValue }) => getValue<string>() || "-",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => openEdit(row.original)}
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive h-8 w-8"
            onClick={() => handleDelete(row.original)}
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Church}
        title="Iglesias"
        description="Gestiona las iglesias de la liga"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nueva iglesia
          </Button>
        }
      />

      {churches && churches.length > 0 ? (
        <DataTable
          columns={columns}
          data={churches}
          searchKey="name"
          searchPlaceholder="Buscar iglesia..."
        />
      ) : (
        <EmptyState
          icon={Church}
          title="Sin iglesias"
          description="Crea la primera iglesia para asignar jugadores."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Crear iglesia
            </Button>
          }
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingChurch ? "Editar iglesia" : "Nueva iglesia"}</DialogTitle>
            <DialogDescription>
              {editingChurch
                ? "Modifica los datos de la iglesia."
                : "Define los datos de la nueva iglesia."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Iglesia Libertad"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
            </div>
            {formError && <p className="text-destructive text-sm">{formError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createChurch.isPending || updateChurch.isPending}>
                {editingChurch ? "Guardar" : "Crear iglesia"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {dialog}
    </div>
  );
}
