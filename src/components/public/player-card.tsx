import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { storageService } from "@/services/storage-service";
import type { Player } from "@/types/database";
import { UserCircle } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  teamName?: string;
  positionName?: string;
  jerseyNumber?: number | null;
}

export function PlayerCard({ player, teamName, positionName, jerseyNumber }: PlayerCardProps) {
  const fullName = `${player.first_name} ${player.last_name}`;

  return (
    <Link to="/players/$playerId" params={{ playerId: player.id }}>
      <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                {player.photo_key ? (
                  <AvatarImage
                    src={storageService.getPublicUrl(player.photo_key)}
                    alt={fullName}
                  />
                ) : (
                  <AvatarFallback className="bg-muted">
                    <UserCircle className="h-8 w-8 text-muted-foreground" />
                  </AvatarFallback>
                )}
              </Avatar>
              {jerseyNumber !== null && jerseyNumber !== undefined && (
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {jerseyNumber}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                {fullName}
                {player.nickname && (
                  <span className="ml-2 text-sm text-muted-foreground">"{player.nickname}"</span>
                )}
              </h3>
              {positionName && (
                <p className="text-sm text-muted-foreground">{positionName}</p>
              )}
              {teamName && (
                <p className="text-sm text-muted-foreground truncate">{teamName}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
