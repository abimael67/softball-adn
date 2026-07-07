import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface SeasonRecordBadgeProps {
  wins: number;
  losses: number;
  ties: number;
  winningPercentage: number;
  position?: number;
}

function ordinalSuffix(n: number): string {
  return `${n}°`;
}

export function SeasonRecordBadge({ wins, losses, ties, winningPercentage, position }: SeasonRecordBadgeProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">Record de la temporada</div>
            <div className="text-2xl font-bold text-foreground">
              {wins}-{losses}
              {ties > 0 ? `-${ties}` : ""}
            </div>
            <div className="text-sm text-muted-foreground">
              {winningPercentage.toFixed(3)} PCT
            </div>
          </div>
          {position !== undefined && (
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {ordinalSuffix(position)}
              </div>
              <span className="text-xs text-muted-foreground">Posición</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
