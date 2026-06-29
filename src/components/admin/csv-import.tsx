import { useState, useCallback } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Download, AlertCircle, CheckCircle2, FileText, X } from "lucide-react";

interface CsvColumn {
  key: string;
  label: string;
  required?: boolean;
}

interface CsvImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  columns: CsvColumn[];
  onImport: (data: Record<string, string>[]) => void;
  templateFilename: string;
}

export function CsvImportDialog({
  open,
  onOpenChange,
  title,
  description,
  columns,
  onImport,
  templateFilename,
}: CsvImportDialogProps) {
  const [parsedData, setParsedData] = useState<Record<string, string>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [filename, setFilename] = useState("");

  const handleFile = useCallback(
    (file: File) => {
      setFilename(file.name);
      setErrors([]);
      setParsedData([]);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as Record<string, string>[];
          const validationErrors: string[] = [];

          const headers = results.meta.fields || [];
          columns.forEach((col) => {
            if (col.required && !headers.includes(col.key)) {
              validationErrors.push(`Columna requerida faltante: "${col.label}" (${col.key})`);
            }
          });

          data.forEach((row, i) => {
            columns.forEach((col) => {
              if (col.required && (!row[col.key] || row[col.key].trim() === "")) {
                validationErrors.push(`Fila ${i + 2}: "${col.label}" es requerido`);
              }
            });
          });

          if (data.length === 0) {
            validationErrors.push("El archivo no contiene datos");
          }

          setErrors(validationErrors);
          setParsedData(data);
        },
        error: () => {
          setErrors(["Error al leer el archivo CSV"]);
        },
      });
    },
    [columns],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".csv")) handleFile(file);
    },
    [handleFile],
  );

  const handleDownloadTemplate = () => {
    const header = columns.map((c) => c.key).join(",");
    const exampleRow = columns.map((c) => (c.key.includes("name") ? "Ejemplo" : "")).join(",");
    const csv = `${header}\n${exampleRow}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = templateFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (errors.length === 0 && parsedData.length > 0) {
      onImport(parsedData);
      setParsedData([]);
      setErrors([]);
      setFilename("");
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    setParsedData([]);
    setErrors([]);
    setFilename("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleReset(); onOpenChange(v); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
              <Download className="h-4 w-4" />
              Descargar plantilla CSV
            </Button>
          </div>

          {!filename ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary"
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Arrastra un archivo CSV aquí o
              </p>
              <label className="mt-2">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    Seleccionar archivo
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                      }}
                    />
                  </span>
                </Button>
              </label>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{filename}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleReset}>
                  <X className="h-3 w-3" />
                </Button>
              </div>

              {errors.length > 0 ? (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {errors.length} error(es) de validación
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {errors.slice(0, 10).map((err, i) => (
                      <li key={i} className="text-xs text-destructive">
                        {err}
                      </li>
                    ))}
                    {errors.length > 10 && (
                      <li className="text-xs text-destructive">
                        ...y {errors.length - 10} errores más
                      </li>
                    )}
                  </ul>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">
                    {parsedData.length} fila(s) lista(s) para importar
                  </span>
                </div>
              )}

              {parsedData.length > 0 && errors.length === 0 && (
                <div className="max-h-48 overflow-auto rounded border">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        {columns.map((col) => (
                          <th key={col.key} className="px-2 py-1 text-left font-medium">
                            {col.label}
                            {col.required && <span className="text-destructive ml-0.5">*</span>}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.slice(0, 5).map((row, i) => (
                        <tr key={i} className="border-b">
                          {columns.map((col) => (
                            <td key={col.key} className="px-2 py-1">
                              {row[col.key] || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedData.length > 5 && (
                    <p className="p-2 text-center text-xs text-muted-foreground">
                      ...y {parsedData.length - 5} filas más
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { handleReset(); onOpenChange(false); }}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={errors.length > 0 || parsedData.length === 0}>
            Importar {parsedData.length > 0 ? `(${parsedData.length})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function exportToCsv(data: Record<string, unknown>[], filename: string) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
