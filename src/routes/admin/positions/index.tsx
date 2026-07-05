import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Crosshair, Plus, Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { usePositions, useCreatePosition, useUpdatePosition, useDeletePosition } from "@/hooks";
import type { Position, PositionInsert, PositionUpdate } from "@/types/database";
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

export const Route = createFileRoute("/admin/positions/")({
  component: AdminPositionsPage,
});

function AdminPositionsPage() {
  const { data: positions, isLoading } = usePositions();
  const createPosition = useCreatePosition();
  const updatePosition = useUpdatePosition();
  const deletePosition = useDeletePosition();
  const { confirm, dialog } = useConfirmDialog();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [form, setForm] = useState({ code: "", name: "", display_order: "" });
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setForm({ code: "", name: "", display_order: "" });
    setEditingPosition(null);
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (position: Position) => {
    setEditingPosition(position);
    setForm({
      code: position.code,
      name: position.name,
      display_order: String(position.display_order),
    });
    setFormError("");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      if (!form.code.trim()) {
        setFormError("El código es requerido");
        return;
      }
      if (!form.name.trim()) {
        setFormError("El nombre es requerido");
        return;
      }
      const order = parseInt(form.display_order);
      if (!order || order < 1) {
        setFormError("El orden debe ser un número mayor a 0");
        return;
      }

      const data = {
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        display_order: order,
      };

      if (editingPosition) {
        await updatePosition.mutateAsync({ id: editingPosition.id, data: data as PositionUpdate });
        toast({ title: "Posición actualizada", variant: "success" });
      } else {
        await createPosition.mutateAsync(data as PositionInsert);
        toast({ title: "Posición creada", variant: "success" });
      }
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      setFormError(getUserFriendlyMessage(handleError(err)));
    }
  };

  const handleDelete = async (position: Position) => {
    const confirmed = await confirm({
      title: "Eliminar posición",
      description: `¿Eliminar "${position.name}" (${position.code})? Los jugadores con esta posición quedarán sin posición asignada.`,
      confirmLabel: "Eliminar",
      variant: "destructive",
    });
    if (!confirmed) return;
    try {
      await deletePosition.mutateAsync(position.id);
      toast({ title: "Posición eliminada", variant: "success" });
    } catch (err) {
      toast({
        title: "Error",
        description: getUserFriendlyMessage(handleError(err)),
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Position>[] = [
    {
      accessorKey: "code",
      header: "Código",
      cell: ({ row }) => (
        <span className="inline-flex h-8 w-12 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "display_order",
      header: "Orden",
      cell: ({ getValue }) => getValue<number>(),
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
        icon={Crosshair}
        title="Posiciones"
        description="Gestiona las posiciones defensivas"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nueva posición
          </Button>
        }
      />

      {positions && positions.length > 0 ? (
        <DataTable
          columns={columns}
          data={positions}
          searchKey="name"
          searchPlaceholder="Buscar posición..."
        />
      ) : (
        <EmptyState
          icon={Crosshair}
          title="Sin posiciones"
          description="Crea la primera posición para asignar a jugadores."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Crear posición
            </Button>
          }
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPosition ? "Editar posición" : "Nueva posición"}</DialogTitle>
            <DialogDescription>
              {editingPosition
                ? "Modifica los datos de la posición."
                : "Define los datos de la nueva posición."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="SS"
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Orden *</Label>
                <Input
                  id="display_order"
                  type="number"
                  min={1}
                  value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: e.target.value })}
                  placeholder="6"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Campo Corto"
                />
              </div>
            </div>
            {formError && <p className="text-destructive text-sm">{formError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createPosition.isPending || updatePosition.isPending}>
                {editingPosition ? "Guardar" : "Crear posición"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {dialog}
    </div>
  );
}
