import { Card, CardContent } from "@/components/ui/card";
import type {
  AggregatedBattingStats,
  AggregatedPitchingStats,
} from "@/hooks/use-public-data";

interface PlayerStatsHighlightsProps {
  batting: AggregatedBattingStats | null;
  pitching: AggregatedPitchingStats | null;
}

function formatAvg(num: number | null): string {
  if (num === null) return "-";
  return num.toFixed(3).slice(1);
}

function formatEra(num: number | null): string {
  if (num === null) return "-";
  return num.toFixed(2);
}

function formatWhip(num: number | null): string {
  if (num === null) return "-";
  return num.toFixed(2);
}

export function PlayerStatsHighlights({ batting, pitching }: PlayerStatsHighlightsProps) {
  const hasBatting = batting !== null;
  const hasPitching = pitching !== null;

  if (!hasBatting && !hasPitching) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {hasBatting && (
        <>
          <StatCard label="AVG" value={formatAvg(batting.battingAverage)} />
          <StatCard label="HR" value={String(batting.homeRuns)} />
          <StatCard label="CI" value={String(batting.rbi)} />
          <StatCard label="H" value={String(batting.hits)} />
          <StatCard label="SO" value={String(batting.strikeouts)} />
          <StatCard label="BB" value={String(batting.walks)} />
        </>
      )}
      {hasPitching && (
        <>
          <StatCard label="ERA" value={formatEra(pitching.era)} />
          <StatCard label="W" value={String(pitching.wins)} />
          <StatCard label="SO" value={String(pitching.strikeouts)} />
          <StatCard label="WHIP" value={formatWhip(pitching.whip)} />
          <StatCard label="IP" value={String(pitching.inningsPitched)} />
          <StatCard label="SV" value={String(pitching.saves)} />
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}
