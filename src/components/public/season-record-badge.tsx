import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface SeasonRecordBadgeProps {
  wins: number;
  losses: number;
  ties: number;
  winningPercentage: number;
}

export function SeasonRecordBadge({ wins, losses, ties, winningPercentage }: SeasonRecordBadgeProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Record de la temporada</div>
            <div className="text-2xl font-bold text-foreground">
              {wins}-{losses}
              {ties > 0 ? `-${ties}` : ""}
            </div>
            <div className="text-sm text-muted-foreground">
              {winningPercentage.toFixed(3)} PCT
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
