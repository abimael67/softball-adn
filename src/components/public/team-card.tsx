import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { storageService } from "@/services/storage-service";
import type { Team } from "@/types/database";

interface TeamCardProps {
  team: Team;
  record?: {
    wins: number;
    losses: number;
    ties: number;
  } | null;
}

export function TeamCard({ team, record }: TeamCardProps) {
  const initials = team.short_name || team.name.substring(0, 2).toUpperCase();

  return (
    <Link to="/teams/$teamId" params={{ teamId: team.id }}>
      <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {team.logo_key ? (
              <img
                src={storageService.getPublicUrl(team.logo_key)}
                alt={team.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-white font-bold text-lg"
                style={{ backgroundColor: team.primary_color || "#3b82f6" }}
              >
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                {team.name}
              </h3>
              {team.city && (
                <p className="text-sm text-muted-foreground truncate">{team.city}</p>
              )}
              {record && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {record.wins}-{record.losses}
                    {record.ties > 0 ? `-${record.ties}` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
