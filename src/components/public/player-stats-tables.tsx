import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  AggregatedBattingStats,
  AggregatedPitchingStats,
  AggregatedFieldingStats,
} from "@/hooks/use-public-data";
import { Target, Activity, Shield } from "lucide-react";

interface PlayerStatsTablesProps {
  batting: AggregatedBattingStats | null;
  pitching: AggregatedPitchingStats | null;
  fielding: AggregatedFieldingStats | null;
}

function formatNumber(num: number | null, decimals = 3): string {
  if (num === null) return "-";
  return num.toFixed(decimals);
}

export function PlayerStatsTables({ batting, pitching, fielding }: PlayerStatsTablesProps) {
  if (!batting && !pitching && !fielding) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Sin estadísticas para esta temporada
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {batting && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Estadísticas de Bateo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>J</TableHead>
                  <TableHead>AB</TableHead>
                  <TableHead>C</TableHead>
                  <TableHead>H</TableHead>
                  <TableHead>2B</TableHead>
                  <TableHead>3B</TableHead>
                  <TableHead>HR</TableHead>
                  <TableHead>CI</TableHead>
                  <TableHead>BB</TableHead>
                  <TableHead>SO</TableHead>
                  <TableHead>BR</TableHead>
                  <TableHead>AVG</TableHead>
                  <TableHead>OBP</TableHead>
                  <TableHead>SLG</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{batting.gamesPlayed}</TableCell>
                  <TableCell>{batting.atBats}</TableCell>
                  <TableCell>{batting.runs}</TableCell>
                  <TableCell>{batting.hits}</TableCell>
                  <TableCell>{batting.doubles}</TableCell>
                  <TableCell>{batting.triples}</TableCell>
                  <TableCell>{batting.homeRuns}</TableCell>
                  <TableCell>{batting.rbi}</TableCell>
                  <TableCell>{batting.walks}</TableCell>
                  <TableCell>{batting.strikeouts}</TableCell>
                  <TableCell>{batting.stolenBases}</TableCell>
                  <TableCell className="font-semibold">{formatNumber(batting.battingAverage)}</TableCell>
                  <TableCell className="font-semibold">{formatNumber(batting.onBasePercentage)}</TableCell>
                  <TableCell className="font-semibold">{formatNumber(batting.sluggingPercentage)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {pitching && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Estadísticas de Pitcheo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>J</TableHead>
                  <TableHead>W</TableHead>
                  <TableHead>L</TableHead>
                  <TableHead>SV</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>SO</TableHead>
                  <TableHead>BB</TableHead>
                  <TableHead>H</TableHead>
                  <TableHead>ER</TableHead>
                  <TableHead>ERA</TableHead>
                  <TableHead>WHIP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{pitching.gamesPlayed}</TableCell>
                  <TableCell>{pitching.wins}</TableCell>
                  <TableCell>{pitching.losses}</TableCell>
                  <TableCell>{pitching.saves}</TableCell>
                  <TableCell>{formatNumber(pitching.inningsPitched, 1)}</TableCell>
                  <TableCell>{pitching.strikeouts}</TableCell>
                  <TableCell>{pitching.walks}</TableCell>
                  <TableCell>{pitching.hitsAllowed}</TableCell>
                  <TableCell>{pitching.earnedRuns}</TableCell>
                  <TableCell className="font-semibold">{formatNumber(pitching.era, 2)}</TableCell>
                  <TableCell className="font-semibold">{formatNumber(pitching.whip, 2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {fielding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Estadísticas de Fildeo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>J</TableHead>
                  <TableHead>PO</TableHead>
                  <TableHead>A</TableHead>
                  <TableHead>E</TableHead>
                  <TableHead>DP</TableHead>
                  <TableHead>FPCT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{fielding.gamesPlayed}</TableCell>
                  <TableCell>{fielding.putouts}</TableCell>
                  <TableCell>{fielding.assists}</TableCell>
                  <TableCell>{fielding.errors}</TableCell>
                  <TableCell>{fielding.doublePlays}</TableCell>
                  <TableCell className="font-semibold">{formatNumber(fielding.fieldingPercentage)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
