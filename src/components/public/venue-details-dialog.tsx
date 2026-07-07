import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Map as MapIcon, ExternalLink } from "lucide-react";
import type { Venue } from "@/types/database";

interface VenueDetailsDialogProps {
  venue: Venue | null;
  venueName: string;
}

export function VenueDetailsDialog({ venue, venueName }: VenueDetailsDialogProps) {
  const hasLocation = venue?.latitude != null && venue?.longitude != null;
  const mapsUrl = hasLocation
    ? `https://www.google.com/maps?q=${venue!.latitude},${venue!.longitude}`
    : null;

  const hasDetails = venue?.city || venue?.address || hasLocation;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-primary transition-colors cursor-pointer"
        >
          <MapPin className="h-4 w-4 text-primary/60" />
          <span>{venueName}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            {venue?.name || venueName}
          </DialogTitle>
          <DialogDescription>
            Información de la sede
          </DialogDescription>
        </DialogHeader>

        {hasDetails ? (
          <div className="space-y-4">
            {venue?.city && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ciudad</p>
                <p className="text-sm text-foreground mt-0.5">{venue.city}</p>
              </div>
            )}
            {venue?.address && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dirección</p>
                <p className="text-sm text-foreground mt-0.5">{venue.address}</p>
              </div>
            )}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors w-full justify-center"
              >
                <MapIcon className="h-4 w-4" />
                Abrir en Google Maps
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay información detallada disponible para esta sede.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
