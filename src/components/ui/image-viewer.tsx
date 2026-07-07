import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  alt?: string;
}

export function ImageViewer({ open, onOpenChange, imageUrl, alt }: ImageViewerProps) {
  const filename = imageUrl.split("/").pop() || "imagen";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-auto h-auto p-2">
        <DialogTitle className="sr-only">{alt || "Visor de imagen"}</DialogTitle>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center overflow-auto">
            <img
              src={imageUrl}
              alt={alt || "Imagen"}
              className="max-w-full max-h-[75vh] rounded object-contain"
            />
          </div>
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={imageUrl} download={filename}>
                <Download className="h-4 w-4" />
                Descargar
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
