import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCheck, Target, Activity, Save } from "lucide-react";
import { useGame, useRostersByTeam, usePlayers, useTeams, usePositions, useUpdateGame } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHeader, LoadingState } from "@/components/admin/admin-shared";
import { storageService } from "@/services/storage-service";
import { handleError, getUserFriendlyMessage } from "@/lib/errors";
import { toast } from "@/components/ui/toast";
import type { Player, SeasonRoster, GameUpdate } from "@/types/database";

export const Route = createFileRoute("/admin/game-reports/$gameId")({
  component: GameStatsEntryPage,
});

interface RosterPlayer {
  roster: SeasonRoster;
  player: Player;
}

function GroupSection({
  title,
  icon: Icon,
  fields,
  values,
  onChange,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: { key: string; label: string; abbr: string }[];
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1">
            <label className="flex items-baseline gap-1 text-xs text-muted-foreground">
              <span className="font-semibold">{field.abbr}</span>
              <span className="hidden sm:inline">{field.label}</span>
            </label>
            <Input
              type="number"
              min={0}
              value={values[field.key] ?? 0}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onChange(field.key, isNaN(val) || val < 0 ? 0 : val);
              }}
              className="h-9 text-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayerAccordion({
  rosterPlayer,
  position,
}: {
  rosterPlayer: RosterPlayer;
  position?: string;
}) {
  const [batting, setBatting] = useState<Record<string, number>>({
    at_bats: 0,
    runs: 0,
    hits: 0,
    doubles: 0,
    triples: 0,
    home_runs: 0,
    rbi: 0,
    walks: 0,
    strikeouts: 0,
    stolen_bases: 0,
    caught_stealing: 0,
    hit_by_pitch: 0,
    sacrifice_flies: 0,
  });

  const [pitching, setPitching] = useState<Record<string, number>>({
    innings_pitched: 0,
    hits_allowed: 0,
    runs_allowed: 0,
    earned_runs: 0,
    walks: 0,
    strikeouts: 0,
    home_runs_allowed: 0,
    wild_pitches: 0,
    wins: 0,
    losses: 0,
    saves: 0,
  });

  const [showPitching, setShowPitching] = useState(false);

  const { player, roster } = rosterPlayer;
  const displayName = `${player.last_name}, ${player.first_name}`;

  return (
    <AccordionItem value={player.id} className="border rounded-lg px-4 mb-3 data-[state=open]:border-primary/30">
      <AccordionTrigger className="text-left hover:no-underline">
        <div className="flex items-center gap-3">
          {roster.jersey_number != null && (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {roster.jersey_number}
            </span>
          )}
          <div>
            <span className="font-medium text-foreground">{displayName}</span>
            {player.nickname && (
              <span className="ml-2 text-xs text-muted-foreground">"{player.nickname}"</span>
            )}
            {position && (
              <Badge variant="outline" className="ml-2 text-xs font-normal">
                {position}
              </Badge>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-6 pt-2">
          <GroupSection
            title="Bateo"
            icon={Target}
            fields={[
              { key: "at_bats", label: "Al Bat", abbr: "AB" },
              { key: "runs", label: "Carreras", abbr: "C" },
              { key: "hits", label: "Hits", abbr: "H" },
              { key: "doubles", label: "Dobles", abbr: "2B" },
              { key: "triples", label: "Triples", abbr: "3B" },
              { key: "home_runs", label: "Jonrones", abbr: "HR" },
              { key: "rbi", label: "CI", abbr: "CI" },
              { key: "walks", label: "Base por bolas", abbr: "BB" },
              { key: "strikeouts", label: "Ponches", abbr: "SO" },
              { key: "stolen_bases", label: "Bases robadas", abbr: "BR" },
              { key: "caught_stealing", label: "Atrapado robando", abbr: "AR" },
              { key: "hit_by_pitch", label: "Golpeado", abbr: "HBP" },
              { key: "sacrifice_flies", label: "Fly de sacrificio", abbr: "SF" },
            ]}
            values={batting}
            onChange={(key, val) => setBatting((prev) => ({ ...prev, [key]: val }))}
          />

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <label htmlFor={`pitching-${player.id}`} className="text-sm font-semibold text-foreground cursor-pointer">
                Registrar estadísticas de pitcheo
              </label>
            </div>
            <Switch
              id={`pitching-${player.id}`}
              checked={showPitching}
              onCheckedChange={setShowPitching}
            />
          </div>

          {showPitching && (
            <GroupSection
              title="Pitcheo"
              icon={Activity}
              fields={[
                { key: "innings_pitched", label: "Entradas", abbr: "IP" },
                { key: "hits_allowed", label: "Hits permitidos", abbr: "H" },
                { key: "runs_allowed", label: "Carreras", abbr: "C" },
                { key: "earned_runs", label: "Carreras limpias", abbr: "CL" },
                { key: "walks", label: "Base por bolas", abbr: "BB" },
                { key: "strikeouts", label: "Ponches", abbr: "SO" },
                { key: "home_runs_allowed", label: "Jonrones", abbr: "HR" },
                { key: "wild_pitches", label: "Lanc. salvajes", abbr: "LP" },
                { key: "wins", label: "Victorias", abbr: "W" },
                { key: "losses", label: "Derrotas", abbr: "L" },
                { key: "saves", label: "Salvados", abbr: "SV" },
              ]}
              values={pitching}
              onChange={(key, val) => setPitching((prev) => ({ ...prev, [key]: val }))}
            />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function TeamLogo({ logoKey, shortName }: { logoKey: string | null; shortName: string }) {
  if (logoKey) {
    return (
      <img
        src={storageService.getPublicUrl(logoKey)}
        alt={shortName}
        className="h-9 w-9 rounded-lg object-cover"
      />
    );
  }
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-black text-primary">
      {shortName}
    </span>
  );
}

function TeamSection({
  teamName,
  teamShortName,
  teamLogoKey,
  rosterPlayers,
  positions,
  accordionValue,
}: {
  teamName: string;
  teamShortName: string;
  teamLogoKey: string | null;
  rosterPlayers: RosterPlayer[];
  positions: Map<string, string>;
  accordionValue: string;
}) {
  return (
    <AccordionItem value={accordionValue} className="border rounded-lg data-[state=open]:border-primary/30">
      <AccordionTrigger className="px-5 hover:no-underline">
        <div className="flex items-center gap-3">
          <TeamLogo logoKey={teamLogoKey} shortName={teamShortName} />
          <span className="text-lg font-semibold text-foreground">{teamName}</span>
          <Badge variant="secondary" className="ml-2 text-xs">
            {rosterPlayers.length} jugador(es)
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="px-5">
          {rosterPlayers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Sin jugadores inscritos en este equipo
            </p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {rosterPlayers.map((rp) => (
                <PlayerAccordion
                  key={rp.player.id}
                  rosterPlayer={rp}
                  position={positions.get(rp.player.primary_position_id ?? "")}
                />
              ))}
            </Accordion>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function GameScoreboard({
  gameId,
  gameStatus,
  homeTeam,
  awayTeam,
  initialScore,
}: {
  gameId: string;
  gameStatus: string;
  homeTeam: { name: string; shortName: string; logoKey: string | null; primaryColor: string | null; secondaryColor: string | null };
  awayTeam: { name: string; shortName: string; logoKey: string | null; primaryColor: string | null; secondaryColor: string | null };
  initialScore: {
    home_score: number | null;
    away_score: number | null;
    home_hits: number | null;
    away_hits: number | null;
    home_errors: number | null;
    away_errors: number | null;
  };
}) {
  const [homeScore, setHomeScore] = useState(initialScore.home_score ?? 0);
  const [awayScore, setAwayScore] = useState(initialScore.away_score ?? 0);
  const [homeHits, setHomeHits] = useState(initialScore.home_hits ?? 0);
  const [awayHits, setAwayHits] = useState(initialScore.away_hits ?? 0);
  const [homeErrors, setHomeErrors] = useState(initialScore.home_errors ?? 0);
  const [awayErrors, setAwayErrors] = useState(initialScore.away_errors ?? 0);

  useEffect(() => {
    setHomeScore(initialScore.home_score ?? 0);
    setAwayScore(initialScore.away_score ?? 0);
    setHomeHits(initialScore.home_hits ?? 0);
    setAwayHits(initialScore.away_hits ?? 0);
    setHomeErrors(initialScore.home_errors ?? 0);
    setAwayErrors(initialScore.away_errors ?? 0);
  }, [initialScore]);

  const updateGame = useUpdateGame();

  const handleSave = async () => {
    try {
      const data: GameUpdate = {
        home_score: homeScore,
        away_score: awayScore,
        home_hits: homeHits,
        away_hits: awayHits,
        home_errors: homeErrors,
        away_errors: awayErrors,
      };

      if (gameStatus === "scheduled" || gameStatus === "in_progress") {
        data.status = "statistics_entry";
      }

      await updateGame.mutateAsync({ id: gameId, data });
      toast({ title: "Marcador guardado", variant: "success" });
    } catch (err) {
      toast({
        title: "Error",
        description: getUserFriendlyMessage(handleError(err)),
        variant: "destructive",
      });
    }
  };

  const homeStyle = homeTeam.primaryColor ? { borderColor: homeTeam.primaryColor } : undefined;
  const awayStyle = awayTeam.primaryColor ? { borderColor: awayTeam.primaryColor } : undefined;

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            Resultado del Partido
          </CardTitle>
          <Button
            onClick={handleSave}
            disabled={updateGame.isPending}
            size="sm"
          >
            {updateGame.isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar marcador
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4" style={homeStyle}>
            <div className="flex items-center gap-3">
              <TeamLogo logoKey={homeTeam.logoKey} shortName={homeTeam.shortName} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Local</p>
                <p className="text-base font-bold text-foreground">{homeTeam.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Carreras</label>
                <Input
                  type="number"
                  min={0}
                  value={homeScore}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setHomeScore(isNaN(val) || val < 0 ? 0 : val);
                  }}
                  className="h-10 text-center text-lg font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Hits</label>
                <Input
                  type="number"
                  min={0}
                  value={homeHits}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setHomeHits(isNaN(val) || val < 0 ? 0 : val);
                  }}
                  className="h-10 text-center text-lg font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Errores</label>
                <Input
                  type="number"
                  min={0}
                  value={homeErrors}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setHomeErrors(isNaN(val) || val < 0 ? 0 : val);
                  }}
                  className="h-10 text-center text-lg font-bold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4" style={awayStyle}>
            <div className="flex items-center gap-3">
              <TeamLogo logoKey={awayTeam.logoKey} shortName={awayTeam.shortName} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visitante</p>
                <p className="text-base font-bold text-foreground">{awayTeam.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Carreras</label>
                <Input
                  type="number"
                  min={0}
                  value={awayScore}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setAwayScore(isNaN(val) || val < 0 ? 0 : val);
                  }}
                  className="h-10 text-center text-lg font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Hits</label>
                <Input
                  type="number"
                  min={0}
                  value={awayHits}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setAwayHits(isNaN(val) || val < 0 ? 0 : val);
                  }}
                  className="h-10 text-center text-lg font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Errores</label>
                <Input
                  type="number"
                  min={0}
                  value={awayErrors}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setAwayErrors(isNaN(val) || val < 0 ? 0 : val);
                  }}
                  className="h-10 text-center text-lg font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GameStatsEntryPage() {
  const { gameId } = Route.useParams();
  const { data: game, isLoading: gameLoading } = useGame(gameId);
  const { data: teams } = useTeams();
  const { data: players } = usePlayers();
  const { data: positions } = usePositions();

  const { data: homeRoster, isLoading: homeLoading } = useRostersByTeam(
    game?.home_team_id ?? "",
    game?.season_id ?? "",
  );
  const { data: awayRoster, isLoading: awayLoading } = useRostersByTeam(
    game?.away_team_id ?? "",
    game?.season_id ?? "",
  );

  const playerMap = useMemo(() => {
    const map = new Map<string, Player>();
    players?.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  const positionMap = useMemo(() => {
    const map = new Map<string, string>();
    positions?.forEach((p) => map.set(p.id, p.code));
    return map;
  }, [positions]);

  const homeTeam = teams?.find((t) => t.id === game?.home_team_id);
  const awayTeam = teams?.find((t) => t.id === game?.away_team_id);

  const homePlayers = useMemo<RosterPlayer[]>(() => {
    if (!homeRoster) return [];
    return homeRoster
      .filter((r) => r.is_active)
      .map((r) => ({ roster: r, player: playerMap.get(r.player_id)! }))
      .filter((rp) => rp.player != null)
      .sort((a, b) => (a.roster.jersey_number ?? 99) - (b.roster.jersey_number ?? 99));
  }, [homeRoster, playerMap]);

  const awayPlayers = useMemo<RosterPlayer[]>(() => {
    if (!awayRoster) return [];
    return awayRoster
      .filter((r) => r.is_active)
      .map((r) => ({ roster: r, player: playerMap.get(r.player_id)! }))
      .filter((rp) => rp.player != null)
      .sort((a, b) => (a.roster.jersey_number ?? 99) - (b.roster.jersey_number ?? 99));
  }, [awayRoster, playerMap]);

  if (gameLoading || homeLoading || awayLoading) return <LoadingState />;

  if (!game) {
    return (
      <div className="flex flex-col gap-4">
        <Button asChild variant="outline" className="w-fit">
          <Link to="/admin/schedule">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al calendario
          </Link>
        </Button>
        <div className="rounded-xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-muted/30 to-background p-12 text-center">
          <p className="text-lg font-bold text-foreground">Partido no encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            El partido que buscas no existe o fue eliminado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={ClipboardCheck}
        title="Captura de Estadísticas"
        description={`${homeTeam?.name ?? "Local"} vs ${awayTeam?.name ?? "Visitante"}`}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/schedule">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Calendario
            </Link>
          </Button>
        }
      />

      <GameScoreboard
        gameId={gameId}
        gameStatus={game.status}
        homeTeam={{
          name: homeTeam?.name ?? "Equipo Local",
          shortName: homeTeam?.short_name ?? "?",
          logoKey: homeTeam?.logo_key ?? null,
          primaryColor: homeTeam?.primary_color ?? null,
          secondaryColor: homeTeam?.secondary_color ?? null,
        }}
        awayTeam={{
          name: awayTeam?.name ?? "Equipo Visitante",
          shortName: awayTeam?.short_name ?? "?",
          logoKey: awayTeam?.logo_key ?? null,
          primaryColor: awayTeam?.primary_color ?? null,
          secondaryColor: awayTeam?.secondary_color ?? null,
        }}
        initialScore={{
          home_score: game.home_score,
          away_score: game.away_score,
          home_hits: game.home_hits,
          away_hits: game.away_hits,
          home_errors: game.home_errors,
          away_errors: game.away_errors,
        }}
      />

      <Accordion type="multiple" defaultValue={[homeTeam?.id ?? "home", awayTeam?.id ?? "away"]} className="space-y-3">
        <TeamSection
          teamName={homeTeam?.name ?? "Equipo Local"}
          teamShortName={homeTeam?.short_name ?? "?"}
          teamLogoKey={homeTeam?.logo_key ?? null}
          rosterPlayers={homePlayers}
          positions={positionMap}
          accordionValue={homeTeam?.id ?? "home"}
        />
        <TeamSection
          teamName={awayTeam?.name ?? "Equipo Visitante"}
          teamShortName={awayTeam?.short_name ?? "?"}
          teamLogoKey={awayTeam?.logo_key ?? null}
          rosterPlayers={awayPlayers}
          positions={positionMap}
          accordionValue={awayTeam?.id ?? "away"}
        />
      </Accordion>
    </div>
  );
}
