import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Search } from "lucide-react";
import { usePlayersPaginated } from "@/hooks/use-public-data";
import { PlayerCard } from "@/components/public/player-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Player } from "@/types/database";

export const Route = createFileRoute("/players/")({
  component: PlayersPage,
});

const PAGE_SIZE = 12;

function PlayersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);

  const { data, isLoading } = usePlayersPaginated(page, PAGE_SIZE, search || undefined);

  const hasMore = data ? data.data.length === PAGE_SIZE : false;

  const handleLoadMore = () => {
    if (data?.data) {
      setAllPlayers((prev) => [...prev, ...data.data]);
    }
    setPage((p) => p + 1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    setAllPlayers([]);
  };

  const displayPlayers = page === 1 ? data?.data || [] : [...allPlayers, ...(data?.data || [])];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Jugadores</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar jugadores..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading && page === 1 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : displayPlayers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            {search ? "No se encontraron jugadores" : "No hay jugadores registrados"}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button onClick={handleLoadMore} variant="outline" size="lg">
                Cargar más
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
